import { expect, test } from '@playwright/test';

/**
 * Measure the real browser-owned View Transition, not an approximation built
 * from a cloned picture. This catches duplicate snapshot names, skipped
 * transitions, image flashes and accidental reintroduction of the menu veil.
 */
test('Home portrait travels into the Story portrait frame', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('seen-intro', 'true');
    const native = document.startViewTransition?.bind(document);
    (window as any).__storyPortraitFlight = null;
    if (!native) return;
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (update: () => Promise<void> | void) => {
        const source = document.querySelector<HTMLElement>('[data-story-flight-source]');
        const rect = source?.getBoundingClientRect();
        const claimed = source ? getComputedStyle(source).viewTransitionName : 'none';
        const participating = document.documentElement.dataset.storyPortraitFlight === 'active';
        const transition = native(update);
        if (participating) {
          const record: Record<string, any> = {
            sourceName: claimed,
            sourceRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
            ready: false,
            finished: false
          };
          (window as any).__storyPortraitFlight = record;
          transition.ready.then(() => {
            const target = document.querySelector<HTMLElement>('[data-story-flight-target]');
            const box = target?.getBoundingClientRect();
            const group = getComputedStyle(document.documentElement, '::view-transition-group(story-portrait)');
            record.targetName = target ? getComputedStyle(target).viewTransitionName : null;
            record.targetRect = box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null;
            record.groupDuration = group.animationDuration;
            record.ready = true;
          }).catch(error => { record.failure = String(error); });
          transition.finished.then(() => { record.finished = true; })
            .catch(error => { record.failure = String(error); });
        }
        return transition;
      }
    });
  });

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const source = page.locator('[data-story-flight-source]');
  await expect(source).toBeVisible();
  await expect.poll(() => page.locator('[data-story-flight-source] img')
    .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

  if (isMobile) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  }

  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('[data-story-ready]')).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).__storyPortraitFlight?.ready), { timeout: 5500 }).toBe(true);
  const flight = await page.evaluate(() => (window as any).__storyPortraitFlight);
  expect(flight.failure).toBeUndefined();
  expect(flight.sourceName).toBe('story-portrait');
  expect(flight.targetName).toBe('story-portrait');
  expect(parseFloat(flight.groupDuration)).toBeGreaterThanOrEqual(0.6);
  expect(flight.sourceRect.width).toBeGreaterThan(150);
  expect(flight.targetRect.width).toBeGreaterThan(150);
  expect(
    Math.abs(flight.sourceRect.x - flight.targetRect.x) +
    Math.abs(flight.sourceRect.y - flight.targetRect.y) +
    Math.abs(flight.sourceRect.height - flight.targetRect.height)
  ).toBeGreaterThan(50);
  await expect.poll(() => page.evaluate(() => (window as any).__storyPortraitFlight?.finished), { timeout: 5500 }).toBe(true);
  await expect(page.locator('[data-story-flight-target] img')).toBeVisible();
  await expect(page.locator('[data-story-flight-target] img')).toHaveJSProperty('complete', true);
  await expect(page.locator('html')).not.toHaveAttribute('data-story-portrait-flight', 'active');
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});

test('reduced motion never starts a shared photo flight', async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('html')).not.toHaveAttribute('data-story-portrait-flight', 'active');
  await expect(page.locator('[data-story-flight-target] img')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});
