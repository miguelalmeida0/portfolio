import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('case dialog tabs through buttons and links in both directions and restores its trigger', async ({ page }) => {
  await page.goto('/');
  await page.locator('#f24 .project-shot').click();
  const dialog = page.locator('#case-dialog');
  const close = dialog.locator('.dialog-close');
  const next = dialog.locator('.dialog-next');
  await expect(close).toBeFocused();
  for (const target of [next, close, next]) {
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
  }
  for (const target of [close, next, close]) {
    await page.keyboard.press('Shift+Tab');
    await expect(target).toBeFocused();
  }

  // Next case replaces the dialog contents and introduces a link between buttons.
  await next.click();
  await expect(dialog.locator('#case-title')).toContainText('Second Voice');
  const app = dialog.getByRole('link', { name: 'Open app' });
  await close.focus();
  for (const target of [app, next, close]) {
    await page.keyboard.press('Tab');
    await expect(target).toBeFocused();
  }
  for (const target of [next, app, close]) {
    await page.keyboard.press('Shift+Tab');
    await expect(target).toBeFocused();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('#second-voice .project-preview-action')).toBeFocused();
});
