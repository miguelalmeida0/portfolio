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
  await selectWorkProject(page, 'second-voice');
  await expect(page.getByRole('tabpanel')).toBeVisible();
}

/** Select a mounted stage by identity, independent of the current project order. */
export async function selectWorkProject(page: Page, id: 'needle' | 'second-voice' | 'f24' | 'flow' | 'leu') {
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  const area = id === 'second-voice' ? 'sv' : id;
  await page.locator(`[data-project-row][data-ask-id="w-${area}"]`).click();
  await expect(page.locator('#work')).toHaveAttribute('data-project', id);
  const stage = page.locator(`#work .stage[data-project="${id}"]`);
  await expect(stage).toBeVisible();
  return stage;
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

/** CSS zoom can quantize a 3px outline to two physical pixels. */
export async function expectVisibleFocus(locator: import('@playwright/test').Locator) {
  await expect(locator).toHaveCSS('outline-style', 'solid');
  const width = await locator.evaluate(el => {
    const zoom = Number(getComputedStyle(document.querySelector('#portfolio-content')!).zoom) || 1;
    return parseFloat(getComputedStyle(el).outlineWidth) * zoom;
  });
  expect(width).toBeGreaterThanOrEqual(2);
  expect(width).toBeLessThanOrEqual(3);
}
