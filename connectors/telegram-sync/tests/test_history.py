"""History checkpoints describe committed coverage, never realtime progress."""
import asyncio
import copy
import os
from unittest.mock import AsyncMock
from uuid import UUID

import asyncpg
import httpx
import pytest

from sync import db, history
from sync.connector_client import ConnectorClient
from fakes import Pool


def message(tg_id):
    return {"conversationId": "7", "telegramMessageId": str(tg_id), "messageType": "TEXT"}


def throttled(seconds="2"):
    response = httpx.Response(429, headers={"Retry-After": seconds},
                              request=httpx.Request("GET", "http://connector"))
    return httpx.HTTPStatusError("wait", request=response.request, response=response)


@pytest.fixture
def storage(monkeypatch):
    class Storage:
        state = None
        inserted = set()
        checkpoints = []
        fail_id = None
        fail_checkpoint = False

        async def get(self, pool, chat_id):
            return copy.deepcopy(self.state)

        async def insert(self, pool, **kwargs):
            tg_id = kwargs["telegram_message_id"]
            if tg_id == self.fail_id:
                raise RuntimeError("insertion failed")
            is_new = tg_id not in self.inserted
            self.inserted.add(tg_id)
            return tg_id, is_new

        async def checkpoint(self, pool, chat_id, title, offset, upper, count):
            if self.fail_checkpoint:
                raise RuntimeError("checkpoint commit failed")
            assert set(range(offset, upper + 1)) <= self.inserted
            self.checkpoints.append(offset)
            self.state = {"last_message_id": (self.state or {}).get("last_message_id", 0),
                          "offset_id": offset, "upper_message_id": upper}

        async def complete(self, pool, chat_id, title, upper, count):
            assert set(range(1, upper + 1)) <= self.inserted
            self.state = {"last_message_id": upper, "offset_id": None, "upper_message_id": None}

    result = Storage()
    monkeypatch.setattr(db, "get_history_state", result.get)
    monkeypatch.setattr(db, "insert_message_ex", result.insert)
    monkeypatch.setattr(db, "checkpoint_history_page", result.checkpoint)
    monkeypatch.setattr(db, "complete_history", result.complete)
    monkeypatch.setattr(history, "HISTORY_MEDIA", False)
    return result


def run(connector):
    asyncio.run(history.import_chat(connector, object(), {"id": "7"}))


def test_200_429_200_retries_identical_page_with_retry_after_and_jitter(storage, monkeypatch):
    connector = AsyncMock()
    connector.get_messages.side_effect = [[message(4), message(3)], throttled(),
                                          [message(2), message(1)], []]
    sleep = AsyncMock()
    monkeypatch.setattr(history.asyncio, "sleep", sleep)
    monkeypatch.setattr(history.random, "uniform", lambda a, b: 0.5)
    run(connector)
    assert [c.kwargs["offset_id"] for c in connector.get_messages.call_args_list] == [None, 3, 3, 1]
    sleep.assert_awaited_once_with(2.5)
    assert storage.state["last_message_id"] == 4
    assert storage.inserted == {1, 2, 3, 4}


def test_restart_resumes_partial_upper_bound_and_later_catches_new_head(storage, monkeypatch):
    monkeypatch.setattr(history, "MAX_PAGES_PER_CHAT", 1)
    connector = AsyncMock()
    connector.get_messages.return_value = [message(4), message(3)]
    run(connector)
    assert storage.state == {"last_message_id": 0, "offset_id": 3, "upper_message_id": 4}
    monkeypatch.setattr(history, "MAX_PAGES_PER_CHAT", 10)
    restarted = AsyncMock()
    restarted.get_messages.side_effect = [[message(2), message(1)], []]
    run(restarted)
    assert restarted.get_messages.call_args_list[0].kwargs["offset_id"] == 3
    assert storage.state["last_message_id"] == 4
    # New messages above the pinned upper bound stay for the next scan.
    restarted.get_messages.side_effect = [[message(5), message(4)]]
    run(restarted)
    assert storage.state["last_message_id"] == 5
    assert storage.inserted == {1, 2, 3, 4, 5}


def test_failed_insert_replays_page_without_holes(storage):
    storage.fail_id = 3
    connector = AsyncMock()
    connector.get_messages.return_value = [message(4), message(3)]
    run(connector)
    assert storage.state is None
    assert storage.inserted == {4}
    storage.fail_id = None
    connector.get_messages.side_effect = [[message(4), message(3)], [message(2), message(1)], []]
    run(connector)
    assert storage.inserted == {1, 2, 3, 4}
    assert storage.state["last_message_id"] == 4


