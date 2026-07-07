import { expect, test } from '@playwright/test';

import { routes } from '../fixtures/testData';
import { AppPage } from '../pages/AppPage';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('theme settings', () => {
  test('theme toggle switches from default dark mode to light mode and persists after reload', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto(routes.home);

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    await expect(app.themeToggle).toHaveAccessibleName('Switch to light mode');

    await app.themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(app.themeToggle).toHaveAccessibleName('Switch to dark mode');
    expect(await page.evaluate(() => window.localStorage.getItem('theme'))).toBe('light');

    await page.reload();
    await expect(html).not.toHaveClass(/dark/);
    await expect(app.themeToggle).toHaveAccessibleName('Switch to dark mode');
  });

  test('saved light preference is applied before hydration', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('theme', 'light');
    });

    await gotoReady(page, routes.home);

    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.getByTestId('theme-toggle')).toHaveAccessibleName('Switch to dark mode');
  });

  test('theme preference survives navigation to routes without the header toggle', async ({ page }) => {
    const app = new AppPage(page);
    await app.goto(routes.home);
    await app.themeToggle.click();
    expect(await page.evaluate(() => window.localStorage.getItem('theme'))).toBe('light');

    await gotoReady(page, routes.story);
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.getByRole('heading', { name: /Dear reader/i })).toBeVisible();

    await gotoReady(page, routes.cv);
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.getByRole('heading', { name: /Miguel Almeida .* The Sheet/i })).toBeVisible();
  });
});
