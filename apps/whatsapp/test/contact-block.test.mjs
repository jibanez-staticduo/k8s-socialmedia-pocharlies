import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.mjs';

test('block uses authenticated account/chat scope and confirms provider state without local deletion', async t => {
  const calls=[];let confirmed=true;
  const app=await createApp({
    env:{DATA_DIR:await mkdtemp(join(tmpdir(),'wa-block-test-')),UI_AUTH_USERNAME:'tester',UI_AUTH_PASSWORD:'fixture',
      APP_PUBLIC_URL:'https://wa.example',APP_ENABLE_SENDING:'true',A_SECRET:'a',B_SECRET:'b'},
    registry:['a','b'].map(accountId=>({channel:'whatsapp',accountId,secretEnv:`${accountId.toUpperCase()}_SECRET`,connectorUrl:`http://connector-${accountId}`})),
    db:{query:async(sql,args)=>{
      assert.doesNotMatch(sql,/DELETE|UPDATE|INSERT/i);
      return {rows:sql.includes('FROM conversations')&&args[0]==='a'&&args[1]==='chat-a'
        ?[{id:'chat-a',wa_chat_id:'123@c.us',is_group:false}]:[]};
    }},
    fetchImpl:async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});
      return Response.json({ok:true,blocked:JSON.parse(options.body).blocked,confirmed});},
  });
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));t.after(()=>app.close());
  const request=(body,headers={})=>fetch(`http://127.0.0.1:${app.server.address().port}/api/chat-actions`,{
    method:'POST',body:JSON.stringify(body),headers:{'content-type':'application/json',origin:'https://wa.example',
      authorization:`Basic ${Buffer.from('tester:fixture').toString('base64')}`,...headers}});
  const body={account:'a',chat:'chat-a',action:'block'};
  assert.equal((await request(body,{authorization:''})).status,401);
  assert.equal((await request(body,{origin:'https://evil.example'})).status,403);
  assert.equal((await request({...body,account:'b'})).status,404);
  assert.equal((await request({...body,account:'missing'})).status,404);
  assert.deepEqual(calls,[]);
  assert.equal((await request(body)).status,200);
  assert.deepEqual(calls,[{url:'http://connector-a/api/v1/chats/123%40c.us/block',body:{blocked:true}}]);
  assert.equal((await request({...body,action:'unblock'})).status,200);
  assert.equal(calls[1].body.blocked,false);
  confirmed=false;assert.equal((await request(body)).status,502);
  for(const action of ['clear','delete','lock'])assert.equal((await request({...body,action})).status,400);
});
