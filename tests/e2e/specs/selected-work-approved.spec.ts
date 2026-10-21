import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const cards = ['needle','second-voice-ai','leu'];
const videos = ['needle','second-voice-ai','leu'];
test.beforeEach(async ({page}) => { await page.emulateMedia({reducedMotion:'no-preference'}); });
async function home(page: Page) { await page.goto('/#work'); await expect(page.locator('#work h2')).toHaveText('Work'); }
async function visibleVideo(page: Page, id: string) {
 const video=page.locator(`[data-selected-project="${id}"] video`);
 await video.scrollIntoViewIfNeeded();
 await expect(video).toBeInViewport();
 return video;
}
async function gallery(page: Page) { await home(page); await visibleVideo(page,'leu'); }
test('permanent static F24 and three independent projects expose honest links', async ({page})=>{
 await home(page);const f=page.locator('[data-f24-feature]');await expect(f).toBeVisible();await expect(f).toHaveCount(1);
 await expect(f.locator('img')).toHaveCount(2);
 await expect(f.locator('img').first()).toHaveAttribute('src','/projects/f24/hackathon-working.webp');
 await expect(f.locator('img').last()).toHaveAttribute('src','/projects/f24/hackathon-team.webp');
 for(const image of await f.locator('img').all())await expect.poll(()=>image.evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth>0)).toBe(true);
 await expect(f.locator('a')).toHaveCount(2);await expect(f.getByRole('link',{name:'Read the case study'})).toHaveAttribute('href','/work/f24');
 await expect(f.getByRole('link',{name:'F24 case study',exact:true})).toHaveAttribute('href','/work/f24');
 await expect(f.locator('video,button')).toHaveCount(0);
 expect(await page.locator('[data-selected-project]').evaluateAll(es=>es.map(e=>e.getAttribute('data-selected-project')))).toEqual(cards);
 for(const id of cards)await expect(page.locator(`[data-selected-project="${id}"] a[href="/work/${id}"]`).first()).toBeVisible();
 await expect(page.locator('[data-selected-project="flow"]')).toHaveCount(0);
 const leu=page.locator('[data-selected-project="leu"]').getByRole('link',{name:'Open Leu live app',exact:true});
 await expect(leu).toHaveAttribute('href','https://leu.miguelalmeida.xyz/');
 await expect(leu).toHaveAttribute('target','_blank');
 await expect(page.locator('[data-selected-project="leu"] video')).toHaveCSS('object-fit','contain');
 await expect(page.locator('[data-selected-project="leu"] img')).toHaveCSS('object-fit','contain');
 await expect(page.locator('[data-selected-project="needle"] img')).toHaveAttribute('src','/projects/needle/needle-loop-poster.png');
 await expect(page.locator('[data-selected-project="second-voice-ai"] img')).toHaveAttribute('src','/projects/ghostwriter/second-voice-poster-1500.jpg');
 const external=page.locator('#work a[target="_blank"]');for(const link of await external.all())await expect(link).toHaveAttribute('rel',/noopener/);
});
for(const id of videos)test(`${id}: actual silent autoplay advances and crosses a loop boundary`,async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(/\.(mp4|webm)(\?|$)/.test(r.url())&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await home(page);const v=page.locator(`[data-selected-project="${id}"] video`);await expect(v).toHaveCount(1,{timeout:1000});await v.scrollIntoViewIfNeeded();
 await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>({muted:x.muted,defaultMuted:x.defaultMuted,loop:x.loop,inline:x.hasAttribute('playsinline') && (!('playsInline' in x) || x.playsInline),ready:x.readyState>=2,width:x.videoWidth>0,playing:!x.paused})),{timeout:20000}).toEqual({muted:true,defaultMuted:true,loop:true,inline:true,ready:true,width:true,playing:true});
 if(id==='needle')await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>new URL(x.currentSrc).pathname)).toBe('/projects/needle/needle-loop-web.mp4');
 if(id==='second-voice-ai')await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>new URL(x.currentSrc).pathname)).toBe('/projects/ghostwriter/second-voice-loop.mp4');
 await expect(v).toHaveCSS('opacity','1');
 await expect(v.locator('..').locator('img')).toHaveCSS('visibility','hidden');
 let t=await v.evaluate((x:HTMLVideoElement)=>x.currentTime);
 for(let i=0;i<3;i++){await page.waitForTimeout(250);const next=await v.evaluate((x:HTMLVideoElement)=>x.currentTime);expect(next).toBeGreaterThan(t);t=next;}
 // Seek to the tail; the browser must actually play across the loop boundary.
 await v.evaluate((x:HTMLVideoElement)=>{x.currentTime=x.duration-0.45;});
 await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>x.currentTime<1.5&&!x.paused),{timeout:5000}).toBe(true);
 await testInfo.attach('actual-media', {body:JSON.stringify(await v.evaluate((x:HTMLVideoElement)=>({source:x.currentSrc,width:x.videoWidth,height:x.videoHeight,ready:x.readyState,time:x.currentTime,muted:x.muted,loop:x.loop,paused:x.paused}))),contentType:'application/json'});expect(errors).toEqual([]);
});
test('visible films autoplay and pause when they leave the viewport',async({page})=>{
 await home(page);
 await expect(page.getByRole('button',{name:'Pause project videos'})).toBeVisible();
 for(const id of videos) {
  const video=await visibleVideo(page,id);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2&&v.videoWidth>0),{timeout:30000}).toBe(true);
  await page.locator('#work h2').scrollIntoViewIfNeeded();
  await expect(video).not.toBeInViewport();
  await expect(video).toHaveJSProperty('paused',true);
 }
 const video=await visibleVideo(page,'needle');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:20000}).toBe(true);
});
for(const preference of ['reduced motion','Save-Data'])test(`${preference} keeps posters until explicit Play, then only visible loops play`,async({page})=>{
 if(preference==='reduced motion')await page.emulateMedia({reducedMotion:'reduce'});
 else await page.addInitScript(()=>{
  const connection=Object.assign(new EventTarget(),{saveData:true});
  Object.defineProperty(navigator,'connection',{value:connection,configurable:true});
 });
 const requests:string[]=[];
 page.on('request',request=>{if(/\.(mp4|webm)(\?|$)/.test(request.url()))requests.push(request.url());});
 await home(page);
 await expect(page.getByRole('button',{name:'Play project videos'})).toBeVisible();
 for(const id of videos) {
  const video=await visibleVideo(page,id);
  await expect(video).toHaveJSProperty('paused',true);
  await expect(video).toHaveJSProperty('currentSrc','');
  await expect(video.locator('source[src]')).toHaveCount(0);
  await expect(video.locator('..').locator('img')).toBeVisible();
 }
 expect(requests).toEqual([]);
 // Keyboard activation must work as well as pointer activation.
 await page.getByRole('button',{name:'Play project videos'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'Pause project videos'})).toBeVisible();
 for(const id of videos) {
  const video=await visibleVideo(page,id);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2),{timeout:25000}).toBe(true);
  await page.locator('#work h2').scrollIntoViewIfNeeded();
  await expect(video).not.toBeInViewport();
  await expect(video).toHaveJSProperty('paused',true);
 }
 await visibleVideo(page,'needle');
 await page.getByRole('button',{name:'Pause project videos'}).click();
 for(const id of videos) await expect(page.locator(`[data-selected-project="${id}"] video`)).toHaveJSProperty('paused',true);
 const paused=await visibleVideo(page,'leu');
 await expect(paused).toHaveJSProperty('paused',true);
 await page.getByRole('button',{name:'Play project videos'}).click();
 await visibleVideo(page,'leu');
 await expect.poll(()=>paused.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
});
test('blocked playback and failed media retain real posters and destinations',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'));};});
 await gallery(page);const media=page.locator('[data-selected-project="leu"] [data-preview]');await expect(media).toHaveAttribute('data-preview-status','blocked');await expect(media.locator('img')).toBeVisible();await expect(page.locator('[data-selected-project="leu"] .collection-retry')).toBeVisible();await expect(page.locator('[data-selected-project="leu"] a[href="/work/leu"]').first()).toBeVisible();expect(errors).toEqual([]);
});
test('missing media remains a usable poster card',async({page})=>{
 await page.route(/\.(mp4|webm)(\?|$)/,r=>r.fulfill({status:404,body:'missing'}));await gallery(page);
 const frame=page.locator('[data-selected-project="leu"] [data-preview]');await expect(frame).toHaveAttribute('data-preview-status','unavailable');await expect(frame.locator('img')).toBeVisible();
});
test('no JavaScript retains F24 privacy, all project posters and links',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();await page.goto('/#work');
 await expect(page.locator('[data-f24-feature] a')).toHaveCount(2);await expect(page.locator('[data-selected-project]')).toHaveCount(3);await expect(page.locator('#work video[src]')).toHaveCount(0);await expect(page.locator('#work img')).toHaveCount(5);for(const img of await page.locator('#work img').all()){await img.scrollIntoViewIfNeeded();await expect(img).toBeVisible();await expect.poll(()=>img.evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth>0)).toBe(true);}await context.close();
});
for(const width of [320,375,390,768,1024,1280,1440,1920])test(`section fits at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await home(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const boxes=await page.locator('[data-selected-project]').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width})));
 expect(boxes).toHaveLength(3);
 expect(new Set(boxes.map(box=>Math.round(box.x))).size).toBe(width>1100?3:width>=640?2:1);
 for(const id of cards) {
  const chapter=page.locator(`[data-selected-project="${id}"]`);
  const copy=await chapter.locator('.collection-info').boundingBox();
  const media=await chapter.locator('.collection-media > a').boundingBox();
  expect(copy).not.toBeNull();expect(media).not.toBeNull();
  expect(copy!.y).toBeGreaterThanOrEqual(media!.y+media!.height-1);
  expect(media!.x).toBeGreaterThanOrEqual(0);expect(media!.x+media!.width).toBeLessThanOrEqual(width+1);
  await expect(chapter.locator('.collection-evidence')).toBeVisible();
  await expect(chapter.locator('.collection-detail')).toBeVisible();
  await expect(chapter.locator('[data-preview]')).toHaveCSS('border-top-width','0px');
  await expect(chapter.locator('[data-preview] img')).toHaveCSS('object-fit','contain');
  await expect(chapter.locator('[data-preview] video')).toHaveCSS('object-fit','contain');
 }
 for(const link of await page.locator('#work a').all()){const b=await link.boundingBox();expect(b!.width).toBeGreaterThan(20);expect(b!.height).toBeGreaterThanOrEqual(35);}
});
test('section passes axe and has visible keyboard focus',async({page})=>{
 await gallery(page);expect((await new AxeBuilder({page}).include('#work').analyze()).violations).toEqual([]);
 const a=page.getByRole('link',{name:'F24 case study',exact:true});await a.focus();expect(await a.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
});

test('offscreen videos attach no sources until their first eligible viewport entry',async({page})=>{
 await page.setViewportSize({width:390,height:844});await home(page);
 const first=await visibleVideo(page,'needle');
 await expect.poll(()=>first.evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2),{timeout:20000}).toBe(true);
 const offscreen=page.locator('[data-selected-project="leu"] video');
 await expect(offscreen).not.toBeInViewport();
 await expect(offscreen).toHaveJSProperty('currentSrc','');
 await expect(offscreen.locator('source[src]')).toHaveCount(0);
 await expect(offscreen).toHaveJSProperty('paused',true);
 await visibleVideo(page,'leu');
 await expect.poll(()=>offscreen.evaluate((v:HTMLVideoElement)=>Boolean(v.currentSrc)&&!v.paused&&v.readyState>=2),{timeout:20000}).toBe(true);
});
test('background tabs pause video and resume on return',async({page})=>{
 await home(page);
 const video=await visibleVideo(page,'leu');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
 const visibility=async(hidden:boolean)=>page.evaluate(value=>{Object.defineProperty(document,'hidden',{configurable:true,value});document.dispatchEvent(new Event('visibilitychange'));},hidden);
 await visibility(true);await expect(video).toHaveJSProperty('paused',true);
 await visibility(false);await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
});
test('Leu falls back from its failed preferred source to real MP4 playback',async({page})=>{
 await page.route(/\.webm(\?|$)/,r=>r.fulfill({status:404,body:'missing preferred source'}));await gallery(page);
 const v=await visibleVideo(page,'leu');await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>!x.paused&&x.readyState>=2&&x.videoWidth>0&&x.currentSrc.endsWith('.mp4')),{timeout:20000}).toBe(true);await expect(v).toHaveCSS('opacity','1');const before=await v.evaluate((x:HTMLVideoElement)=>x.currentTime);await page.waitForTimeout(250);expect(await v.evaluate((x:HTMLVideoElement)=>x.currentTime)).toBeGreaterThan(before);
});
test('slow responses preserve posters and links until real playback begins',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});await page.route(/\.(mp4|webm)(\?|$)/,async r=>{await gate;await r.continue();});
 await gallery(page);const frame=page.locator('[data-selected-project="leu"] [data-preview]');await expect(frame.locator('img')).toBeVisible();await expect(frame.locator('video')).toHaveCSS('opacity','0');await expect(page.locator('[data-selected-project="leu"] a[href="/work/leu"]').first()).toBeVisible();release();
 await expect.poll(()=>frame.locator('video').evaluate((x:HTMLVideoElement)=>!x.paused&&x.readyState>=2),{timeout:20000}).toBe(true);await expect(frame.locator('video')).toHaveCSS('opacity','1');
});
test('unmounting an active loop leaves no client errors',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await home(page);
 const video=await visibleVideo(page,'leu');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
 await page.locator('[data-selected-project="leu"] h4 a').click();
 await expect(page).toHaveURL(/\/work\/leu$/);
 await expect(page.locator('h1')).toBeVisible();
 expect(errors).toEqual([]);
});
test('each chapter film plays uncropped on desktop and mobile',async({page})=>{
 await gallery(page);
 for(const width of [1440,390]) {
  await page.setViewportSize({width,height:844});
  for(const id of videos) {
   const v=page.locator(`[data-selected-project="${id}"] video`);
   await v.scrollIntoViewIfNeeded();
   await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>!x.paused&&x.readyState>=2),{timeout:20000}).toBe(true);
   await expect(v).toHaveCSS('opacity','1');
   await expect(v).toHaveCSS('object-fit','contain');
   const ratio=width<640?3/2:4/3;
   const frame=await v.locator('..').locator('..').boundingBox();
   expect(frame).not.toBeNull();
   expect(Math.abs(frame!.width/frame!.height-ratio)).toBeLessThan(0.025);
  }
 }
});

test('section remains usable at 200 percent content zoom',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await home(page);await page.evaluate(()=>{document.documentElement.style.zoom='2';});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 for(const link of await page.locator('#work a').all()){await link.scrollIntoViewIfNeeded();await expect(link).toBeVisible();const box=await link.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(1441);}
});

test('keyboard activation reaches every case study independently',async({page})=>{
 for(const id of ['f24',...cards]){await home(page);const a=id==='f24'?page.getByRole('link',{name:'F24 case study',exact:true}):page.locator(`[data-selected-project="${id}"] h4 a`);await a.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(new RegExp(`/work/${id==='second-voice-ai'?'second-voice':id}$`));await expect(page.locator('h1')).toBeVisible();expect(page.context().pages()).toHaveLength(1);}
});
test('touch activates media links and separate public actions without hijacking',async({browser,baseURL})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,baseURL});const page=await context.newPage();
 for(const id of cards){await page.goto('/#work');const a=page.locator(`[data-selected-project="${id}"] .collection-media > a`);await a.tap();await expect(page).toHaveURL(new RegExp(`/work/${id==='second-voice-ai'?'second-voice':id}$`));}
 await page.goto('/#work');await context.route('https://**/*',r=>r.fulfill({contentType:'text/html',body:'<title>Verified destination navigation</title>'}));
 for(const link of await page.locator('#work a[target="_blank"]').all()){const href=await link.getAttribute('href');const original=page.url();const opened=page.waitForEvent('popup');await link.tap();const popup=await opened;await expect(popup).toHaveURL(href!);expect(page.url()).toBe(original);await popup.close();}
 await context.close();
});
