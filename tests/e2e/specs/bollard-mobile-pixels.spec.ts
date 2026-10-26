import {test,expect} from '@playwright/test';
import {PNG} from 'pngjs';
for(const reducedMotion of ['reduce','no-preference'] as const)test(`mobile Bollard paints its story with ${reducedMotion} and rejected native play`,async({page},testInfo)=>{
 await page.setViewportSize({width:393,height:637});await page.emulateMedia({reducedMotion});
 await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'));};});
 await page.goto('/#bollard');const shot=page.locator('#bollard .project-shot');await shot.scrollIntoViewIfNeeded();
 const before=PNG.sync.read(await shot.screenshot());
 await expect.poll(async()=>{const after=PNG.sync.read(await shot.screenshot());let changed=0;for(let i=0;i<before.data.length;i+=4)if(Math.abs(before.data[i]-after.data[i])+Math.abs(before.data[i+1]-after.data[i+1])+Math.abs(before.data[i+2]-after.data[i+2])>30)changed++;return changed/(before.width*before.height);},{timeout:6500,intervals:[400,600,800]}).toBeGreaterThan(.04);
 await shot.screenshot({path:testInfo.outputPath(`bollard-${reducedMotion}.png`)});
});
test('project DOM and index follow the requested order and F24 uses the working photo',async({page})=>{
 await page.goto('/');const ids=['f24','second-voice','leu','needle','bollard'];
 expect(await page.locator('.project').evaluateAll(nodes=>nodes.map(n=>n.id))).toEqual(ids);
 expect(await page.locator('[data-project]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-controls')))).toEqual(ids);
 await expect(page.locator('#f24 .project-cover')).toHaveAttribute('src','/projects/f24/hackathon-working.webp');await expect(page.locator('#f24 .project-scene')).toHaveCount(0);
});
for(const reducedMotion of ['reduce','no-preference'] as const)test(`mobile Bollard ${reducedMotion} respects pause, lifecycle and authored seek beats`,async({page})=>{
 await page.setViewportSize({width:393,height:637});await page.emulateMedia({reducedMotion});await page.goto('/#bollard');
 const canvas=page.locator('#bollard-mobile-film'),shot=page.locator('#bollard .project-shot'),toggle=page.locator('[data-bollard-toggle]');await shot.scrollIntoViewIfNeeded();await expect(canvas).toHaveAttribute('data-film-playing','true');
 await toggle.click();await expect(canvas).toBeHidden();const paused=await canvas.getAttribute('data-film-time');await page.waitForTimeout(180);expect(await canvas.getAttribute('data-film-time')).toBe(paused);
 await page.locator('[data-bollard-seek="0.8"]').click();await expect(canvas).toBeVisible();expect(Number(await canvas.getAttribute('data-film-time'))).toBeGreaterThanOrEqual(.8);expect(Number(await canvas.getAttribute('data-film-time'))).toBeLessThan(1.5);
 await page.locator('[data-bollard-seek="2.5"]').click();expect(Number(await canvas.getAttribute('data-film-time'))).toBeGreaterThanOrEqual(2.5);expect(Number(await canvas.getAttribute('data-film-time'))).toBeLessThan(3.3);
 const global=page.locator('[data-film-toggle]');await global.click();await expect(canvas).toHaveAttribute('data-film-playing','false');await page.locator('[data-bollard-seek="0.8"]').click();await expect(canvas).toBeHidden();await global.click();await shot.scrollIntoViewIfNeeded();await expect(canvas).toHaveAttribute('data-film-playing','true');
 await shot.click();await expect(page.getByRole('dialog')).toBeVisible();await expect(canvas).toHaveAttribute('data-film-playing','false');await page.keyboard.press('Escape');await expect(canvas).toHaveAttribute('data-film-playing','true');
 await page.locator('#f24').scrollIntoViewIfNeeded();await expect(canvas).toHaveAttribute('data-film-playing','false');await shot.scrollIntoViewIfNeeded();await expect(canvas).toHaveAttribute('data-film-playing','true');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await expect(canvas).toHaveAttribute('data-film-playing','false');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});await expect(canvas).toHaveAttribute('data-film-playing','true');
 await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true})));const hidden=await canvas.getAttribute('data-film-time');await page.waitForTimeout(180);expect(await canvas.getAttribute('data-film-time')).toBe(hidden);await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true})));await expect.poll(()=>canvas.getAttribute('data-film-time')).not.toBe(hidden);
 await page.setViewportSize({width:1440,height:900});await expect(canvas).toBeHidden();await page.setViewportSize({width:393,height:637});await shot.scrollIntoViewIfNeeded();await expect(canvas).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
