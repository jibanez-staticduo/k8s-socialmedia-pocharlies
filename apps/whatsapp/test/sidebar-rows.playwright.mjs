import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {startPublicFixture} from './browser-fixture.mjs';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright/index.mjs');
const artifacts = process.env.PLAYWRIGHT_ARTIFACT_DIR || '/tmp/sidebar-rows-qa';
await mkdir(artifacts, {recursive: true});
const server = await startPublicFixture();
const browser = await chromium.launch({headless: true, args: ['--no-sandbox'], ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {})});
const chats = [
  {id:'long', name:'Daniel Fernandez y familia', preview:'Un mensaje largo que debe aprovechar el ancho disponible', pinned:true, timestamp:new Date().toISOString()},
  {id:'indicators', name:'Equipo de trabajo con un nombre largo', preview:'Informe de hoy', pinned:true, favorite:true, muted:true, unread:123, timestamp:new Date().toISOString()},
  {id:'selected', name:'Grupo de baile', preview:'Asistencia clase', unread:true, timestamp:new Date().toISOString()},
];
try {
  for (const width of [1440, 1000, 390, 320]) {
    const context = await browser.newContext({viewport:{width, height:900}, hasTouch:width < 760});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', route => {
      const path = new URL(route.request().url()).pathname;
      if (route.request().headers().accept?.includes('text/event-stream')) return route.fulfill({contentType:'text/event-stream', body:': fixture\n\n'});
      const body = path === '/api/accounts' ? {accounts:[{id:'personal',label:'Personal'}],sendingEnabled:true}
        : path === '/api/chats' ? {chats}
          : path === '/api/messages' ? {messages:[]}
            : path === '/api/models' ? {models:[]}
              : {};
      return route.fulfill({contentType:'application/json', body:JSON.stringify(body)});
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(() => document.querySelectorAll('.chat-row').length === 3);
    await page.waitForFunction(() => document.querySelector('#chat-selection-toggle') && document.querySelector('.chat-pin'));
    await page.locator('[data-chat-id="selected"]').evaluate(el => el.setAttribute('aria-current','true'));
    for (const theme of ['dark', 'light']) {
      await page.evaluate(theme => document.body.dataset.theme = theme, theme);
      const measure = () => page.locator('.chat-row').evaluateAll(rows => rows.map(row => {
        const box = selector => {const r=row.querySelector(selector).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
        return {row:row.getBoundingClientRect().toJSON(),name:box('.chat-name'),time:box('.chat-time'),preview:box('.chat-preview'),metadata:box('.chat-metadata'),menu:box('.chat-row-menu')};
      }));
      for (const row of await measure()) {
        assert.equal(row.row.height,76,'virtual row height stays stable');
        assert(row.name.right <= row.time.left && row.time.right <= row.row.right);
        assert(row.row.right - row.time.right <= 18,'timestamp uses right edge');
        assert(row.preview.right <= row.metadata.left + 1 || row.metadata.width === 0);
        assert(row.name.width >= row.row.width - 160,`long names reclaim former quick-action space: ${JSON.stringify(row)}`);
      }
      assert.equal(await page.locator('.chat-quick').count(),0);
      const indicatorRow = page.locator('.chat-row').filter({has:page.locator('[data-chat-id="indicators"]')});
      const timeBefore = await indicatorRow.locator('.chat-time').boundingBox();
      if (width >= 760) await indicatorRow.hover();
      const menu = indicatorRow.getByRole('button',{name:'Opciones de Equipo de trabajo con un nombre largo'});
      await menu.focus();
      await page.waitForFunction(() => {const menu=document.querySelector('[aria-label="Opciones de Equipo de trabajo con un nombre largo"]');return menu && getComputedStyle(menu).opacity === '1';});
      const timeAfter = await indicatorRow.locator('.chat-time').boundingBox();
      assert.deepEqual(timeAfter,timeBefore,'hover/focus never shifts title or timestamp');
      const boxes = await measure();
      assert(boxes[1].metadata.right <= boxes[1].menu.left + 1,'menu does not cover unread or status indicators');
      await menu.click();
      assert(await page.getByRole('menuitem',{name:'Archivar chat',exact:true}).isVisible());
      assert(await page.getByRole('menuitem',{name:'Desfijar chat',exact:true}).isVisible());
      await page.keyboard.press('Escape');
      const toggle = page.locator('#chat-selection-toggle');
      assert.equal(await toggle.evaluate(el => getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({path:`${artifacts}/sidebar-${theme}-${width}.png`});
    }
    assert.deepEqual(errors,[]);
    await context.close();
  }
  console.log('PASS sidebar rows: full-width titles/time, metadata, menu actions, keyboard, touch and light/dark at 320–1440px');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
