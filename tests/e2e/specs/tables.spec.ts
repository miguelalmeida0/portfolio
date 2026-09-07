import { expect, test } from '@playwright/test';

import { cvSections, routes, storyChapters } from '../fixtures/testData';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('structured CV and story data', () => {
  test('CV renders all structured sections and list data without a table widget', async ({ page }) => {
    await gotoReady(page, routes.cv);

    for (const section of cvSections) {
      await expect(page.getByRole('heading', { name: section, exact: true }).first()).toBeVisible();
    }

    await expect(page.getByText(/2022 — now/).first()).toBeVisible();
    await expect(page.getByText(/Software Engineer/i).first()).toBeVisible();
    await expect(page.getByText(/English/i).first()).toBeVisible();
    await expect(page.getByText(/Portuguese/i).first()).toBeVisible();
    await expect(page.getByRole('table')).toHaveCount(0);
  });

  test('CV has no pagination, sorting, or row-action controls', async ({ page }) => {
    await gotoReady(page, routes.cv);

    await expect(page.getByRole('button', { name: /next|previous|sort|filter|page/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /next|previous|sort|filter|page/i })).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Experience' })).toBeVisible();
  });

  test('Story exposes every chapter as a concise section', async ({ page }) => {
    await gotoReady(page, routes.story);

    for (const chapter of storyChapters) {
      await expect(page.getByText(chapter, { exact: true })).toBeVisible();
    }

    await expect(page.locator('#at-work')).toBeVisible();
    await expect(page.locator('#hackathon')).toBeVisible();
    await expect(page.locator('#side-projects')).toBeVisible();
  });
});
