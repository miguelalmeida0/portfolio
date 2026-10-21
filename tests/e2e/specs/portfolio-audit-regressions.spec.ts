import { test, expect, type Page } from '@playwright/test';
const home='/#top';

async function pageNavigation(page:Page,name:string){
 const index=page.getByRole('button',{name:'Index',exact:true});
 if(await index.isVisible()){
  await index.click();
  await page.locator('#d1-index').locator(`a[href="${name==='Story'?'/story':'/cv'}"]`).click({noWaitAfter:true});
 }else await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name,exact:true}).click({noWaitAfter:true});
}

// Regression: ENG-08 — native history must supersede interrupted forward work.
// Found by /qa on 2026-10-21. Report: implementation-evidence/progress.md
for(const width of [390,1440]) for(const phase of ['covering','covered','revealing'])
 test('history supersedes the '+phase+' destination at '+width,async({page},info)=>{
  await page.setViewportSize({width,height:900});
  await page.addInitScript(()=>{
   const events:Array<unknown>=[];(window as any).navigationEvidence=events;
   for(const name of ['pushState','replaceState'] as const){
    const original=history[name].bind(history);
    history[name]=(data:unknown,unused:string,url?:string|URL|null)=>{events.push({event:name,url:String(url),at:performance.now()});return original(data,unused,url);};
   }
   addEventListener('popstate',()=>events.push({event:'popstate',url:location.href,at:performance.now()}));
   addEventListener('route:covered',()=>events.push({event:'covered',url:location.href,at:performance.now()}));
  });
  await page.goto('/');await expect(page.locator('.mah[data-renderer]')).toBeVisible();
  await pageNavigation(page,'Story');await expect(page.locator('[data-d1-page=story]')).toBeVisible();
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  // Arm in the browser: polling can miss the short covered phase entirely.
  await page.evaluate(phase=>{
   (window as any).phaseBack=undefined;
   const shutter=document.querySelector<HTMLElement>('[data-route-shutter]')!;
   const observer=new MutationObserver(()=>{
    if(shutter.dataset.phase!==phase)return;
    observer.disconnect();
    (window as any).phaseBack={cvPushed:location.pathname==='/cv'};
    history.back();
   });
   observer.observe(shutter,{attributes:true,attributeFilter:['data-phase']});
  },phase);
  await pageNavigation(page,'CV');
  await expect.poll(()=>page.evaluate(()=>(window as any).phaseBack!==undefined)).toBe(true);
  const {cvPushed}=await page.evaluate(()=>(window as any).phaseBack);
  const backPath=cvPushed?'/story':'/';
  await expect(page).toHaveURL(new RegExp(backPath==='/'?'/$':'/story$'));
  await expect(page.locator(backPath==='/'?'.mah':'[data-d1-page=story]')).toBeVisible();
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  await page.goForward();const forwardPath=cvPushed?'/cv':'/story';
  await expect(page).toHaveURL(new RegExp(forwardPath+'$'));
  await expect(page.locator(forwardPath==='/cv'?'[data-d1-page=cv]':'[data-d1-page=story]')).toBeVisible();
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert','');
  expect(await page.title()).toMatch(forwardPath==='/cv'?/CV|Experience/:/Story/);
  await info.attach('navigation-lifecycle.json',{body:JSON.stringify(await page.evaluate(()=>(window as any).navigationEvidence),null,2),contentType:'application/json'});
 });

test('latest rapid internal destination wins after a pending shutter',async({page})=>{
 await page.goto('/');await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 await page.evaluate(()=>{
  const nav=document.querySelector('nav[aria-label="Main navigation"]')!;
  (nav.querySelector('a[href="/story"]') as HTMLAnchorElement).click();
 });
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','covering');
 await page.evaluate(()=>{
  const nav=document.querySelector('nav[aria-label="Main navigation"]')!;
  for(const path of ['/cv','/story','/cv'])(nav.querySelector(`a[href="${path}"]`) as HTMLAnchorElement).click();
 });
 await expect(page).toHaveURL(/\/cv$/);await expect(page.locator('[data-d1-page=cv]')).toBeVisible();
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('#main')).toBeFocused();
});

