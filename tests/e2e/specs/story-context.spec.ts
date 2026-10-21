import { expect, test } from '@playwright/test';

test('CV uses a page heading and metrics remain readable without assistant controls', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experience.');
  await expect(page.locator('.c-highlights [data-count]').first()).toHaveText('2,000+');
  await expect(page.locator('.c-highlights')).toContainText('within the shared frontend suite');
  await expect(page.locator('[data-ask-id], .metric-ask, [data-ask-panel]')).toHaveCount(0);
  const popup = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open CV PDF', exact: true }).click();
  await expect(await popup).toHaveURL(/\/cv\/pdf$/);
});

for (const width of [1440, 390]) {
  test(`Story chapters work with pointer and keyboard at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/story');
    await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
    const tabs = page.getByRole('tablist', { name: 'Career journey' }).getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await expect(page.getByRole('tabpanel')).toContainText('My first career was in aviation');
    await tabs.nth(1).click();
    await expect(page.getByRole('tabpanel')).toContainText('Studying UX design');
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText("React");
    await expect(page.locator('[data-ask-trigger]')).toHaveCount(0);
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
