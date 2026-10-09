import { expect, test, type Page } from '@playwright/test';

async function watchFade(page: Page) {
  await page.evaluate(() => {
    const veil = document.querySelector<HTMLElement>('[data-route-veil]')!;
    (window as any).__storyFadeObserver?.disconnect();
    (window as any).__storyFadeStages = [];
    const observe = () => {
      const phase = veil.dataset.phase;
      const stages: string[] = (window as any).__storyFadeStages;
      if (phase && phase !== 'idle' && stages.at(-1) !== phase) stages.push(phase);
    };
    const observer = new MutationObserver(observe);
    observer.observe(veil, {
      attributes: true, attributeFilter: ['data-phase']
    });
    (window as any).__storyFadeObserver = observer;
  });
}

async function settled(page: Page) {
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle', {timeout: 7000});
  await expect(page.locator('[data-route-veil]')).toBeHidden();
  await expect(page.locator('[data-story-identity-bridge]')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveAttribute('data-story-identity-transition', /./);
}

async function openStory(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/story$/);
  await settled(page);
}

test('Home and Story use one full-screen opacity fade in both directions', async ({ page, isMobile }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto('/');
  await watchFade(page);
  await openStory(page, isMobile);
  const forward = await page.evaluate(() => (window as any).__storyFadeStages);
  expect(forward).toContain('covering');
  expect(forward).toContain('revealing');
  await expect(page.locator('.story-intro-photo img')).toBeVisible();
  await expect(page.locator('.story-intro-photo img')).not.toHaveCSS('visibility', 'hidden');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);

  await watchFade(page);
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL(/\/#top$/);
  await settled(page);
  const reverse = await page.evaluate(() => (window as any).__storyFadeStages);
  expect(reverse).toContain('covering');
  expect(reverse).toContain('revealing');
  await expect(page.locator('[data-portrait-card] img.portrait')).toBeVisible();
  await expect(page.locator('[data-portrait-card] img.portrait')).not.toHaveCSS('visibility', 'hidden');
  expect(errors).toEqual([]);
});

test('Story history navigation remains readable and does not strand overlays', async ({ page, isMobile }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/');
  await openStory(page, isMobile);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await settled(page);
  await page.goForward();
  await expect(page).toHaveURL(/\/story$/);
  await settled(page);
  await page.getByRole('link', { name: 'Start with the short version' }).click();
  await expect(page.locator('#story-summary')).toBeFocused({timeout: 5000});
});

test('reduced motion uses no animated route veil', async ({ page, isMobile }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openStory(page, isMobile);
  await expect(page.locator('[data-route-veil]')).toBeHidden();
  await expect(page.locator('[data-story-identity-bridge]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL(/\/#top$/);
  await settled(page);
  await expect(page.locator('main h1')).toBeVisible();
});
