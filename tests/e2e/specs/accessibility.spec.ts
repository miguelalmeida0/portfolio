import { expect, test } from '@playwright/test';

import { routes, site } from '../fixtures/testData';
import { expectFocusable, expectLinkTarget, expectNoHorizontalOverflow } from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';
import { AppPage } from '../pages/AppPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('accessibility and keyboard smoke checks', () => {
  test('home page exposes clear landmarks, navigation labels, and accessible controls', async ({ page }) => {
    await gotoReady(page, routes.home);

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy email address to clipboard' }).first()).toBeVisible();
    await expect(page.getByAltText('Miguel Almeida in red studio light against a black background')).toBeVisible();
  });

  for (const route of [routes.home, routes.story, routes.cv, routes.missing]) {
    test(`links and buttons on ${route} have discernible names`, async ({ page }) => {
      await gotoReady(page, route);

      const unnamedControls = await page.locator('a, button').evaluateAll((elements) =>
        elements
          .map((element, index) => {
            const name =
              element.getAttribute('aria-label') ??
              element.getAttribute('title') ??
              element.textContent ??
              '';

            return name.trim()
              ? null
              : {
                  index,
                  tag: element.tagName.toLowerCase(),
                  html: element.outerHTML.slice(0, 140)
                };
          })
          .filter(Boolean)
      );

      expect(unnamedControls).toEqual([]);
    });
  }

  test('keyboard can operate the theme toggle, visitor input, and reset control', async ({ page }) => {
    await gotoReady(page, routes.home);

    const app = new AppPage(page);
    const dashboard = new DashboardPage(page);

    await expectFocusable(app.themeToggle);
    await page.keyboard.press('Enter');
    await expect(app.themeToggle).toHaveAccessibleName('Switch to dark mode');

    await expectFocusable(dashboard.visitorInput);
    await dashboard.visitorInput.fill('lost');
    await page.keyboard.press('Enter');
    await dashboard.expectVisitorFlow('lost');

    await expectFocusable(dashboard.resetVisitorFlowButton);
    await page.keyboard.press('Enter');
    await expect(dashboard.visitorFlow).toBeHidden();
  });

  test.describe('mobile accessibility layout', () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

    for (const route of [routes.home, routes.story, routes.cv]) {
      test(`${route} avoids horizontal overflow on mobile`, async ({ page }) => {
        await gotoReady(page, route);
        await expectNoHorizontalOverflow(page);
      });
    }
  });

  test('external links communicate new-tab behavior with target and rel', async ({ page }) => {
    await gotoReady(page, routes.home);

    await page.getByTestId('visitor-option-recruiter').click();
    await expectLinkTarget(page.getByRole('link', { name: 'Book 15 min' }), {
      href: site.cal,
      target: '_blank',
      relIncludes: 'noopener'
    });

    await expectLinkTarget(page.getByRole('link', { name: /\/in\/miguelalmeida1/i }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });
  });
});
