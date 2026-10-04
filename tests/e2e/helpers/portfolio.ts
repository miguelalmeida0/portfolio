import { expect, type Page } from '@playwright/test';

/** Enter the real homepage without waiting for the decorative presentation. */
export async function openPortfolioHome(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/');
  const intro = page.locator('[data-landing-overlay]');
  if (await intro.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await expect(intro).toBeHidden({ timeout: 3_000 });
  }
  await expect(page.getByRole('heading', { level: 1, name: /Frontend developer.*design engineer/i })).toBeVisible();
  // The current first paint renders before hydration attaches menu/tab handlers.
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
}

/** Select the prepared Second Voice pair from the work index. */
export async function openSecondVoiceStudio(page: Page) {
  await openPortfolioHome(page);
  await page.locator('[data-project-row][data-ask-id="w-sv"]').click();
  await expect(page.locator('#work')).toHaveAttribute('data-project', 'second-voice');
  await expect(page.getByRole('tabpanel')).toBeVisible();
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
