import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.env.MOTION_URL||'http://127.0.0.1:4398';
const out='artifacts/portfolio-corrections/fade';
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const results=[];
try {
  for(const width of [1440,390]) for(const reducedMotion of ['no-preference','reduce']) {
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion,isMobile:width<500,hasTouch:width<500,recordVideo:{dir:out,size:{width,height:900}}});
    await context.addInitScript(()=>{
      sessionStorage.setItem('seen-intro','true');
      window.__routeFrames=[];
      const sample=()=>{
        for(const animation of document.getAnimations()) {
          if(animation.animationName?.includes('view-transition')||animation.animationName?.startsWith('route-fade')) {
            window.__routeFrames.push({name:animation.animationName,frames:animation.effect.getKeyframes()});
          }
        }
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const slug of ['f24','second-voice','needle','leu','flow']) {
      await page.goto(base+'/work/'+slug);await page.waitForTimeout(800);
      const next=page.getByRole('navigation',{name:'Next project',exact:true}).getByRole('link');
      await next.scrollIntoViewIfNeeded();await page.waitForTimeout(800);
      await page.evaluate(()=>document.addEventListener('click',()=>{window.__departureY=scrollY;},{once:true,capture:true}));
      await next.click();await page.waitForTimeout(800);
      const y=await page.evaluate(()=>window.__departureY);
      assert.ok(await page.evaluate(()=>scrollY<2));
      const frames=await page.evaluate(()=>window.__routeFrames);
      assert.ok(!frames.some(f=>f.name.includes('project-identity')),'title must never fly');
      if(reducedMotion==='no-preference') {
        const fade=frames.find(f=>f.name==='route-fade-in');
        assert.ok(fade,'incoming page should fade');
        assert.ok(fade.frames.every(f=>!f.transform||f.transform==='none'));
        assert.equal(fade.frames[0].opacity,'0');assert.equal(fade.frames.at(-1).opacity,'1');
      } else assert.equal(frames.length,0);
      await page.goBack();await page.waitForTimeout(800);
      const restored=await page.evaluate(()=>scrollY);
      assert.ok(Math.abs(restored-y)<5,`${width} ${reducedMotion} ${slug}: history ${y} -> ${restored}`);
      results.push({width,reducedMotion,slug,animations:[...new Set(frames.map(f=>f.name))]});
    }
    assert.deepEqual(errors,[]);await context.close();
  }
  await writeFile(out+'/results.json',JSON.stringify(results,null,2));
  console.log(`${results.length} fade, reduced-motion and navigation checks passed.`);
} finally {await browser.close();}
