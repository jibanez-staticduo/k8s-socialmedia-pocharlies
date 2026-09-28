import assert from 'node:assert/strict';
import test from 'node:test';
import pg from 'pg';
import { decryptEventResponse } from '@whiskeysockets/baileys';
import { BaileysClient } from './baileys-client';
import { serializeDurableValue } from './whatsapp-capabilities';

test('RSVP relays only after claiming and remains accepted if local persistence fails', async () => {
  const original = pg.Pool.prototype.query;
  const key = {id: 'event', remoteJid: '123@g.us', participant: '20000@s.whatsapp.net'};
  const secret = Buffer.alloc(32, 5);
  const message = {eventMessage: {name: 'Fixture'}, messageContextInfo: {messageSecret: secret}};
  (pg.Pool.prototype as any).query = async () => ({rows: [{message_key: serializeDurableValue(key), message_payload: serializeDurableValue(message)}]});
  const client = new BaileysClient('/tmp/unused-event-test', 'fixture') as any;
  const order: string[] = [];
  let relayed: any;
  Object.assign(client, {ready: true, meJid: '10000@s.whatsapp.net', logger: {warn: () => {}},
    sock: {relayMessage: async (_jid: string, content: any, options: any) => {order.push('relay'); relayed = content; assert.equal(options.messageId, 'stable-id');}},
    persistSentMessage: async () => {order.push('persist'); throw new Error('fixture storage unavailable');},
  });
  const input = {token: 'fixture', conversationId: '123@g.us', eventMessageId: 'event', attendance: 'going' as const, extraGuestCount: 0};
  try {
    const id = await client.sendEventResponse(input, 'stable-id', async () => {order.push('claim');});
    assert.equal(id, 'stable-id');
    assert.deepEqual(order, ['claim', 'relay', 'persist']);
    const decoded = decryptEventResponse(relayed.encEventResponseMessage, {eventCreatorJid: key.participant,
      eventMsgId: 'event', eventEncKey: secret, responderJid: '10000@s.whatsapp.net'});
    assert.equal(decoded.response, 1);
    order.length = 0;
    await assert.rejects(client.sendEventResponse({...input, extraGuestCount: 1}, 'stable-id', async () => {order.push('claim');}), {code: 'EVENT_GUESTS_DISABLED'});
    assert.deepEqual(order, []);
  } finally { (pg.Pool.prototype as any).query = original; }
});

test('incoming RSVP is stored as ciphertext without appearing as a chat message or changing its preview', async () => {
  const original = pg.Pool.prototype.query;
  const queries: string[] = [];
  (pg.Pool.prototype as any).query = async (sql: string) => {queries.push(sql); return {rows: []};};
  const client = new BaileysClient('/tmp/unused-event-test', 'fixture') as any;
  let emitted = false;
  client.on('message', () => {emitted = true;});
  try {
    const result = await client.ingestMessage({key: {id: 'reply', remoteJid: '123@g.us'}, message: {
      encEventResponseMessage: {eventCreationMessageKey: {id: 'event'}, encIv: Buffer.alloc(12), encPayload: Buffer.alloc(20)},
    }});
    assert.equal(result.inserted, false);
    assert.equal(emitted, false);
    assert.equal(queries.length, 1);
    assert.match(queries[0], /INSERT INTO whatsapp_message_payloads/);
  } finally { (pg.Pool.prototype as any).query = original; }
});
