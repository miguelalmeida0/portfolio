import { expect, type Page } from '@playwright/test';

export const INTRO_COOKIE = 'intro-seen-2026';

export async function markIntroSeen(page: Page) {
  await page.addInitScript((cookieName) => {
    try {
      window.sessionStorage.setItem(cookieName, '1');
    } catch {
      // Tests should keep moving if storage is unavailable.
    }

    document.cookie = `${cookieName}=1; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, INTRO_COOKIE);
}

export async function waitForAppReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('body')).toBeVisible();
  await page.waitForFunction(() => document.readyState !== 'loading');
}

export async function gotoReady(
  page: Page,
  path = '/',
  options: { skipIntro?: boolean } = {}
) {
  if (options.skipIntro !== false) {
    await markIntroSeen(page);
  }

  const response = await page.goto(path);
  await waitForAppReady(page);
  return response;
}

export async function expectIntroHidden(page: Page) {
  await expect(page.getByTestId('intro-overlay')).toBeHidden();
}
