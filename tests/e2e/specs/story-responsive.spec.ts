import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const active = '[data-story-section][data-current]';
for (const width of [390, 834, 1024]) test(`inline Story scenes, controls and completion at ${width}px`, async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({width, height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/story');
  for (let i=0; i<8; i++) {
    const section = page.locator('[data-story-section]').nth(i);
    await expect(section).toHaveAttribute('data-current');
    const panel = section.locator('[data-story-panel]');
    expect((await panel.boundingBox())!.height).toBe(420);
    await section.locator('[data-story-action="0"]').click();
    const boxes = await panel.evaluate(element => {
      const scene = element.querySelector('[data-story-scene][data-active]')!.getBoundingClientRect();
      const controls = element.querySelector('.scene-controls')!.getBoundingClientRect();
      const caption = element.querySelector('.scene-caption')!.getBoundingClientRect();
      return { sceneBottom:scene.bottom, sceneTop:scene.top, controlsTop:controls.top, captionBottom:caption.bottom };
    });
    expect(boxes.sceneBottom).toBeLessThanOrEqual(boxes.controlsTop - 4);
    expect(boxes.sceneTop).toBeGreaterThanOrEqual(boxes.captionBottom + 4);
    expect(await panel.locator('[data-story-scene]').evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) await panel.screenshot({path:`.cache/story-mobile-scene-${i}.png`});
    await section.locator('[data-story-next]').click();
  }
  await expect(page.locator('[data-story-progress]')).toHaveText('All 8 answered');
  await expect(page.locator('.mobile-summary .short-version')).toHaveClass(/complete/);
  await page.locator('[data-story-copy]').scrollIntoViewIfNeeded();
  await page.screenshot({path:`.cache/story-end-${width}.png`});
  expect((await new AxeBuilder({page}).include('.story-split').analyze()).violations).toEqual([]);
  await page.locator(`${active} [data-story-back]`).click();
  await expect(page.locator('[data-story-ring][data-complete]')).toHaveCount(0);
});

test('actions cancel earlier timers; revisiting does not replay; clipboard failures stay truthful', async ({page}) => {
  await page.setViewportSize({width:1440,height:1020});
  await page.goto('/story');
  for(let i=0;i<3;i++) { await page.locator(`${active} [data-story-next]`).click(); await page.waitForTimeout(650); }
  await page.locator('[data-story-action="0"]').click();
  await page.waitForTimeout(450);
  await page.locator('[data-story-action="1"]').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('[data-story-scene="f24"]')).toContainText('No active alarms.');
  await page.locator(`${active} [data-story-next]`).click();
  await page.waitForTimeout(650);
  await page.locator(`${active} [data-story-back]`).click();
  await page.waitForTimeout(3000);
  await expect(page.locator('[data-story-scene="f24"]')).toContainText('No active alarms.');
  await page.locator('.story-ending').evaluate(element => window.scrollTo({top:scrollY + element.getBoundingClientRect().top - 96,behavior:'instant'}));
  await expect(page.locator('[data-story-ring][data-complete]')).toHaveCount(1);
  await page.evaluate(() => Object.defineProperty(navigator.clipboard,'writeText',{value:async()=>{throw new Error('denied')}}));
  await page.locator('[data-story-copy]').click();
  await expect(page.locator('[data-story-copy]')).toHaveText('Couldn’t copy — select the text');
});

test('reduced motion manual actions show end states without animations', async ({page}) => {
  await page.setViewportSize({width:1440,height:1020});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/story');
  for(let i=0;i<8;i++) {
    await page.locator('[data-story-action="0"]').click();
    expect(await page.locator('.story-split').evaluate(element => element.getAnimations({subtree:true}).length)).toBe(0);
    await page.locator(`${active} [data-story-next]`).click();
  }
  await expect(page.locator('.short-version')).toHaveClass(/complete/);
  expect(await page.locator('.story-split').evaluate(element => element.getAnimations({subtree:true}).length)).toBe(0);
});

test('manual scene interactions cancel pending automatic changes', async ({page}) => {
  await page.setViewportSize({width:1440,height:1020});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/story');
  for(let i=0;i<6;i++) {
    await expect(page.locator('[data-story-section]').nth(i)).toHaveAttribute('data-current');
    await page.locator(`${active} [data-story-next]`).click();
  }
  await expect(page.locator('[data-story-scene="love"]')).toHaveAttribute('data-active');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('[data-story-action="0"]').click();
  await page.waitForTimeout(200);
  await page.locator('.request-line button').nth(1).hover();
  await page.waitForTimeout(1700);
  await expect(page.locator('.request-explanation')).toContainText('DNS turns a name into an address');
  await expect(page.locator('.request-card .scene-pill')).toHaveText('ready');
  await expect(page.locator('.request-line')).not.toHaveClass(/running/);
});

for(const width of [1440,390]) test(`F24 photo fills its rounded frame and stays an internal link at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1020});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#work');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.locator('.project-index button').nth(1).click();
  const frame=page.locator('.photo-link');
  await expect(frame).toBeVisible();
  await expect(frame).not.toHaveAttribute('target','_blank');
  const bounds=await frame.evaluate(element=>{
    const image=element.querySelector('img')!;
    const a=element.getBoundingClientRect(),b=image.getBoundingClientRect();
    return {width:a.width,height:a.height,imgWidth:b.width,imgHeight:b.height,fit:getComputedStyle(image).objectFit,radius:getComputedStyle(element).borderRadius};
  });
  expect(bounds.imgWidth).toBe(bounds.width);expect(bounds.imgHeight).toBe(bounds.height);
  expect(bounds.fit).toBe('cover');expect(bounds.radius).toBe('12px');
  await frame.click();
  await expect(page).toHaveURL(/\/work\/f24/);
});
