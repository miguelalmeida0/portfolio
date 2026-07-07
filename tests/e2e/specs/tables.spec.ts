import { expect, test } from '@playwright/test';

import { cvSections, routes, storyChapters } from '../fixtures/testData';
import { expectSectionNearTop } from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('structured CV and timeline data', () => {
  test('CV page renders all structured sections and list data without a table widget', async ({ page }) => {
    await gotoReady(page, routes.cv);

    for (const section of cvSections) {
      await expect(page.getByText(section, { exact: true }).first()).toBeVisible();
    }

    await expect(page.getByText('2026 — Now')).toBeVisible();
    await expect(page.getByText('Software Engineer, Mid-level')).toBeVisible();
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Portuguese')).toBeVisible();
    await expect(page.getByText('Full-Stack Web Development')).toBeVisible();
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('CV has no pagination, sorting, or row-action controls because all data is static and visible', async ({ page }) => {
    await gotoReady(page, routes.cv);

    await expect(page.getByRole('button', { name: /next|previous|sort|filter|page/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /next|previous|sort|filter|page/i })).toHaveCount(0);
    await expect(page.getByText('p. 01 / 01')).toBeVisible();
  });

  test('story timeline index exposes every chapter and anchors to the selected year', async ({ page }) => {
    await gotoReady(page, routes.story);

    for (const chapter of storyChapters) {
      await expect(page.getByRole('link', { name: chapter, exact: true })).toBeVisible();
    }

    await page.getByRole('link', { name: '2026', exact: true }).click();
    await expect(page).toHaveURL(/\/story#ch-5$/);
    await expectSectionNearTop(page, '#ch-5');
  });
});
