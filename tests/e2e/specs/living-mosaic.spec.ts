import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

test('recruiter hero and four projects have the locked desktop hierarchy', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openPortfolioHome(page);
  await expect(page.getByText('F24 · 4 years in product delivery', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From scratch to hundreds of companies.', exact: true })).toBeVisible();
  await expect(page.locator('[aria-labelledby="intro-heading"]').getByRole('link', { name: 'View CV', exact: true })).toBeVisible();
  const layout = await page.evaluate(() => {
    const rect = (s: string) => document.querySelector(s)!.getBoundingClientRect().toJSON();
    return { work: rect('#work-title'), hero: rect('[aria-labelledby="intro-heading"]'), voice: rect('#project-second-voice-ai'), f24: rect('#project-f24'), leu: rect('#project-leu'), flow: rect('#project-flow'), contact: rect('#contact'), ids: [...document.querySelectorAll('[data-project]')].map(e => e.id) };
  });
  expect(layout.ids).toEqual(['project-second-voice-ai', 'project-f24', 'project-flow', 'project-leu']);
  expect(layout.work.y).toBeLessThan(800);
  expect(layout.work.y - layout.hero.bottom).toBe(88);
  expect(layout.voice.width).toBe(layout.flow.width);
  expect(layout.f24.width).toBe(layout.voice.width);
  expect(layout.leu.width).toBe(layout.voice.width);
  expect(layout.leu.x).toBe(layout.f24.x);
  expect(layout.f24.y - layout.voice.bottom).toBe(96);
  expect(layout.flow.y - layout.f24.bottom).toBe(80);
  expect(layout.leu.y - layout.flow.bottom).toBe(80);
  expect(layout.contact.y).toBeGreaterThan(layout.leu.bottom);
  await expect(page.locator('#experience a[href="/work/f24#activity-history"]')).toBeVisible();
  await expect(page.locator('[data-project-panel], #work a[href="/work/mirror-ai"], #work a[href="/work/vigia"]')).toHaveCount(0);
  for (const asset of ['/projects/f24/hackathon.webp', '/projects/leu/leu-loop-web.mp4', '/projects/flow/flow-loop-web-final.mp4']) expect((await request.head(asset)).status()).toBe(200);
});

test('hover and keyboard focus leave every project and media rectangle unchanged', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openPortfolioHome(page);
  const geometry = () => page.locator('[data-project], [data-project] .surface, [data-project] video, [data-project] img').evaluateAll(els => els.map(el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, transform: getComputedStyle(el).transform };
  }));
  const before = await geometry();
  for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
    const link = page.locator('#project-' + slug + ' .project-link');
    await link.hover();
    await page.waitForTimeout(600);
    expect(await geometry()).toEqual(before);
    await link.focus();
    await page.waitForTimeout(250);
    expect(await geometry()).toEqual(before);
  }
});

test('both videos start on load and advance together while below the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  // No pointer, keyboard, scroll, or play() call may unlock initial playback.
  await page.goto('/');
  await page.waitForTimeout(500);
  const times = () => page.locator('#work video').evaluateAll(vs => vs.map(v => (v as HTMLVideoElement).currentTime));
  const start = await times();
  expect(start).toHaveLength(2);
  start.forEach(time => expect(time).toBeGreaterThan(0));
  await page.waitForTimeout(1500);
  const later = await times();
  later.forEach((time, index) => expect(time).toBeGreaterThan(start[index]));
  for (const slug of ['leu', 'flow']) {
    const video = page.locator('#project-' + slug + ' video');
    expect(await video.evaluate(v => v.getBoundingClientRect().top)).toBeGreaterThan(1000);
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('preload', 'auto');
    await expect(video).toHaveAttribute('playsinline', '');
    expect(await video.evaluate(v => (v as HTMLVideoElement).muted && (v as HTMLVideoElement).loop)).toBe(true);
    const frame = () => video.evaluate(v => {
      const canvas = document.createElement('canvas');
      canvas.width = 320; canvas.height = 180;
      canvas.getContext('2d')!.drawImage(v as HTMLVideoElement, 0, 0, 320, 180);
      return canvas.toDataURL();
    });
    const first = await frame();
    await page.waitForTimeout(1500);
    expect(await frame()).not.toBe(first);
  }
  // Scrolling to either loop must neither pause nor restart the other.
  for (const slug of ['flow', 'leu']) {
    const before = await times();
    await page.locator('#project-' + slug).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const after = await times();
    after.forEach((time, index) => expect(time).toBeGreaterThan(before[index]));
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const slug of ['leu', 'flow']) {
    await expect(page.locator('#project-' + slug + ' img')).toHaveCSS('opacity', '1');
    expect(await page.locator('#project-' + slug + ' video').evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
  }
  const stopped = await times();
  await page.waitForTimeout(500);
  expect(await times()).toEqual(stopped);
});

test('tablet and phone preserve complete interactive studio and project order', async ({ page }) => {
  for (const width of [834, 390]) {
    await page.setViewportSize({ width, height: width === 834 ? 1112 : 844 });
    await openPortfolioHome(page);
    const rects = await page.locator('[data-project]').evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
    expect(rects[0].width).toBe(rects[3].width);
    expect(rects[1].y).toBeGreaterThan(rects[0].bottom);
    expect(rects[2].y).toBeGreaterThan(rects[1].bottom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.getByRole('radio')).toHaveCount(7);
    await page.locator('#project-f24 .project-link').click();
    await expect(page).toHaveURL(/\/work\/f24$/);
  }
});
