import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPortfolioHome } from '../helpers/portfolio';

test('fullscreen menu occupies the viewport and contains only the four editorial destinations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.getByRole('dialog', { name: 'Portfolio navigation' });
  await expect(menu).toBeVisible();
  expect(await menu.boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  await expect(menu.locator('.menu-label')).toHaveText(['Work', 'Story', 'CV', 'Contact']);
  await expect(menu.locator('.menu-description')).toHaveText(['SELECTED WORK', 'ABOUT ME', 'RESUME', 'LET’S CONNECT']);
  await expect(menu.getByRole('navigation').locator('svg')).toHaveCount(0);
  await expect(menu.getByRole('button', { name: 'Ask MiguelLLM', exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).include('dialog').analyze()).violations).toEqual([]);
});
