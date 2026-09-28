import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import { readContactBlocked, setContactBlocked } from './contact-block';
import { BaileysClient } from './baileys-client';
import { createRouter } from './api/controller';
import { generateHMACSignature } from './api/auth';

test('provider block state is verified and repeated requests are idempotent across PN/LID', async () => {
  let list:string[]=[]; const calls:unknown[]=[];
  const socket={signalRepository:{lidMapping:{getLIDForPN:async()=> '777@lid'}},
    fetchBlocklist:async()=>list, updateBlockStatus:async(jid:string,action:string)=>{
      calls.push([jid,action]); list=action==='block'?['777@lid']:[];
    }};
  assert.deepEqual(await setContactBlocked(socket,'123@c.us',true),{blocked:true,changed:true,confirmed:true});
  assert.equal(await readContactBlocked(socket,'123@c.us'),true);
  assert.equal(await readContactBlocked({ ...socket, signalRepository:{lidMapping:{getPNForLID:async()=> '123@s.whatsapp.net'}} },'777@lid'),true);
  assert.equal(await readContactBlocked({ ...socket, signalRepository:{lidMapping:{getPNForLID:async()=> '123:0@s.whatsapp.net'}} },'777@lid'),true);
  assert.equal(await readContactBlocked({ ...socket, fetchBlocklist:async()=>['123@s.whatsapp.net'], signalRepository:{lidMapping:{getPNForLID:async()=> '123:0@s.whatsapp.net'}} },'777@lid'),true);
  assert.equal(await readContactBlocked({ ...socket, signalRepository:{lidMapping:{getPNForLID:async()=> 'unexpected-alias'}} },'777@lid'),true);
  assert.equal((await setContactBlocked(socket,'123@s.whatsapp.net',true)).changed,false);
  assert.equal(calls.length,1);
  await setContactBlocked(socket,'123@c.us',false);
  assert.equal((await setContactBlocked(socket,'123@c.us',false)).changed,false);
  assert.equal(calls.length,2);
  for(const chat of ['123@g.us','123@newsletter','other:123@c.us','status@broadcast'])
    await assert.rejects(setContactBlocked(socket,chat,true),/direct contact/);
  socket.updateBlockStatus=async()=>{};
  await assert.rejects(setContactBlocked(socket,'123@c.us',true),/not confirmed/);
});

test('block state read refuses a disconnected provider', async () => {
  await assert.rejects(BaileysClient.prototype.contactBlocked.call({sock:null,isConnected:()=>false} as any,'123@c.us'),
    (error:unknown)=>error instanceof Error && /not connected/.test(error.message));
});

test('connector requires HMAC, sending permission and a strict contact/boolean target', async () => {
  const previous={enable:process.env.ENABLE_SENDING,emergency:process.env.EMERGENCY_DISABLE_SENDING};
  const calls:unknown[]=[]; const secret='block-fixture';
  const app=express();app.use(express.json());app.use(createRouter({contactBlocked:async()=>true,blockContact:async(...args:unknown[])=>{
    calls.push(args);return {blocked:args[1],confirmed:true};
  }} as any,{} as any,secret));
  const server=app.listen(0,'127.0.0.1'); await new Promise<void>(r=>server.once('listening',r));
  const post=(chat:string,blocked:unknown,signed=true)=>{
    const body={blocked};const timestamp=Math.floor(Date.now()/1000);
    return fetch(`http://127.0.0.1:${(server.address() as any).port}/chats/${encodeURIComponent(chat)}/block`,{
      method:'POST',body:JSON.stringify(body),headers:{'content-type':'application/json',...(signed?{
        'x-connector-timestamp':String(timestamp),'x-connector-signature':generateHMACSignature(body,timestamp,secret)}:{})}});
  };
  const get=(chat:string,signed=true)=>{
    const timestamp=Math.floor(Date.now()/1000);
    return fetch(`http://127.0.0.1:${(server.address() as any).port}/chats/${encodeURIComponent(chat)}/block`,{
      headers:signed?{'x-connector-timestamp':String(timestamp),'x-connector-signature':generateHMACSignature({},timestamp,secret)}:{}});
  };
  try {
    assert.equal((await get('123@c.us',false)).status,401);
    assert.equal((await get('123@g.us')).status,400);
    assert.deepEqual(await (await get('123@c.us')).json(),{ok:true,blocked:true,confirmed:true});
    process.env.ENABLE_SENDING='true';delete process.env.EMERGENCY_DISABLE_SENDING;
    assert.equal((await post('123@c.us',true,false)).status,401);
    assert.equal((await post('123@g.us',true)).status,400);
    assert.equal((await post('123@c.us','true')).status,400);
    process.env.ENABLE_SENDING='false';assert.equal((await post('123@c.us',true)).status,403);
    process.env.ENABLE_SENDING='true';process.env.EMERGENCY_DISABLE_SENDING='true';
    assert.equal((await post('123@c.us',true)).status,403);assert.deepEqual(calls,[]);
    delete process.env.EMERGENCY_DISABLE_SENDING;
    assert.equal((await post('123@c.us',true)).status,200);
    assert.deepEqual(calls,[['123@s.whatsapp.net',true]]);
  } finally {
    for(const [key,value] of [['ENABLE_SENDING',previous.enable],['EMERGENCY_DISABLE_SENDING',previous.emergency]])
      if(value===undefined)delete process.env[key!];else process.env[key!]=value;
    await new Promise<void>(r=>server.close(()=>r()));
  }
});
