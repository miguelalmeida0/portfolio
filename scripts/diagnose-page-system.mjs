import {chromium} from '@playwright/test';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
let before;
page.on('pageerror', e=>console.log('ERROR',e.message));
await page.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));
for(const route of ['/','/story','/work/flow']) {
 await page.goto('http://127.0.0.1:4173'+route);
 await page.locator('[data-ask-trigger]').first().waitFor();
 await page.waitForFunction(()=>!document.querySelector('[data-ask-trigger]').disabled);
 await page.evaluate(()=>document.fonts.ready);
 const styles=await page.locator('.wind-header').evaluate(el=>[el,...el.querySelectorAll('a,span,button')].map(x=>{const s=getComputedStyle(x);return {...Object.fromEntries([...s].filter(k=>!k.startsWith('--')).map(k=>[k,s.getPropertyValue(k)])),rect:x.getBoundingClientRect().toJSON()}}));
 if(!before)before=styles;
 else console.log(route,styles.map((s,i)=>Object.fromEntries(Object.keys(s).filter(k=>JSON.stringify(s[k])!==JSON.stringify(before[i][k])).map(k=>[k,[before[i][k],s[k]]]))));
 if(route==='/work/flow') {
  const next=page.getByRole('button',{name:/^Next:/});
  for(let i=0;i<5;i++) {await next.click();console.log('step',i,await next.textContent(), await page.locator('[data-draft-state]').textContent());}
 }
}
await browser.close();