def test_checkpoint_failure_replays_committed_page_idempotently(storage):
    storage.fail_checkpoint = True
    connector = AsyncMock()
    connector.get_messages.return_value = [message(2), message(1)]
    with pytest.raises(RuntimeError, match="checkpoint commit failed"):
        run(connector)
    assert storage.state is None
    storage.fail_checkpoint = False
    connector.get_messages.side_effect = [[message(2), message(1)], []]
    run(connector)
    assert storage.inserted == {1, 2}
    assert storage.state["last_message_id"] == 2


def test_retry_budget_preserves_partial_checkpoint_and_does_not_shorten_wait(storage, monkeypatch):
    connector = AsyncMock()
    connector.get_messages.side_effect = [[message(4), message(3)], throttled("900")]
    sleep = AsyncMock()
    monkeypatch.setattr(history.asyncio, "sleep", sleep)
    run(connector)
    sleep.assert_not_awaited()
    assert storage.state == {"last_message_id": 0, "offset_id": 3, "upper_message_id": 4}
    assert connector.get_messages.await_count == 2


def test_retry_attempt_cap_reuses_same_offset(storage, monkeypatch):
    connector = AsyncMock()
    connector.get_messages.side_effect = [throttled()] * 4
    sleep = AsyncMock()
    monkeypatch.setattr(history.asyncio, "sleep", sleep)
    run(connector)
    assert sleep.await_count == history.MAX_PAGE_RETRIES
    assert connector.get_messages.await_count == history.MAX_PAGE_RETRIES + 1
    assert storage.state is None


@pytest.mark.parametrize("page", [[message(2), message(3)], [message(2), message(2)],
                                  [message(2), {"telegramMessageId": None}],
                                  [message(2), {"telegramMessageId": "1"}]])
def test_invalid_page_never_advances_checkpoint(storage, page):
    connector = AsyncMock()
    connector.get_messages.return_value = page
    run(connector)
    assert storage.state is None


def test_shared_account_gate_serializes_reads_and_preserves_503_cooldown(monkeypatch):
    async def scenario():
        clock = [10.0]
        requests = []
        waits = []
        monkeypatch.setattr("sync.connector_client.time.monotonic", lambda: clock[0])

        async def sleep(seconds):
            waits.append(seconds)
            clock[0] += seconds

        monkeypatch.setattr("sync.connector_client.asyncio.sleep", sleep)

        async def handle(request):
            requests.append(clock[0])
            if len(requests) == 1:
                return httpx.Response(503, headers={"Retry-After": "8"})
            return httpx.Response(200, json={"dialogs": []})

        client = ConnectorClient("http://connector", "test")
        await client._client.aclose()
        client._client = httpx.AsyncClient(transport=httpx.MockTransport(handle))
        try:
            results = await asyncio.gather(client.get_messages("7"), client.get_dialogs(),
                                           client.get_dialogs(), return_exceptions=True)
            assert isinstance(results[0], httpx.HTTPStatusError)
            assert results[1:] == [[], []]
            assert waits == [8.0, 1.0]
            assert requests == [10.0, 18.0, 19.0]
        finally:
            await client.aclose()

    asyncio.run(scenario())


DSN = os.environ.get("TELEGRAM_SYNC_TEST_DATABASE_URL")


@pytest.mark.skipif(not DSN, reason="TELEGRAM_SYNC_TEST_DATABASE_URL not set")
def test_history_schema_never_trusts_global_legacy_coverage_and_isolates_accounts(monkeypatch):
    async def scenario():
        conn = await asyncpg.connect(DSN)
        try:
            # This connection's temporary tables shadow all permanent names.
            await conn.execute("""
                CREATE TEMP TABLE messages (platform text, metadata jsonb);
                CREATE TEMP TABLE telegram_sync_state (
                    chat_id bigint PRIMARY KEY, chat_title text, last_message_id bigint,
                    total_imported bigint, completed boolean, updated_at timestamptz);
                INSERT INTO telegram_sync_state VALUES (7, NULL, 100, 1, TRUE, NOW()),
                                                       (8, NULL, 200, 1, FALSE, NOW());
            """)
            # Completed legacy rows may have been written by either account or
            # advanced past failed inserts. Neither account can trust them.
            # Force the new table into pg_temp as well, without touching deployment tables.
            await conn.execute(db.SCHEMA_SQL.replace("CREATE TABLE IF NOT EXISTS telegram_history_state",
                                                      "CREATE TEMP TABLE IF NOT EXISTS telegram_history_state"))
            pool = Pool(conn)
            monkeypatch.setattr(db, "ACCOUNT", "personal")
            assert await db.get_history_state(pool, 7) is None
            assert await db.get_history_state(pool, 8) is None
            await db.checkpoint_history_page(pool, 7, None, 120, 150, 3)
            assert (await db.get_history_state(pool, 7))["last_message_id"] == 0
            monkeypatch.setattr(db, "ACCOUNT", "professional")
            assert await db.get_history_state(pool, 7) is None
            assert await db.get_history_state(pool, 8) is None
            await db.checkpoint_history_page(pool, 7, None, 20, 25, 2)
            await db.complete_history(pool, 7, None, 25, 1)
            state = await db.get_history_state(pool, 7)
            assert state["last_message_id"] == 25 and state["offset_id"] is None
            monkeypatch.setattr(db, "ACCOUNT", "personal")
            assert (await db.get_history_state(pool, 7))["offset_id"] == 120
            assert await conn.fetchval("SELECT last_message_id FROM telegram_sync_state WHERE chat_id = 7") == 100
        finally:
            await conn.close()

    asyncio.run(scenario())


