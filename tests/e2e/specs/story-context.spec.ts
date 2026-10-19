import { expect, test } from '@playwright/test';

test('CV uses a page heading and metrics open their grounded answer directly', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experience.');
  const metric = page.locator('[data-ask-id="cv-highlight-0"]');
  await expect(metric).toBeEnabled();
  await expect(metric.locator('[data-count]')).toHaveText('5,500+');
  await metric.click();
  await expect(page.locator('[data-ask-panel]')).toBeVisible();
  await expect(page.locator('[data-ask-knowledge]')).toContainText('5,500+');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('customers worldwide');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Move guide to the left' }).click();
  const popup = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open CV PDF', exact: true }).click();
  await expect(await popup).toHaveURL(/\/cv\/pdf$/);
});

for (const width of [1440, 390]) {
  test(`Story chapters work with pointer, keyboard and Ask at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/story');
    await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
    const tabs = page.getByRole('tablist', { name: 'Career journey' }).getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await expect(page.getByRole('tabpanel')).toContainText('aviation was where I began my career');
    await tabs.nth(1).click();
    await expect(page.getByRole('tabpanel')).toContainText('Start with the person.');
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText("Berlin");
    await page.getByRole('button', { name: 'Ask about frontend', exact: true }).click();
    await expect(page.locator('[data-ask-knowledge]')).toContainText('React');
    // An open guide must not hijack the journey's own controls.
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
