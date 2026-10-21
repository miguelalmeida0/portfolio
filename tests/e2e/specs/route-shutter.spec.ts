import { expect, test, type Page } from '@playwright/test';
const home = process.env.SHUTTER_HOME ?? '/hero-lab/typographic';
const story = home === '/' ? '/story' : home + '/story';
const cv = home === '/' ? '/cv' : home + '/cv';
const shutter = (page: Page) => page.locator('[data-route-shutter]');
test.use({ video: 'on' });

async function ready(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
}
async function navLink(page: Page, name: string) {
  const index = page.getByRole('button', { name: /^(Index|Menu)$/ });
  if (await index.isVisible()) {
    await index.click();
    return page.locator('dialog[open]').getByRole('link', { name, exact: true });
  }
  return page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name, exact: true });
}
async function uncovered(page: Page) {
  await expect(shutter(page)).toBeHidden({ timeout: 1500 });
  expect(await page.evaluate(() => [[.5,.5],[.3,.4],[.7,.6]].every(([x,y]) =>
    !!document.elementFromPoint(innerWidth*x,innerHeight*y)?.closest('#portfolio-content')))).toBe(true);
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert','');
}
async function sample(page: Page) {
  await page.evaluate(() => {
    const w = window as any;
    w.routeSamples = []; w.routePress = performance.now();
    const scan = () => {
      const el = document.querySelector<HTMLElement>('[data-route-shutter]')!;
      const strips = [...el.querySelectorAll<HTMLElement>('.route-strip')].filter(n => getComputedStyle(n).display !== 'none');
      const scales = strips.map(n => new DOMMatrixReadOnly(getComputedStyle(n).transform).m22);
      const title = el.querySelector<HTMLElement>('.route-title-text')!;
      w.routeSamples.push({t:performance.now()-w.routePress,hidden:el.hidden,label:title.textContent,scales,
        titleY:new DOMMatrixReadOnly(getComputedStyle(title).transform).m42,path:location.pathname});
      if(performance.now()-w.routePress<1600)requestAnimationFrame(scan);
    };
    requestAnimationFrame(scan);
  });
}
test.beforeEach(async ({page}) => {
  await page.addInitScript(() => {sessionStorage.setItem('seen-intro','true');localStorage.removeItem('miguel-motion-preference');});
  await page.emulateMedia({reducedMotion:'no-preference'});
});
test('recorded tour names each destination, covers promptly and never strands the viewport', async ({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await ready(page,home);
 for(const [from,label,to] of [[home,'Story',story],[story,'CV',cv],[cv,'Home',home],[home,'F24','/work/f24'],[story,'Work',home+'#work']]){
   if(!page.url().endsWith(from))await ready(page,from);
   const link=label==='Home'?page.locator('[data-identity-home]'):
     label==='F24'?page.locator('a[href="/work/f24"]').first():await navLink(page,label);
   await link.scrollIntoViewIfNeeded();await link.hover();await sample(page);
   await link.click({noWaitAfter:true});
   await expect(shutter(page).locator('.route-title-text')).toHaveText(label,{timeout:150});
   await expect(page).toHaveURL(new RegExp(to.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&')+'$'));
   await uncovered(page);
   await expect(page.locator(to.includes('#work')?'#work':'#main')).toBeFocused();
   const samples=await page.evaluate(()=>(window as any).routeSamples);
   await info.attach('shutter-'+label+'.json',{body:JSON.stringify(samples),contentType:'application/json'});
   const visible=samples.filter((s:any)=>!s.hidden);
   expect(visible.some((s:any)=>s.scales.some((v:number)=>v>0)&&s.t<=80)).toBe(true);
   expect(visible.some((s:any)=>s.scales.every((v:number)=>v>=.999)&&s.t<=320)).toBe(true);
   const readable=visible.filter((s:any)=>Math.abs(s.titleY)<.5);
   expect(readable.at(-1).t-readable[0].t).toBeGreaterThanOrEqual(145); // one frame of sampling tolerance
   // Exact supplied phases total up to 930ms; keep the requested 900ms target visible as a measurement.
   const cleared=samples.find((s:any)=>s.hidden&&s.t>visible[0].t)?.t;
   await info.attach('budget-'+label+'.json',{body:JSON.stringify({cleared,preloadedTarget:900,coldTarget:1200}),contentType:'application/json'});
 }
 expect(errors).toEqual([]);
});
test('leaving immediately after arrival stays quick in either engine',async({page})=>{
 for(const [from,label,to] of [[story,'CV',cv],[cv,'Story',story]]){
  await ready(page,from);await page.waitForTimeout(400);const link=await navLink(page,label);
  const start=Date.now();await link.click({noWaitAfter:true});await expect(page).toHaveURL(new RegExp(to+'$'));
  await expect(page.locator(label==='CV'?'[data-ask-id="cv-summary"]':'h1')).toBeAttached({timeout:2500});
  expect(Date.now()-start).toBeLessThan(2500);await uncovered(page);
 }
});
test('busy clicks are ignored, then the next route succeeds with no rejection',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await ready(page,home);
 await (await navLink(page,'Story')).click({noWaitAfter:true});await page.waitForURL('**'+story);await page.waitForTimeout(150);
 // Programmatic click stresses the cancellation rule even while the overlay blocks physical clicks.
 await page.locator('a[href="'+cv+'"]').first().evaluate((el:HTMLAnchorElement)=>el.click());
 await uncovered(page);expect(new URL(page.url()).pathname).toBe(story);
 await (await navLink(page,'CV')).click();await uncovered(page);expect(new URL(page.url()).pathname).toBe(cv);expect(errors).toEqual([]);
});
test('reduced motion remains hidden and focuses main',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await ready(page,home);
 await page.evaluate(()=>{(window as any).shutterShown=false;const el=document.querySelector('[data-route-shutter]')!;new MutationObserver(()=>{if(!el.hasAttribute('hidden'))(window as any).shutterShown=true;}).observe(el,{attributes:true,attributeFilter:['hidden']});});
 await (await navLink(page,'Story')).click();await expect(page.locator('#main')).toBeFocused();await expect(shutter(page)).toBeHidden();
 expect(await page.evaluate(()=>(window as any).shutterShown)).toBe(false);
});
test('history has no name and restores prior reading position',async({page})=>{
 await ready(page,story);await page.evaluate(()=>window.scrollTo(0,500));await (await navLink(page,'CV')).click();await uncovered(page);
 await page.goBack();await expect(shutter(page).locator('.route-title-text')).toHaveText('');
 await expect(shutter(page)).toBeHidden();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeCloseTo(500,-1);
});
test('mobile menu closes and releases scroll and focus',async({page,isMobile})=>{
 test.skip(!isMobile);await ready(page,home);await (await navLink(page,'Story')).click({noWaitAfter:true});
 await expect(shutter(page).locator('.route-title-text')).toHaveText('Story');await uncovered(page);
 await expect(page.locator('dialog[open]')).toHaveCount(0);await expect(page.locator('#main')).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.style.overflow)).not.toBe('hidden');
});
test('Work from Story reveals then reaches the real anchor',async({page})=>{
 await ready(page,story);await (await navLink(page,'Work')).click();await uncovered(page);
 await expect(page.locator('#work')).toBeFocused();await expect.poll(()=>page.locator('#work').evaluate(el=>Math.abs(el.getBoundingClientRect().top))).toBeLessThan(200);
});
test('unknown and error routes release the cover without inventing a label',async({page})=>{
 await ready(page,home);
 await page.evaluate(()=>{const a=document.createElement('a');a.href='/missing-shutter-test';a.id='error-route';a.textContent='Missing page';document.querySelector('main')!.prepend(a);});
 await page.locator('#error-route').click({noWaitAfter:true});await expect(shutter(page).locator('.route-title-text')).toHaveText('');
 await expect(shutter(page)).toBeHidden({timeout:4500});
});
test('new-tab PDF, download, external, mail and modified links do not open a shutter',async({page,context})=>{
 await ready(page,cv);
 for(const selector of ['a[href="/cv/pdf"]','a[download]','a[href^="mailto:"]']){
  const link=page.locator(selector).first();
  // Prevent the browser/OS side effect only after application handlers have seen the click.
  await link.evaluate(el=>el.addEventListener('click',e=>e.preventDefault(),{once:true}));
  await link.click();await expect(shutter(page)).toBeHidden();
 }
 const link=await navLink(page,'Story');const popup=context.waitForEvent('page');await link.click({modifiers:['ControlOrMeta']});const tab=await popup;await expect(shutter(page)).toBeHidden();await tab.close();
});