@pytest.mark.skipif(not DSN, reason="TELEGRAM_SYNC_TEST_DATABASE_URL not set")
@pytest.mark.parametrize("id_type", ["uuid DEFAULT gen_random_uuid()", "bigserial"])
def test_committed_pages_resume_after_real_postgres_insert_failure(monkeypatch, id_type):
    async def scenario():
        conn = await asyncpg.connect(DSN)
        try:
            await conn.execute(f"""
                CREATE TEMP TABLE conversations (
                    id text PRIMARY KEY, name text, is_group boolean, type text,
                    wa_chat_id text, created_at timestamp, updated_at timestamp,
                    last_message_at timestamp, account text);
                CREATE TEMP TABLE participants (
                    id text PRIMARY KEY, name text, first_seen timestamp, last_seen timestamp, account text);
                CREATE TEMP TABLE conversation_participants (
                    conversation_id text, participant_id text, UNIQUE(conversation_id, participant_id));
                CREATE TEMP TABLE messages (
                    id {id_type} PRIMARY KEY, wa_message_id text UNIQUE, conversation_id text,
                    sender_wa_id text, wa_timestamp timestamp, direction text,
                    content text CHECK (content IS DISTINCT FROM 'reject'), message_type text,
                    is_forwarded boolean, reply_to_message_id text, platform text, metadata jsonb, account text);
            """)
            schema = db.SCHEMA_SQL.replace("CREATE TABLE IF NOT EXISTS", "CREATE TEMP TABLE IF NOT EXISTS")
            await conn.execute(schema)
            pool = Pool(conn)
            monkeypatch.setattr(db, "ACCOUNT", "personal")
            monkeypatch.setattr(history, "HISTORY_MEDIA", False)
            monkeypatch.setattr(history, "MAX_PAGES_PER_CHAT", 1)
            connector = AsyncMock()
            connector.get_messages.return_value = [message(4), message(3)]
            await history.import_chat(connector, pool, {"id": "7"})
            state = await db.get_history_state(pool, 7)
            assert (state["last_message_id"], state["upper_message_id"], state["offset_id"]) == (0, 4, 3)
            original_id = await conn.fetchval("SELECT id FROM messages WHERE wa_message_id = 'tg_7_4'")
            assert isinstance(original_id, UUID if id_type.startswith("uuid") else int)

            # One message commits before the next insertion fails. Neither the
            # persisted offset nor coverage may skip that failed transaction.
            monkeypatch.setattr(history, "MAX_PAGES_PER_CHAT", 10)
            restarted = AsyncMock()
            restarted.get_messages.return_value = [message(2), {**message(1), "content": "reject"}]
            await history.import_chat(restarted, pool, {"id": "7"})
            state = await db.get_history_state(pool, 7)
            assert (state["last_message_id"], state["offset_id"]) == (0, 3)
            assert await conn.fetchval("SELECT count(*) FROM messages") == 3

            # Replaying the failed page deduplicates the committed message and
            # fills the missing one before coverage advances to the pinned head.
            restarted.get_messages.side_effect = [[message(2), message(1)], []]
            await history.import_chat(restarted, pool, {"id": "7"})
            assert restarted.get_messages.call_args_list[-2].kwargs["offset_id"] == 3
            state = await db.get_history_state(pool, 7)
            assert (state["last_message_id"], state["offset_id"], state["upper_message_id"]) == (4, None, None)
            assert await conn.fetchval("SELECT count(*) FROM messages") == 4
            assert await conn.fetchval("SELECT id FROM messages WHERE wa_message_id = 'tg_7_4'") == original_id
            rows = await conn.fetch("SELECT (metadata->>'telegram_message_id')::int AS id FROM messages")
            assert sorted(row["id"] for row in rows) == [1, 2, 3, 4]
        finally:
            await conn.close()

    asyncio.run(scenario())
