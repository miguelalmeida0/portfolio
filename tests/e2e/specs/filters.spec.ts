import { expect, test } from '@playwright/test';

import { routes, selectedWork, visitorFlows, visitorInputError } from '../fixtures/testData';
import { gotoReady } from '../utils/waitForAppReady';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('filters and selectable states', () => {
  test('work catalogue has no hidden filter controls and shows every work card by default', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);

    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('checkbox')).toHaveCount(0);
    await expect(page.getByRole('radio')).toHaveCount(0);
    await expect(page.getByRole('tab')).toHaveCount(0);
    await expect(page.getByRole('switch')).toHaveCount(0);

    for (const [index, title] of selectedWork.entries()) {
      await expect(dashboard.selectedWorkCard(index)).toContainText(title);
    }
  });

  test('visitor option selection behaves as an audience filter while preserving all choices', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);
    await dashboard.chooseVisitor('lost');
    await dashboard.expectVisitorFlow('lost');

    for (const key of Object.keys(visitorFlows) as Array<keyof typeof visitorFlows>) {
      await expect(dashboard.visitorOption(key)).toBeVisible();
    }

    await dashboard.resetVisitorFlowButton.click();
    await expect(dashboard.visitorFlow).toBeHidden();
  });

  test('visitor text filter normalizes punctuation and maps aliases correctly', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);
    await dashboard.submitVisitorInput('  hiring!!! ');
    await dashboard.expectVisitorFlow('recruiter');
  });

  test('empty filter input returns a validation state instead of selecting a flow', async ({ page }) => {
    await gotoReady(page, routes.home);

    const dashboard = new DashboardPage(page);
    await dashboard.visitorInput.press('Enter');

    await expect(dashboard.visitorHelp).toHaveText(visitorInputError);
    await expect(dashboard.visitorFlow).toBeHidden();
  });
});
