import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.MOTION_URL || 'http://127.0.0.1:4398';
const out = 'artifacts/motion/acceptance';
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const results=[];
const routes=['/','/work/needle','/work/f24','/work/second-voice','/work/flow','/work/leu','/story','/cv','/cv/pdf'];
const pause=page=>page.waitForTimeout(800);
async function settled(page){await page.evaluate(()=>document.fonts.ready);await pause(page);}
async function geometry(page){return page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,triggers:Number(document.documentElement.dataset.motionTriggers||0),owners:[...document.querySelectorAll('[data-motion-owner]')].map(n=>n.dataset.motionOwner),ghosts:document.querySelectorAll('[data-artwork-flight]').length}));}
try {
for(const viewport of [{width:1440,height:900},{width:1280,height:800},{width:768,height:1024},{width:390,height:844},{width:375,height:812}]){
 const context=await browser.newContext({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<1024,recordVideo:{dir:`${out}/video`,size:viewport}});
 await context.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const route of routes){
  await page.goto(base+route,{waitUntil:'networkidle'});await settled(page);
  const g=await geometry(page);assert.equal(g.overflow,false,`${viewport.width} ${route} overflow`);
  if(route.startsWith('/work/'))assert.ok(g.owners.includes('chapter-titles'),`${route}: chapter owner missing`);
  if(route==='/')assert.ok(g.owners.includes('selected-work'),'work owner missing');
  const headings=page.locator('.chapter > .head h2');
  for(let i=0;i<await headings.count();i++){
   await headings.nth(i).scrollIntoViewIfNeeded();await pause(page);
   const h=await headings.nth(i).evaluate(n=>({label:n.getAttribute('aria-label'),text:n.textContent,box:n.getBoundingClientRect().toJSON(),clipped:[...n.querySelectorAll('div[style*="transform"]')].some(e=>Math.abs(new DOMMatrix(getComputedStyle(e).transform).m42)>1)}));
   assert.equal(h.clipped,false,`${route} hidden heading ${h.text}`);assert.ok(h.box.height>0);
   if(h.label)assert.equal(h.label,h.text);
  }
  await page.screenshot({path:`${out}/${viewport.width}-${route.replaceAll('/','_')}.jpg`,quality:75});
  assert.equal((await geometry(page)).overflow,false);assert.deepEqual(errors,[],`${route} console errors`);
  results.push({viewport,route,...g,chapters:await headings.count()});
 }
 await page.goto(base+'/work/needle');await settled(page);
 await page.locator('a[href="#engineering"]').filter({visible:true}).first().focus();await page.keyboard.press('Enter');await pause(page);
 assert.ok(new URL(page.url()).hash==='#engineering');
 await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement?.tagName),'BODY');
 await page.setViewportSize({width:viewport.height,height:viewport.width});await pause(page);
 assert.equal((await geometry(page)).overflow,false);await page.setViewportSize(viewport);await pause(page);
 await page.mouse.wheel(0,2600);await page.mouse.wheel(0,-700);await pause(page);
 for(let i=0;i<4;i++){await page.mouse.wheel(0,100);await page.waitForTimeout(100);}
 await page.reload();await settled(page);assert.equal((await geometry(page)).overflow,false);
 await page.emulateMedia({reducedMotion:'reduce'});await pause(page);
 assert.equal((await geometry(page)).triggers,0);assert.equal((await geometry(page)).owners.length,0);
 assert.equal(await page.locator('.chapter > .head h2 div').count(),0);
 await page.emulateMedia({reducedMotion:'no-preference'});await settled(page);
 assert.ok((await geometry(page)).owners.includes('chapter-titles'));
 await context.close();
}
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:`${out}/video`,size:{width:1440,height:900}}});await context.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));
const page=await context.newPage();await page.goto(base+'/cv');await settled(page);
const cdp=await context.newCDPSession(page);await cdp.send('HeapProfiler.collectGarbage');const heapBefore=await cdp.send('Runtime.getHeapUsage');
const counts=[];
for(let i=0;i<5;i++){
 await page.locator('h3 a[href="/work/needle"]').click();await page.waitForURL('**/work/needle');await settled(page);
 counts.push((await geometry(page)).triggers);
 await page.goBack();await page.waitForURL('**/cv');await settled(page);
 assert.equal((await geometry(page)).triggers,0,'orphaned triggers on CV');assert.equal((await geometry(page)).ghosts,0);
 await page.goForward();await page.waitForURL('**/work/needle');await settled(page);
 await page.goBack();await page.waitForURL('**/cv');await settled(page);
}
assert.ok(Math.max(...counts)-Math.min(...counts)<=1,`trigger growth ${counts}`);
await cdp.send('HeapProfiler.collectGarbage');const heapAfter=await cdp.send('Runtime.getHeapUsage');
results.push({lifecycle:{counts,heapBefore,heapAfter}});
await page.goto(base+'/work/needle');await settled(page);await page.locator('.artwork-card').nth(1).scrollIntoViewIfNeeded();await pause(page);
await page.locator('.artwork-card').nth(1).click();await pause(page);assert.equal(await page.locator('.artwork-card').nth(1).getAttribute('aria-pressed'),'true');
await page.locator('.artwork-card').nth(2).click();await page.locator('.artwork-card').nth(3).click();await pause(page);
assert.equal((await geometry(page)).ghosts,0);assert.notEqual(await page.locator('.inspector-image img').evaluate(n=>getComputedStyle(n).opacity),'0');
await page.goto(base+'/');await settled(page);const preview=page.locator('[data-selected-project] [data-preview]').first();await preview.scrollIntoViewIfNeeded();await pause(page);
const box=await preview.boundingBox();await preview.hover();await page.mouse.move(box.x+box.width*.8,box.y+box.height*.5);await pause(page);
const afterBox=await preview.boundingBox();assert.ok(Math.abs(afterBox.x-box.x)<1&&Math.abs(afterBox.width-box.width)<1,'moving hit target');
await page.screenshot({path:`${out}/desktop-work-hover.jpg`,quality:85});
await page.emulateMedia({reducedMotion:'reduce'});await pause(page);assert.equal((await geometry(page)).triggers,0);
await context.close();
const reduced=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
await reduced.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));const rp=await reduced.newPage();
for(const route of routes){await rp.goto(base+route,{waitUntil:'networkidle'});await settled(rp);assert.equal((await geometry(rp)).triggers,0);assert.equal((await geometry(rp)).overflow,false);assert.ok(await rp.locator('h1').count());}
await reduced.close();
await writeFile(`${out}/results.json`,JSON.stringify({status:'PASS',results},null,2));
console.log(`PASS: ${results.length} viewport/route/lifecycle records plus reduced-motion coverage`);
} catch(error){await writeFile(`${out}/failure.json`,JSON.stringify({error:String(error),stack:error.stack,results},null,2));throw error;}
finally{await browser.close();}
