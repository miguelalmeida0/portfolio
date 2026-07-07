import { expect, test } from '@playwright/test';

import { routes, visitorFlows, visitorInputError } from '../fixtures/testData';
import { expectLinkTarget, expectSectionNearTop } from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('visitor-path form workflow', () => {
  test('each audience button selects the correct flow and reset clears it', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);

    for (const key of Object.keys(visitorFlows) as Array<keyof typeof visitorFlows>) {
      await dashboard.chooseVisitor(key);
      await dashboard.expectVisitorFlow(key);

      await dashboard.resetVisitorFlowButton.click();
      await expect(dashboard.visitorFlow).toBeHidden();
    }
  });

  test('text input accepts documented aliases and clears after a successful submit', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);

    for (const [key, flow] of Object.entries(visitorFlows) as Array<
      [keyof typeof visitorFlows, (typeof visitorFlows)[keyof typeof visitorFlows]]
    >) {
      await dashboard.submitVisitorInput(flow.alias);
      await dashboard.expectVisitorFlow(key);
      await expect(dashboard.visitorInput).toHaveValue('');
      await dashboard.resetVisitorFlowButton.click();
    }
  });

  test('invalid input shows validation, aria-invalid, and recovers on edit', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);

    await dashboard.submitVisitorInput('what even is this');
    await expect(dashboard.visitorHelp).toHaveText(visitorInputError);
    await expect(dashboard.visitorInput).toHaveAttribute('aria-invalid', 'true');
    await expect(dashboard.visitorFlow).toBeHidden();

    await dashboard.visitorInput.fill('curious');
    await expect(dashboard.visitorHelp).toHaveText('Numbers 1-4 work too.');
    await expect(dashboard.visitorInput).toHaveAttribute('aria-invalid', 'false');

    await dashboard.visitorInput.press('Enter');
    await dashboard.expectVisitorFlow('curious');
  });

  test('recruiter flow CTAs point to email, booking, and CV destinations', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);
    await dashboard.chooseVisitor('recruiter');

    await expectLinkTarget(dashboard.visitorFlow.getByRole('link', { name: 'Write directly' }), {
      href: 'mailto:miguelalmeida1592@gmail.com?subject=Role%20opportunity'
    });
    await expectLinkTarget(dashboard.visitorFlow.getByRole('link', { name: 'Book 15 min' }), {
      href: 'https://cal.com/miguel-almeida',
      target: '_blank',
      relIncludes: 'noopener'
    });
    await expectLinkTarget(dashboard.visitorFlow.getByRole('link', { name: 'Read the resume' }), {
      href: routes.cv
    });

    await Promise.all([
      page.waitForURL(/\/cv$/),
      dashboard.visitorFlow.getByRole('link', { name: 'Read the resume' }).click()
    ]);
    await expect(page.getByRole('heading', { name: /Miguel Almeida .* The Sheet/i })).toBeVisible();
  });

  test('collaborator flow smooth-scroll CTA updates the URL and reveals selected work', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);
    await dashboard.chooseVisitor('collaborator');
    await dashboard.visitorFlow.getByRole('link', { name: 'See selected work' }).click();

    await expect(page).toHaveURL(/\/#work$/);
    await expectSectionNearTop(page, '#work');
  });
});
