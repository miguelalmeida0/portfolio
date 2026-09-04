import { expect, test } from '@playwright/test';

import { homeHeroHeading, routes, site } from '../fixtures/testData';
import { expectHtmlSecurityHeaders, expectLinkTarget } from '../utils/assertions';
import { blockPopups, getWindowOpenCalls, mockClipboard } from '../utils/mockApi';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('error and fallback states', () => {
  test('404 page returns the correct status and offers recovery', async ({ page }) => {
    const response = await gotoReady(page, routes.missing);

    expect(response?.status()).toBe(404);
    await expectHtmlSecurityHeaders(response);
    await expect(page.getByText('404 · Not found')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wrong page.' })).toBeVisible();

    await page.getByRole('link', { name: 'Return home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: homeHeroHeading })).toBeVisible();
  });

  test('copy-email failure exposes retry and manual-copy guidance', async ({ page }) => {
    await mockClipboard(page, 'failure');
    await gotoReady(page, routes.home);

    const copyEmail = page.getByTestId('direct-email-copy');
    await copyEmail.click();
    await expect(copyEmail).toContainText('Retry');
    await expect(copyEmail).toContainText(/Couldn.t copy automatically/);
    await expect(copyEmail.locator('[aria-live="polite"]')).toContainText(/copy manually/);
  });

  test('LinkedIn bridge handles popup blocking with manual fallback links', async ({ page }) => {
    await blockPopups(page);
    await gotoReady(page, routes.linkedinBridge);

    await expect(page.getByText('Your browser blocked the automatic new tab.')).toBeVisible();
    expect(await getWindowOpenCalls(page)).toEqual([site.linkedin]);
    await expectLinkTarget(page.getByRole('link', { name: 'Open LinkedIn' }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });

    await page.getByRole('link', { name: 'Back to CV' }).click();
    await expect(page).toHaveURL(/\/cv$/);
    await expect(page.getByRole('heading', { name: 'Miguel Almeida' })).toBeVisible();
  });

  test('private Camera Harness captures are not publicly served', async ({ request }) => {
    for (const file of [
      'movement-mug-1600.jpg',
      'movement-peace-sign-1280.jpg',
      'movement-confirmation-1280.jpg'
    ]) {
      const response = await request.get(`/projects/camera-harness/${file}`);
      expect(response.status(), `${file} should remain private`).toBe(404);
    }
  });
});
