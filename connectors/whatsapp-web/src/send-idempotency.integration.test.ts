// WA_TEST_DATABASE_URL must point to disposable PostgreSQL with CREATE DATABASE permission.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import pg from 'pg';

test(
  'PostgreSQL preserves ambiguous send failures and retries only proven pre-network failures',
  {
    skip: !process.env.WA_TEST_DATABASE_URL,
  },
  async () => {
    const url = new URL(process.env.WA_TEST_DATABASE_URL!);
    const admin = new pg.Client({ connectionString: url.toString() });
    await admin.connect();
    const database = `wa_idempotency_${randomUUID().replaceAll('-', '')}`;
    try {
      await admin.query(`CREATE DATABASE ${database}`);
    } finally {
      await admin.end();
    }
    url.pathname = `/${database}`;
    process.env.DATABASE_URL = url.toString();
    process.env.CONNECTOR_ACCOUNT = 'personal';
    const client = new pg.Client({ connectionString: url.toString() });
    await client.connect();
    const { runMigrations } =
      await import('../../../mcp-server/src/infrastructure/database/migrate');
    await runMigrations(client);
    const { getPool } = await import('./db-writer');
    const { reserveSend, claimSendAttempt, recordSendFailure, confirmSend, idempotencyKeyHash } =
      await import('./send-idempotency');
    const row = async (key: string) =>
      (
        await client.query(
          'SELECT status,error,updated_at,message_id FROM whatsapp_send_attempts WHERE account=$1 AND key_hash=$2',
          ['personal', idempotencyKeyHash(key)]
        )
      ).rows[0];
    try {
      assert.equal((await reserveSend('unknown', 'request')).state, 'claimed');
      await claimSendAttempt('unknown', 'request');
      await client.query(
        "UPDATE whatsapp_send_attempts SET updated_at='2000-01-01' WHERE key_hash=$1",
        [idempotencyKeyHash('unknown')]
      );
      await recordSendFailure('unknown', true, new Error('QA timeout after claim'));
      const unknown = await row('unknown');
      assert.equal(unknown.status, 'pending');
      assert.equal(unknown.error, 'QA timeout after claim');
      assert.ok(unknown.updated_at.getTime() > Date.parse('2000-01-01'));
      assert.equal((await reserveSend('unknown', 'request')).state, 'pending');
      await assert.rejects(claimSendAttempt('unknown', 'request'), /already claimed/i);

      await reserveSend('upload', 'media-request');
      await claimSendAttempt('upload', 'media-request');
      await recordSendFailure('upload', true, new Error('Media upload failed on all hosts'));
      assert.equal((await row('upload')).status, 'failed');
      assert.equal((await row('upload')).error, 'Media upload failed on all hosts');
      assert.equal((await reserveSend('upload', 'media-request')).state, 'retry');
      await claimSendAttempt('upload', 'media-request');
      assert.equal((await row('upload')).error, null);
      await confirmSend('upload', 'acknowledged-message');
      assert.equal((await reserveSend('upload', 'media-request')).state, 'sent');
      await recordSendFailure('upload', true, new Error('late network failure'));
      assert.equal((await row('upload')).status, 'sent');
      assert.equal((await row('upload')).error, null);

      await reserveSend('validation', 'text-request');
      await recordSendFailure('validation', false, new Error('invalid input before claim'));
      assert.equal((await row('validation')).status, 'failed');
      assert.equal((await row('validation')).error, 'invalid input before claim');
      assert.equal((await reserveSend('validation', 'text-request')).state, 'retry');
    } finally {
      await getPool().end();
      await client.end();
    }
  }
);
