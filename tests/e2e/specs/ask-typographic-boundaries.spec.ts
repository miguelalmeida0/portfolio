import { expect, test } from '@playwright/test';

// The retired guide must never capture navigation, keyboard input or page content.
for (const width of [390, 768, 1440]) for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`assistant stays removed across navigation at ${width}px with ${reducedMotion}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion });
    const requests: string[] = [];
    page.on('request', request => { if (/\/api\/(ask|miguel-llm)(?:\?|$)/.test(request.url())) requests.push(request.url()); });
    for (const route of ['/', '/story', '/cv', '/work/needle', '/work/second-voice', '/work/leu', '/work/f24', '/work/flow']) {
      await page.goto(route);
      await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase', 'idle');
      await expect(page.locator('[data-ask-id], [data-ask-trigger], [data-ask-panel], .metric-ask')).toHaveCount(0);
      for (const shortcut of ['Control+/', 'Meta+/', '/']) await page.keyboard.press(shortcut);
      // Legacy custom-event callers cannot remount the removed feature either.
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('ask:open'));
        window.dispatchEvent(new CustomEvent('miguel-llm:open'));
      });
      await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
      await expect(page.getByRole('textbox', { name: 'Type your own question' })).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    }
    expect(requests).toEqual([]);
  });
}

for (const width of [390, 768]) test(`Index retains keyboard focus without the guide at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/cv');
  const index = page.getByRole('button', { name: 'Index', exact: true });
  const dialog = page.getByRole('dialog', { name: 'Site index' });
  await index.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close', exact: true }).focus();
  for (const shortcut of ['Control+/', 'Meta+/']) {
    await page.keyboard.press(shortcut);
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(index).toBeFocused();
});
