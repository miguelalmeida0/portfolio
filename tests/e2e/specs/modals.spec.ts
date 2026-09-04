import { expect, test } from '@playwright/test';

import { routes } from '../fixtures/testData';
import { expectFocusable } from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('MiguelLLM dialog behavior', () => {
  test('hero trigger opens the dialog and Escape restores focus', async ({ page }) => {
    await gotoReady(page, routes.home);
    const trigger = page.getByRole('button', { name: /Ask MiguelLLM/i }).first();

    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'MiguelLLM' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('dialog is keyboard reachable and preset questions return evidence links', async ({ page }) => {
    await gotoReady(page, routes.home);
    const trigger = page.getByRole('button', { name: /Ask MiguelLLM/i }).first();
    await expectFocusable(trigger);
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'MiguelLLM' });
    await dialog.getByRole('button', { name: /strongest technical project/i }).click();
    await expect(dialog.getByText(/Camera Harness/i).last()).toBeVisible();
    await expect(dialog.getByRole('link').first()).toBeVisible();
  });

  test('contact presets open the same dialog without navigating away', async ({ page }) => {
    await gotoReady(page, routes.home);
    await page.getByRole('button', { name: 'Interview questions' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('dialog', { name: 'MiguelLLM' })).toBeVisible();
  });

  test('reduced-motion visitors land directly on complete content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoReady(page, routes.home);

    await expect(page.getByTestId('intro-overlay')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Miguel Almeida' })).toBeVisible();
    await expect(page.locator('[data-project-tile="camera-harness"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });
});
