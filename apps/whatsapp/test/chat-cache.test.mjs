import test from 'node:test';
import assert from 'node:assert/strict';
import {createChatCache} from '../public/chat-cache.mjs';

test('logout clears previews and later login cannot restore legacy previews when network fails', () => {
  const values = new Map([['wa-chats-cache-v1:personal:false', '[{"preview":"secret A"}]'], ['theme', 'light']]);
  const storage = {get length() {return values.size;}, key: index => [...values.keys()][index], removeItem: key => values.delete(key)};
  const documentA = new EventTarget();
  const cacheA = createChatCache(storage, documentA);
  assert.equal(values.has('wa-chats-cache-v1:personal:false'), false);
  assert.equal(values.get('theme'), 'light');
  cacheA.set('personal:false', {chats: [{preview:'secret A'}]});
  assert.equal(cacheA.size, 1, 'account switching can reuse document memory');
  documentA.dispatchEvent(new Event('socialmedia:logout'));
  assert.equal(cacheA.size, 0);
  const cacheB = createChatCache(storage, new EventTarget());
  assert.equal(cacheB.get('personal:false'), undefined, 'failed network cannot expose prior login previews');
});

test('unavailable storage still permits isolated memory caching', () => {
  const cache = createChatCache(null, new EventTarget());
  cache.set('personal:false', {chats: []});
  assert.equal(cache.size, 1);
});
