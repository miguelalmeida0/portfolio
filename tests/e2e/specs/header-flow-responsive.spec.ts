import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPortfolioHome } from '../helpers/portfolio';

test('identity and navigation never overlap while resizing shared routes', async ({page}) => {
  test.setTimeout(60000);
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  for(const route of ['/#top','/story','/work/flow']) {
    await page.goto(route);
    await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
    await page.evaluate(()=>document.fonts.ready);
    for(const width of [1440,1279,1100,1024,1023,900,834,800,768,767,720,650,550,430,390,375,320]) {
      await page.setViewportSize({width,height:1020});
      const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});
      const menu=page.locator('.menu-toggle');
      if(width<1024) {await expect(nav).toBeHidden();await expect(menu).toBeVisible();}
      else {await expect(nav).toBeVisible();await expect(menu).toBeHidden();}
      const identity=await page.locator('[data-identity-home]').boundingBox();
      const control=await (width<1024?menu:nav).boundingBox();
      expect(control!.x-identity!.x-identity!.width,`${route} at ${width}`).toBeGreaterThanOrEqual(15);
      expect(control!.x+control!.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(route==='/#top'&&[834,1024,390].includes(width)) await page.screenshot({path:`/tmp/portfolio-header-${width}.png`});
    }
  }
  expect(errors).toEqual([]);
});

test('tablet burger navigates in the same tab and restores focus when resized',async({page,context})=>{
  await page.setViewportSize({width:834,height:1112});
  await openPortfolioHome(page);
  const pages=context.pages().length;
  const menu=page.locator('.menu-toggle');
  await menu.click();
  await expect(page.locator('#mobile-navigation a')).toHaveText(['Work','Story','CV','Contact']);
  expect((await new AxeBuilder({page}).include('header.wind-header').analyze()).violations).toEqual([]);
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Story',exact:true}).click();
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('.story-split')).toBeVisible();
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase','idle');
  expect(context.pages()).toHaveLength(pages);
  await menu.click();
  await page.locator('#mobile-navigation a').first().focus();
  await page.setViewportSize({width:1024,height:768});
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('[data-identity-home]')).toBeFocused();
  await page.setViewportSize({width:834,height:1112});
  await menu.click();await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();await expect(menu).toHaveAttribute('aria-expanded','false');
});

test('Flow shows its full native video frame across small screens and remains clickable',async({page,context})=>{
  await page.setViewportSize({width:390,height:844});
  await openPortfolioHome(page);
  await page.locator('.project-index button').nth(2).click();
  const stage=page.locator('.stage[data-project="flow"]');
  const video=stage.locator('video');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(()=>video.evaluate(element=>(element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  const media=await video.evaluate(element=>{const v=element as HTMLVideoElement;return{w:v.videoWidth,h:v.videoHeight,muted:v.muted,loop:v.loop,inline:v.playsInline,src:v.currentSrc}});
  expect(media).toMatchObject({w:1920,h:1080,muted:true,loop:true,inline:true});
  expect(media.src).toContain('flow-loop-web-final.mp4');
  for(const width of [1099,1024,834,768,767,650,550,430,390,375,320]) {
    await page.setViewportSize({width,height:844});
    const box=(await video.boundingBox())!;
    expect(Math.abs(box.width/box.height-media.w/media.h)).toBeLessThan(.005);
    expect(await video.evaluate(element=>getComputedStyle(element).objectFit)).toBe('contain');
    const caption=(await stage.locator('.caption').boundingBox())!;
    expect(box.y-caption.y-caption.height).toBeLessThan(16);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if([834,550,390].includes(width)) {
      await video.evaluate(element=>(element as HTMLVideoElement).pause());
      await stage.screenshot({path:`/tmp/portfolio-flow-${width}.png`});
    }
  }
  const count=context.pages().length;
  await stage.getByRole('link',{name:'View Flow case study'}).click();
  await expect(page).toHaveURL(/\/work\/flow$/);
  expect(context.pages()).toHaveLength(count);
});

test('desktop Flow and the other project frame dimensions are preserved',async({page})=>{
  await page.setViewportSize({width:1440,height:1020});
  await page.emulateMedia({reducedMotion:'reduce'});await openPortfolioHome(page);
  await page.locator('.project-index button').nth(2).click();
  expect((await page.locator('.stage .frame').boundingBox())!.height).toBe(560);
  expect(await page.locator('.stage video').evaluate(element=>getComputedStyle(element).objectFit)).toBe('cover');
  await page.setViewportSize({width:390,height:844});
  for(const index of [0,1,3]){
    await page.locator('.project-index button').nth(index).click();
    expect((await page.locator('.stage .frame').boundingBox())!.height).toBe(780);
  }
});
