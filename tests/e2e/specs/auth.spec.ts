import { expect, test } from '@playwright/test';

import { routes } from '../fixtures/testData';
import { users } from '../fixtures/users';
import { AuthPage } from '../pages/AuthPage';
import { trackRequests } from '../utils/mockApi';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('auth surface', () => {
  for (const route of [routes.home, routes.story, routes.cv]) {
    test(`${users.anonymous.label} can access ${route} without an auth redirect`, async ({ page }) => {
      await gotoReady(page, route);

      const auth = new AuthPage(page);
      await auth.expectPublicRoute(route);
    });
  }

  test('public pages do not trigger auth/session API calls', async ({ page }) => {
    const tracker = trackRequests(page);

    await gotoReady(page, routes.home);

    const authCalls = tracker.requests.filter((request) =>
      /\/(api\/)?(auth|login|logout|session|user)(\/|$|\?)/i.test(new URL(request.url).pathname)
    );

    tracker.stop();
    expect(authCalls).toEqual([]);
  });

  test('no hidden login, registration, password, or account controls are present', async ({ page }) => {
    await gotoReady(page, routes.home);

    const auth = new AuthPage(page);
    await auth.expectNoAuthSurface();
    await expect(page.getByText(/dashboard|settings|account/i)).toHaveCount(0);
  });
});
