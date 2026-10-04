import { expect, test } from '@playwright/test';

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
  await page.goto('/work/leu');
  await expect(page.locator('video')).not.toHaveAttribute('src', /.+/);
  await page.getByRole('button', { name: /Play.*film/i }).click();
  await expect(page.locator('video')).toHaveAttribute('src', /.+/);
});

test('case studies expose their contribution, stack and architecture', async ({ page }) => {
  for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
    await page.goto('/work/' + slug);
    const header = page.locator('main header').first();
    await expect(header.locator('h1')).toBeVisible();
    await expect(header.locator('[data-project-stack], .stack')).toHaveText(/\S/);
    await expect(header.locator('p').first()).toHaveText(/\S/);
    const architecture = page.locator('#architecture');
    await expect(architecture.locator('h2')).toBeVisible();
    expect(await architecture.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('main h1')!) & Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
    if (slug === 'f24') {
      await expect(page.locator('#product-impact')).toContainText('thousands of companies');
      await expect(page.locator('#production-decision')).toContainText('Tradeoff');
    } else if (slug === 'second-voice-ai') {
      await expect(page.locator('#writing-demo')).toBeVisible();
    } else {
      await expect(page.locator('main video')).toBeVisible();
    }
  }
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ')).toContain('Frontend developer & design engineer');
});
