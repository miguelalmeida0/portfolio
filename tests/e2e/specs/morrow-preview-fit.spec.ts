import { expect, test } from '@playwright/test';

test.use({ video: 'off' });

// A square gallery frame used to letterbox Morrow's widescreen film.
// Inspect the rendered frame against the media's declared native dimensions,
// so a change in the shared gallery layout cannot reintroduce those bands.
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 }
]) {
  test(`Morrow fills its preview without letterboxing at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const shot = page.locator('#morrow .project-shot');
    if (viewport.width > 767) await page.locator('.work-index [aria-controls="morrow"]').click();
    else await shot.scrollIntoViewIfNeeded();
    await expect(shot).toBeVisible();

    await expect.poll(() => shot.evaluate(element => {
      const video = element.querySelector('video')!;
      const poster = element.querySelector('img')!;
      const frame = element.getBoundingClientRect();
      const nativeRatio = Number(video.getAttribute('width')) / Number(video.getAttribute('height'));
      const dimensions = [video, poster].map(media => media.getBoundingClientRect());
      return Math.max(
        Math.abs(frame.height - frame.width / nativeRatio),
        ...dimensions.flatMap(rect => [Math.abs(rect.width - frame.width), Math.abs(rect.height - frame.height)])
      );
    })).toBeLessThan(1);
    await testInfo.attach(`morrow-preview-${viewport.width}`, {
      body: await page.screenshot(), contentType: 'image/png'
    });
  });
}
