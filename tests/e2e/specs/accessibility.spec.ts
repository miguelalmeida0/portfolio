import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

test('mobile menu closes on Escape and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'My story' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
});

test('intro is decorative, skippable and never creates a second page heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pixel-intro] h1')).toHaveCount(0);
  const intro = page.locator('[data-pixel-intro]');
  if (await intro.isVisible().catch(() => false)) {
    await expect(intro.getByRole('link', { name: 'View work' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(intro).toBeHidden({ timeout: 3_000 });
  }
  await expect(page.locator('h1')).toHaveCount(1);
});

test('reduced motion keeps content visible and disables decorative transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /Frontend developer.*design engineer/i })).toBeVisible();
  const mark = page.locator('mark').first();
  await expect(mark).toBeVisible();
  const styles = await mark.evaluate(el => ({ duration: getComputedStyle(el).animationDuration, opacity: getComputedStyle(el).opacity }));
  expect(parseFloat(styles.duration)).toBeLessThan(.01);
  expect(styles.opacity).toBe('1');
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('public controls have accessible names and content has one main landmark and one h1', async ({ page }) => {
  for (const route of ['/', '/cv', '/story', '/work/second-voice-ai']) {
    if (route === '/') await openPortfolioHome(page);
    else await page.goto(route);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const controls = page.locator('button:not([inert] button), a:not([inert] a)');
    for (const control of await controls.all()) {
      if (await control.isVisible()) await expect(control).toHaveAccessibleName(/\S/);
    }
  }
});
