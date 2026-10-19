import { expect, test } from '@playwright/test';

const base = '/hero-lab/typographic';

test('Story introduces Miguel through a real team image and keyboard-readable chapters', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/story`);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#story-title')).toContainText('Curious by nature.');
  const photo = page.locator('.story-photo img');
  await expect.poll(() => photo.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const tabs = page.getByRole('tab');
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toHaveCount(1);
  await expect(page.getByRole('tabpanel').locator('.s-copy p')).toHaveCount(2);
  await page.keyboard.press('End');
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Berlin');
  await page.keyboard.press('Home');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[data-reader-section="story"]')).toHaveCount(8);
  await page.locator('#story-ux').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});

test('CV keeps the PDF actions visible and reduced motion removes reading transforms', async ({ page }) => {
  await page.goto(`${base}/cv`);
  await expect(page.locator('[data-cv-action]').first()).toBeInViewport();
  await expect.poll(() => page.locator('[data-reader-head="cv"]').count()).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-reader-head]')).toHaveCount(0);
  await expect(page.locator('[data-reader-held]')).toHaveCount(0);
  await expect(page.locator('[data-cv-action]').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
});

for (const slug of ['f24', 'needle', 'second-voice', 'leu', 'flow']) {
  test(`${slug} gives editorial chapters motion without transforming product controls`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/work/${slug}`);
    const head = page.locator('[data-reader-head="case"]').first();
    await expect(head).toBeAttached();
    await head.scrollIntoViewIfNeeded();
    await expect(page.locator('[data-typographic-case] .pin-spacer')).toHaveCount(0);
    await expect(page.locator('button[data-reader-head], video[data-reader-head], canvas[data-reader-head]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const control = page.locator('[data-reader-section="case"] button:visible').first();
    if (await control.count()) { await control.focus(); await expect(control).toBeFocused(); }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('[data-reader-head]')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
