import { expect, test } from '@playwright/test';

import { routes, site } from '../fixtures/testData';
import {
  expectFocusable,
  expectLinkTarget,
  expectNoHorizontalOverflow
} from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('accessibility and keyboard smoke checks', () => {
  test('home exposes clear landmarks, navigation, and accessible controls', async ({ page }) => {
    await gotoReady(page, routes.home);

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore my work' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ask MiguelLLM/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Copy email address to clipboard' }).first()
    ).toBeVisible();
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
              : { index, tag: element.tagName.toLowerCase(), html: element.outerHTML.slice(0, 140) };
          })
          .filter(Boolean)
      );

      expect(unnamedControls).toEqual([]);
    });
  }

  test('keyboard reaches the hero, project wall, and project case study', async ({ page }) => {
    await gotoReady(page, routes.home);

    const workCta = page.getByRole('link', { name: 'Explore my work' });
    await expectFocusable(workCta);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#work$/);

    const camera = page
      .locator('[data-project-tile="camera-harness"]')
      .getByRole('link', { name: /Camera Harness/i }).first();
    await expectFocusable(camera);

    await camera.press('Enter');
    await expect(page).toHaveURL(/\/work\/camera-harness$/);
    await expect(page.getByRole('heading', { name: 'From camera lifecycle to model integration' })).toBeVisible();
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

  test('external contact links communicate new-tab behavior', async ({ page }) => {
    await gotoReady(page, routes.home);

    await expectLinkTarget(page.getByRole('link', { name: /LinkedIn/i }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });
    await expectLinkTarget(page.getByRole('link', { name: /GitHub/i }), {
      target: '_blank',
      relIncludes: 'noopener'
    });
  });
});
