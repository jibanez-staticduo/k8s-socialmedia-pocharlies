import test from 'node:test';
import assert from 'node:assert/strict';
import { BaileysClient } from './baileys-client.js';

test('channel media persists original payload outside chats and keeps receipt on store failure', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  const accepted = {
    key: { remoteJid: '123@newsletter', id: 'post', fromMe: true },
    message: { imageMessage: { caption: 'picture' } },
  };
  const stored: any[] = [];
  const errors: string[] = [];
  client.logger = { error: (value: string) => errors.push(value) };
  client.sock = { user: { id: 'owner@s.whatsapp.net' }, sendMessage: async () => accepted };
  client.toRawJid = (jid: string) => jid;
  client.buildQuotedFromId = async () => undefined;
  client.novedadesIngestStore = () => ({
    post: async (value: any) => {
      stored.push(value);
    },
  });
  client.persistSentMedia = () => {
    throw new Error('Must not create a chat attachment');
  };
  client.rememberKey = () => {
    throw new Error('Must not enter chat retry cache');
  };
  assert.equal(await client.sendFile('123@newsletter', 'data:image/png;base64,YQ=='), 'post');
  assert.equal(stored[0].key, accepted.key);
  assert.equal(stored[0].message, accepted.message);
  assert.equal(stored[0].identityKind, 'client');
  client.novedadesIngestStore = () => ({
    post: async () => {
      throw new Error('DB unavailable');
    },
  });
  assert.equal(await client.sendFile('123@newsletter', 'data:image/png;base64,YQ=='), 'post');
  assert.match(errors[0], /NOVEDADES_PERSIST_PENDING/);
});

test('sent status keeps captured owner identity when connection changes during send', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  let saved: any;
  client.sock = {
    user: { id: 'owner@s.whatsapp.net' },
    sendMessage: async () => {
      client.sock = undefined;
      return {
        key: { remoteJid: 'status@broadcast', id: 'story', fromMe: true },
        message: { audioMessage: {} },
        messageTimestamp: 1790500000,
      };
    },
  };
  client.isConnected = () => true;
  client.toRawJid = (jid: string) => jid;
  client.novedadesIngestStore = () => ({
    status: async (input: any) => {
      saved = input;
    },
  });
  assert.equal(await client.sendVoice('status@broadcast', Buffer.from('voice')), 'story');
  assert.equal(saved.authorJid, 'owner@s.whatsapp.net');
  assert.equal(saved.key.participant, undefined);
  assert.equal(saved.messageTimestampMs, 1790500000000);
});

test('data uploads preserve a safe document filename and provider receipt', async () => {
  const sent: any[] = [];
  const client = Object.create(BaileysClient.prototype) as any;
  client.sock = {
    sendMessage: async (_jid: string, payload: any) => {
      sent.push(payload);
      return { key: { id: 'provider-receipt' }, message: {} };
    },
  };
  client.toRawJid = (jid: string) => jid;
  client.buildQuotedFromId = async () => undefined;
  client.rememberKey = () => undefined;
  client.rememberMessageForRetry = () => undefined;
  client.persistSentMedia = async () => undefined;
  const receipt = await client.sendFile(
    'peer@s.whatsapp.net',
    'data:application/pdf;base64,YQ==',
    undefined,
    { fileName: '../report\n.pdf' }
  );
  assert.equal(receipt, 'provider-receipt');
  assert.equal(sent[0].fileName, 'report.pdf');
  assert.equal(sent[0].document.toString(), 'a');
  await client.sendFile('peer@s.whatsapp.net', 'data:application/pdf;base64,YQ==');
  assert.equal(sent[1].fileName, 'attachment');
});

