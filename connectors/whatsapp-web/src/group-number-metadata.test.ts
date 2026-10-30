import './test-env';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BaileysClient } from './baileys-client';

test('modify notification retains observed old participant and new author identities', () => {
  process.env.CONNECTOR_ACCOUNT = 'professional';
  const client = new BaileysClient('/tmp/unused-session', 'k'.repeat(16));
  const internals = client as any;
  const handlers: Record<string, (event: unknown) => void> = {};
  internals.sock = { ev: { on: (name: string, handler: (event: unknown) => void) => { handlers[name] = handler; } } };
  internals.bindSocketEvents(async () => {});
  const updates: unknown[] = [];
  client.on('chat-update', update => updates.push(update));
  handlers['group-participants.update']({
    id: '123-456@g.us', participants: ['111@s.whatsapp.net'], action: 'modify',
    author: '222:7@s.whatsapp.net', authorPn: '222:7@s.whatsapp.net',
  });
  assert.deepEqual(updates, [{
    waChatId: '123-456@g.us', updateType: 'NAME_CHANGED',
    metadata: {
      participants: ['111@c.us'], action: 'modify',
      author: '222:7@s.whatsapp.net', authorPn: '222:7@s.whatsapp.net',
    },
  }]);
});
