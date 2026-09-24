#!/usr/bin/env node
/*
 * Social Media Agent conversation contract: the right panel is an ordinary chat,
 * the composer keeps a "Proponer mensaje" action next to "+", and nothing in the
 * panel may send a WhatsApp message without the owner pressing send.
 */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright/index.mjs');
const {DRAFT_INSTRUCTION} = await import(new URL('../public/draft-suggest.mjs', import.meta.url).href);
const publicDir = path.resolve(process.env.UI_SOURCE_DIR || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public'));
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

const chats = {personal: [{id: 'one', name: 'Uno'}, {id: 'two', name: 'Dos'}], secondary: [{id: 'one', name: 'Uno secundario'}]};
const sessions = new Map([['personal:one', {sessionId: 'session-personal-one', messages: [{role: 'user', content: 'Consulta previa'}, {role: 'assistant', content: 'Respuesta previa'}]}]]);
const proposals = new Map([['personal:one', [{id: 'proposal-approve', text: 'Texto exacto para enviar', expiresAt: '2099-01-01T00:00:00Z'}, {id: 'proposal-reject', text: 'Texto que no se enviará', expiresAt: '2099-01-01T00:00:00Z'}]]]);
const turns = [];
const decisions = [];
const errors = [];
let sendingEnabled = true;
let directSends = 0;
let sessionLoads = 0;
let proposalLoads = 0;
let reply = 'Respuesta del agente';
let failNext = false;
let heldRoute = null;
page.on('pageerror', error => errors.push(error.message));
await page.route('**/api/**', async route => {
  const url = new URL(route.request().url());
  const account = url.searchParams.get('account') || route.request().postDataJSON()?.account;
  const chat = url.searchParams.get('chat') || route.request().postDataJSON()?.chat;
  const key = `${account}:${chat}`;
  const json = body => route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(body)});
  if (url.pathname === '/api/accounts') return json({accounts: [{id: 'personal', label: 'Personal'}, {id: 'secondary', label: 'Secundaria'}], sendingEnabled});
  if (url.pathname === '/api/chats') return json({chats: chats[account] || []});
  if (url.pathname === '/api/messages') return json({messages: []});
  if (url.pathname === '/api/send') { directSends++; return json({messageId: 'wa-confirmed'}); }
  if (url.pathname === '/api/ai/session') {
    sessionLoads++;
    const stored = sessions.get(key) || {sessionId: `session-${key}`, messages: []};
    return json({sessionId: stored.sessionId, messages: stored.messages});
  }
  if (url.pathname === '/api/ai/proposals') { proposalLoads++; return json({proposals: proposals.get(key) || []}); }
  if (url.pathname === '/api/ai/proposal') {
    const body = route.request().postDataJSON();
    decisions.push(body);
    const stored = proposals.get(key) || [];
    proposals.set(key, stored.filter(proposal => proposal.id !== body.id));
    if (body.id === 'proposal-uncertain') return route.fulfill({status: 502, contentType: 'application/json', body: JSON.stringify({code: 'DELIVERY_UNCONFIRMED', error: 'Estado de entrega desconocido; no reintentar automáticamente'})});
    return json(body.action === 'approve' ? {confirmed: true, messageId: 'wa-confirmed'} : {rejected: true});
  }
  if (url.pathname === '/api/ai/chat') {
    const body = route.request().postDataJSON();
    assert.equal(body.allowPropose, false, 'the panel asked for a proposal without owner approval');
    turns.push({key, message: body.message});
    if (failNext) { failNext = false; return route.fulfill({status: 503, contentType: 'application/json', body: JSON.stringify({error: 'Hermes no disponible'})}); }
    if (heldRoute === 'chat') { heldRoute = route; return; }
    const stored = sessions.get(key) || {sessionId: `session-${key}`, messages: []};
    stored.messages.push({role: 'user', content: body.message}, {role: 'assistant', content: reply});
    sessions.set(key, stored);
    return json({sessionId: stored.sessionId, text: reply});
  }
  return json({});
});
const openPanel = async () => { await page.locator('#ai-toggle').click(); await page.locator('#ai-panel').waitFor({state: 'visible'}); };
const draftTurns = () => turns.filter(turn => turn.message === DRAFT_INSTRUCTION).length;

