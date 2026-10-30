import './test-env';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import pg from 'pg';
import type { WAMessage } from '@whiskeysockets/baileys';
import { BaileysClient } from './baileys-client';
import { resetDurableStoreStateForTests } from './durable-message-store';
import { UNAVAILABLE_MESSAGE_TYPES } from './message-preservation';

type Row = Record<string, unknown>;
const chat = '123-456@g.us';
const timestamp = 1789250000000;
const missing = (id: string): Row => ({
  wa_message_id: `professional:${id}`, conversation_id: `professional:${chat}`,
  remote_jid: chat, from_me: false, participant_jid: '789@lid',
});

function stubPool(route: (sql: string, params: unknown[]) => Row[] = () => []) {
  const original = pg.Pool.prototype.query;
  const calls: Array<{ sql: string; params: unknown[] }> = [];
  (pg.Pool.prototype as any).query = async (sql: string, params: unknown[] = []) => {
    calls.push({ sql, params });
    return { rows: route(sql, params) };
  };
  return { calls, restore: () => { pg.Pool.prototype.query = original; } };
}

function harness() {
  process.env.CONNECTOR_ACCOUNT = 'professional';
  resetDurableStoreStateForTests();
  const client = new BaileysClient('/tmp/unused-session', 'k'.repeat(16));
  const internals = client as any;
  const resends: unknown[] = [];
  internals.ready = true;
  internals.sock = {
    fetchMessageHistory: async () => assert.fail('targeted recovery cannot request history'),
    requestPlaceholderResend: async (key: unknown) => { resends.push(key); return 'pdo-request'; },
  };
  return { client, internals, resends };
}

test('targets all six explicit missing keys, scoped by account/chat with no history or payload scan', async () => {
  const ids = Array.from({ length: 6 }, (_, index) => `MISSING${index}`);
  const db = stubPool(sql => /SELECT m.wa_message_id, m.conversation_id/.test(sql) ? ids.map(missing) : []);
  try {
    const { client, resends } = harness();
    const result = await client.recoverUnavailableMessages(chat, ids);
    assert.equal(result.status, 'requested');
    assert.equal(result.requested, 6);
    assert.equal(result.recovered, 0);
    assert.deepEqual(result.outcomes.map(item => item.outcome), ids.map(() => 'requested'));
    assert.deepEqual(resends, ids.map(id => ({ id, remoteJid: chat, fromMe: false, participant: '789@lid' })));
    const scan = db.calls.find(call => /SELECT m.wa_message_id, m.conversation_id/.test(call.sql))!;
    assert.deepEqual(scan.params, ['professional', [`professional:${chat}`],
      ids.map(id => `professional:${id}`), UNAVAILABLE_MESSAGE_TYPES]);
    assert.match(scan.sql, /k.conversation_id = m.conversation_id/);
    assert.match(scan.sql, /NOT COALESCE\(m.is_edited, false\)/);
    assert.match(scan.sql, /NOT COALESCE\(m.is_deleted, false\)/);
    assert.match(scan.sql, /deleted_for_me/);
    const payloads = db.calls.filter(call => /SELECT message_key, message_payload/.test(call.sql));
    assert.equal(payloads.length, 6);
    for (const call of payloads) {
      assert.match(call.sql, /account = \$2/);
      assert.ok(call.params.includes('professional'));
      assert.ok(call.params.includes(`professional:${chat}`));
    }
    assert.equal((await client.recoverUnavailableMessages(chat, ids)).status, 'cooldown');
    assert.equal(resends.length, 6);
  } finally { db.restore(); }
});

test('unobserved, other-account and other-chat keys remain ineligible without provider calls', async () => {
  const db = stubPool();
  try {
    const { client, resends } = harness();
    const result = await client.recoverUnavailableMessages(chat, ['UNKNOWN']);
    assert.equal(result.status, 'no_match');
    assert.deepEqual(result.outcomes, [{ messageId: 'UNKNOWN', outcome: 'not_eligible' }]);
    assert.equal(resends.length, 0);
    await assert.rejects(client.recoverUnavailableMessages(`personal:${chat}`, ['UNKNOWN']), /Invalid chatId/);
    await assert.rejects(client.recoverUnavailableMessages(chat, ['personal:UNKNOWN']), /Invalid messageIds/);
  } finally { db.restore(); }
});

