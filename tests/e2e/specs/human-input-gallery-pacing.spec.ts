import { expect, test } from '@playwright/test';

type GalleryTrigger = { start: number; end: number };
async function readGallery(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const api = (window as Window & { ScrollTrigger?: { getById(id: string): GalleryTrigger | undefined } }).ScrollTrigger;
    const trigger = api?.getById('human-gallery');
    return trigger ? { start: trigger.start, end: trigger.end, travel: trigger.end - trigger.start } : null;
  });
}

test('desktop wheel scrolling gives every project a longer uninterrupted reading interval', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect.poll(async () => (await readGallery(page))?.travel ?? 0).toBeGreaterThanOrEqual(6300);
  const trigger = await readGallery(page);
  expect(trigger).not.toBeNull();

  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), trigger!.start);
  await page.waitForTimeout(300);
  await page.mouse.move(400, 500);
  await page.mouse.wheel(0, 850);
  await page.waitForTimeout(1000);

  // A strong wheel gesture must not immediately replace the first project.
  await expect(page.getByRole('button', { name: 'F24', exact: true })).toHaveAttribute('aria-current', 'true');
  await page.mouse.wheel(0, 850);
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(trigger!.start + 1400);
  await expect(page.getByRole('button', { name: 'Second Voice', exact: true })).toHaveAttribute('aria-current', 'true');

  // Explicit project selection still works across the longer span.
  await page.getByRole('button', { name: 'Needle', exact: true }).click();
  await expect.poll(async () => page.getByRole('button', { name: 'Needle', exact: true }).getAttribute('aria-current')).toBe('true');
  await expect(page.locator('#needle')).toBeInViewport({ ratio: 0.15 });
  expect(errors).toEqual([]);
});

test('compact laptop preserves horizontal transitions and shorter pages can still reach the footer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect.poll(async () => (await readGallery(page))?.travel ?? 0).toBeGreaterThanOrEqual(4900);
  await expect(page.locator('body')).toHaveClass(/gallery-is-horizontal/);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('.human-contact')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

for (const scenario of [
  { width: 390, height: 844, motion: 'no-preference' as const },
  { width: 1440, height: 900, motion: 'reduce' as const }
]) {
  test(scenario.width + 'px ' + scenario.motion + ' keeps native project flow', async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    await page.emulateMedia({ reducedMotion: scenario.motion });
    await page.goto('/');
    await expect.poll(async () => page.evaluate(() => Boolean((window as Window & { motionEnabled?: boolean }).motionEnabled))).toBe(false);
    expect(await readGallery(page)).toBeNull();
    await expect(page.locator('body')).not.toHaveClass(/gallery-is-horizontal/);
    await page.locator('#f24').scrollIntoViewIfNeeded();
    await expect(page.locator('#f24')).toBeInViewport();
    await page.locator('#leu').scrollIntoViewIfNeeded();
    await expect(page.locator('#leu')).toBeInViewport();
  });
}
