import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import type { BaileysEventMap, WAMessage } from '@whiskeysockets/baileys';
import { WAMessageStubType } from '@whiskeysockets/baileys';
import processMessage from '@whiskeysockets/baileys/lib/Utils/process-message.js';

const OLD_ID = '34600111222@s.whatsapp.net';
const NEW_ID = '34600333444@s.whatsapp.net';
const GROUP_ID = '120363000000000000@g.us';
type ParticipantUpdate = BaileysEventMap['group-participants.update'];

/** Exercise the installed, pnpm-patched processor without connecting a socket or DB. */
async function processNumberChange(parameters: unknown, author = OLD_ID): Promise<ParticipantUpdate[]> {
  const updates: ParticipantUpdate[] = [];
  const context = {
    shouldProcessHistoryMsg: false,
    creds: { me: { id: '34600999888@s.whatsapp.net' }, accountSettings: {} },
    ev: {
      emit(name: string, payload: ParticipantUpdate) {
        if (name === 'group-participants.update') updates.push(payload);
        return true;
      },
    },
    keyStore: {},
    signalRepository: {},
    options: {},
    getMessage: async () => undefined,
  } as unknown as Parameters<typeof processMessage>[1];
  await processMessage(
    {
      key: { remoteJid: GROUP_ID, id: 'CHANGE_NUMBER', fromMe: false, participant: author },
      messageStubType: WAMessageStubType.GROUP_PARTICIPANT_CHANGE_NUMBER,
      messageStubParameters: parameters,
    } as WAMessage,
    context
  );
  return updates;
}

test('installed rc13 producer supplies raw participant JIDs in their original order', async () => {
  const require = createRequire(import.meta.url);
  const producer = await readFile(
    require.resolve('@whiskeysockets/baileys/lib/Socket/messages-recv.js'),
    'utf8'
  );
  const modify = producer.slice(producer.indexOf("case 'modify':"), producer.indexOf("case 'promote':"));
  assert.match(modify, /getBinaryNodeChildren\(child, 'participant'\)\.map\(p => p\.attrs\.jid\)/);
  assert.match(modify, /msg\.messageStubParameters = oldNumber \|\| \[\]/);
  assert.match(modify, /GROUP_PARTICIPANT_CHANGE_NUMBER/);
});

test('patched processor keeps both old and new raw JIDs in the downstream participant contract', async () => {
  const updates = await processNumberChange([OLD_ID, NEW_ID]);
  assert.deepEqual(updates, [{
    id: GROUP_ID,
    author: OLD_ID,
    authorPn: undefined,
    authorUsername: undefined,
    participants: [{ id: OLD_ID }, { id: NEW_ID }],
    action: 'modify',
  }]);
  // The connector consumes p.id and preserves order; neither identity may collapse to an empty JID.
  assert.deepEqual(updates[0]!.participants.map(participant => participant.id), [OLD_ID, NEW_ID]);
});

test('a notification with only the old ID preserves the new identity supplied as its author', async () => {
  const updates = await processNumberChange([OLD_ID], NEW_ID);
  assert.equal(updates[0]!.author, NEW_ID);
  assert.deepEqual(updates[0]!.participants, [{ id: OLD_ID }]);
});

test('serialized and mixed participant pairs retain IDs, aliases and metadata', async () => {
  const oldParticipant = { id: OLD_ID, lid: '900111222@lid', admin: 'admin' };
  const newParticipant = { id: '900333444@lid', phoneNumber: NEW_ID, username: 'new-user' };
  const updates = await processNumberChange([
    JSON.stringify(oldParticipant),
    JSON.stringify(newParticipant),
  ]);
  assert.deepEqual(updates[0]!.participants, [oldParticipant, newParticipant]);
  const mixed = await processNumberChange([OLD_ID, JSON.stringify(newParticipant)]);
  assert.deepEqual(mixed[0]!.participants, [{ id: OLD_ID }, newParticipant]);
  const strings = await processNumberChange([JSON.stringify(OLD_ID), JSON.stringify(NEW_ID)]);
  assert.deepEqual(strings[0]!.participants.map(participant => participant.id), [OLD_ID, NEW_ID]);
});

test('malformed parameters neither throw nor fabricate participant identities', async () => {
  const malformed = [
    '', 'not-a-jid', '{', '{invalid@lid', 'null', 'true', '42', '[]', '{}',
    JSON.stringify({ id: null }), JSON.stringify({ id: 42 }),
    JSON.stringify({ id: 'not-a-jid' }), JSON.stringify({ id: '@lid' }),
    JSON.stringify({ id: 'person@g.us' }), JSON.stringify({ id: 'person@lid trailing' }),
    JSON.stringify({ id: '{invalid@lid' }),
    JSON.stringify({ phoneNumber: NEW_ID }), JSON.stringify([OLD_ID, NEW_ID]),
    undefined, null, 42, { id: NEW_ID },
  ];
  for (const parameters of [undefined, null, {}, OLD_ID, [], malformed]) {
    assert.deepEqual(await processNumberChange(parameters), []);
  }
  const updates = await processNumberChange([OLD_ID, ...malformed, JSON.stringify({ id: NEW_ID })]);
  assert.deepEqual(updates[0]!.participants, [{ id: OLD_ID }, { id: NEW_ID }]);
});
