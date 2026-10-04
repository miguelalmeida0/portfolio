import { expect, test } from '@playwright/test';
import { openPortfolioHome, selectWorkProject } from '../helpers/portfolio';

const sizes = [[1440, 1000], [1280, 900], [1100, 900], [834, 1112], [390, 844]];

for (const [width, height] of sizes) test(`selected media stays within its frame at ${width}x${height}`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openPortfolioHome(page);
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('Miguel Almeida — Frontend developer & design engineer');
  const frames: Record<string, unknown> = {};
  for (const slug of ['f24', 'leu', 'flow'] as const) {
    const stage = await selectWorkProject(page, slug);
    const frame = stage.locator('[data-stage-frame]');
    await frame.scrollIntoViewIfNeeded();
    await expect(stage.locator('[data-stage-caption]')).toBeVisible();
    const media = stage.locator(slug === 'f24' ? 'img' : 'video');
    if (slug === 'f24') {
      await expect(media).toHaveAttribute('src', '/projects/f24/hackathon.webp');
      await expect.poll(() => media.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    } else {
      await expect.poll(() => media.evaluate(el => (el as HTMLVideoElement).videoWidth)).toBeGreaterThan(0);
      await expect(media).toHaveCSS('object-fit', 'contain');
      await expect(media).not.toHaveAttribute('controls');
      await expect.poll(() => media.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
    }
    const geometry = () => media.evaluate(el => {
      const r = el.getBoundingClientRect();
      const frame = el.closest('[data-stage-frame]')!.getBoundingClientRect();
      const css = getComputedStyle(el);
      return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height,
        left: r.left - frame.left, top: r.top - frame.top,
        right: frame.right - r.right, bottom: frame.bottom - r.bottom,
        transform: css.transform, filter: css.filter };
    });
    const before = await geometry();
    for (const gap of [before.left, before.top, before.right, before.bottom]) expect(gap).toBeGreaterThanOrEqual(-1);
    expect(before.width).toBeGreaterThan(0);
    expect(before.height).toBeGreaterThan(0);
    expect(before.transform).toBe('none');
    expect(before.filter).toBe('none');
    await media.hover();
    expect(await geometry()).toEqual(before);
    frames[slug] = before;
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
  await testInfo.attach('selected-media-geometry', { body: JSON.stringify(frames, null, 2), contentType: 'application/json' });
});

test('reduced motion keeps each selected film paused on its poster', async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolioHome(page);
  for (const slug of ['leu', 'flow'] as const) {
    const stage = await selectWorkProject(page, slug);
    const video = stage.locator('video');
    await video.scrollIntoViewIfNeeded();
    await expect(video).not.toHaveAttribute('autoplay');
    await expect(video).toHaveJSProperty('paused', true);
    await expect(video).toHaveJSProperty('currentTime', 0);
    const poster = await video.getAttribute('poster');
    expect(poster).toBeTruthy();
    expect((await request.get(poster!)).ok()).toBe(true);
    await page.waitForTimeout(500);
    await expect(video).toHaveJSProperty('currentTime', 0);
    await expect(stage.getByRole('button', { name: /^Play/ })).toBeVisible();
  }
});

test('autoplay rejection keeps valid native posters and an explicit Play control', async ({ page, request }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Autoplay rejected for this test', 'NotAllowedError'));
    Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', { configurable: true, get: () => false, set: () => undefined });
    const original = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (this instanceof HTMLVideoElement && name === 'autoplay') return;
      original.call(this, name, value);
    };
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openPortfolioHome(page);
  for (const slug of ['leu', 'flow'] as const) {
    const stage = await selectWorkProject(page, slug);
    const video = stage.locator('video');
    await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty('paused', true);
    const poster = await video.getAttribute('poster');
    expect(poster).toBeTruthy();
    expect((await request.get(poster!)).ok()).toBe(true);
    await expect(stage.getByRole('button', { name: /^Play/ })).toBeVisible();
  }
  expect(errors).toEqual([]);
});