for(const width of [390,1440]) test('repeated native Back and Forward preserve the latest history entry at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/');await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 await pageNavigation(page,'Story');await expect(page.locator('[data-d1-page=story]')).toBeVisible();
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await page.evaluate(()=>{
  const shutter=document.querySelector<HTMLElement>('[data-route-shutter]')!;
  (window as any).historyReplay=undefined;
  const observer=new MutationObserver(()=>{
   if(shutter.dataset.phase!=='covering')return;
   observer.disconnect();
   (window as any).historyReplay={target:location.pathname==='/cv'?'/cv':'/story'};
   addEventListener('popstate',()=>history.forward(),{once:true});
   history.back();
  });
  observer.observe(shutter,{attributes:true,attributeFilter:['data-phase']});
 });
 await pageNavigation(page,'CV');
 await expect.poll(()=>page.evaluate(()=>(window as any).historyReplay?.target)).toMatch(/story|cv/);
 const target=await page.evaluate(()=>(window as any).historyReplay.target);
 await expect(page).toHaveURL(new RegExp(target+'$'));
 await expect(page.locator(target==='/story'?'[data-d1-page=story]':'[data-d1-page=cv]')).toBeVisible();
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
});

for(const width of [390,1440]) test('Back supersedes delayed route content at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('/');await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 await pageNavigation(page,'Story');await expect(page.locator('[data-d1-page=story]')).toBeVisible();
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 let release!:()=>void,entered!:()=>void;
 const gate=new Promise<void>(resolve=>release=resolve),requested=new Promise<void>(resolve=>entered=resolve);
 await page.route('**/*',async route=>{
  if(route.request().resourceType()==='script'){entered();await gate;}
  await route.continue();
 });
 try{
  await page.evaluate(()=>(document.querySelector('nav[aria-label="Main navigation"] a[href="/cv"]') as HTMLAnchorElement).click());
  await requested;
  await page.goBack();release();
  await expect(page).toHaveURL(/\/$/);await expect(page.locator('.mah')).toBeVisible();
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  await page.goForward();await expect(page).toHaveURL(/\/story$/);await expect(page.locator('[data-d1-page=story]')).toBeVisible();
 }finally{release();await page.unrouteAll({behavior:'wait'});}
});

test('reduced navigation preserves hash focus without starting a shutter',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/story');
 await expect(page.locator('[data-d1-page=story]')).toBeVisible();
 await expect(page.getByRole('link',{name:'Work',exact:true}).first()).toBeVisible();
 await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Work',exact:true}).click();
 await expect(page).toHaveURL(/\/#work$/);await expect(page.locator('#work')).toBeFocused();
 await expect(page.locator('[data-route-shutter]')).toBeHidden();
});
for(const width of [390,1440]) test('history interrupts a forward shutter at '+width, async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto(home); await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 await page.locator('.mah-ctas a[href="/cv"]').click();
 await page.waitForURL('**/cv');
 await page.goBack({waitUntil:'networkidle'});
 await page.waitForTimeout(1800);
 await expect(page).toHaveURL(/\/#top$/);
 await expect(page.locator('.mah')).toBeVisible();
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert','');
 await page.goForward(); await expect(page.locator('h1')).toContainText('Experience');
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
});
test('removed assistant shortcuts do not capture a shrinking mobile viewport',async({page})=>{
 await page.setViewportSize({width:390,height:844}); await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(home); await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 for(const height of [568,480,420,320,844]){
  await page.setViewportSize({width:390,height}); await page.keyboard.press('Control+/');
  await expect(page.locator('[data-ask-panel], [data-ask-trigger]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(392);
 }
});
test('project video control receives pointer input beside the scrollbar',async({page})=>{
 await page.setViewportSize({width:390,height:900}); await page.goto(home);
 await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 const pause=page.getByRole('button',{name:'Pause project videos',exact:true});
 await pause.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
 await expect.poll(()=>pause.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
 await pause.click(); await expect(page.getByRole('button',{name:'Play project videos',exact:true})).toBeVisible();
 const rail=page.getByRole('scrollbar',{name:'Scroll page'});
 await rail.focus(); await page.keyboard.press('Home'); await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
 await page.keyboard.press('PageDown'); await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(400);
});
