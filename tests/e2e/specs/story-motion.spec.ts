import { expect, test } from '@playwright/test';

test('opening Story keeps the portfolio transition and a clean portrait', async ({ page, isMobile }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => {
    (window as any).__storyRouteTransitionSeen = false;
    const observer = new MutationObserver(() => {
      if (document.documentElement.dataset.routeTransition === 'active') {
        (window as any).__storyRouteTransitionSeen = true;
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-route-transition']
    });
  });
  if (isMobile) {
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(menu).toBeEnabled();
    await menu.click();
    await page.getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  }

  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('[data-story-ready]')).toBeVisible();
  await expect(page.locator('.story-intro-photo img')).toBeVisible();
  await expect(page.locator('.story-intro-photo figcaption')).toHaveCount(0);
  await expect(page.locator('.story-intro-photo picture')).toHaveCSS('height', /\d+(\.\d+)?px/);
  await expect(page.locator('.story-intro-text')).toHaveCSS('animation-name', 'story-opening-copy');
  if (!isMobile) {
    expect(await page.evaluate(() => (window as any).__storyRouteTransitionSeen)).toBe(true);
  }
});

test('Story links use smooth section travel, preserve the hash and focus the destination', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/story');
  await expect(page.locator('[data-story-ready]')).toBeVisible();

  await page.getByRole('link', { name: 'Start with the short version' }).click();
  await expect(page).toHaveURL(/\/story#story-summary$/);
  const initial = await page.evaluate(() => scrollY);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initial + 10);
  const summary = page.locator('#story-summary');
  await expect(summary).toBeFocused({ timeout: 5000 });
  const summaryTop = await summary.evaluate(node => node.getBoundingClientRect().top);
  expect(summaryTop).toBeGreaterThanOrEqual(75);
  expect(summaryTop).toBeLessThanOrEqual(135);

  await page.getByRole('navigation', { name: 'Story chapters' })
    .getByRole('link', { name: '01 Hello' }).click();
  await expect(page).toHaveURL(/\/story#story-hi$/);
  const chapter = page.locator('#story-hi');
  await expect(chapter).toBeFocused({ timeout: 5000 });
  const chapterTop = await chapter.evaluate(node => node.getBoundingClientRect().top);
  expect(chapterTop).toBeGreaterThanOrEqual(65);
  expect(chapterTop).toBeLessThanOrEqual(130);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});

test('Story respects reduced motion without losing usable hash navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/story');
  await expect(page.locator('[data-story-ready]')).toBeVisible();
  await expect(page.locator('.story-intro-text')).toHaveCSS('animation-name', 'none');
  await page.getByRole('link', { name: 'Start with the short version' }).click();
  await expect(page).toHaveURL(/\/story#story-summary$/);
  await expect(page.locator('#story-summary')).toBeFocused();
  const top = await page.locator('#story-summary').evaluate(node => node.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(75);
  expect(top).toBeLessThanOrEqual(135);
});

test('Story remains readable and anchors work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 }
  });
  try {
    const page = await context.newPage();
    await page.goto('/story');
    await expect(page.locator('#story-title')).toBeVisible();
    await expect(page.locator('.story-intro-photo figcaption')).toHaveCount(0);
    await page.getByRole('link', { name: 'Start with the short version' }).click();
    await expect(page).toHaveURL(/\/story#story-summary$/);
    await expect(page.locator('#story-summary')).toBeInViewport();
  } finally {
    await context.close();
  }
});
