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

test('case studies expose ownership and hero media immediately before architecture', async ({ page }) => {
  for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
    await page.goto('/work/' + slug);
    await expect(page.locator('main .role-label')).toBeVisible();
    await expect(page.locator('main header [data-project-stack]')).toBeVisible();
    if (slug === 'f24') {
      await expect(page.locator('#product-purpose')).toHaveText('What the product is');
      await expect(page.locator('#production-decision')).toContainText('Tradeoff');
      expect(await page.locator('#architecture').evaluate(el => el.previousElementSibling?.tagName)).toBe('HEADER');
    } else {
      expect(await page.locator('#architecture').evaluate(architecture => {
        const media = document.querySelector('main video, main figure');
        return !!media && !!(architecture.compareDocumentPosition(media) & Node.DOCUMENT_POSITION_PRECEDING);
      })).toBe(true);
    }
  }
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.join(' ')).toContain('Frontend engineer & design engineer');
});
