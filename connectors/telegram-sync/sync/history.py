"""History importer / backfill — pulls Telegram history through the connector
into PostgreSQL. This is the SAFETY NET for the at-most-once NATS realtime path:
anything the live consumer missed (consumer downtime, connector restart) is
recovered here within one cycle.

Session-less: enumerates chats via GET /api/v1/dialogs and pages each chat's
history via GET /api/v1/messages/:chatId?limit&offsetId (newest-first,
older-than cursor). Durable partial scans and complete coverage are separate
fields in telegram_history_state, keyed by account and chat.
"""
from __future__ import annotations

import asyncio
import logging
import os
import random
import time

import asyncpg

from sync import db, mapping, media_download, avatar_sync
from sync.connector_client import ConnectorClient, is_throttled, retry_after

logger = logging.getLogger(__name__)

BATCH_SIZE = 100
DELAY_BETWEEN_CHATS = 1          # seconds, gentle on the shared connector session
CATCHUP_INTERVAL = 30 * 60       # 30 minutes
STARTUP_DELAY = 5               # let NATS realtime attach first
# Per-chat page cap per cycle — a runaway backstop and a bound on how hard a
# single first-run backfill can hammer the shared connector session. The
# no-progress + empty-page + watermark checks are the real terminators; normal
# catch-up finishes far under this. ~100k messages/chat/cycle.
MAX_PAGES_PER_CHAT = 1000
MAX_PAGE_RETRIES = 3
PAGE_RETRY_BUDGET = 5 * 60       # defer longer flood waits to a later cycle
RETRY_JITTER = 1.0              # always additive, never shorten Retry-After
# Download historical media inline (parity with the old sync). Tunable because a
# first full backfill of a media-heavy account is the heaviest load on the
# connector's single session.
HISTORY_MEDIA = os.environ.get("HISTORY_MEDIA", "true").lower() == "true"


async def _get_page(connector: ConnectorClient, chat_id: str, offset_id: int | None) -> list[dict]:
    """Retry the identical page within a bounded wait budget."""
    deadline = time.monotonic() + PAGE_RETRY_BUDGET
    for attempt in range(MAX_PAGE_RETRIES + 1):
        try:
            return await connector.get_messages(chat_id, limit=BATCH_SIZE, offset_id=offset_id)
        except Exception as error:
            if not is_throttled(error) or attempt == MAX_PAGE_RETRIES:
                raise
            delay = retry_after(error.response) + random.uniform(0, RETRY_JITTER)
            if time.monotonic() + delay > deadline:
                raise
            await asyncio.sleep(delay)
    raise RuntimeError("history retry budget exhausted")


async def import_chat(connector: ConnectorClient, pool: asyncpg.Pool, dialog: dict) -> None:
    """Resume a bounded newest-to-oldest scan without losing older coverage."""
    chat_id = str(dialog.get("id"))
    chat_title = dialog.get("name")

    state = await db.get_history_state(pool, int(chat_id))
    min_id = int(state["last_message_id"]) if state else 0
    offset_id = int(state["offset_id"]) if state and state["offset_id"] is not None else None
    upper_id = int(state["upper_message_id"]) if state and state["upper_message_id"] is not None else None
    new_count = 0
    complete = False

    for _ in range(MAX_PAGES_PER_CHAT):
        try:
            msgs = await _get_page(connector, chat_id, offset_id)
        except Exception as e:
            logger.warning("get_messages failed for %s (%s): %s", chat_title, chat_id, e)
            break
        if not msgs:
            await db.complete_history(pool, int(chat_id), chat_title, upper_id or min_id, 0)
            complete = True
            break

        ids = [mapping._int_or_none(m.get("telegramMessageId")) for m in msgs]
        # A malformed or non-progressing page cannot establish contiguous coverage.
        if any(tg_id is None or tg_id <= 0 for tg_id in ids):
            logger.warning("Invalid history page for chat %s; preserving checkpoint", chat_id)
            break
        if ids != sorted(set(ids), reverse=True) or (offset_id is not None and ids[0] >= offset_id):
            logger.warning("Non-progressing history page for chat %s; preserving checkpoint", chat_id)
            break
        page_upper = upper_id if upper_id is not None else ids[0]
        page_new = 0
        stop = False
        failed = False
        for m, tg_id in zip(msgs, ids):
            if tg_id <= min_id:
                stop = True
                break
            kwargs = mapping.to_insert_kwargs(m)
            if kwargs is None or kwargs["chat_id"] != int(chat_id):
                failed = True
                break
            try:
                message_id, is_new = await db.insert_message_ex(pool, **kwargs)
            except Exception as e:
                logger.error("history insert failed (chat %s msg %s): %s", chat_id, tg_id, e)
                failed = True
                break
            if message_id is None:
                failed = True
                break
            if is_new:
                new_count += 1
                page_new += 1
            if (HISTORY_MEDIA
                    and kwargs["message_type"] in media_download.DOWNLOADABLE_TYPES):
                try:
                    await media_download.download_and_store_media(
                        connector, pool, m, message_id, kwargs["message_type"]
                    )
                except Exception as e:
                    logger.warning("history media error (msg %s): %s", message_id, e)

        if failed:
            # Earlier inserts may have committed; replaying the entire page is
            # idempotent. Never skip the failed message by checkpointing past it.
            break
        # insert_message_ex returns only after its transaction commits. A crash
        # before this checkpoint causes harmless replay, never skipped offsets.
        if stop:
            await db.complete_history(pool, int(chat_id), chat_title, page_upper, page_new)
            complete = True
            break
        await db.checkpoint_history_page(pool, int(chat_id), chat_title, ids[-1], page_upper, page_new)
        offset_id, upper_id = ids[-1], page_upper

    if new_count:
        logger.info("Backfilled %s: %s new messages%s", chat_title, new_count,
                    " (partial; checkpoint retained)" if not complete else "")


async def run(pool: asyncpg.Pool, connector: ConnectorClient) -> None:
    """Periodic backfill loop. Never raises out — the connector recovers on its
    own and the bridge keeps serving; we just retry next cycle."""
    await asyncio.sleep(STARTUP_DELAY)

    while True:
        try:
            dialogs = await connector.get_dialogs()
            logger.info("Backfill cycle: %s chats", len(dialogs))

            avatars_done = 0
            for dialog in dialogs:
                try:
                    if await avatar_sync.sync_dialog_state(connector, pool, dialog):
                        avatars_done += 1
                except Exception as e:
                    logger.warning("dialog state sync failed for %s: %s", dialog.get("name"), e)

                try:
                    await import_chat(connector, pool, dialog)
                except Exception as e:
                    logger.error("Error importing chat %s: %s", dialog.get("name"), e)
                await asyncio.sleep(DELAY_BETWEEN_CHATS)

            if avatars_done:
                logger.info("Backfilled %s conversation avatars this cycle", avatars_done)
            logger.info("Backfill cycle complete. Next run in 30 minutes.")
        except Exception as e:
            logger.error("Backfill cycle failed: %s", e)

        await asyncio.sleep(CATCHUP_INTERVAL)