test('simultaneous calls cannot issue duplicate requests for an overlapping selection', async () => {
  const db = stubPool(sql => /SELECT m.wa_message_id, m.conversation_id/.test(sql) ? [missing('MISSING')] : []);
  try {
    const { client, resends } = harness();
    const results = await Promise.all([
      client.recoverUnavailableMessages(chat, ['MISSING']),
      client.recoverUnavailableMessages(chat, ['MISSING']),
    ]);
    assert.deepEqual(results.map(result => result.status).sort(), ['cooldown', 'requested']);
    assert.equal(resends.length, 1);
  } finally { db.restore(); }
});

test('a payload from a different provider chat cannot be reprojected', async () => {
  const db = stubPool(sql => {
    if (/SELECT m.wa_message_id, m.conversation_id/.test(sql)) return [missing('MISSING')];
    if (/SELECT message_key, message_payload/.test(sql)) return [{
      message_key: { id: 'MISSING', remoteJid: '987-654@g.us' },
      message_payload: { conversation: 'other chat' }, message_timestamp_ms: String(timestamp),
    }];
    return [];
  });
  try {
    const { client, internals, resends } = harness();
    internals.ingestMessage = async () => assert.fail('payload chat must match the selection');
    assert.equal((await client.recoverUnavailableMessages(chat, ['MISSING'])).requested, 1);
    assert.equal(resends.length, 1);
  } finally { db.restore(); }
});

test('input, connection and ingestion gates reject before any provider request', async () => {
  const { client, internals, resends } = harness();
  for (const ids of [[], ['X', 'X'], [' '], ['X'.repeat(201)], Array(11).fill('X')])
    await assert.rejects(client.recoverUnavailableMessages(chat, ids), /Invalid messageIds/);
  internals.ready = false;
  await assert.rejects(client.recoverUnavailableMessages(chat, ['X']), /not connected/);
  internals.ready = true;
  internals.ingest = false;
  await assert.rejects(client.recoverUnavailableMessages(chat, ['X']), /ingest disabled/);
  assert.equal(resends.length, 0);
});

test('provider responses and failures stay separate from DB-confirmed content recovery', async () => {
  const ids = ['SENT', 'PENDING', 'RECEIVED', 'FAILED', 'CONFIRMED', 'NOKEY'];
  const db = stubPool(sql => {
    if (/SELECT m.wa_message_id, m.conversation_id/.test(sql))
      return ids.map(id => id === 'NOKEY' ? { ...missing(id), remote_jid: null } : missing(id));
    if (/SELECT m.wa_message_id FROM messages m/.test(sql)) return [{ wa_message_id: 'professional:CONFIRMED' }];
    return [];
  });
  try {
    const { client, internals } = harness();
    internals.sock.requestPlaceholderResend = async (key: { id: string }) => {
      if (key.id === 'FAILED') throw new Error('provider failure with private details');
      return key.id === 'PENDING' ? undefined : key.id === 'RECEIVED' ? 'RESOLVED' : 'pdo-request';
    };
    const result = await client.recoverUnavailableMessages(chat, ids);
    assert.equal(result.requested, 2);
    assert.equal(result.recovered, 1);
    assert.deepEqual(result.outcomes.map(item => item.outcome),
      ['requested', 'already_pending', 'received', 'failed', 'recovered', 'no_key']);
    assert.doesNotMatch(JSON.stringify(result), /private details/);
    const confirmation = db.calls.find(call => /SELECT m.wa_message_id FROM messages m/.test(call.sql))!;
    assert.match(confirmation.sql, /m.message_type <> 'TEXT' OR NULLIF\(m.content, ''\) IS NOT NULL/);
    assert.equal((await client.recoverUnavailableMessages(chat, ids)).status, 'cooldown');
  } finally { db.restore(); }
});

