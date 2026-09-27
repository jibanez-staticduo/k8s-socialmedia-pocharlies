import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initializeSettings, readSettings, SETTINGS_KEYS } from '../public/settings-ui.mjs';

class Element extends EventTarget {
  constructor(value = '') { super(); this.value = value; this.checked = false; this.disabled = false; this.hidden = false; this.open = false; this.dataset = {}; this.attrs = {}; }
  setAttribute(name, value) { this.attrs[name] = value; }
  focus() { this.focused = true; }
  contains(target) { return target === this; }
}

function fixture(saved = {}) {
  const values = new Map(Object.entries(saved));
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const ids = new Map(['settings-panel', 'message', 'settings-spellcheck', 'settings-enter-send', 'settings-logout', 'settings-logout-error', 'settings-close'].map(id => [id, new Element()]));
  const details = new Element();
  const summary = new Element();
  details.querySelector = () => summary;
  const radios = ['default', 'sand', 'sage', 'slate'].map(value => new Element(value));
  const document = new EventTarget();
  document.body = new Element();
  document.getElementById = id => ids.get(id);
  document.querySelector = () => details;
  document.querySelectorAll = () => radios;
  return { document, details, summary, ids, radios, storage, values };
}

test('local preferences restore, update composer, and emit Enter preference', () => {
  const f = fixture({ [SETTINGS_KEYS.spellcheck]: 'false', [SETTINGS_KEYS.enterToSend]: 'false', [SETTINGS_KEYS.wallpaper]: 'sage' });
  const originalCustomEvent = globalThis.CustomEvent;
  globalThis.CustomEvent = class extends Event { constructor(type, options) { super(type); this.detail = options.detail; } };
  try {
    initializeSettings(f.document, f.storage, async () => ({ ok: true }));
    assert.equal(f.ids.get('message').spellcheck, false);
    assert.equal(f.ids.get('settings-enter-send').checked, false);
    assert.equal(f.document.body.dataset.wallpaper, 'sage');
    assert.equal(f.radios[2].checked, true);
    f.ids.get('settings-spellcheck').checked = true;
    f.ids.get('settings-spellcheck').dispatchEvent(new Event('change'));
    assert.equal(f.ids.get('message').spellcheck, true);
    assert.equal(f.values.get(SETTINGS_KEYS.spellcheck), 'true');
    let enabled;
    f.document.addEventListener('wa:enter-to-send-change', event => { enabled = event.detail.enabled; });
    f.ids.get('settings-enter-send').checked = true;
    f.ids.get('settings-enter-send').dispatchEvent(new Event('change'));
    assert.equal(enabled, true);
    assert.equal(f.values.get(SETTINGS_KEYS.enterToSend), 'true');
    f.radios[0].checked = true;
    f.radios[0].dispatchEvent(new Event('change'));
    assert.equal(f.document.body.dataset.wallpaper, 'default');
    assert.equal(f.values.get(SETTINGS_KEYS.wallpaper), 'default');
  } finally { globalThis.CustomEvent = originalCustomEvent; }
});

test('invalid wallpaper returns to default and settings close on Escape or outside pointer', () => {
  const f = fixture({ [SETTINGS_KEYS.wallpaper]: 'url(javascript:bad)' });
  assert.equal(readSettings(f.storage).wallpaper, 'default');
  initializeSettings(f.document, f.storage, async () => ({ ok: true }));
  f.details.open = true;
  f.document.dispatchEvent(new Event('keydown', { cancelable: true }));
  const escape = new Event('keydown', { cancelable: true });
  Object.defineProperty(escape, 'key', { value: 'Escape' });
  f.document.dispatchEvent(escape);
  assert.equal(f.details.open, false);
  assert.equal(f.summary.focused, true);
  f.details.open = true;
  const outside = new Event('pointerdown');
  Object.defineProperty(outside, 'target', { value: new Element() });
  f.document.dispatchEvent(outside);
  assert.equal(f.details.open, false);
});

test('logout posts to the web auth endpoint and keeps an error visible on failure', async () => {
  const f = fixture();
  let request;
  initializeSettings(f.document, f.storage, async (...args) => { request = args; return { ok: false, status: 403 }; });
  f.ids.get('settings-logout').dispatchEvent(new Event('click'));
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(request, ['/auth/logout', {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}',
  }]);
  assert.equal(f.ids.get('settings-logout-error').hidden, false);
  assert.equal(f.ids.get('settings-logout').disabled, false);
});

test('settings markup retains account/theme IDs and feature extension hook', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.match(html, /class="rail-popover"/);
  assert.match(html, /id="account"/);
  assert.match(html, /id="theme"/);
  assert.match(html, /settings-ui\.mjs/);
});
