import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.mjs';

const id = '11111111-1111-4111-8111-111111111111';
const jpeg = Buffer.from([255, 216, 255, 217]);
const authorization = `Basic ${Buffer.from('owner:fixture').toString('base64')}`;
async function fixture(t, { db, fetchImpl, oidc = false } = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'wa-private-cache-'));
  const session = 'a'.repeat(43);
  if (oidc) {
    await mkdir(join(dir, 'auth'));
    await writeFile(join(dir, 'auth/oidc-sessions.json'), JSON.stringify({ sessions: [[session, { subject: 'owner', expiresAt: Date.now() + 600000 }]] }));
  }
  const app = await createApp({
    databaseSchema: { messageIdType: 'uuid', attachmentIdType: 'uuid', attachmentDurationColumns: [] },
    env: { DATA_DIR: dir, APP_REALTIME_ENABLED: 'false', HERMES_RUNS_ENABLED: 'false', APP_PUBLIC_URL: 'https://wa.example',
      UI_AUTH_USERNAME: 'owner', UI_AUTH_PASSWORD: 'fixture', PERSONAL_SECRET: 'fixture', MEDIA_ALLOWED_ORIGINS: 'https://media.example',
      ...(oidc ? { APP_AUTH_MODE: 'oidc', OIDC_ISSUER_URL: 'https://idp.example', OIDC_CLIENT_ID: 'fixture', OIDC_CLIENT_SECRET: 'fixture', OIDC_ALLOWED_SUBJECTS: 'owner' } : {}) },
    registry: [{ channel: 'whatsapp', accountId: 'personal', secretEnv: 'PERSONAL_SECRET', connectorUrl: 'http://connector' }], db, fetchImpl,
  });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await app.close(); await rm(dir, { recursive: true, force: true }); });
  const request = (path, headers = {}, method = 'GET') => fetch(`http://127.0.0.1:${app.server.address().port}${path}`, {
    method, headers: { ...(oidc ? { cookie: `__Host-wa_session=${session}` } : { authorization }), ...headers },
  });
  return { request };
}

test('private media, thumbnail and cached avatar revalidate before reuse after logout or local deletion', async t => {
  let retained = true;
  let mediaFetches = 0;
  const db = { query: async (sql) => {
    if (/FROM conversations/.test(sql)) return { rows: [{ id: 'chat@g.us', is_group: true }] };
    assert.match(sql, /deleted_for_me/);
    if (!retained) return { rows: [] };
    return { rows: sql.includes('AS thumbnail') ? [{ thumbnail: jpeg.toString('base64') }]
      : [{ ref: 'https://media.example/image', mime_type: 'image/jpeg', file_name: 'photo.jpg' }] };
  } };
  const { request } = await fixture(t, { oidc: true, db, fetchImpl: async (url, options) => {
    if (String(url).startsWith('http://connector')) return Response.json({ data: jpeg.toString('base64'), contentType: 'image/jpeg' });
    mediaFetches++;
    return options.headers['if-none-match'] === '"media"' ? new Response(null, { status: 304, headers: { etag: '"media"' } })
      : new Response(jpeg, { headers: { etag: '"media"' } });
  } });
  const paths = [`/api/media/${id}?account=personal&chat=chat%40g.us`, `/api/media/thumb/${id}?account=personal&chat=chat%40g.us`, '/api/avatar?account=personal&chat=chat%40g.us'];
  const etags = [];
  for (const path of paths) {
    const response = await request(path);
    assert.equal(response.status, 200, await response.clone().text());
    assert.equal(response.headers.get('cache-control'), 'private, no-cache');
    assert.equal(response.headers.get('vary'), 'cookie, authorization');
    etags.push(response.headers.get('etag'));
    assert.ok(etags.at(-1));
    assert.equal((await request(path, { 'if-none-match': etags.at(-1) })).status, 304);
  }
  retained = false;
  const fetchesBeforeDeletion = mediaFetches;
  for (let index = 0; index < 2; index++) assert.equal((await request(paths[index], { 'if-none-match': etags[index] })).status, 404);
  assert.equal(mediaFetches, fetchesBeforeDeletion, 'deleted media is rejected before contacting object storage');
  const logout = await request('/auth/logout', { origin: 'https://wa.example', 'content-type': 'application/json' }, 'POST');
  assert.equal(logout.status, 200);
  for (let index = 0; index < paths.length; index++) assert.equal((await request(paths[index], { 'if-none-match': etags[index] })).status, 401);
});

test('search varies limit, sees connector changes immediately and never shares results across app instances', async t => {
  let visible = true;
  let queries = 0;
  const db = { query: async (sql, args) => {
    if (!sql.includes('m.content ILIKE')) return { rows: [] };
    queries++;
    assert.match(sql, /deleted_for_me/);
    return { rows: visible ? [1, 2, 3, 4].slice(0, args.at(-1)).map(n => ({ id: id.replace(/^1/, String(n)), wa_message_id: `wa-${n}`, conversation_id: 'chat@g.us', content: 'private result', direction: 'INBOUND', message_type: 'TEXT', wa_timestamp: '2026-10-24T00:00:00.000Z' })) : [] };
  } };
  const { request } = await fixture(t, { db });
  const path = '/api/search?account=personal&q=private&scope=all';
  const first = await request(path + '&limit=1');
  assert.equal((await first.json()).results.length, 1);
  assert.equal(first.headers.get('cache-control'), 'private, no-cache');
  assert.equal((await (await request(path + '&limit=3')).json()).results.length, 3);
  visible = false;
  const changed = await request(path + '&limit=1', { 'if-none-match': first.headers.get('etag') });
  assert.equal(changed.status, 200);
  assert.deepEqual((await changed.json()).results, []);
  assert.equal(queries, 3);
  const other = await fixture(t, { db: { query: async () => ({ rows: [] }) } });
  assert.deepEqual((await (await other.request(path + '&limit=3')).json()).results, []);
});
