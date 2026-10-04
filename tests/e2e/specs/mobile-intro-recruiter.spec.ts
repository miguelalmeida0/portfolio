import { expect, test } from '@playwright/test';
import { recoveredCases } from '../helpers/case-studies';
import { selectWorkProject } from '../helpers/portfolio';

// Entry coverage lives in landing.spec.ts; retain the unrelated media/content checks.
test('reduced motion shows real posters without decorative video requests', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const videos: string[] = [];
  page.on('request', req => { if (/\.(mp4|webm)(?:\?|$)/.test(req.url())) videos.push(req.url()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  for (const video of await page.locator('video').all()) {
    await expect(video).not.toHaveAttribute('src', /.+/);
    await expect(video).toHaveAttribute('preload', 'none');
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  }
  expect(videos).toEqual([]);
  await selectWorkProject(page, 'leu');
  const film = page.locator('#work video');
  await expect(film).not.toHaveAttribute('src', /.+/);
  await expect(page.locator('#work img[src*="poster"]')).toBeVisible();
  expect(videos).toEqual([]);
});

test('case studies expose contribution, implementation and working models', async ({ page }) => {
  for (const study of recoveredCases) {
    await page.goto('/work/' + study.slug);
    await expect(page.locator('main h1')).toHaveText(study.heading);
    await expect(page.locator(`${study.root} #overview .sub`)).toHaveText(/\S/);
    await expect(page.locator(study.architecture).locator('h2')).toHaveText(study.architectureHeading);
    await expect(page.locator('#try button').first()).toBeVisible();
    for (const id of study.sections) await expect(page.locator(`${study.root} #${id}`)).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ')).toContain('Frontend developer & design engineer');
});
