import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import { selectWorkProject } from './e2e/helpers/portfolio';
import { workProjects } from '../src/lib/content/work-projects';
// @ts-expect-error Shared JavaScript loader used by the repository's Node checks.
import { loadLocalTs } from '../scripts/lib/load-local-ts.mjs';

const plans: typeof import('../src/lib/ask/question-plans.json') = JSON.parse(fs.readFileSync('src/lib/ask/question-plans.json', 'utf8'));
const { validateStep } = await loadLocalTs('src/lib/ask/plan.ts', {
  stubs: { './question-plans.json': `export default ${JSON.stringify(plans)}` }
});

const sizes = [[1920,1080],[1440,900],[1280,800],[1024,768],[390,844]];
test.use({ contextOptions: { reducedMotion: 'reduce' } });
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.goto('/');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.evaluate(()=>document.fonts.ready);
  await selectWorkProject(page, 'second-voice');
  await page.evaluate(() => scrollTo(0, 0));
});

for (const [width,height] of [...sizes,[768,1024],[320,844]]) {
  test(`layout and contact separation at ${width}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const result=await page.evaluate(()=>{
      const rect=(s:string)=>document.querySelector(s)!.getBoundingClientRect();
      const margin=innerWidth>=1024?Math.min(108,innerWidth*.09375)*.8:innerWidth<768?20:Math.min(108,innerWidth*.075);
      const work=rect('#work'),title=rect('footer h2'),board=rect('[data-board]');
      return {margin, lefts:[...document.querySelectorAll('[data-align="left"]')].map(e=>e.getBoundingClientRect().left),overflow:document.documentElement.scrollWidth-innerWidth,gap:title.top-work.bottom,boardRight:board.right,titleBoard:title.top-board.top,rowCaption:rect('[data-project-row]').top-rect('[data-stage-caption]').top,metaFrame:rect('[data-index-meta]').bottom-rect('[data-stage-frame]').bottom};
    });
    for(const left of result.lefts) expect(Math.abs(left-result.margin)).toBeLessThanOrEqual(.5);
    expect(result.overflow).toBe(0);
    expect(Math.abs(result.gap-(width>=1280?128:width>=1024?102.4:width>=768?96:72))).toBeLessThanOrEqual(1);
    if(width>=1280) { expect(result.boardRight).toBeCloseTo(width-result.margin,0); expect(Math.abs(result.titleBoard)).toBeLessThanOrEqual(1); }
    if(width>=1024) { expect(Math.abs(result.rowCaption)).toBeLessThanOrEqual(1); expect(Math.abs(result.metaFrame)).toBeLessThanOrEqual(1); }
  });
}
for(const [width,height] of sizes) {
  test(`portrait geometry and rendered copy freeze at ${width}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const before=JSON.parse(fs.readFileSync(`baseline/${width}.json`,'utf8')).find((b:any)=>b.sel==='[data-portrait-card]');
    const portrait=(await page.locator('[data-portrait-card]').boundingBox())!;
    const zoom=width>=1024?.8:1;
    const expectedWidth=width>=1280?Math.min(width*1.25-913,(width*1.25-216)*.56)*zoom:width>=1024?(width*1.25-128)*.44*zoom:before.w;
    expect(portrait.width).toBeCloseTo(expectedWidth,1); expect(portrait.height).toBeCloseTo(before.h*zoom,1);
    const copy=await page.locator('[data-ask-id]').evaluateAll(nodes=>Object.fromEntries(nodes.map(e=>[(e as HTMLElement).dataset.askId,(e as HTMLElement).innerText])));
    const expectedCopy=JSON.parse(fs.readFileSync(`baseline/${width}-source-texts.json`,'utf8'));
    // Approved F24 ownership update; preserve every other original source string.
    expectedCopy.f24='Built a product used by hundreds of companies.';
    const needle=workProjects.find(p=>p.id==='needle')!;
    expectedCopy['w-needle']=`${needle.name}\n${needle.sub}`;
    expect(copy).toEqual(expectedCopy);
  });
  test(`portrait zero-pixel contract at ${width}`,async({page})=>{
    await page.setViewportSize({width,height});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.locator('.portrait').evaluate((img:HTMLImageElement)=>img.decode());
    // Golden images are specific to browser, operating system and device scale.
    // The geometry and source-copy contracts above remain independent of rasterization.
    await expect(page.locator('[data-portrait-card]')).toHaveScreenshot(`portrait-${width}.png`, { animations:'disabled', maxDiffPixels:0 });
  });
}
test('hero hierarchy, active bar, keyboard focus and above-fold work title',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await expect(page.locator('#work h2')).toBeInViewport();
  await expect(page.locator('.hero-stack')).toHaveCSS('font-weight','500');
  const facts=await page.locator('.supporting-copy p').evaluateAll(nodes=>nodes.map(e=>{const s=getComputedStyle(e);return [s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight,s.color];}));
  expect(facts[0]).toEqual(facts[1]);
  const active=page.locator('[data-project-row][aria-current="true"]');
  const s=await active.evaluate(e=>{const s=getComputedStyle(e),b=getComputedStyle(e,'::after');return {bg:s.backgroundColor,border:s.borderWidth,outline:s.outlineStyle,bar:b.width,left:b.left};});
  expect(s).toEqual({bg:'rgba(0, 0, 0, 0)',border:'0px',outline:'none',bar:'3px',left:'0px'});
  await active.focus(); await expect(active).toHaveCSS('outline-width','3px');
});
for(const width of [1920,1440,1280,1024,768,390,320]) test(`stable project frames and resting snapshots at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:width===1440?900:844});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const frames=[];
  for(const id of ['second-voice','f24','flow','leu'] as const) {
    await selectWorkProject(page, id);
    await page.waitForTimeout(850);
    frames.push(await page.locator('[data-stage-frame]').evaluate(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,top:e.getBoundingClientRect().top+scrollY,footer:document.querySelector('footer')!.getBoundingClientRect().top+scrollY})));
    const captionFits=await page.locator('[data-stage-caption]').evaluate(el=>{
      const frame=document.querySelector('[data-stage-frame]')!.getBoundingClientRect();
      return [...el.children].every(child=>child.getBoundingClientRect().bottom<=frame.top);
    });
    expect(captionFits).toBe(true);
    if(width===1440||width===390) {
      await page.evaluate(()=>scrollTo(0,0));
      await expect.soft(page).toHaveScreenshot(`tidy-${width}-${id}.png`,{fullPage:true,animations:'disabled',maxDiffPixelRatio:.002});
    }
  }
  for(const frame of frames) expect(frame).toEqual(frames[0]);
});
for(const reducedMotion of ['reduce','no-preference'] as const) test(`both film controls pause and resume with ${reducedMotion}`,async({page})=>{
  await page.emulateMedia({reducedMotion});
  for(const [id,name] of [['flow','film'],['leu','Leu film']] as const) {
    await selectWorkProject(page, id);
    const media=page.locator('[data-stage-frame] video');
    await expect(media).toHaveCount(1);
    await media.scrollIntoViewIfNeeded();
    if(reducedMotion==='reduce') {
      await expect(media).toHaveJSProperty('paused',true);
      await page.locator('[data-stage-caption]').getByRole('button',{name:`Play ${name}`,exact:true}).click();
    }
    await expect(media).toHaveJSProperty('paused',false);
    await page.locator('[data-stage-caption]').getByRole('button',{name:`Pause ${name}`,exact:true}).click();
    await expect(media).toHaveJSProperty('paused',true);
    await page.evaluate(()=>{document.dispatchEvent(new Event('visibilitychange'));});
    await expect(media).toHaveJSProperty('paused',true);
    await page.locator('[data-stage-caption]').getByRole('button',{name:`Play ${name}`,exact:true}).click();
    await expect(media).toHaveJSProperty('paused',false);
  }
});
test('all work themes pass axe and Leu caption control pauses',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  for(const id of ['second-voice','f24','flow','leu'] as const) {
    await selectWorkProject(page, id); await page.waitForTimeout(850);
    expect((await new AxeBuilder({page}).analyze()).violations.map(v=>v.id)).toEqual([]);
  }
  await expect(page.locator('[data-stage-frame] video')).toHaveCount(1);
  await page.locator('video').scrollIntoViewIfNeeded();
  const button=page.locator('[data-stage-caption]').getByRole('button',{name:'Play Leu film'});
  await button.click(); await expect(page.locator('video')).toHaveJSProperty('paused',false);
  await page.getByRole('button',{name:'Pause Leu film'}).click(); await expect(page.locator('video')).toHaveJSProperty('paused',true);
});
test('all question-plan quotes validate against rendered sources',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  const sources=await page.locator('[data-ask-id]').evaluateAll(nodes=>Object.fromEntries(nodes.map(e=>[(e as HTMLElement).dataset.askId,(e as HTMLElement).innerText])));
  const steps=[...plans.areas.flatMap(a=>a.steps),...Object.values(plans.freeQuestionPlans).flat()];
  expect(steps.filter(step=>!validateStep(step,sources[step.source]??''))).toEqual([]);
});
test('section headings have identical type metrics',async({page})=>{
  const styles=await page.locator('#work h2, footer h2').evaluateAll(nodes=>nodes.map(e=>{const s=getComputedStyle(e);return [s.fontSize,s.fontWeight,s.lineHeight];}));
  expect(styles[0]).toEqual(styles[1]);
});
test('200 percent layout has no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:720,height:450});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
