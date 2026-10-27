import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {createServer} from 'node:http';
import {servePublicAsset} from './browser-fixture.mjs';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || '/app/node_modules/playwright/index.mjs');
const artifacts = process.env.PLAYWRIGHT_ARTIFACT_DIR || '/home/staticduo/tmp/document-card-qa';
await mkdir(artifacts, {recursive:true});
const html='<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/features-parity.css"><main id="messages" class="messages"></main>';
const server = createServer((req,res)=>{
  if(req.url.startsWith('/api/media/')) {res.writeHead(200,{'content-type':'application/pdf','content-disposition':'attachment'});res.end('%PDF-1.4\nfixture');}
  else void servePublicAsset(req,res,{html});
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const name = `Informe_de_prueba_${'nombre_largo_'.repeat(12)}.pdf`;
try {
  for (const width of [1440,390,320]) for (const theme of ['dark','light']) {
    const page = await browser.newPage({viewport:{width,height:900}});
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(async ({name,theme}) => {
      document.body.dataset.theme=theme;
      const {renderMessage,createAttachmentElement,reconcileMessageList}=await import('/message-render.mjs');
      const host=document.querySelector('#messages');
      const policy={enabled:()=>false,autoMaxBytes:32*1024*1024};
      const fixtureMessages=[];
      for(const fromMe of [false,true]) for(const pending of [false,true]) {
        const item={id:`${fromMe}-${pending}`,fromMe,type:'DOCUMENT',text:'Documento de prueba',timestamp:'2026-10-27T07:11:00Z',isDeleted:fromMe,deletedAt:'2026-10-27T08:00:00Z',attachments:[{name,size:183000,mimeType:'application/pdf',...(pending?{pending:true}:{url:'/api/media/document?account=fixture'})}]};
        fixtureMessages.push(item);
      }
      for(let pass=0;pass<3;pass++)reconcileMessageList(host,fixtureMessages,{mediaPolicy:policy});
      host.append(renderMessage({id:'quoted',fromMe:true,text:'Si',timestamp:'2026-10-27T07:11:00Z',replyToMessageId:'source',replyPreview:{available:true,type:'TEXT',senderName:'Javi',text:'Texto citado largo que debe mantenerse dentro de la burbuja sin deformarla.'}},{mediaPolicy:policy}));
      const media=document.createElement('article');media.className='message';media.id='retry-fixture';
      const failingPolicy={...policy,loadBytes:()=>new Promise((resolve,reject)=>{window.failMedia=()=>reject(new Error('Fixture unavailable'));})};
      media.append(createAttachmentElement({name:'Foto de prueba.png',mimeType:'image/png',size:183000,url:'/api/media/image?account=fixture'},{mediaPolicy:failingPolicy}));host.append(media);
    },{name,theme});
    const layout=await page.locator('.attachment-document').evaluateAll(cards=>cards.map(card=>{
      const bounds=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height};};
      const details=card.querySelector('.document-details');
      const size=card.querySelector('.document-size');
      return {card:bounds(card),details:bounds(details),size:bounds(size),icon:bounds(card.querySelector('.document-icon')),name:bounds(card.querySelector('.document-name')),action:card.querySelector('a')?bounds(card.querySelector('a')):null};
    }));
    for(const row of layout){
      assert(row.card.left>=0&&row.card.right<=width,JSON.stringify(row));
      assert(row.name.width>=100,`name must retain useful width: ${JSON.stringify(row)}`);
      assert(row.size.height<25,'file size must remain on one line');
      assert.equal(row.icon.width,34);
      if(row.action){assert.equal(row.action.width,40);assert(row.details.right<=row.action.left);}
    }
    for(const bubble of await page.locator('.message-document').all()) {
      const dimensions=await bubble.evaluate(el=>{
        const card=el.querySelector('.attachment-document').getBoundingClientRect();
        const box=el.getBoundingClientRect();const meta=el.querySelector('.message-meta').getBoundingClientRect();
        const marker=el.querySelector('.message-deleted');const date=el.querySelector('.message-deleted-time');
        return {width:box.width,cardWidth:card.width,metaGap:box.right-meta.right,marker:marker?.getBoundingClientRect().toJSON(),date:date?.getBoundingClientRect().toJSON()};
      });
      assert(dimensions.width<=380,'document bubble must not expand to generic 530px limit');
      assert(dimensions.width-dimensions.cardWidth<=24,'document card fills bubble instead of floating in blank space');
      assert(dimensions.metaGap<=14,'sent time stays at the bubble edge');
      if(dimensions.marker) assert(dimensions.marker.height<=34,'deletion metadata stays compact');
    }
    assert.equal(await page.locator('.message-document').count(),4);
    const load=page.locator('#retry-fixture .attachment-load');
    await load.click();
    assert.equal(await load.textContent(),'Descargando…');
    assert(Number.parseFloat(await load.evaluate(el=>getComputedStyle(el).fontSize))>=11);
    await page.evaluate(()=>window.failMedia());
    await page.waitForFunction(()=>document.querySelector('#retry-fixture .attachment-load').textContent==='Reintentar');
    assert(Number.parseFloat(await load.evaluate(el=>getComputedStyle(el).fontSize))>=11);
    const link=page.getByRole('link',{name:`Descargar ${name}`,exact:true}).first();
    assert.equal(await link.getAttribute('download'),name);
    const downloadPromise=page.waitForEvent('download');
    await link.click();
    const download=await downloadPromise;
    assert.equal(download.suggestedFilename(),name);
    assert.equal(await download.failure(),null);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:`${artifacts}/documents-${theme}-${width}.png`});
    await page.close();
  }
  console.log('PASS document cards: long names, size, deleted/pending/inbound/outbound, download and light/dark 320-1440px');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