test('local payload recovery counts only confirmed projection and keeps cached anchors outside selection', async () => {
  let ingested = 0;
  const db = stubPool(sql => {
    if (/SELECT m.wa_message_id, m.conversation_id/.test(sql)) return [missing('LOCAL')];
    if (/SELECT message_key, message_payload/.test(sql)) return [{
      message_key: { id: 'LOCAL', remoteJid: chat, fromMe: false },
      message_payload: { conversation: 'recovered' }, message_timestamp_ms: String(timestamp),
    }];
    return [];
  });
  try {
    const { client, internals, resends } = harness();
    internals.rememberHistoryRecoveryAnchor({ key: { id: 'UNRELATED', remoteJid: chat },
      message: { conversation: 'must not ingest' }, messageTimestamp: timestamp / 1000 });
    internals.ingestMessage = async (message: WAMessage, options: unknown) => {
      assert.equal(message.key.id, 'LOCAL');
      assert.deepEqual(options, { source: 'baileys_history_sync', publishEvent: false, storeMedia: true });
      ingested += 1;
      return { inserted: true };
    };
    const result = await client.recoverUnavailableMessages(chat, ['LOCAL']);
    assert.equal(ingested, 1);
    assert.equal(result.recovered, 0, 'an ingest return value alone does not confirm recovery');
    assert.equal(result.outcomes[0].outcome, 'unresolved');
    assert.equal(resends.length, 0);
  } finally { db.restore(); }
});

test('placeholder-to-media replay projects once, with one attachment download and no recovery event', async () => {
  let complete = false;
  let writes = 0;
  const db = stubPool(sql => {
    if (/SELECT m.wa_message_id, m.conversation_id/.test(sql)) return complete ? [] : [missing('LOCAL')];
    if (/SELECT message_key, message_payload/.test(sql)) return [{
      message_key: { id: 'LOCAL', remoteJid: chat, fromMe: false, participant: '789@lid' },
      message_payload: { imageMessage: { mimetype: 'image/jpeg' } },
      message_timestamp_ms: String(timestamp),
    }];
    if (/INSERT INTO messages/.test(sql)) {
      writes += 1;
      if (complete) return [];
      complete = true;
      return [{ id: 'saved-row' }];
    }
    if (/SELECT m.wa_message_id FROM messages m/.test(sql)) return [{ wa_message_id: 'professional:LOCAL' }];
    return [];
  });
  try {
    const { client, internals, resends } = harness();
    internals.persistDurablePayload = async () => true;
    internals.ensureConversationAvatarIfMissing = async () => {};
    internals.ensureParticipantAvatarIfMissing = async () => {};
    let downloads = 0;
    internals.downloadAndStoreMedia = async () => { downloads += 1; };
    client.on('message', () => assert.fail('manual recovery must not republish a live event'));
    const result = await client.recoverUnavailableMessages(chat, ['LOCAL']);
    assert.equal(result.recovered, 1);
    assert.equal(result.outcomes[0].outcome, 'recovered');
    internals.unavailableRecoveryRequestedAt.clear();
    assert.equal((await client.recoverUnavailableMessages(chat, ['LOCAL'])).status, 'no_match');
    assert.equal(writes, 1);
    assert.equal(downloads, 1);
    assert.equal(resends.length, 0);
    const write = db.calls.find(call => /INSERT INTO messages/.test(call.sql))!;
    assert.match(write.sql, /NOT COALESCE\(messages.is_edited, false\)/);
    assert.doesNotMatch(write.sql, /(?:is_deleted|deleted_at|status|is_edited)\s*=/);
    assert.equal(db.calls.some(call => /(?:UPDATE|DELETE FROM) attachments/.test(call.sql)), false);
  } finally { db.restore(); }
});

test('captured placeholder payload does not count as recovered and still requests exact key', async () => {
  const db = stubPool(sql => {
    if (/SELECT m.wa_message_id, m.conversation_id/.test(sql)) return [missing('MISSING')];
    if (/SELECT message_key, message_payload/.test(sql)) return [{
      message_key: { id: 'MISSING', remoteJid: chat },
      message_payload: { placeholderMessage: { type: 0 } }, message_timestamp_ms: String(timestamp),
    }];
    return [];
  });
  try {
    const { client, internals, resends } = harness();
    internals.ingestMessage = async () => assert.fail('cannot recover a placeholder');
    const result = await client.recoverUnavailableMessages(chat, ['MISSING']);
    assert.equal(result.recovered, 0);
    assert.equal(result.requested, 1);
    assert.equal(resends.length, 1);
  } finally { db.restore(); }
});