try {
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator('.chat-item').first().click();
  assert.equal(await page.locator('#ai-panel').isVisible(), false, 'the panel opened by itself');
  assert.equal(sessionLoads, 0, 'a hidden panel loaded a Hermes session');
  assert.equal(proposalLoads, 0, 'a hidden panel loaded proposals');
  assert.equal(await page.locator('#ai-panel-subtitle').textContent(), 'Uno', 'the panel did not name the current chat');
  assert.equal(await page.locator('#suggest').isEnabled(), true, 'Proponer mensaje was disabled for an open chat');

  await openPanel();
  assert(sessionLoads > 0 && proposalLoads > 0, 'opening the panel did not load session and proposals');
  assert.equal((await page.locator('#ai-panel-title').textContent()).trim(), 'Social Media Agent', 'the panel title is not the agent name');
  assert.equal((await page.locator('#ai-panel').innerText()).includes('Asistente privado'), false, 'the private assistant label is still visible');
  assert.equal((await page.locator('#ai-panel').innerText()).includes('SOLO PARA TI'), false, 'the panel kept its eyebrow label');
  assert.equal(await page.locator('#ai-panel input, #ai-panel select, #ai-panel button[role="switch"]').count(), 0, 'the panel shows configuration controls');
  assert.equal(await page.locator('#ai-allow-propose').count(), 0, 'the proposal permission checkbox is still mounted');
  assert.equal(await page.locator('.ai-bubble-in').first().innerText(), 'Respuesta previa', 'the agent reply did not render as an incoming bubble');
  assert.equal(await page.locator('.ai-bubble-out').first().innerText(), 'Consulta previa', 'the owner turn did not render as an outgoing bubble');

  await page.locator('.chat-item').nth(1).click();
  await page.getByText('Escribe para consultar sobre esta conversación.').waitFor();
  assert.equal(await page.locator('.ai-bubble').count(), 0, 'bubbles leaked between chats');

  reply = 'Le piden confirmar la reunión del jueves';
  heldRoute = 'chat';
  await page.locator('#ai-prompt').fill('Resume el chat');
  await page.locator('#ai-prompt').press('Enter');
  await page.locator('.ai-typing').waitFor({state: 'visible'});
  assert.equal(await page.locator('#ai-send').isDisabled(), true, 'the panel stayed enabled while the agent was answering');
  await heldRoute.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({sessionId: 'session-personal-two', text: reply})});
  heldRoute = null;
  await page.locator('.ai-bubble-in').filter({hasText: reply}).waitFor();
  assert.equal(await page.locator('#ai-prompt').inputValue(), '', 'the composer kept the sent text');
  assert.equal(await page.locator('.ai-typing').count(), 0, 'the typing receipt stayed after the answer');

  await page.locator('#ai-use-draft').click();
  assert.equal(await page.locator('#message').inputValue(), reply, 'the draft action did not fill the composer');
  assert.equal(await page.locator('#ai-panel').isVisible(), false, 'using the draft left the panel open');
  assert.equal(directSends, 0, 'a draft action sent a WhatsApp message');

  await page.locator('#message').fill('');
  await page.locator('#suggest').click();
  await page.locator('#suggest.is-busy').waitFor({state: 'attached'});
  assert.equal(await page.locator('#suggest').getAttribute('aria-busy'), 'true', 'Proponer mensaje did not report progress');
  await page.waitForFunction(() => document.querySelector('#suggest')?.disabled === false && document.querySelector('#suggest.is-busy') === null);
  assert.equal(draftTurns(), 1, 'Proponer mensaje did not ask the Hermes session once');
  assert.deepEqual(turns.at(-1), {key: 'personal:two', message: DRAFT_INSTRUCTION}, 'Proponer mensaje asked another conversation');
  assert.equal(await page.locator('#message').inputValue(), reply, 'the proposal was not written as a draft');
  assert.equal(directSends, 0, 'Proponer mensaje sent a WhatsApp message');
  assert.equal(await page.locator('#ai-panel').isVisible(), false, 'Proponer mensaje opened the panel');

  reply = '  "Voy para allí en 10 minutos."  ';
  await page.locator('#suggest').click();
  await page.waitForFunction(() => document.querySelector('#suggest.is-busy') === null);
  assert.equal(await page.locator('#message').inputValue(), `${reply.trim().replace(/^"|"$/g, '')}\n\n${''}`.trim() && `Le piden confirmar la reunión del jueves\n\nVoy para allí en 10 minutos.`, 'the proposal was not quoted-stripped or replaced the draft');

  reply = 'Reunión a las 9 confirmada';
  await page.locator('#message').fill('');
  await page.locator('#suggest').click();
  await page.waitForFunction(() => document.querySelector('#suggest.is-busy') === null);
  assert.equal(await page.locator('#message').inputValue(), 'Reunión a las 9 confirmada', 'an empty draft was not filled');

  await openPanel();
  await page.locator('.ai-bubble-out').filter({hasText: 'Propón un mensaje'}).first().waitFor();
  assert.equal(await page.locator('.ai-bubble-in').filter({hasText: 'Reunión a las 9 confirmada'}).count(), 1, 'the draft answer did not join the conversation');
  await page.locator('#ai-close').click();

  failNext = true;
  const draftBefore = await page.locator('#message').inputValue();
  await page.locator('#suggest').click();
  await page.getByText('Hermes no disponible').waitFor();
  assert.equal(await page.locator('#message').inputValue(), draftBefore, 'a failed proposal changed the draft');
  assert.equal(await page.locator('#suggest').isDisabled(), false, 'Proponer mensaje stayed disabled after failing');

  heldRoute = 'chat';
  await page.locator('#message').fill('Borrador de Dos');
  await page.locator('#suggest').click();
  await page.waitForFunction(() => document.querySelector('#suggest.is-busy') !== null);
  await page.locator('.chat-item').first().click();
  await heldRoute.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({sessionId: 'session-personal-two', text: 'Respuesta para Dos'})});
  heldRoute = null;
  await page.waitForTimeout(120);
  assert.equal(await page.locator('#message').inputValue(), '', 'a late proposal was written into another chat');
  await page.locator('.chat-item').nth(1).click();
  assert.equal(await page.locator('#message').inputValue(), 'Borrador de Dos', 'the draft of the other chat was lost');

  await openPanel();
  await page.locator('.ai-proposal').filter({hasText: 'Texto exacto para enviar'}).waitFor();
  await page.locator('.ai-proposal').filter({hasText: 'Texto exacto para enviar'}).getByRole('button', {name: 'Aprobar y enviar'}).click();
  await page.locator('.ai-proposal').filter({hasText: 'Texto exacto para enviar'}).waitFor({state: 'detached'});
  assert.deepEqual(decisions[0], {account: 'personal', chat: 'one', id: 'proposal-approve', action: 'approve'});
  await page.locator('.ai-proposal').filter({hasText: 'Texto que no se enviará'}).getByRole('button', {name: 'Descartar'}).click();
  assert.deepEqual(decisions[1], {account: 'personal', chat: 'one', id: 'proposal-reject', action: 'reject'});
  proposals.get('personal:one').push({id: 'proposal-uncertain', text: 'Texto con entrega incierta'});
  await page.locator('#ai-close').click();
  await openPanel();
  await page.locator('.ai-proposal').filter({hasText: 'Texto con entrega incierta'}).getByRole('button', {name: 'Aprobar y enviar'}).click();
  await page.getByText('Estado de entrega desconocido; no reintentar automáticamente').waitFor();
  await page.locator('.ai-proposal').filter({hasText: 'Texto con entrega incierta'}).waitFor({state: 'detached'});
  assert.equal(decisions.filter(decision => decision.id === 'proposal-uncertain').length, 1, 'an uncertain delivery was retried');

  await page.locator('#ai-close').click();
  await page.locator('#account').evaluate(select => { select.value = 'secondary'; select.dispatchEvent(new Event('change', {bubbles: true})); });
  await page.locator('.chat-item').first().click();
  await openPanel();
  await page.getByText('Escribe para consultar sobre esta conversación.').waitFor();
  assert.equal(await page.getByText('Respuesta previa').count(), 0, 'history leaked across accounts');
  assert.equal(await page.locator('.ai-proposal').count(), 0, 'proposals leaked into another account');
  await page.locator('#ai-close').click();

  await page.setViewportSize({width: 390, height: 844});
  await openPanel();
  await page.locator('#ai-prompt').waitFor({state: 'visible'});
  const panel = await page.locator('#ai-panel').boundingBox();
  assert(panel && panel.x >= 0 && panel.x + panel.width <= 391, 'the panel overflowed the mobile viewport');
  await page.locator('#ai-close').click();
  await page.setViewportSize({width: 1280, height: 800});

  sendingEnabled = false;
  await page.reload();
  await page.locator('.chat-item').first().click();
  assert.equal(await page.locator('#send').isDisabled(), true, 'sending stayed enabled without the server gate');
  assert.equal(await page.locator('#suggest').isEnabled(), true, 'Proponer mensaje needs the send gate to draft a message');

  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
