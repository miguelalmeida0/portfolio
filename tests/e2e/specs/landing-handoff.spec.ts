import { expect, test } from '../fixtures';
import sharp from 'sharp';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });
const viewports = [[1920,963],[1440,900],[1366,768],[1280,800],[1024,768],[834,1112],[430,932],[393,852],[390,844]];

async function holdIntro(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof original>) {
      const animation = original.apply(this, args);
      if (this.matches('[data-intro-backdrop]') && animation.effect!.getTiming().duration === 3600) {
        animation.pause();
        animation.currentTime = 0;
      }
      return animation;
    };
  });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await expect(page.locator('[data-pixel-intro]')).toHaveAttribute('data-stage', 'approach');
}
async function seek(page: import('@playwright/test').Page, ms: number) {
  await page.locator('[data-intro-backdrop]').evaluate((el, time) => {
    const animation = el.getAnimations()[0];
    animation.currentTime = Math.min(time, 3600);
    if (time > 3600) animation.play();
  }, ms);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test.describe('portrait pixels at CSS scale', () => {
  // This contract was authored at one image pixel per CSS pixel. Use the fixture
  // directly; contextOptions cannot override a project's deviceScaleFactor.
  // The resize contracts below retain each project's native device density.
  test.use({ deviceScaleFactor: 1 });
  for (const [width, height] of viewports) {
    test(`portrait handoff at ${width}x${height}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height });
      await holdIntro(page);
      const initial = (await page.locator('[data-landing-target]').boundingBox())!;
      await seek(page, 3550);
      const final = (await page.locator('[data-intro-card]').boundingBox())!;
      for (const key of ['x','y','width','height'] as const) expect(Math.abs(initial[key] - final[key])).toBeLessThanOrEqual(1);
      await expect(page.locator('[data-intro-photo]')).toHaveCSS('opacity', '1');
      await expect(page.locator('[data-landing-target] img')).toHaveCSS('visibility', 'hidden');
      expect(await page.locator('[data-intro-photo]').evaluate((el: HTMLImageElement) => el.currentSrc))
        .toBe(await page.locator('[data-landing-target] img').evaluate((el: HTMLImageElement) => el.currentSrc));
      const before = await page.screenshot();
      await seek(page, 3610);
      await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
      await expect(page.locator('[data-landing-target] img')).toHaveCSS('visibility', 'visible');
      const after = await page.screenshot();
      await testInfo.attach('portrait-before-handoff', { body: before, contentType: 'image/png' });
      await testInfo.attach('portrait-after-handoff', { body: after, contentType: 'image/png' });
      // Keep the crop in the screenshot's pixel coordinates.
      const scale = (await sharp(before).metadata()).width! / page.viewportSize()!.width;
      const clip = { left: Math.round(initial.x * scale), top: Math.round(initial.y * scale), width: Math.round(initial.width * scale), height: Math.round(initial.height * scale) };
      const a = await sharp(before).extract(clip).ensureAlpha().raw().toBuffer();
      const b = await sharp(after).extract(clip).ensureAlpha().raw().toBuffer();
      let sum = 0, maximum = 0;
      for (let i = 0; i < a.length; i++) { const delta = Math.abs(a[i] - b[i]); sum += delta; maximum = Math.max(maximum, delta); }
      // Fixed-layer versus page-layer alpha rasterization can differ by a few
      // edge values. This bound rejects a shifted image or a visible material cut.
      expect(sum / a.length, JSON.stringify({ initial, final, mean: sum / a.length, maximum })).toBeLessThan(.02); // < 0.008% of the channel range.
      expect(maximum).toBeLessThanOrEqual(16);
    });
  }
});

for (const [start, end] of [[[1440,900],[390,844]],[[390,844],[1440,900]]]) {
  test(`resize retargets from ${start[0]} to ${end[0]} without replaying`, async ({ page }) => {
    await page.setViewportSize({ width: start[0], height: start[1] });
    await holdIntro(page);
    await seek(page, 2800);
    await page.setViewportSize({ width: end[0], height: end[1] });
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(1);
    await seek(page, 3550);
    const live = (await page.locator('[data-landing-target]').boundingBox())!;
    const overlay = (await page.locator('[data-intro-card]').boundingBox())!;
    for (const key of ['x','y','width','height'] as const) expect(Math.abs(live[key] - overlay[key])).toBeLessThanOrEqual(1);
    await seek(page, 3610);
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
    await expect(page.locator('[data-landing-target] img')).toHaveCSS('visibility', 'visible');
  });
}
