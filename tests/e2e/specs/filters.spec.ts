import { expect, test } from '@playwright/test';

import { routes, selectedWork } from '../fixtures/testData';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('curated work and explicit evidence boundaries', () => {
  test('homepage shows the complete curated set without catalogue controls', async ({ page }) => {
    await gotoReady(page, routes.home);

    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('checkbox')).toHaveCount(0);
    await expect(page.getByRole('radio')).toHaveCount(0);
    await expect(page.locator('[data-project-tile]')).toHaveCount(selectedWork.length);
  });

  test('Camera Harness exposes failure, alternatives, behavior, and limits', async ({ page }) => {
    await gotoReady(page, '/work/camera-harness');

    await expect(page.getByRole('heading', { name: 'I made mode changes invalidate obsolete AI work.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Two ways to handle work that arrives late' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What happens when the interaction changes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Conditions and limits' })).toBeVisible();
  });

  test('Atlas keeps deterministic findings separate from model explanation', async ({ page }) => {
    await gotoReady(page, '/work/atlas');

    await expect(page.getByRole('heading', { name: 'Atlas' })).toBeVisible();
    await expect(page.getByText(/cannot create the finding or change the repository/i)).toBeVisible();
    await expect(page.getByText(/no simulated product UI/i)).toBeVisible();
  });
});
