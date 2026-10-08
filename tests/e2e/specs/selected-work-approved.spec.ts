import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const cards = ['needle','second-voice-ai','leu','flow'];
const videos = ['needle','second-voice-ai','flow','leu'];
async function home(page: Page) { await page.goto('/#work'); await expect(page.locator('#work h2')).toHaveText('Selected Work'); }
async function gallery(page: Page) { await home(page); await page.locator('[data-selected-project="flow"]').scrollIntoViewIfNeeded(); }
test('permanent static F24 and four independent projects expose honest links', async ({page})=>{
 await home(page);const f=page.locator('[data-f24-feature]');await expect(f).toBeVisible();await expect(f).toHaveCount(1);
 await expect(f.locator('img')).toHaveCount(2);
 await expect(f.locator('img').first()).toHaveAttribute('src','/projects/f24/hackathon-working.webp');
 await expect(f.locator('img').last()).toHaveAttribute('src','/projects/f24/hackathon-team.webp');
 for(const image of await f.locator('img').all())await expect.poll(()=>image.evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth>0)).toBe(true);
 await expect(f.locator('a')).toHaveCount(2);await expect(f.getByRole('link',{name:'View case study'})).toHaveAttribute('href','/work/f24');
 await expect(f.getByRole('link',{name:'F24 case study',exact:true})).toHaveAttribute('href','/work/f24');
 await expect(f.locator('video,button')).toHaveCount(0);
 expect(await page.locator('[data-selected-project]').evaluateAll(es=>es.map(e=>e.getAttribute('data-selected-project')))).toEqual(cards);
 for(const id of cards)await expect(page.locator(`[data-selected-project="${id}"] a[href="/work/${id}"]`).first()).toBeVisible();
 await expect(page.locator('[data-selected-project="flow"]').getByRole('link',{name:'Live app',exact:true})).toHaveCount(0);
 const leu=page.locator('[data-selected-project="leu"]').getByRole('link',{name:'Live app',exact:true});
 await expect(leu).toHaveAttribute('href','https://leu-desktop.vercel.app/');
 await expect(leu).toHaveAttribute('target','_blank');
 await expect(page.locator('[data-selected-project="flow"] video')).toHaveCSS('object-fit','contain');
 await expect(page.locator('[data-selected-project="flow"] img')).toHaveCSS('object-fit','contain');
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
test('all four films autoplay without a control and continue offscreen',async({page})=>{
 await home(page);
 await expect(page.locator('#work .preview-toggle')).toHaveCount(0);
 for(const id of videos) {
  const video=page.locator(`[data-selected-project="${id}"] video`);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2&&v.videoWidth>0),{timeout:30000}).toBe(true);
 }
 const video=page.locator('[data-selected-project="needle"] video');
 await video.scrollIntoViewIfNeeded();
 const start=await video.evaluate((v:HTMLVideoElement)=>v.currentTime);
 await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
 await page.waitForTimeout(750);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(start);
});
test('muted project loops autoplay under reduced motion and can be paused by the visitor',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await home(page);
 for(const id of videos) {
  const video=page.locator(`[data-selected-project="${id}"] video`);
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2),{timeout:25000}).toBe(true);
 }
 await page.getByRole('button',{name:'Pause project videos'}).click();
 for(const id of videos) await expect(page.locator(`[data-selected-project="${id}"] video`)).toHaveJSProperty('paused',true);
 await page.getByRole('button',{name:'Play project videos'}).click();
 for(const id of videos) await expect.poll(()=>page.locator(`[data-selected-project="${id}"] video`).evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
});
test('blocked playback and failed media retain real posters and destinations',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'));};});
 await gallery(page);const media=page.locator('[data-selected-project="flow"] [data-preview]');await expect(media).toHaveAttribute('data-preview-status','blocked');await expect(media.locator('img')).toBeVisible();await expect(page.locator('[data-selected-project="flow"] .preview-retry')).toBeVisible();await expect(page.locator('[data-selected-project="flow"] a[href="/work/flow"]').first()).toBeVisible();expect(errors).toEqual([]);
});
test('missing media remains a usable poster card',async({page})=>{
 await page.route(/\.(mp4|webm)(\?|$)/,r=>r.fulfill({status:404,body:'missing'}));await gallery(page);
 const frame=page.locator('[data-selected-project="flow"] [data-preview]');await expect(frame).toHaveAttribute('data-preview-status','unavailable');await expect(frame.locator('img')).toBeVisible();
});
test('no JavaScript retains F24 privacy, all project posters and links',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:4397/#work');
 await expect(page.locator('[data-f24-feature] a')).toHaveCount(2);await expect(page.locator('[data-selected-project]')).toHaveCount(4);await expect(page.locator('#work video[src]')).toHaveCount(0);await expect(page.locator('#work img')).toHaveCount(6);for(const img of await page.locator('#work img').all()){await img.scrollIntoViewIfNeeded();await expect(img).toBeVisible();await expect.poll(()=>img.evaluate((x:HTMLImageElement)=>x.complete&&x.naturalWidth>0)).toBe(true);}await context.close();
});
for(const width of [320,375,390,768,1024,1280,1440,1920])test(`section fits at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await home(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const boxes=await page.locator('[data-selected-project]').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width})));
 expect(boxes).toHaveLength(4);
 for(const id of cards) {
  const chapter=page.locator(`[data-selected-project="${id}"]`);
  const copy=await chapter.locator('.project-info').boundingBox();
  const media=await chapter.locator('.preview-link').boundingBox();
  expect(copy).not.toBeNull();expect(media).not.toBeNull();
  if(width>=980) expect(id==='second-voice-ai'||id==='flow' ? media!.x<copy!.x : copy!.x<media!.x).toBe(true);
  else {expect(media!.y<copy!.y).toBe(true);expect(media!.x).toBeGreaterThanOrEqual(0);expect(media!.x+media!.width).toBeLessThanOrEqual(width+1);}
  await expect(chapter.locator('.project-tags')).toHaveCSS('display','flex');
  await expect(chapter.locator('.project-stack')).toHaveCSS('font-style','normal');
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

test('videos start loading independently of viewport visibility',async({page})=>{
 await home(page);
 for(const id of videos) {
  await expect.poll(()=>page.locator(`[data-selected-project="${id}"] video`).evaluate((v:HTMLVideoElement)=>Boolean(v.currentSrc)),{timeout:10000}).toBe(true);
 }
});
test('project loops autoplay even with browser Save-Data enabled',async({page})=>{
 await page.addInitScript(()=>{
  const connection=Object.assign(new EventTarget(),{saveData:true});
  Object.defineProperty(navigator,'connection',{value:connection,configurable:true});
 });
 await home(page);
 for(const id of videos) await expect.poll(()=>page.locator(`[data-selected-project="${id}"] video`).evaluate((v:HTMLVideoElement)=>!v.paused&&v.readyState>=2),{timeout:25000}).toBe(true);
});
test('background tabs pause video and resume on return',async({page})=>{
 await home(page);
 const video=page.locator('[data-selected-project="flow"] video');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
 const visibility=async(hidden:boolean)=>page.evaluate(value=>{Object.defineProperty(document,'hidden',{configurable:true,value});document.dispatchEvent(new Event('visibilitychange'));},hidden);
 await visibility(true);await expect(video).toHaveJSProperty('paused',true);
 await visibility(false);await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
});
test('Leu falls back from its failed preferred source to real MP4 playback',async({page})=>{
 await page.route(/\.webm(\?|$)/,r=>r.fulfill({status:404,body:'missing preferred source'}));await gallery(page);
 for(const id of ['leu']){const v=page.locator(`[data-selected-project="${id}"] video`);await expect.poll(()=>v.evaluate((x:HTMLVideoElement)=>!x.paused&&x.readyState>=2&&x.videoWidth>0&&x.currentSrc.endsWith('.mp4')),{timeout:20000}).toBe(true);await expect(v).toHaveCSS('opacity','1');const before=await v.evaluate((x:HTMLVideoElement)=>x.currentTime);await page.waitForTimeout(250);expect(await v.evaluate((x:HTMLVideoElement)=>x.currentTime)).toBeGreaterThan(before);}
});
test('slow responses preserve posters and links until real playback begins',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});await page.route(/\.(mp4|webm)(\?|$)/,async r=>{await gate;await r.continue();});
 await gallery(page);const frame=page.locator('[data-selected-project="flow"] [data-preview]');await expect(frame.locator('img')).toBeVisible();await expect(frame.locator('video')).toHaveCSS('opacity','0');await expect(page.locator('[data-selected-project="flow"] a[href="/work/flow"]').first()).toBeVisible();release();
 await expect.poll(()=>frame.locator('video').evaluate((x:HTMLVideoElement)=>!x.paused&&x.readyState>=2),{timeout:20000}).toBe(true);await expect(frame.locator('video')).toHaveCSS('opacity','1');
});
test('unmounting an active loop leaves no client errors',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await home(page);
 const video=page.locator('[data-selected-project="flow"] video');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused),{timeout:25000}).toBe(true);
 await page.locator('[data-selected-project="flow"] h4 a').click();
 await expect(page).toHaveURL(/\/work\/flow$/);
 await page.waitForTimeout(250);
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
   const ratio=await v.evaluate((x:HTMLVideoElement)=>x.videoWidth/x.videoHeight);
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
test('touch activates media links and separate public actions without hijacking',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();
 for(const id of cards){await page.goto('http://127.0.0.1:4397/#work');const a=page.locator(`[data-selected-project="${id}"] .preview-link`);await a.tap();await expect(page).toHaveURL(new RegExp(`/work/${id==='second-voice-ai'?'second-voice':id}$`));}
 await page.goto('http://127.0.0.1:4397/#work');await context.route('https://**/*',r=>r.fulfill({contentType:'text/html',body:'<title>Verified destination navigation</title>'}));
 for(const link of await page.locator('#work a[target="_blank"]').all()){const href=await link.getAttribute('href');const original=page.url();const opened=page.waitForEvent('popup');await link.tap();const popup=await opened;await expect(popup).toHaveURL(href!);expect(page.url()).toBe(original);await popup.close();}
 await context.close();
});
