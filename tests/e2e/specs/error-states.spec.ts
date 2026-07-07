import { expect, test } from '@playwright/test';

import { routes, site } from '../fixtures/testData';
import { expectHtmlSecurityHeaders, expectLinkTarget } from '../utils/assertions';
import { blockPopups, getWindowOpenCalls, mockClipboard } from '../utils/mockApi';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('error and fallback states', () => {
  test('404 page returns the correct status and offers a working recovery path', async ({ page }) => {
    const response = await gotoReady(page, routes.missing);

    expect(response?.status()).toBe(404);
    await expectHtmlSecurityHeaders(response);
    await expect(page.getByText('404 · Not found')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wrong page.' })).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/$/),
      page.getByRole('link', { name: 'Return home' }).click()
    ]);
    await expect(page.getByRole('heading', { name: /Frontend Engineer/i })).toBeVisible();
  });

  test('copy-email failure shows a retry state and manual-copy guidance', async ({ page }) => {
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

    await expect(page).toHaveURL(/\/out\/linkedin$/);
    await expect(page.getByText('Your browser blocked the automatic new tab.')).toBeVisible();
    expect(await getWindowOpenCalls(page)).toEqual([site.linkedin]);

    await expectLinkTarget(page.getByRole('link', { name: 'Open LinkedIn' }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });

    await Promise.all([
      page.waitForURL(/\/cv$/),
      page.getByRole('link', { name: 'Back to CV' }).click()
    ]);
    await expect(page.getByRole('heading', { name: /Miguel Almeida .* The Sheet/i })).toBeVisible();
  });

  test('visitor-path validation error is announced without navigating away', async ({ page }) => {
    await gotoReady(page, routes.home);

    await page.getByLabel('Choose visitor path').fill('not a persona');
    await page.getByLabel('Choose visitor path').press('Enter');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#visitor-input-help')).toHaveText(
      'Try recruiter, collaborator, curious, lost, or 1-4.'
    );
    await expect(page.getByLabel('Choose visitor path')).toHaveAttribute('aria-invalid', 'true');
  });
});
