import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes=['/','/story','/cv','/work/f24','/work/needle','/work/second-voice','/work/leu','/work/flow'];
test('all homepage project prose retains a readable physical size', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/');
 for (const width of [320, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const paragraph of await page.locator('.f24-overview .description, .collection-intro p, .collection-line, .collection-detail').all()) {
   const size = await paragraph.evaluate(el => parseFloat(getComputedStyle(el).fontSize) * el.getBoundingClientRect().width / (el as HTMLElement).offsetWidth);
   expect(size, `${width}px: ${await paragraph.innerText()}`).toBeGreaterThanOrEqual(16);
  }
 }
});

for(const width of [320,390,768,1024,1440]) {
 test(`editorial pages remain readable and usable at ${width}px`,async({page},info)=>{
  test.setTimeout(120_000);
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of routes) {
   await page.goto(route);await expect(page.locator('main, [data-hero-stage], .mah').first()).toBeVisible();
   await expect(page.locator('h1').first()).toBeVisible();
   await expect(page.locator('vite-error-overlay')).toHaveCount(0);
   await page.evaluate(()=>document.fonts.ready);
   const overflow=await page.evaluate(()=>({screen:innerWidth,width:document.documentElement.scrollWidth}));
   expect(overflow.width,`${route}: document overflow`).toBeLessThanOrEqual(overflow.screen+2);
   const text=await page.locator('body').innerText();
   expect(text).not.toMatch(/Curious by nature|A builder by choice|From speech to deterministic state|Reuse is a decision|A quieter way to read/);
   if(route.startsWith('/work/') && route!=='/work/f24') await expect(page.locator('.case-pitch .case-ownership')).toContainText('I ');
   const reading=await page.locator('.case-pitch .sub,.c-bio,.story-answer,.f24-overview .description').first().evaluate(el=>{const style=getComputedStyle(el);return {font:style.fontFamily,pixels:parseFloat(style.fontSize)*el.getBoundingClientRect().width/(el as HTMLElement).offsetWidth};});
   expect(reading.font).toMatch(/Figtree/);expect(reading.pixels,`${route}: reading text physical size`).toBeGreaterThanOrEqual(16);
   const name=route==='/'?'home':route.replaceAll('/','-').slice(1);
   await page.screenshot({path:info.outputPath(`${name}-${width}.png`)});
  }
  await page.goto('/story');await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  const tabs=page.getByRole('tablist',{name:'Career journey'});
  await tabs.getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected','true');
  await expect(page.locator('#journey-panel-1')).toBeVisible();
  await expect(page.getByRole('button',{name:'Copy my introduction'})).toBeVisible();
  await page.keyboard.press('Control+/');
  await expect(page.locator('[data-ask-panel], [data-ask-trigger]')).toHaveCount(0);
  expect(errors).toEqual([]);
 });
}

test('case captions, destination labels, scoped metrics and release identity agree',async({page,request})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/cv');await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('.c-highlights')).toContainText('Checks I wrote');
 await expect(page.locator('.c-highlights')).toContainText('Shared test suite');
 await expect(page.locator('.c-highlights')).not.toContainText('5,500');
 const version=await (await request.get('/version.json')).json();
 expect(version.commit).toMatch(/^[a-f0-9]{40}$/);
 if(process.env.PORTFOLIO_EXPECTED_COMMIT) expect(version.commit).toBe(process.env.PORTFOLIO_EXPECTED_COMMIT);
 await expect(page.locator('meta[name="portfolio-build"]')).toHaveAttribute('content',version.commit);
 await expect(page.locator('meta[name="portfolio-build-time"]')).toHaveAttribute('content',version.builtAt);
 await page.goto('/work/leu');
 await expect(page.locator('.case-artifact figcaption')).toContainText('browser interface');
 await expect(page.locator('.pnav a').filter({hasText:'Open live app'})).toHaveAttribute('href',/leu\.miguelalmeida\.xyz/);
 await page.goto('/work/second-voice');
 await expect(page.locator('.case-pitch a').filter({hasText:'Try the case demo'})).toHaveAttribute('href','#try');
 await expect(page.locator('#release')).toContainText('21 October 2026');
});

test('editorial pages have no serious automated accessibility violations',async({page},info)=>{
 test.setTimeout(120_000);await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of routes) {
  await page.goto(route);await page.evaluate(()=>document.fonts.ready);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await info.attach(`${route.replaceAll('/','-')||'home'}-axe`,{body:JSON.stringify(result.violations,null,2),contentType:'application/json'});
  expect(result.violations.filter(item=>['critical','serious'].includes(item.impact??'')),route).toEqual([]);
 }
});

test('media blocking and offline navigation leave useful content and PDF links',async({page,context})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.route(/\.(?:webp|avif|jpg|png|mp4|webm)(?:\?|$)/,route=>route.abort());
 await page.goto('/work/needle');await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('.case-pitch h1')).toBeVisible();
 await page.getByRole('button',{name:'a blue scarab',exact:true}).click();
 await expect(page.locator('[data-needle-demo] .inspector h3')).toHaveText('Scarab Decorated with Scrolls');
 await expect(page.locator('[data-needle-demo]')).toContainText('Image unavailable');
 await context.setOffline(true);
 await page.locator('.pipeline-model').getByRole('button',{name:'Older reply'}).click();
 await expect(page.locator('.pipeline-model')).toContainText('Discard stale response');
 await context.setOffline(false);
 await page.goto('/cv');
 await expect(page.locator('a[href="/files/miguel-almeida-cv.pdf"]').first()).toHaveAttribute('download','Miguel-Almeida-CV.pdf');
});

for(const width of [320,390]) test(`case navigation keeps project names and actions separate at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of routes.filter(route=>route.startsWith('/work/'))) {
  await page.goto(route);await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');await page.evaluate(()=>document.fonts.ready);
  const identity=page.locator('.pnav .project-identity');
  const metrics=await identity.locator('.pname').evaluate(el=>({height:el.getBoundingClientRect().height,line:parseFloat(getComputedStyle(el).lineHeight)}));
  expect(metrics.height,`${route}: project name must stay on one line`).toBeLessThanOrEqual(metrics.line+1);
  for(const control of await page.locator('a[data-circle-fill]').all()) {
   const label=(await control.locator('.flow-label').boundingBox())!;const orbit=(await control.locator('.flow-arrow').boundingBox())!;
   expect(label.x+label.width,`${route}: button text must clear its arrow`).toBeLessThanOrEqual(orbit.x-4);
  }
  const a=(await identity.boundingBox())!;const b=(await page.locator('.pnav .project-actions').boundingBox())!;
  expect(a.x+a.width<=b.x+1 || a.y+a.height<=b.y+1,route).toBe(true);
  for(const control of await page.locator('.pnav .project-actions a').all()) {
   const box=(await control.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(width+1);expect(box.height).toBeGreaterThanOrEqual(44);
  }
 }
});

test('copying the short introduction copies the introduction shown on screen',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/story');await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as Window & {copiedIntro?:string}).copiedIntro=text;}}}));
 const expected=await page.locator('.short-introduction').innerText();await page.locator('[data-story-copy]').click();
 expect(await page.evaluate(()=>(window as Window & {copiedIntro?:string}).copiedIntro)).toBe(expected);
});
