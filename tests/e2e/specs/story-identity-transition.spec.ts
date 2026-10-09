import { expect, test } from '@playwright/test';

async function setup(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('seen-intro', 'true');
    (window as any).__identityStages = [];
    new MutationObserver(() => {
      const stage = document.documentElement.dataset.storyIdentityTransition;
      const trace = (window as any).__identityStages;
      if (!stage || trace.at(-1)?.stage === stage) return;
      const rows = document.querySelectorAll('[data-story-identity-type] text');
      const mark = document.querySelector<HTMLElement>('[data-story-identity-mark]');
      trace.push({
        stage, rows: rows.length, text: rows[0]?.textContent,
        position: mark?.getBoundingClientRect().toJSON(), time: performance.now()
      });
    }).observe(document, {
      attributes: true, subtree: true, attributeFilter: ['data-story-identity-transition']
    });
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
}

async function settle(page: import('@playwright/test').Page) {
  await expect(page.locator('[data-story-identity-bridge]')).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator('html')).not.toHaveAttribute('data-story-identity-transition', /./);
}

async function openStory(page: import('@playwright/test').Page, mobile: boolean) {
  if (mobile) {
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Story', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/story$/);
  await settle(page);
}

function verifyStages(stages: Array<{stage: string; rows: number; text: string}>) {
  expect(stages.map(item => item.stage)).toEqual(['covering', 'covered', 'revealing']);
  expect(stages.every(item => item.rows === 63)).toBe(true);
  expect(stages[0].text).toContain('MIGUEL ALMEIDA');
}

test('name silhouette replaces the photo flight in both directions', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await setup(page);
  await page.goto('/');
  await openStory(page, isMobile);
  await expect(page.locator('.story-intro-photo img')).toBeVisible();
  await expect(page.locator('.story-intro-photo img')).not.toHaveCSS('visibility', 'hidden');
  let stages = await page.evaluate(() => (window as any).__identityStages);
  verifyStages(stages);

  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL(/\/#top$/);
  await settle(page);
  await expect(page.locator('[data-portrait-card] img.portrait')).not.toHaveCSS('visibility', 'hidden');
  stages = await page.evaluate(() => (window as any).__identityStages);
  verifyStages(stages.slice(3));
  expect(errors).toEqual([]);
});

test('browser Back and Forward preserve the identity transition and scroll behavior', async ({ page, isMobile }) => {
  await setup(page);
  await page.goto('/');
  await openStory(page, isMobile);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await settle(page);
  await page.goForward();
  await expect(page).toHaveURL(/\/story$/);
  await settle(page);
  const stages = await page.evaluate(() => (window as any).__identityStages);
  expect(stages.length).toBe(9);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.getByRole('link', { name: 'Start with the short version' }).click();
  await expect(page.locator('#story-summary')).toBeFocused({ timeout: 5000 });
});

test('visiting Story from a different page uses the same lettering', async ({ page, isMobile }) => {
  await setup(page);
  await page.goto('/cv');
  await openStory(page, isMobile);
  const stages = await page.evaluate(() => (window as any).__identityStages);
  verifyStages(stages);
  await expect(page.locator('#story-title')).toBeVisible();
});

test('reduced motion skips the identity overlay in both directions', async ({ page, isMobile }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openStory(page, isMobile);
  await expect(page.locator('[data-story-identity-bridge]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL(/\/#top$/);
  await expect(page.locator('[data-story-identity-bridge]')).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('#story-title')).toBeVisible();
});
