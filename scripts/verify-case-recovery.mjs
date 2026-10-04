import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.RECOVERY_URL || 'http://127.0.0.1:4187';
const prior='https://1ed04fb5.miguelalmeida-portfolio.pages.dev';
const dir='artifacts/case-recovery';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch();const results=[];
try {
 for(const width of [390,1440,2560]) for(const route of ['flow','leu','f24','second-voice']) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const snapshot=async(origin,label)=>{
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`${origin}/work/${route}`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
   const value=await page.evaluate(()=>{
    const root=document.querySelector('[class^="cs-"]');
    const h=root?.querySelector('h1');const r=h?.getBoundingClientRect();
    return {headings:[...root.querySelectorAll('h1,h2')].map(e=>e.textContent.trim()),heading:r&&{x:r.x,y:r.y,width:r.width,height:r.height},zoom:getComputedStyle(document.querySelector('#portfolio-content')).zoom,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   if(width===1440||width===390)await page.screenshot({path:`${dir}/${label}-${route}-${width}.png`});
   assert.deepEqual(errors,[],`${label} ${route} browser errors`);await page.close();return value;
  };
  const reference=await snapshot(prior,'friday');const candidate=await snapshot(base,'candidate');
  assert.deepEqual(candidate.headings,reference.headings,`${route} original headings`);
  assert.equal(candidate.zoom,reference.zoom,`${route} desktop scale`);
  assert.equal(candidate.overflow,false,`${route} ${width} overflow`);
  const differences=Object.fromEntries(Object.keys(candidate.heading).map(k=>[k,Math.abs(candidate.heading[k]-reference.heading[k])]));
  results.push({route,width,reference,candidate,differences});
  console.log(JSON.stringify({route,width,differences}));
  await context.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto(`${base}/work/second-voice-ai`);assert.equal(new URL(page.url()).pathname,'/work/second-voice');
 await page.goto(`${base}/`);await page.locator('[data-project-row]').first().waitFor();
 assert.match(await page.locator('[data-project-row]').first().innerText(),/Needle/);
 assert.match(await page.locator('.experience').innerText(),/hundreds of companies/);
 await page.screenshot({path:`${dir}/candidate-home.png`});
 await page.goto(`${base}/work/needle`);assert.equal(await page.locator('[data-needle-study] section').count(),8);
 await page.screenshot({path:`${dir}/candidate-needle.png`});
 writeFileSync(`${dir}/verification.json`,JSON.stringify({base,results,needlePreserved:true,legacyLink:true},null,2));
}finally{await browser.close();}
