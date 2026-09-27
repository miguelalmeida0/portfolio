import { expect, type Page } from '@playwright/test';

/** Enter the real homepage without waiting for the decorative presentation. */
export async function openPortfolioHome(page: Page) {
  await page.goto('/');
  const intro = page.locator('[data-pixel-intro]');
  if (await intro.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await expect(intro).toBeHidden({ timeout: 3_000 });
  }
  await expect(page.getByRole('heading', { level: 1, name: /Frontend developer.*design engineer/i })).toBeVisible();
}

export async function installClipboardStub(page: Page) {
  await page.addInitScript(() => {
    const clipboard = { writeText: async (_value: string) => undefined };
    try {
      Object.defineProperty(Navigator.prototype, 'clipboard', {
        configurable: true,
        get: () => clipboard
      });
    } catch {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: clipboard
      });
    }
  });
}
