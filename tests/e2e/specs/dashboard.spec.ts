import { expect, test } from '@playwright/test';

import { routes, selectedWork, site } from '../fixtures/testData';
import { expectLinkTarget, expectSectionNearTop } from '../utils/assertions';
import { getMockClipboardText, mockClipboard } from '../utils/mockApi';
import { gotoReady } from '../utils/waitForAppReady';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('portfolio overview dashboard', () => {
  test('home overview renders the critical recruiter-facing content', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);
    await dashboard.expectLandingContent();
    await expect(page.getByText('I build frontends that feel calm')).toBeVisible();
    await expect(page.getByText('A short history.')).toBeVisible();
  });

  test('contact cards expose real contact methods and copy email successfully', async ({ page }) => {
    await mockClipboard(page, 'success');
    await gotoReady(page, routes.home);

    const copyEmail = page.getByTestId('direct-email-copy');
    await copyEmail.click();

    await expect(copyEmail.locator('[aria-live="polite"]')).toContainText('Email copied');
    await expect(copyEmail).toContainText('Copied');
    expect(await getMockClipboardText(page)).toBe(site.email);

    await expectLinkTarget(page.getByRole('link', { name: /\/in\/miguelalmeida1/i }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });
    await expectLinkTarget(page.getByRole('link', { name: site.phone }), {
      href: 'tel:+351918500305',
      target: null
    });
  });

  test('all selected-work cards are visible and at least one card navigates to the story', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);

    for (const [index, title] of selectedWork.entries()) {
      await expect(dashboard.selectedWorkCard(index)).toContainText(title);
    }

    await dashboard.selectedWorkCard(0).click();

    const activeProjectLink = page.getByRole('link', { name: /View project/i });
    await expect(activeProjectLink).toHaveAttribute('href', routes.story);

    await Promise.all([page.waitForURL(/\/story$/), activeProjectLink.click()]);
    await expect(page.getByRole('heading', { name: /Dear reader/i })).toBeVisible();
  });

  test.describe('mobile contact access', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

    test('mobile header contact control scrolls to the contact workflow', async ({ page }) => {
      await gotoReady(page, routes.home);

      await page.getByTestId('mobile-contact-link').click();
      await expect(page).toHaveURL(/\/#contact$/);
      await expectSectionNearTop(page, '#contact');
      await expect(page.getByLabel('Choose visitor path')).toBeVisible();
    });
  });
});
