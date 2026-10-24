import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return {promise, resolve, reject};
};
function worker({fetcher = async () => new Response('network'), cached, put = async () => {}} = {}) {
  const handlers = {}, calls = [], deleted = [];
  let claimed = false;
  const store = {match: async () => cached, put: async (...args) => { calls.push(['put', ...args]); await put(...args); }};
  vm.runInNewContext(source, {
    URL, Response,
    self: {location: {origin: 'https://social.test'}, addEventListener: (type, handler) => {handlers[type] = handler;},
      skipWaiting: async () => {}, clients: {claim: async () => {claimed = true;}}},
    caches: {open: async name => {calls.push(['open', name]); return store;},
      keys: async () => ['wa-static-v1', 'wa-static-v2', 'another-app'], delete: async name => deleted.push(name)},
    fetch: (...args) => {calls.push(['fetch', ...args]); return fetcher(...args);},
  });
  function dispatch(type, request) {
    const waits = [];
    let response;
    handlers[type]({request, waitUntil: promise => waits.push(promise), respondWith: promise => {response = promise;}});
    return {waits, response};
  }
  return {dispatch, calls, deleted, claimed: () => claimed};
}
const request = (path, extra = {}) => ({url: new URL(path, 'https://social.test').href, method: 'GET', mode: 'cors', ...extra});

test('private endpoints, navigation, unknown paths, external URLs and mutations bypass the worker', () => {
  const w = worker();
  for (const req of [request('/api/avatar.png'), request('/auth/login.js'), request('/api'), request('/auth'),
    request('/private.png'), request('/other/module.mjs'), request('/'), request('/index.html'),
    request('/app.js', {mode: 'navigate'}), request('https://other.test/app.js'), request('/app.js', {method: 'POST'})]) {
    const event = w.dispatch('fetch', req);
    assert.equal(event.response, undefined, req.url);
    assert.equal(event.waits.length, 0);
  }
  assert.equal(w.calls.length, 0);
});

test('stale-while-revalidate icons return the hit while waitUntil covers fetch and cache.put', async () => {
  const network = deferred(), writing = deferred();
  const w = worker({cached: new Response('old-icon'), fetcher: () => network.promise, put: () => writing.promise});
  const event = w.dispatch('fetch', request('/icon.svg?v=dialogue-1'));
  assert.equal(event.waits.length, 1, 'lifetime must be extended synchronously');
  assert.equal(await (await event.response).text(), 'old-icon');
  let finished = false;
  const completion = Promise.all(event.waits).then(() => {finished = true;});
  network.resolve(new Response('new-icon'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(w.calls.filter(call => call[0] === 'put').length, 1);
  assert.equal(finished, false, 'waitUntil must still be pending during cache.put');
  writing.resolve();
  await completion;
  assert.equal(finished, true);
});

test('unhashed code loads current deployment despite a cached previous release', async () => {
  const w = worker({cached: new Response('old-code'), fetcher: async () => new Response('new-code')});
  const event = w.dispatch('fetch', request('/app.js'));
  assert.equal(await (await event.response).text(), 'new-code');
  await Promise.all(event.waits);
  assert.equal(w.calls.find(call => call[0] === 'fetch')[2].cache, 'no-cache');
  assert.equal(w.calls.find(call => call[0] === 'open')[1], 'wa-static-v2');
});

test('offline code falls back to cache, a first offline load returns a network error', async () => {
  for (const cached of [new Response('offline-code'), undefined]) {
    const w = worker({cached, fetcher: async () => {throw Error('offline');}});
    const event = w.dispatch('fetch', request('/styles.css'));
    const response = await event.response;
    if (cached) assert.equal(await response.text(), 'offline-code');
    else assert.equal(response.type, 'error');
    await Promise.all(event.waits);
  }
});

test('redirects, HTML, errors and opaque responses never enter static cache', async () => {
  for (const response of [new Response('login', {headers: {'content-type':'text/html'}}),
    new Response('error', {status: 500}), {ok: true, redirected: true}, {ok: true, type: 'opaque'}]) {
    const w = worker({fetcher: async () => response});
    const event = w.dispatch('fetch', request('/app.js'));
    assert.equal(await event.response, response);
    await Promise.all(event.waits);
    assert.equal(w.calls.some(call => call[0] === 'put'), false);
  }
});

test('cache write failure preserves the online response and activation keeps unrelated caches', async () => {
  const w = worker({put: async () => {throw Error('quota');}});
  const event = w.dispatch('fetch', request('/app.js'));
  assert.equal(await (await event.response).text(), 'network');
  await Promise.all(event.waits);
  await Promise.all(w.dispatch('activate').waits);
  assert.deepEqual(w.deleted, ['wa-static-v1']);
  assert.equal(w.claimed(), true);
});

test('registration bypasses HTTP cache without reloading a draft on controller changes', async () => {
  const app = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(app, /register\('\/sw\.js', \{updateViaCache: 'none'\}\)/);
  assert.doesNotMatch(app, /controllerchange/);
});
