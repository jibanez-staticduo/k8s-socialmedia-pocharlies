#!/usr/bin/env node
/*
 * Contrato de navegador para la escritura de privacidad: cada POST lleva la cuenta
 * activa en el momento de construirse, un cambio de cuenta a mitad de bucle corta el
 * resto de escrituras, una respuesta lenta no reescribe un dialogo ya cerrado, y los
 * valores que el usuario no toca (por ejemplo una lista de excluidos) no se reenvian.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const playwrightModule = process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright/index.mjs';
const { chromium } = await import(playwrightModule);
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/ms-playwright/chromium-1246/chrome-linux64/chrome';
const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');

const snapshots = {
  alpha: { profile: 'contact_blacklist', lastSeen: 'contacts', readReceipts: true, online: 'all', groupsAdd: 'contacts' },
  beta: { profile: 'contacts', lastSeen: 'all', readReceipts: false, online: 'match_last_seen', groupsAdd: 'all' },
};
const writes = [];
let held = null;
let holdNextGet = false;
let holdWrites = false;
const pendingWrites = [];
const releaseWrites = () => { for (const send of pendingWrites.splice(0, pendingWrites.length)) send(); };
let failFrom = Infinity;
const unexpected = [];

function reply(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' }).end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  const url = new URL(request.url || '/', 'http://fixture.local');
  const account = url.searchParams.get('account') || '';
  if (url.pathname === '/api/accounts') return reply(response, 200, { accounts: [{ id: 'alpha', label: 'Alpha' }, { id: 'beta', label: 'Beta' }], sendingEnabled: true, outboxScope: 'session' });
  if (url.pathname === '/api/chats') return reply(response, 200, { chats: [{ id: '123@s.whatsapp.net', name: 'Ana Fixture', preview: 'Hola', unread: 0, isGroup: false }] });
  if (url.pathname === '/api/messages') return reply(response, 200, { messages: [] });
  if (url.pathname === '/api/presence' || url.pathname === '/api/presence/subscribe') return reply(response, 200, {});
  if (url.pathname === '/api/privacy' && request.method === 'GET') {
    const send = () => reply(response, 200, { account, chat: null, privacy: snapshots[account] || snapshots.alpha });
    if (holdNextGet) { holdNextGet = false; held = send; return; }
    return send();
  }
  if (url.pathname === '/api/privacy' && request.method === 'POST') {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => {
      const parsed = JSON.parse(body || '{}');
      writes.push({ account: parsed.account, field: parsed.field, value: parsed.value, chat: parsed.chat ?? null });
      const send = () => (writes.length >= failFrom
        ? reply(response, 500, { error: 'El proveedor rechaza el cambio.' })
        : reply(response, 200, { account: parsed.account, chat: parsed.chat ?? null, confirmed: true, applied: [] }));
      if (held) { const release = held; held = null; release(); }
      if (holdWrites) { pendingWrites.push(send); return; }
      return send();
    });
    return;
  }
  if (url.pathname.startsWith('/api/')) { unexpected.push(url.pathname); return reply(response, 200, {}); }
  const file = path.resolve(publicDir, `.${url.pathname === '/' ? '/index.html' : url.pathname}`);
  if (!file.startsWith(`${publicDir}${path.sep}`)) { response.writeHead(403).end(); return; }
  readFile(file).then(body => {
    const type = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.mjs': 'text/javascript', '.js': 'text/javascript', '.svg': 'image/svg+xml' }[path.extname(file)];
    response.writeHead(200, { 'content-type': type || 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
  }).catch(() => response.writeHead(404).end());
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

async function waitForWrites(count, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (writes.length >= count) return;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  assert.fail(`esperaba ${count} escrituras y hay ${writes.length}: ${JSON.stringify(writes)}`);
}

let checks = 0;
const check = name => { checks += 1; console.log(`ok ${checks} - ${name}`); };
const select = (name, value) => page.selectOption(`.feature-dialog select[name="${name}"]`, value);
const submitState = () => page.evaluate(() => {
  const button = document.querySelector('.feature-dialog [type="submit"]');
  return { disabled: button?.disabled !== false, notice: document.querySelector('.feature-dialog .feature-muted')?.textContent || '' };
});
const modals = () => page.locator('.feature-modal').count();

await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('#account option'), null, { timeout: 15000 });

async function openPrivacy() {
  await page.click('.rail-settings summary');
  await page.click('#feature-privacy');
  await page.waitForSelector('.feature-dialog', { timeout: 5000 });
  await page.waitForFunction(() => document.querySelector('.feature-dialog [type="submit"]')?.disabled === false, null, { timeout: 15000 });
}

await openPrivacy();
const loaded = await submitState();
assert.match(loaded.notice, /usa WhatsApp en tu teléfono/, 'una lista de excluidos debe avisar de que no se edita aquí');
assert.equal(await page.inputValue('.feature-dialog select[name="profile"]'), 'contact_blacklist',
  'la exclusion existente debe quedar seleccionada aunque la opcion este deshabilitada');
check('la lista de excluidos se muestra seleccionada y con su aviso');

await select('readReceipts', 'false');
await page.click('.feature-dialog [type="submit"]');
await page.waitForFunction(() => document.querySelectorAll('.feature-modal').length === 0, null, { timeout: 5000 });
assert.deepEqual(writes, [{ account: 'alpha', field: 'readReceipts', value: 'none', chat: null }],
  'solo se envia el campo tocado, sin reescribir la exclusion');
check('un solo cambio toca un solo campo y no reenvia la exclusion de perfil');

writes.length = 0;
held = null;
holdWrites = true;
await openPrivacy();
await select('lastSeen', 'none');
await select('groupsAdd', 'all');
await page.click('.feature-dialog [type="submit"]');
await waitForWrites(1);
assert.equal((await submitState()).disabled, true);
await page.evaluate(() => {
  const form = document.querySelector('.feature-dialog form');
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
});
await page.waitForTimeout(100);
assert.equal(writes.length, 1, 'un doble submit no puede duplicar la escritura pendiente');
check('Guardar bloquea envios simultaneos incluso con submit programatico');
assert.equal(await modals(), 1, 'el dialogo sigue abierto mientras la primera escritura esta en vuelo');
const railReachable = await page.click('#account-rail button[data-account-id="beta"]', { timeout: 800 }).then(() => true).catch(() => false);
assert.equal(railReachable, false, 'el overlay del modal debe tapar el rail de cuentas: con raton no se puede cambiar de cuenta aqui');
check('el modal abierto impide cambiar de cuenta con raton (el overlay tapa el rail)');
await page.evaluate(() => document.querySelector('#account-rail button[data-account-id="beta"]')?.click());
assert.equal(await modals(), 0, 'el cambio de cuenta cierra el dialogo de privacidad');
releaseWrites();
await page.waitForTimeout(400);
assert.deepEqual(writes, [{ account: 'alpha', field: 'lastSeen', value: 'none', chat: null }],
  'la respuesta tardia aborta el resto del bucle y nada se escribe en la cuenta nueva');
check('cambiar de cuenta con una escritura en vuelo aborta las escrituras restantes sin mezclar cuentas');
holdWrites = false;

await openPrivacy();
assert.equal(await page.inputValue('.feature-dialog select[name="lastSeen"]'), 'all',
  'la cuenta nueva carga su propia instantanea');
check('al cambiar de cuenta el dialogo vuelve a leer la instantanea de esa cuenta');
await page.keyboard.press('Escape');
await page.waitForFunction(() => document.querySelectorAll('.feature-modal').length === 0, null, { timeout: 5000 });
const focusAfterClose = await page.evaluate(() => document.activeElement === document.querySelector('.rail-settings summary'));
assert.equal(focusAfterClose, true, 'cerrar devuelve el foco al disparador visible de ajustes');
check('Escape devuelve el foco al disparador visible de ajustes');

writes.length = 0;
failFrom = writes.length + 2;
await openPrivacy();
await select('lastSeen', 'none');
await select('online', 'all');
await page.click('.feature-dialog [type="submit"]');
await page.waitForFunction(() => document.querySelector('.feature-toast')?.textContent.includes('rechaza el cambio'), null, { timeout: 5000 });
assert.equal(await page.evaluate(() => document.querySelectorAll('.feature-modal').length), 1,
  'con un fallo el dialogo debe seguir abierto');
assert.match(await page.locator('.feature-toast').last().textContent(), /rechaza el cambio/, 'el fallo del proveedor debe mostrarse');
assert.deepEqual(writes.map(write => write.field), ['lastSeen', 'online'], 'el fallo del segundo campo no debe intentarlo de nuevo');
check('un rechazo en el segundo campo muestra el error, deja el dialogo abierto y no reintenta');
assert.match(await page.locator('.feature-dialog .feature-muted').textContent(), /Algunos ajustes se han guardado/);
failFrom = Infinity;
await page.click('.feature-dialog [type="submit"]');
await page.waitForFunction(() => document.querySelectorAll('.feature-modal').length === 0, null, { timeout: 5000 });
assert.deepEqual(writes.map(write => write.field), ['lastSeen', 'online', 'online']);
check('el reintento solo envia el campo fallido y conserva los ya aceptados');

writes.length = 0;
holdWrites = true;
await openPrivacy();
await select('lastSeen', 'none');
await select('online', 'all');
await page.evaluate(() => { window.detachedPrivacyForm = document.querySelector('.feature-dialog form'); });
await page.click('.feature-dialog [type="submit"]');
await waitForWrites(1);
await page.keyboard.press('Escape');
releaseWrites();
await page.waitForTimeout(200);
assert.equal(writes.length, 1, 'cerrar entre campos impide las escrituras posteriores');
holdWrites = false;
await openPrivacy();
await page.evaluate(() => window.detachedPrivacyForm.dispatchEvent(new Event('submit', { cancelable: true })));
await page.waitForTimeout(100);
assert.equal(writes.length, 1, 'un formulario antiguo no puede escribir al reabrir en la misma cuenta');
await page.keyboard.press('Escape');
check('cerrar cancela los campos pendientes y los formularios separados no pueden escribir');

writes.length = 0;
held = null;
holdNextGet = true;
await page.click('.rail-settings summary');
await page.click('#feature-privacy');
await page.waitForSelector('.feature-dialog', { timeout: 5000 });
assert.equal((await submitState()).disabled, true, 'mientras la lectura esta pendiente, Guardar debe estar desactivado');
await page.keyboard.press('Escape');
await page.waitForFunction(() => document.querySelectorAll('.feature-modal').length === 0, null, { timeout: 5000 });
const pending = held;
held = null;
pending?.();
await page.waitForTimeout(200);
assert.equal(await page.evaluate(() => document.querySelectorAll('.feature-modal').length), 0,
  'una lectura tardia no puede resucitar el dialogo cerrado');
assert.deepEqual(writes, [], 'una lectura tardia no debe escribir nada');
check('una lectura lenta que responde tarde no resucita ni contamina el dialogo cerrado');
await openPrivacy();
assert.equal(await page.inputValue('.feature-dialog select[name="profile"]'), 'contacts',
  'la siguiente apertura vuelve a leer los valores reales');
await page.keyboard.press('Escape');

assert.deepEqual(unexpected, [], `rutas de API no previstas: ${unexpected.join(', ')}`);
check('todas las llamadas de API estan previstas en el fixture');
assert.deepEqual(pageErrors, [], `errores de pagina: ${pageErrors.join(' | ')}`);
check('sin errores de javascript en la pagina');

await browser.close();
server.close();
console.log(JSON.stringify({ status: 'passed', checks, writes: writes.length }));
