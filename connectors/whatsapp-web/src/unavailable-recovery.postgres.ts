// Manual integration check: DATABASE_URL must point at the local disposable QA database.
import assert from 'node:assert/strict';
import pg from 'pg';
import type { MessageData } from './db-writer';

async function main(): Promise<void> {
  const base = new URL(process.env.DATABASE_URL || '');
  if (
    !['127.0.0.1', 'localhost'].includes(base.hostname) || base.port !== '32769' ||
    !/(?:qa|scratch|test)/i.test(base.pathname)
  ) throw new Error('Local disposable PostgreSQL on port 32769 with a QA/scratch/test database required');

  const admin = new pg.Client({ connectionString: base.toString() });
  await admin.connect();
  const schema = `qa_unavailable_${process.pid}_${Date.now()}`;
  await admin.query(`CREATE SCHEMA ${schema}`);
  base.searchParams.set('options', `-csearch_path=${schema}`);
  process.env.DATABASE_URL = base.toString();
  process.env.CONNECTOR_ACCOUNT = 'professional';
  const db = new pg.Client({ connectionString: base.toString() });
  await db.connect();
  const writer = await import('./db-writer');

  try {
    // LIKE copies the QA column/default/index contract, with no foreign keys to its data.
    await db.query(`CREATE TABLE messages (LIKE public.messages INCLUDING ALL);
      CREATE TABLE attachments (LIKE public.attachments INCLUDING ALL)`);
    const input = (id: string, content: string | null, messageType = 'TEXT'): MessageData => ({
      waMessageId: id, conversationId: '123-456@g.us', senderWaId: '789@lid',
      waTimestamp: new Date('2026-10-30T00:00:00Z'), direction: 'INBOUND',
      content, messageType, isForwarded: false,
      metadata: messageType === 'UNAVAILABLE'
        ? { contentUnavailable: true, retention: 'keep', source: 'live' }
        : { source: 'baileys_history_sync' },
    });
    const row = async (id: string) => (await db.query(
      'SELECT * FROM messages WHERE wa_message_id=$1', [`professional:${id}`]
    )).rows[0];

    const nativeId = await writer.storeMessage(input('TARGET', null, 'UNAVAILABLE'));
    assert.ok(nativeId);
    await db.query(`INSERT INTO attachments (message_id,file_type,file_url)
      VALUES ($1,'IMAGE','qa-existing-attachment')`, [nativeId]);
    const attachmentBefore = (await db.query('SELECT * FROM attachments')).rows;
    assert.equal(await writer.storeMessage(input('TARGET', 'recovered text')), nativeId);
    const recovered = await row('TARGET');
    assert.equal(recovered.id, nativeId);
    assert.equal(recovered.content, 'recovered text');
    assert.equal(recovered.message_type, 'TEXT');
    assert.equal(recovered.metadata.contentUnavailable, false);
    assert.equal(recovered.metadata.recovered, true);
    assert.equal(recovered.metadata.retention, 'keep');
    for (const replay of [input('TARGET', 'recovered text'), input('TARGET', null, 'UNAVAILABLE')])
      assert.equal(await writer.storeMessage(replay), null);
    assert.deepEqual(await row('TARGET'), recovered);
    assert.deepEqual((await db.query('SELECT * FROM attachments')).rows, attachmentBefore);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM messages')).rows[0].n, 1);

    // The same provider ID in another account has its own native row and content.
    process.env.CONNECTOR_ACCOUNT = 'personal';
    const otherAccountId = await writer.storeMessage(input('TARGET', 'personal original'));
    assert.ok(otherAccountId);
    assert.notEqual(otherAccountId, nativeId);
    const personalBefore = (await db.query("SELECT * FROM messages WHERE account='personal'")).rows;
    process.env.CONNECTOR_ACCOUNT = 'professional';
    assert.equal(await writer.storeMessage(input('TARGET', 'unwanted replay')), null);
    assert.deepEqual((await db.query("SELECT * FROM messages WHERE account='personal'")).rows, personalBefore);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM messages')).rows[0].n, 2);

    const editedId = await writer.storeMessage(input('EDITED', null, 'UNAVAILABLE'));
    await db.query(`UPDATE messages SET is_edited=true,edited_at='2026-10-30T01:00:00Z',
      metadata=metadata || '{"edited_retention":"keep"}'::jsonb WHERE id=$1`, [editedId]);
    const editedBefore = await row('EDITED');
    assert.equal(await writer.storeMessage(input('EDITED', 'must not replace edit')), null);
    assert.deepEqual(await row('EDITED'), editedBefore);

    for (const id of ['DELETED', 'HIDDEN']) {
      const native = await writer.storeMessage(input(id, null, 'UNAVAILABLE'));
      await db.query(`UPDATE messages SET is_deleted=$2,deleted_at='2026-10-30T02:00:00Z',
        status='deleted',metadata=metadata || $3::jsonb WHERE id=$1`,
      [native, id === 'DELETED', JSON.stringify({ deleted_for_me: id === 'HIDDEN', retention: 'keep' })]);
      const before = await row(id);
      assert.equal(await writer.storeMessage(input(id, 'captured content retained')), native);
      const after = await row(id);
      assert.equal(after.id, before.id);
      assert.equal(after.is_deleted, before.is_deleted);
      assert.deepEqual(after.deleted_at, before.deleted_at);
      assert.equal(after.status, before.status);
      assert.equal(after.metadata.deleted_for_me, before.metadata.deleted_for_me);
      assert.equal(after.metadata.retention, 'keep');
      assert.equal(await writer.storeMessage(input(id, 'captured content retained')), null);
      assert.deepEqual(await row(id), after);
    }
    assert.deepEqual((await db.query('SELECT * FROM attachments')).rows, attachmentBefore);
    console.log('PASS real PostgreSQL: placeholder recovery keeps native UUID; replay adds no rows/attachments; account isolation; edited row unchanged; deleted/hidden retention preserved');
  } finally {
    await writer.getPool().end();
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
}

void main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
