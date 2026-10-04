import {chromium} from '@playwright/test';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch();const results=[];
const base=process.env.RECOVERY_URL||'http://127.0.0.1:4187';
mkdirSync('artifacts/case-recovery',{recursive:true});
try{
 for(const width of [390,1440])for(const [route,selector]of [['flow','.cs-flow'],['leu','.cs-leu'],['f24','.cs-f24'],['second-voice','.cs-sv']]){
  const shots=[];
  for(const origin of ['https://1ed04fb5.miguelalmeida-portfolio.pages.dev',base]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   await page.goto(`${origin}/work/${route}`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);await page.mouse.move(0,0);await page.waitForTimeout(200);
   shots.push(PNG.sync.read(await page.locator(selector).screenshot({animations:'disabled'})));
   await page.close();
  }
  const [a,b]=shots;let pixels=null;
  if(a.width===b.width&&a.height===b.height){const diff=new PNG({width:a.width,height:a.height});pixels=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0,includeAA:true});if(pixels)writeFileSync(`artifacts/case-recovery/friday-diff-${route}-${width}.png`,PNG.sync.write(diff));}
  const result={route,width,friday:[a.width,a.height],candidate:[b.width,b.height],pixels};results.push(result);console.log(JSON.stringify(result));
 }
 writeFileSync('artifacts/case-recovery/friday-pixels.json',JSON.stringify(results,null,2));
 assert.ok(results.every(r=>r.pixels===0),'Recovered case-study pixels differ from the reviewed Friday deployment');
}finally{await browser.close();}
