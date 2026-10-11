import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createNovedadesTab, startPublicFixture, viewportMetrics } from './browser-fixture.mjs';

const html = `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css">
<body class="chat-open"><div id="messages"><div class="message" data-message-id="42">Sent</div><div class="message" data-message-id="43">Incoming</div><div class="message" data-message-id="local-1">Pending</div></div>
<script type="module">
import {installFeatureUI} from '/features-ui.mjs';
window.requests=[]; window.xss=0;
window.state={account:'alpha',chat:'group',selectedChat:{id:'group',isGroup:true}};
window.ui=installFeatureUI({state,documentRef:document,windowRef:window,
 query:(path,extra)=>path+'?'+new URLSearchParams({account:state.account,chat:state.chat,...extra}),
 api:async url=>url.startsWith('/api/messages/info')?new Promise(resolve=>requests.push({url,resolve})):({})});
ui.messagesChanged([{id:'42',fromMe:true,text:'<img src=x onerror="xss++">'},{id:'43',fromMe:false,text:'Incoming'},{id:'local-1',fromMe:true,text:'Pending'}]);
window.answer=(index,extra={})=>requests[index].resolve({account:'alpha',chatId:'group',messageId:'42',fromMe:true,recipientCount:null,completeRecipients:false,
 receipts:[{participantId:'a',name:'<img src=x onerror="xss++">',readAt:'2026-10-11T10:00:00Z',deliveredAt:'2026-10-11T09:00:00Z',playedAt:null}],...extra});
window.ready=true;
</script>`;
const server = await startPublicFixture({ html });
const errors = [];
const { browser, tab } = await createNovedadesTab(errors);
try {
  await tab.goto(`http://127.0.0.1:${server.address().port}`);
  await tab.waitForFunction(() => window.ready);
  const open = async () => {
    await tab.locator('[data-message-id="42"] .feature-message-action').click();
    await tab.getByRole('button', { name: 'Información del mensaje', exact: true }).click();
  };
  for (const id of ['43', 'local-1']) {
    await tab.locator(`[data-message-id="${id}"] .feature-message-action`).click();
    assert.equal(await tab.getByRole('button', { name: 'Información del mensaje', exact: true }).count(), 0);
    await tab.keyboard.press('Escape');
  }
  await open();
  assert.match(await tab.locator('.feature-message-info').textContent(), /Cargando/);
  await tab.evaluate(() => answer(0));
  await tab.getByRole('button', { name: 'Actualizar', exact: true }).waitFor();
  assert.equal(await tab.evaluate(() => xss), 0);
  assert.equal(await tab.locator('.feature-message-info img').count(), 0);
  assert.equal(await tab.locator('.feature-message-info svg').count(), 0);
  assert.match(await tab.locator('.feature-message-info').textContent(), /total desconocido/);
  for (const width of [1280, 390]) {
    await tab.setViewportSize({ width, height: 800 });
    const metrics = await viewportMetrics(tab);
    assert.ok(metrics.documentWidth <= metrics.viewportWidth, 'Panel fits the viewport');
    assert.ok(await tab.getByRole('button', { name: 'Actualizar', exact: true }).isVisible());
    if (process.env.UI_OUTPUT_DIR) {
      await mkdir(process.env.UI_OUTPUT_DIR, { recursive: true });
      await tab.screenshot({ path: join(process.env.UI_OUTPUT_DIR, `message-info-${width}.png`) });
    }
  }
  await tab.keyboard.press('Escape');
  assert.equal(await tab.locator('.feature-message-info').count(), 0);
  await tab.setViewportSize({ width: 1280, height: 800 });
  await open();
  await tab.mouse.click(20, 400);
  assert.equal(await tab.locator('.feature-message-info').count(), 0, 'Outside click closes panel');
  await tab.evaluate(() => answer(1));
  assert.equal(await tab.locator('.feature-message-info').count(), 0, 'Closed panel stays closed after response');
  await open();
  await tab.evaluate(() => { state.account='beta'; ui.accountChanged('beta'); });
  await tab.evaluate(() => answer(2));
  assert.equal(await tab.locator('.feature-message-info').count(), 0);
  assert.equal(await tab.evaluate(() => requests[0].url), '/api/messages/info?account=alpha&chat=group&messageId=42');
  assert.deepEqual(errors, []);
  console.log('Message info browser: action eligibility, escaping, scoped request, stale response, Escape and desktop/mobile pass');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
