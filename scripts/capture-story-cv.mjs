import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({reducedMotion:'reduce'});
const results=[];
const errors=[];
page.on('pageerror', e=>errors.push(e.message));
page.on('console', message=>{ if(message.type()==='error')errors.push(message.text()); });
for (const [width,height] of [[1440,1020],[1366,768],[1280,800],[1024,768],[834,1112],[430,932],[393,852],[390,844],[375,812]]) {
  await page.setViewportSize({width,height});
  for(const route of ['/story','/cv']) {
    await page.goto('http://127.0.0.1:4185'+route);
    await page.evaluate(()=>document.fonts.ready);
    const measurement=await page.evaluate(()=>{
      const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};
      const style=getComputedStyle(document.querySelector('.profile-primary'));
      return {overflow:document.documentElement.scrollWidth-innerWidth,header:box('#portfolio-content > header'),intro:box('.profile-top'),h1:box('h1'),font:getComputedStyle(document.querySelector('h1')).fontSize,radius:style.borderRadius,background:style.backgroundColor,avatar:!!document.querySelector('[data-identity-avatar]'),early:box(location.pathname==='/cv'?'.cv-summary .profile-button':'.story-path')};
    });
    results.push({route,width,height,...measurement});
    await page.screenshot({path:'artifacts/story-cv-agent/'+route.slice(1)+'-'+width+'.png'});
    if([1440,1024,390].includes(width))await page.screenshot({path:'artifacts/story-cv-agent/'+route.slice(1)+'-'+width+'-full.png',fullPage:true});
  }
}
await page.setViewportSize({width:1440,height:1020});
await page.goto('http://127.0.0.1:4185/');
await page.keyboard.press('Escape');
await page.waitForSelector('#work [role="tabpanel"]');
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'artifacts/story-cv-agent/home-reference-1440.png'});
await writeFile('artifacts/story-cv-agent/measurements.json',JSON.stringify({results,errors},null,2));
console.log(JSON.stringify({layouts:results.length,overflow:results.filter(r=>r.overflow>0),errors}));
await browser.close();
