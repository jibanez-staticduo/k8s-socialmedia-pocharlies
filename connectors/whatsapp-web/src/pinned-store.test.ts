import assert from 'node:assert/strict';
import test from 'node:test';
import pg from 'pg';
import type { WAMessage } from '@whiskeysockets/baileys';
import { listCapturedPins, readPinnedMessages } from './pinned-store';

const chat = '123@g.us';
const now = 1790600000000;
const message = (id: string, type = 1, timestamp = now): WAMessage => ({
  key:{id,remoteJid:chat}, message:{pinInChatMessage:{key:{id:'target',remoteJid:chat},type,senderTimestampMs:timestamp},messageContextInfo:{messageAddOnDurationInSecs:86400}},
});

test('pin pages bind account, chat and cursor and use stable keyset ordering', async () => {
  const originalQuery = pg.Pool.prototype.query;
  const originalAccount = process.env.CONNECTOR_ACCOUNT;
  const calls: {sql:string;params:unknown[]}[] = [];
  process.env.CONNECTOR_ACCOUNT='professional';
  (pg.Pool.prototype as any).query = async (sql:string,params:unknown[]) => {
    calls.push({sql,params});
    return {rows:['a','b','c'].map(id=>({wa_message_id:`professional:${id}`,message_key:{id,remoteJid:chat},message_payload:{conversation:'synthetic'},message_timestamp_ms:now}))};
  };
  try {
    const page = await listCapturedPins(chat,'previous',2);
    assert.deepEqual(calls.at(-1)!.params,['professional',`professional:${chat}`,'professional:previous',3]);
    assert.match(calls.at(-1)!.sql,/account = \$1 AND conversation_id = \$2/);
    assert.match(calls.at(-1)!.sql,/COLLATE "C" ASC LIMIT/);
    assert.match(calls.at(-1)!.sql,/jsonb_path_exists/);
    assert.equal(page.nextCursor,'b');
    assert.deepEqual(page.items.map(item=>item.key.id),['a','b']);
  } finally {
    pg.Pool.prototype.query=originalQuery;
    if(originalAccount===undefined)delete process.env.CONNECTOR_ACCOUNT;else process.env.CONNECTOR_ACCOUNT=originalAccount;
  }
});

test('a later-page unpin overrides earlier pages and result exposes only public fields', async () => {
  const cursors:(string|null|undefined)[]=[];
  const result=await readPinnedMessages(chat,{nowMs:now,loadPage:async (_chat,cursor)=>{
    cursors.push(cursor);
    return cursor===null ? {items:[message('pin')],nextCursor:'next'} : {items:[message('unpin',2,now+1)],nextCursor:null};
  }});
  assert.deepEqual(cursors,[null,'next']);
  assert.deepEqual(result,{availability:'local_partial',items:[]});
  const active=await readPinnedMessages(chat,{nowMs:now,loadPage:async()=>({items:[message('pin')],nextCursor:null})});
  assert.deepEqual(active.items,[{messageId:'target',timestampMs:now,expiresAtMs:now+86400000}]);
});

test('repeated cursors and failed later pages fail instead of reporting partial success', async () => {
  await assert.rejects(readPinnedMessages(chat,{loadPage:async()=>({items:[],nextCursor:'same'})}),/did not advance/);
  await assert.rejects(readPinnedMessages(chat,{loadPage:async(_chat,cursor)=>{
    if(cursor)throw new Error('database unavailable');
    return {items:[message('pin')],nextCursor:'next'};
  }}),/database unavailable/);
  await assert.rejects(listCapturedPins(chat,null,0),/Invalid pin page/);
});

test('verified LID and phone aliases are visible without admitting another contact', async () => {
  const local=message('pin');local.key.remoteJid='777@lid';local.message!.pinInChatMessage!.key!.remoteJid='555@s.whatsapp.net';
  const foreign=message('foreign');foreign.key.remoteJid='888@lid';foreign.message!.pinInChatMessage!.key!.id='foreign-target';foreign.message!.pinInChatMessage!.key!.remoteJid='888@lid';
  const calls:string[]=[];
  const result=await readPinnedMessages('555@c.us',{nowMs:now,loadPage:async()=>({items:[local,foreign],nextCursor:null}),
    canonicalChat:async jid=>{calls.push(jid);return ['555@c.us','555@s.whatsapp.net','777@lid'].includes(jid)?'777@lid':jid;},
  });
  assert.deepEqual(result.items.map(item=>item.messageId),['target']);
  assert.equal(local.key.remoteJid,'777@lid');
  assert.equal(calls.filter(jid=>jid==='555@c.us').length,1);
});
