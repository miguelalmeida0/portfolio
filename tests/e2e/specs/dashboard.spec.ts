import { expect, test } from '@playwright/test';

import { routes, selectedWork, site } from '../fixtures/testData';
import { expectLinkTarget, expectSectionNearTop } from '../utils/assertions';
import { getMockClipboardText, mockClipboard } from '../utils/mockApi';
import { gotoReady } from '../utils/waitForAppReady';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('portfolio overview', () => {
  test('home renders the critical recruiter-facing content and work', async ({ page }) => {
    await gotoReady(page, routes.home);
    const dashboard = new DashboardPage(page);

    await dashboard.expectLandingContent();
    await expect(page.getByRole('heading', { name: 'Selected work' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Built from scratch. Used by hundreds of companies.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Let’s talk about the work.' })).toBeVisible();
  });

  test('contact cards expose real methods and copy email successfully', async ({ page }) => {
    await mockClipboard(page, 'success');
    await gotoReady(page, routes.home);

    const copyEmail = page.getByTestId('direct-email-copy');
    await copyEmail.click();
    await expect(copyEmail.locator('[aria-live="polite"]')).toContainText('Email copied');
    expect(await getMockClipboardText(page)).toBe(site.email);

    await expectLinkTarget(page.getByRole('link', { name: /LinkedIn/i }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });
    await expect(page.getByRole('link', { name: site.email })).toHaveAttribute('href', /^mailto:/);
  });

  test('all project-wall entries are visible and route to real destinations', async ({ page }) => {
    await gotoReady(page, routes.home);

    const tiles = page.locator('[data-project-tile]');
    await expect(tiles).toHaveCount(selectedWork.length);
    for (const [index, title] of selectedWork.entries()) {
      await expect(tiles.nth(index)).toContainText(title);
    }

    await page
      .locator('[data-project-tile="camera-harness"]')
      .getByRole('link', { name: /Camera Harness/i }).first()
      .click();
    await expect(page).toHaveURL(/\/work\/camera-harness$/);
    await expect(page.getByRole('heading', { name: 'Camera Harness' })).toBeVisible();
  });

  test.describe('mobile contact access', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

    test('mobile header contact control reaches the contact section', async ({ page }) => {
      await gotoReady(page, routes.home);
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      await page
        .getByRole('navigation', { name: 'Mobile primary' })
        .getByRole('link', { name: 'Contact' })
        .click();
      await expect(page).toHaveURL(/\/#contact$/);
      await expectSectionNearTop(page, '#contact');
      await expect(page.getByRole('heading', { name: 'Let’s talk about the work.' })).toBeVisible();
    });
  });
});
