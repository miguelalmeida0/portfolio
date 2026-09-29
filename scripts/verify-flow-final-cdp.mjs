import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {Server} from '../.svelte-kit/output/server/index.js';
import {manifest} from '../.svelte-kit/output/server/manifest.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(root,'../flow/film/flow-portfolio-loop/output/qa');
process.env.TMPDIR=path.join(root,'.cache/tmp');
fs.mkdirSync(process.env.TMPDIR,{recursive:true});
const {chromium,expect}=await import('@playwright/test');
// Execute the built SvelteKit request handler in process. No HTTP listener,
// development server, preview server, or browser process is started.
const app=new Server(manifest);
await app.init({env:{}});
const origin='http://127.0.0.1:4173';
const types={'.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.mp4':'video/mp4','.pdf':'application/pdf'};
const browser=await chromium.connectOverCDP('http://127.0.0.1:9223');
const page=await browser.contexts()[0].newPage();
const report={mode:'Built SvelteKit SSR and local assets fulfilled through CDP; no network server',checks:[],errors:[]};
page.on('pageerror',error=>report.errors.push(error.message));
await page.route(`${origin}/**`,async route=>{
 const request=route.request(), pathname=decodeURIComponent(new URL(request.url()).pathname);
 const relative=pathname.replace(/^\//,'');
 const candidate=[path.join(root,'.svelte-kit/output/client',relative),path.join(root,'static',relative)].find(file=>fs.existsSync(file)&&fs.statSync(file).isFile());
 if(candidate){
  const bytes=fs.readFileSync(candidate),headers={'content-type':types[path.extname(candidate)]??'application/octet-stream','accept-ranges':'bytes'};
  const range=request.headers()['range']?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):bytes.length-1,bytes.length-1);headers['content-range']=`bytes ${start}-${end}/${bytes.length}`;await route.fulfill({status:206,headers,body:bytes.subarray(start,end+1)});}
  else await route.fulfill({status:200,headers,body:bytes});
 }else{
  const response=await app.respond(new Request(request.url(),{method:request.method(),headers:request.headers()}),{getClientAddress:()=> '127.0.0.1'});
  await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
 }
});
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  await page.setViewportSize(viewport);await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(`${origin}/work/flow`);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Conversation becomes editable life state.');
  await expect(page.getByText('The Flow product film is currently unavailable.')).toHaveCount(0);
  const video=page.locator('video[src*="flow-loop-web-final.mp4"]');
  await video.scrollIntoViewIfNeeded();await page.bringToFront();
  await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0);
  const state=await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,muted:v.muted,loop:v.loop,playsInline:v.playsInline,error:v.error}));
  assert.deepEqual(state,{duration:23,width:1920,height:1080,muted:true,loop:true,playsInline:true,error:null});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:path.join(output,`final-portfolio-${viewport.width}.png`)});
  report.checks.push({name:`Playback ${viewport.width}`,status:'PASS',...state});
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('video')).not.toHaveAttribute('src');
  await expect(page.locator('img[src*="flow-loop-poster-final.jpg"]')).toBeVisible();
  report.checks.push({name:`Reduced motion ${viewport.width}`,status:'PASS'});
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin);
 await expect(page.locator('[aria-label="Project overview"] button')).toHaveText(['Second Voice','F24','Leu','Flow','Mirror AI']);
 await page.locator('#project-trigger-flow').click();
 await expect(page.locator('#project-content-flow')).toHaveAttribute('aria-hidden','false');
 report.checks.push({name:'Exact project order and Flow panel',status:'PASS'});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setContent('<video muted playsinline preload="auto" style="width:100%"></video>');
 await page.evaluate(async origin=>{const bytes=await(await fetch(origin+'/projects/flow/flow-loop-web-final.mp4')).arrayBuffer();const v=document.querySelector('video');v.src=URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));v.muted=true;v.load();},origin);
 await page.waitForFunction(()=>document.querySelector('video').readyState===4);await page.bringToFront();
 const playbackBefore=await page.locator('video').evaluate(v=>v.getVideoPlaybackQuality().droppedVideoFrames);assert.equal(playbackBefore,0);
 await page.locator('video').evaluate(v=>v.play());
 await page.waitForFunction(()=>document.querySelector('video')?.ended,undefined,{timeout:40000});
 const playbackAfter=await page.locator('video').evaluate(v=>({duration:v.duration,error:v.error,dropped:v.getVideoPlaybackQuality().droppedVideoFrames}));assert.equal(playbackAfter.dropped,0);
 report.checks.push({name:'Whole final encode playback',status:'PASS',...playbackAfter});
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify(report,null,2));
}finally{
 fs.writeFileSync(path.join(output,'final-portfolio-cdp.json'),JSON.stringify(report,null,2));
 await page.close();await browser.close();
}