test('image send forwards caption and preserves provider receipt after storage failure', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  let payload: any;
  let stored = false;
  let sendCount = 0;
  const errors: string[] = [];
  client.logger = { warn: () => undefined, error: (message: string) => errors.push(message) };
  client.sock = {
    sendMessage: async (_jid: string, content: any) => {
      sendCount += 1;
      payload = content;
      return { key: { id: 'image-receipt' }, message: { imageMessage: {} } };
    },
  };
  client.toRawJid = (jid: string) => jid;
  client.buildQuotedFromId = async () => undefined;
  client.rememberKey = () => undefined;
  client.rememberMessageForRetry = () => undefined;
  client.persistSentMedia = async (
    _sent: any,
    bytes: Buffer,
    mime: string,
    name: string,
    type: string,
    caption: string
  ) => {
    assert.equal(bytes.toString(), 'image');
    assert.equal(mime, 'image/webp');
    assert.equal(name, 'photo.webp');
    assert.equal(type, 'IMAGE');
    assert.equal(caption, 'A caption');
    stored = true;
  };
  assert.equal(
    await client.sendFile('peer@s.whatsapp.net', 'data:image/webp;base64,aW1hZ2U=', 'A caption', {
      fileName: 'photo.webp',
    }),
    'image-receipt'
  );
  assert.equal(stored, true);
  assert.equal(payload.image.toString(), 'image');
  assert.equal(payload.caption, 'A caption');
  client.persistSentMedia = async () => {
    throw new Error('storage unavailable');
  };
  assert.equal(
    await client.sendFile('peer@s.whatsapp.net', 'data:image/png;base64,aW1hZ2U=', 'A caption'),
    'image-receipt'
  );
  assert.equal(sendCount, 2);
  assert.match(errors[0], /MEDIA_PERSIST_PENDING provider_message_id=image-receipt/);
});

test('document and video sends persist the correct media type before receipt', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  const types: string[] = [];
  client.logger = { warn: () => undefined, error: () => undefined };
  client.sock = {
    sendMessage: async (_jid: string, payload: any) => ({
      key: { id: `receipt-${types.length}` },
      message: payload,
    }),
  };
  client.toRawJid = (jid: string) => jid;
  client.buildQuotedFromId = async () => undefined;
  client.rememberKey = () => undefined;
  client.rememberMessageForRetry = () => undefined;
  client.persistSentMedia = async (
    _sent: any,
    _bytes: Buffer,
    _mime: string,
    _name: string,
    type: string
  ) => {
    types.push(type);
  };
  assert.equal(
    await client.sendFile('peer@s.whatsapp.net', 'data:application/pdf;base64,YQ==', undefined, {
      fileName: 'a.pdf',
    }),
    'receipt-0'
  );
  assert.equal(
    await client.sendFile('peer@s.whatsapp.net', 'data:video/mp4;base64,YQ==', 'clip'),
    'receipt-1'
  );
  assert.deepEqual(types, ['DOCUMENT', 'VIDEO']);
});

test('missing quoted media is rejected before WhatsApp send', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  let sent = false;
  let claimed = false;
  client.sock = {
    sendMessage: async () => {
      sent = true;
      return { key: { id: 'unwanted' } };
    },
  };
  client.toRawJid = (jid: string) => jid;
  client.buildQuotedFromId = async () => undefined;
  await assert.rejects(
    client.sendFile('peer@s.whatsapp.net', 'data:image/png;base64,YQ==', undefined, {
      replyToMessageId: 'missing',
      beforeSend: async () => {
        claimed = true;
      },
    }),
    /Quoted message is unavailable/
  );
  assert.equal(sent, false);
  assert.equal(claimed, false);
});

test('media reservation is claimed immediately before provider send with its stable ID', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  const order: string[] = [];
  client.sock = {
    sendMessage: async (_jid: string, _payload: unknown, options: { messageId: string }) => {
      order.push('provider');
      assert.equal(options.messageId, '3EB0STABLE');
      return { key: { id: options.messageId }, message: {} };
    },
  };
  client.toRawJid = (jid: string) => jid;
  client.buildQuotedFromId = async () => undefined;
  client.rememberKey = () => undefined;
  client.rememberMessageForRetry = () => undefined;
  client.persistSentMedia = async () => undefined;
  const receipt = await client.sendFile(
    'peer@s.whatsapp.net',
    'data:image/png;base64,YQ==',
    undefined,
    {
      messageId: '3EB0STABLE',
      beforeSend: async () => {
        order.push('claim');
      },
    }
  );
  assert.equal(receipt, '3EB0STABLE');
  assert.deepEqual(order, ['claim', 'provider']);
});

test('media persistence lock serializes competing echo and local writes', async () => {
  const client = Object.create(BaileysClient.prototype) as any;
  const order: string[] = [];
  let release!: () => void;
  const waiting = new Promise<void>(resolve => {
    release = resolve;
  });
  const first = client.withMediaPersistenceLock('provider-id', async () => {
    order.push('first-start');
    await waiting;
    order.push('first-end');
  });
  const second = client.withMediaPersistenceLock('provider-id', async () => {
    order.push('second');
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(order, ['first-start']);
  release();
  await Promise.all([first, second]);
  assert.deepEqual(order, ['first-start', 'first-end', 'second']);
});
