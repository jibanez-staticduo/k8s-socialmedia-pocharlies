import assert from 'node:assert/strict';
import { test } from 'node:test';
import express from 'express';
import { createRouter } from './api/controller';
import { generateHMACSignature } from './api/auth';
import { CommunityError } from './novedades-communities';

const secret = 'communities-test-only-secret';
async function appFor(client: Record<string, unknown>) {
  const app = express();
  app.use(express.json());
  app.use('/api/v1', createRouter(client as any, {} as any, secret));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/v1`;
  return { base, close: () => new Promise<void>(resolve => server.close(() => resolve())) };
}
function headers(body: unknown) {
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    'content-type': 'application/json',
    'x-connector-timestamp': String(timestamp),
    'x-connector-signature': generateHMACSignature(body, timestamp, secret),
  };
}

test('all community routes require HMAC and never reach provider anonymously', async () => {
  let calls = 0;
  const stub = async () => {
    calls++;
    return [];
  };
  const app = await appFor({
    listCommunities: stub,
    getCommunity: stub,
    createCommunity: stub,
    communityAction: stub,
  });
  try {
    for (const [path, method] of [
      ['/communities', 'GET'],
      ['/communities/123@g.us', 'GET'],
      ['/communities', 'POST'],
      ['/communities/123@g.us/action', 'POST'],
    ]) {
      assert.equal((await fetch(app.base + path, { method })).status, 401);
    }
    assert.equal(calls, 0);
    const result = await fetch(app.base + '/communities', { headers: headers({}) });
    assert.equal(result.status, 200);
    assert.deepEqual(await result.json(), { ok: true, communities: [] });
    assert.equal(calls, 1);
  } finally {
    await app.close();
  }
});

test('community mutations respect enable and emergency gates', async () => {
  const oldEnabled = process.env.ENABLE_SENDING;
  const oldEmergency = process.env.EMERGENCY_DISABLE_SENDING;
  let calls = 0;
  const stub = async () => {
    calls++;
  };
  const app = await appFor({ createCommunity: stub, communityAction: stub });
  try {
    for (const [enabled, emergency] of [
      ['false', 'false'],
      ['true', 'true'],
    ]) {
      process.env.ENABLE_SENDING = enabled;
      process.env.EMERGENCY_DISABLE_SENDING = emergency;
      for (const path of ['/communities', '/communities/123@g.us/action']) {
        const response = await fetch(app.base + path, {
          method: 'POST',
          headers: headers({}),
          body: '{}',
        });
        assert.equal(response.status, 403);
      }
    }
    assert.equal(calls, 0);
  } finally {
    await app.close();
    if (oldEnabled === undefined) delete process.env.ENABLE_SENDING;
    else process.env.ENABLE_SENDING = oldEnabled;
    if (oldEmergency === undefined) delete process.env.EMERGENCY_DISABLE_SENDING;
    else process.env.EMERGENCY_DISABLE_SENDING = oldEmergency;
  }
});

test('community input and provider errors preserve honest HTTP error contract', async () => {
  const app = await appFor({
    getCommunity: async (jid: string) => {
      if (jid === 'bad') throw new CommunityError('INVALID_COMMUNITY_INPUT', 'Invalid JID', 400);
      throw new CommunityError('INVALID_PROVIDER_RESPONSE', 'Incomplete result', 502);
    },
  });
  try {
    for (const [jid, status] of [
      ['bad', 400],
      ['123@g.us', 502],
    ] as const) {
      const response = await fetch(app.base + '/communities/' + jid, { headers: headers({}) });
      assert.equal(response.status, status);
      assert.equal((await response.json()).ok, false);
    }
  } finally {
    await app.close();
  }
});
