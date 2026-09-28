import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright/index.mjs');
const root = fileURLToPath(new URL('../public/', import.meta.url));
const fixture = `<!doctype html><link rel="stylesheet" href="/styles.css"><button id="opener">Opciones</button><script type="module">
import {installFeatureUI} from '/features-ui.mjs';
localStorage.setItem('socialmedia-wa-features:alpha', JSON.stringify({lists:[{id:'work',name:'Trabajo',chatIds:[]}]}));
window.calls=[]; window.errors=[]; window.fail=false;
window.target={id:'target',name:'Ana Fixture',pinned:true,unread:0};
window.ui=installFeatureUI({state:{account:'alpha',chat:'selected'},api:async(path,body)=>{calls.push({path,body});if(window.fail)throw Error('Fallo de prueba');return{};},query:p=>p,getChats:()=>[target],showError:e=>errors.push(e.message)});
document.querySelector('#opener').onclick=()=>ui.openSidebarChatMenu(target,document.querySelector('#opener'));
</script>`;
const server=createServer(async(req,res)=>{try {res.setHeader('Content-Type',req.url.endsWith('.css')?'text/css':req.url==='/'?'text/html':'text/javascript');res.end(req.url==='/'?fixture:await readFile(root+req.url.slice(1)));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox'],...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
try{
const page=await browser.newPage({viewport:{width:1000,height:800}});
await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>window.ui);
const open=()=>page.locator('#opener').click();
await open(); assert.equal(await page.evaluate(()=>calls.filter(call => call.body !== undefined).length),0);
await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowRight');
assert.equal(await page.locator(':focus').textContent(),'8 horas');
await page.keyboard.press('Escape');assert.match(await page.locator(':focus').textContent(),/Silenciar/);
await page.keyboard.press('ArrowRight');await page.getByRole('menuitem',{name:'1 semana',exact:true}).click();
assert.deepEqual(await page.evaluate(()=>calls.at(-1).body),{account:'alpha',chat:'target',action:'mute',durationMs:604800000});
await open();await page.getByRole('menuitem',{name:'Desfijar chat',exact:true}).click();
assert.equal(await page.evaluate(()=>calls.at(-1).body.action),'unpin');
await open();await page.getByRole('menuitem',{name:'Añadir a lista ›',exact:true}).click();await page.getByRole('menuitem',{name:'Trabajo',exact:true}).click();
assert.equal(await page.evaluate(()=>calls.at(-1).path),'/api/lists');assert.equal(await page.evaluate(()=>calls.at(-1).body.chat),'target');
await page.evaluate(()=>window.fail=true);await open();await page.getByRole('menuitem',{name:'Archivar chat',exact:true}).click();
assert.equal(await page.evaluate(()=>target.archived),undefined);assert.deepEqual(await page.evaluate(()=>errors),['Fallo de prueba']);
await open();await page.getByRole('menu').evaluate(element=>Promise.all(element.getAnimations().map(animation=>animation.finished)));await page.screenshot({path:'/tmp/sidebar-chat-menu.png'});await page.keyboard.press('Escape');assert.equal(await page.locator(':focus').getAttribute('id'),'opener');
await page.setViewportSize({width:375,height:667});await open();const bounds=await page.getByRole('menu').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=375);
console.log('PASS sidebar menu: scoped actions, keyboard submenus, lists, errors, focus and mobile');
}finally{await browser.close();server.close();}
