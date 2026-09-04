import { expect, test } from '@playwright/test';

import { routes, selectedWork } from '../fixtures/testData';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('selectable evidence states', () => {
  test('homepage has no hidden catalogue filters and shows the complete curated wall', async ({
    page
  }) => {
    await gotoReady(page, routes.home);

    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('checkbox')).toHaveCount(0);
    await expect(page.getByRole('radio')).toHaveCount(0);
    await expect(page.locator('[data-project-tile]')).toHaveCount(selectedWork.length);
  });

  test('architecture state tabs preserve explicit status boundaries', async ({ page }) => {
    await page.goto('/work/camera-harness#runtime-architecture');
    const architecture = page.locator(
      '[aria-label="Camera Harness architecture states"]'
    );

    await architecture.getByRole('tab', { name: 'Historical' }).click();
    await expect(architecture).toHaveAttribute('data-architecture-mode', 'historical');
    await expect(architecture.getByText(/not active in the current product/i)).toBeVisible();

    await architecture.getByRole('tab', { name: 'Proposed' }).click();
    await expect(architecture).toHaveAttribute('data-architecture-mode', 'proposed');
    await expect(architecture.getByText(/not currently implemented/i)).toBeVisible();
  });

  test('Ask comparison switches between visible implication and actual evidence flow', async ({
    page
  }) => {
    await page.goto('/work/camera-harness#ask-provenance');
    const comparison = page.locator(
      '.system-comparison[aria-label="Ask evidence continuity comparison"]'
    );

    await comparison.getByRole('tab', { name: /What currently happens/i }).click();
    await expect(comparison).toHaveAttribute('data-comparison-active', 'actual');
    await expect(comparison.getByText(/No shared immutable evidence ID/i)).toBeVisible();
  });

  test('test-evidence tabs expose what a result does and does not establish', async ({ page }) => {
    await page.goto('/work/camera-harness#testing');
    const evidence = page.getByRole('region', { name: 'Evidence interpretation explorer' });

    await evidence.getByRole('tab', { name: /Visual snapshot/i }).click();
    await expect(evidence.getByText('One deterministic UI state')).toBeVisible();
    await expect(evidence.getByText('Current live behavior')).toBeVisible();
  });
});
