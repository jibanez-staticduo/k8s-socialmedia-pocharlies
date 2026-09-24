#!/usr/bin/env node
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright/index.mjs');
const publicDir = path.resolve(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public'));
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const filename = path.resolve(publicDir, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!filename.startsWith(`${publicDir}${path.sep}`)) return response.writeHead(403).end();
  try {
    const body = await readFile(filename);
    response.writeHead(200, {'content-type': {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'}[path.extname(filename)] || 'application/octet-stream'}).end(body);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || '/ms-playwright/chromium-1246/chrome-linux64/chrome'});
const page = await browser.newPage();
const requests = [];
const decisions = [];
let directSends = 0;
let sessionLoads = 0;
let proposalLoads = 0;
const proposals = {'personal:one': [{id: 'proposal-approve', text: 'Texto exacto para enviar', expiresAt: '2099-01-01T00:00:00Z'}, {id: 'proposal-reject', text: 'Texto que no se enviará', expiresAt: '2099-01-01T00:00:00Z'}]};
const errors = [];
let failNext = false;
let pendingReply;
page.on('pageerror', error => errors.push(error.message));
page.route('**/api/**', async route => {
  const url = new URL(route.request().url());
  const chat = url.searchParams.get('chat');
  const json = body => route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(body)});
  if (url.pathname === '/api/accounts') return json({accounts: [{id: 'personal', label: 'Personal'}, {id: 'secondary', label: 'Secundaria'}], sendingEnabled: true});
  if (url.pathname === '/api/chats') return json({chats: url.searchParams.get('account') === 'secondary' ? [{id: 'one', name: 'Uno secundario'}] : [{id: 'one', name: 'Uno'}, {id: 'two', name: 'Dos'}]});
  if (url.pathname === '/api/messages') return json({messages: []});
  if (url.pathname === '/api/send') { directSends++; return json({confirmed: true}); }
  if (url.pathname === '/api/ai/session') {
    sessionLoads++;
    const account = url.searchParams.get('account');
    assert(['personal', 'secondary'].includes(account));
    return json({sessionId: `session-${account}-${chat}`, messages: account === 'personal' && chat === 'one' ? [{role: 'user', content: 'Consulta previa'}, {role: 'assistant', content: 'Respuesta previa'}] : []});
  }
  if (url.pathname === '/api/ai/proposals') { proposalLoads++; return json({proposals: proposals[`${url.searchParams.get('account')}:${chat}`] || []}); }
  if (url.pathname === '/api/ai/proposal') {
    const body = route.request().postDataJSON();
    decisions.push(body);
    const key = `${body.account}:${body.chat}`;
    proposals[key] = (proposals[key] || []).filter(proposal => proposal.id !== body.id);
    if (body.id === 'proposal-uncertain') return route.fulfill({status: 502, contentType: 'application/json', body: JSON.stringify({code: 'DELIVERY_UNCONFIRMED', error: 'Estado de entrega desconocido; no reintentar automáticamente'})});
    return json(body.action === 'approve' ? {confirmed: true, messageId: 'wa-confirmed'} : {rejected: true});
  }
  if (url.pathname === '/api/ai/chat') {
    requests.push({route, body: route.request().postDataJSON()});
    if (failNext) { failNext = false; return route.fulfill({status: 503, contentType: 'application/json', body: JSON.stringify({error: 'Hermes no disponible'})}); }
    if (requests.length === 4) { pendingReply = route; return; }
    return json({sessionId: 'session-one', text: `Respuesta ${requests.length}`});
  }
  return json({});
});

try {
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('.chat-item').first().click();
  await page.locator('.chat-item').nth(1).click();
  await page.locator('.chat-item').first().click();
  await page.waitForTimeout(80);
  assert.equal(sessionLoads, 0, 'hidden assistant fetched a session on chat navigation');
  assert.equal(proposalLoads, 0, 'hidden assistant fetched proposals on chat navigation');
  await page.locator('#ai-toggle').click();
  await page.getByText('Respuesta previa').waitFor({timeout: 5000}).catch(async error => { console.error('assistant root:', await page.locator('#ai-root').innerText(), 'page errors:', errors); throw error; });
  assert(sessionLoads > 0 && proposalLoads > 0, 'opening assistant did not load session and proposals');
  assert.equal(await page.locator('#ai-allow-propose').isChecked(), false);
  assert.equal(await page.locator('#ai-session, #ai-model, #ai-global').count(), 0);
  await page.getByText('Texto exacto para enviar').waitFor();
  await page.locator('.private-proposal').filter({hasText: 'Texto exacto para enviar'}).getByRole('button', {name: 'Aprobar y enviar'}).click();
  await page.getByText('Texto exacto para enviar').waitFor({state: 'detached'});
  assert.deepEqual(decisions[0], {account: 'personal', chat: 'one', id: 'proposal-approve', action: 'approve'});
  await page.locator('.private-proposal').filter({hasText: 'Texto que no se enviará'}).getByRole('button', {name: 'Rechazar'}).click();
  assert.deepEqual(decisions[1], {account: 'personal', chat: 'one', id: 'proposal-reject', action: 'reject'});
  proposals['personal:one'].push({id: 'proposal-uncertain', text: 'Texto con entrega incierta'});
  await page.locator('#ai-close').click();
  await page.locator('#ai-toggle').click();
  await page.locator('.private-proposal').filter({hasText: 'Texto con entrega incierta'}).getByRole('button', {name: 'Aprobar y enviar'}).click();
  await page.getByText('Estado de entrega desconocido; no reintentar automáticamente').waitFor();
  await page.getByText('Texto con entrega incierta').waitFor({state: 'detached'});
  assert.equal(decisions.filter(decision => decision.id === 'proposal-uncertain').length, 1, 'ambiguous delivery was retried');
  await page.locator('#ai-prompt').fill('Resume el chat');
  await page.locator('#ai-send').click();
  await page.getByText('Respuesta 1').waitFor();
  assert.deepEqual(requests[0].body, {account: 'personal', chat: 'one', message: 'Resume el chat', allowPropose: false});
  await page.locator('#ai-allow-propose').check();
  await page.locator('#ai-prompt').fill('Prepara otra respuesta');
  await page.locator('#ai-send').click();
  await page.getByText('Respuesta 2').waitFor();
  assert.equal(requests[1].body.allowPropose, true);
  assert.equal(await page.locator('#ai-allow-propose').isChecked(), false);
  assert.equal(directSends, 0, 'proposing sent a WhatsApp message without approval');
  await page.locator('#ai-use-draft').click();
  assert.equal(await page.locator('#message').inputValue(), 'Respuesta 2');
  failNext = true;
  await page.locator('#ai-toggle').click();
  await page.locator('#ai-prompt').fill('Conservar si falla');
  await page.locator('#ai-send').click();
  await page.getByText('Hermes no disponible').waitFor();
  assert.equal(await page.locator('#ai-prompt').inputValue(), 'Conservar si falla');
  await page.locator('#ai-prompt').fill('Respuesta tardía');
  await page.locator('#ai-send').click();
  await page.waitForFunction(() => document.querySelector('#ai-send')?.disabled);
  await page.locator('.chat-item').nth(1).click();
  await page.getByText('Pregunta a Hermes sobre este chat.').waitFor();
  await pendingReply.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({sessionId: 'session-one', text: 'No mostrar aquí'})});
  await page.waitForTimeout(100);
  assert.equal(await page.getByText('No mostrar aquí').count(), 0);
  assert.equal(await page.locator('#ai-allow-propose').isChecked(), false);
  assert.equal(await page.locator('.private-proposal').count(), 0, 'proposals leaked into another chat');
  await page.setViewportSize({width: 390, height: 844});
  await page.locator('#ai-prompt').waitFor({state: 'visible'});
  const panel = await page.locator('#ai-panel').boundingBox();
  assert(panel && panel.x >= 0 && panel.x + panel.width <= 391, 'assistant panel overflows mobile viewport');
  await page.locator('#ai-close').click();
  await page.locator('#account').evaluate(select => { select.value = 'secondary'; select.dispatchEvent(new Event('change', {bubbles: true})); });
  await page.locator('.chat-item').first().click();
  await page.locator('#ai-toggle').click();
  await page.getByText('Pregunta a Hermes sobre este chat.').waitFor();
  assert.equal(await page.getByText('Respuesta previa').count(), 0, 'same chat id leaked history across accounts');
  assert.equal(await page.locator('#ai-allow-propose').isChecked(), false);
  assert.equal(await page.locator('.private-proposal').count(), 0, 'proposals leaked into another account');
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
