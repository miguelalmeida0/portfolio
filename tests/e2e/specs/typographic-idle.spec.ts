import { expect, test } from '@playwright/test';

test('hero has no orbiting project cards or flat-photo rotation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/hero-lab/typographic');
  await expect(page.locator('[data-lab-root]')).toHaveAttribute('data-lab-ready', '');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-identity-home]').focus();
  await page.waitForTimeout(1500);
  const heading = page.locator('[data-back-word="left"]');
  const before = (await heading.boundingBox())!;
  await expect(page.locator('[data-orbit-project]')).toHaveCount(0);
  await expect(page.locator('[data-idle-figure], [data-figure-turn]')).toHaveCount(0);
  await page.waitForTimeout(800);
  const after = (await heading.boundingBox())!;
  expect(Math.abs(before.x - after.x) + Math.abs(before.y - after.y)).toBeLessThan(1);
});

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
test(`opening and closing Ask preserves the portrait and editorial geometry: ${reducedMotion}`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion });
  await page.goto('/hero-lab/typographic');
  await expect(page.locator('[data-mast] [data-ask-trigger]')).toBeEnabled();
  await page.locator('[data-identity-home]').focus();
  const photo = page.locator('[data-figure]');
  const greeting = page.locator('.d1-greeting');
  const before = (await photo.boundingBox())!;
  const greetingBefore = (await greeting.boundingBox())!;
  await page.locator('[data-mast] [data-ask-trigger]').click();
  await expect(page.locator('html')).toHaveClass(/ask-on/);
  const during = (await photo.boundingBox())!;
  expect(Math.abs(during.y - before.y)).toBeLessThan(1);
  expect(Math.abs(during.height - before.height)).toBeLessThan(1);
  expect(Math.abs((await greeting.boundingBox())!.y - greetingBefore.y)).toBeLessThan(3);
  await expect(photo).toBeInViewport();
  await page.getByRole('button', { name: 'Close LLM', exact: true }).click();
  await expect(page.locator('html')).not.toHaveClass(/ask-present/);
  expect(Math.abs((await photo.boundingBox())!.y - before.y)).toBeLessThan(1);
});
}

for (const width of [1440, 390]) {
  test(`original portrait remains available with motion and reduced motion at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/hero-lab/typographic');
    const photo=page.locator('[data-portrait-surface] img');
    await expect(page.locator('[data-lab-root]')).toHaveAttribute('data-lab-ready','');
    await page.locator('[data-identity-home]').focus();
    await expect(photo).toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('[data-lab-root]')).toHaveAttribute('data-lab-motion', 'static');
    await expect(page.getByRole('button', { name: /hero motion/ })).toBeHidden();
    await expect(photo).toBeVisible();
    await expect(page.locator('.portrait-surround, .type-sculpture')).toHaveCount(0);
  });
}

test('Close LLM closes the drawer and restores usable page controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-lab/typographic');
  await page.locator('[data-mast] [data-ask-trigger]').click();
  const close = page.getByRole('button', { name: 'Close LLM', exact: true });
  await expect(close).toBeVisible();
  await close.click();
  await expect(page.locator('[data-ask-panel]')).toBeHidden();
  await expect(page.locator('[data-mast] [data-ask-trigger]')).toBeEnabled();
});
