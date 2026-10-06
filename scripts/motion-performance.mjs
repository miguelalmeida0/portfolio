import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const phase=process.argv[2]||'after',out=`artifacts/motion/${phase}`;
await mkdir(out,{recursive:true});
const browser=await chromium.launch();const runs=[];
try {
for(const mobile of [false,true])for(const route of ['/','/work/needle'])for(let run=0;run<3;run++){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile,...(!mobile&&run===0?{recordVideo:{dir:`${out}/interaction-video`,size:{width:1440,height:900}}}:{})});
 await context.addInitScript(()=>{
  sessionStorage.setItem('seen-intro','true');
  const m=window.__perf={lcp:0,cls:0,tasks:[],events:[],frames:[],sampling:false};
  for(const [type,apply] of [['largest-contentful-paint',e=>m.lcp=e.startTime],['layout-shift',e=>{if(!e.hadRecentInput)m.cls+=e.value;}],['longtask',e=>m.tasks.push(e.duration)],['event',e=>{if(e.interactionId)m.events.push({id:e.interactionId,duration:e.duration});}]]){
   new PerformanceObserver(l=>l.getEntries().forEach(apply)).observe({type,buffered:true,durationThreshold:16});
  }
  let last=0;function frame(t){if(m.sampling&&last)m.frames.push(t-last);last=t;requestAnimationFrame(frame);}requestAnimationFrame(frame);
 });
 const page=await context.newPage(),cdp=await context.newCDPSession(page);
 if(mobile)await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.goto((process.env.MOTION_URL||'http://127.0.0.1:4398')+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
 if(route==='/work/needle'){
  await page.locator('.artwork-card').nth(1).scrollIntoViewIfNeeded();await page.waitForTimeout(600);
  for(const i of [1,2,3,0,2]){await page.locator('.artwork-card').nth(i).click();await page.waitForTimeout(300);}
 }else{
  await page.locator('[data-selected-project]').first().scrollIntoViewIfNeeded();await page.waitForTimeout(600);
  const buttons=page.getByRole('button',{name:/Pause previews|Play previews|Resume previews/});
  if(await buttons.count()){await buttons.first().click();await page.waitForTimeout(200);await buttons.first().click();}
 }
 await page.evaluate(()=>window.__perf.sampling=true);
 for(let i=0;i<30;i++){await page.mouse.wheel(0,i<20?90:-90);await page.waitForTimeout(32);}
 await page.evaluate(()=>window.__perf.sampling=false);
 const metrics=await page.evaluate(()=>{
  const m=window.__perf,s=[...m.frames].sort((a,b)=>a-b),grouped=new Map();
  m.events.forEach(e=>grouped.set(e.id,Math.max(grouped.get(e.id)||0,e.duration)));
  const events=[...grouped.values()];
  return {lcp:m.lcp,cls:m.cls,interactionCount:events.length,maxInteractionMs:Math.max(0,...events),longTaskCount:m.tasks.length,longTaskTotal:m.tasks.reduce((a,b)=>a+b,0),longestTask:Math.max(0,...m.tasks),frameP95:s[Math.floor(s.length*.95)],frameCount:s.length,framesOver34ms:s.filter(v=>v>34).length};
 });
 runs.push({phase,mobile,cpuRate:mobile?4:1,route,run,...metrics});console.log(runs.at(-1));await context.close();
 await writeFile(`${out}/performance.json`,JSON.stringify(runs,null,2));
}
}finally{await browser.close();}
