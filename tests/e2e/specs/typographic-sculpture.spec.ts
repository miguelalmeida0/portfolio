import { expect, test } from '@playwright/test';
const home = '/hero-lab/typographic';

// The owner retired the sculpted lettering in favour of the original editorial type.
for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`editorial headline uses a plain backdrop (${reducedMotion})`, async ({ page }) => {
    const errors: string[] = [], sculptureRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.url().includes('/models/inflated-type')) sculptureRequests.push(request.url());
    });
    await page.emulateMedia({ reducedMotion });
    await page.goto(home);
    await expect(page.locator('[data-lab-root]')).toHaveAttribute('data-lab-ready', '');
    await expect(page.locator('.hero-setting')).toHaveCount(0);
    await expect(page.locator('img[src*="typographic-chamber"]')).toHaveCount(0);
    await expect(page.locator('[data-back-word=left]')).toHaveText('Frontend');
    await expect(page.locator('[data-back-word=right]')).toHaveText('Engineer');
    await expect(page.locator('[data-back-word=left]')).toHaveCSS('font-family', /Lab Antonio/);
    await expect(page.locator('.type-sculpture, [data-sculpted]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /hero motion/ })).toHaveCount(0);
    await expect(page.locator('[data-portrait-surface] picture')).toHaveCSS('opacity', '1');
    await page.locator('[data-mast] [data-ask-trigger]').click();
    await expect(page.locator('[data-portrait-surface] picture')).toHaveCSS('opacity', '1');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect(sculptureRequests).toEqual([]);
    expect(errors).toEqual([]);
  });
}
