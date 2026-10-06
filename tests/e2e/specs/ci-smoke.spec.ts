import { expect, test } from '@playwright/test';

test('current portfolio shell and published work routes are reachable', async ({ page }) => {
  const homeResponse = await page.goto('/');
  expect(homeResponse, 'homepage should return a document response').not.toBeNull();
  expect(homeResponse!.status(), 'homepage should not return an HTTP error').toBeLessThan(400);
  await expect(page.locator('main')).toBeVisible();

  const workRoutes = await page.locator('a[href^="/work/"]').evaluateAll((anchors) => {
    const hrefs = anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href): href is string => Boolean(href));

    return [...new Set(hrefs)];
  });

  expect(workRoutes.length, 'homepage should expose the current project case studies').toBeGreaterThanOrEqual(4);

  for (const href of workRoutes) {
    const response = await page.goto(href);
    expect(response, `${href} should return a document response`).not.toBeNull();
    expect(response!.status(), `${href} should not return an HTTP error`).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  }
});

test('primary routes render without uncaught client exceptions', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  for (const route of ['/', '/story', '/cv']) {
    const response = await page.goto(route);
    expect(response, `${route} should return a document response`).not.toBeNull();
    expect(response!.status(), `${route} should not return an HTTP error`).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
});
