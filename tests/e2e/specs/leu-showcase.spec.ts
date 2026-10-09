import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

async function captureGallery(page: import('@playwright/test').Page, name: string) {
  if (!process.env.LEU_QA_DIR) return;
  mkdirSync(process.env.LEU_QA_DIR, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press('Control+Home');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  const box = await page.getByRole('region', { name: 'Leu across phone and browser' }).boundingBox();
  const image = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await sharp(image).extract({ left: Math.round(box!.x), top: Math.round(box!.y), width: Math.floor(box!.width), height: Math.floor(box!.height) }).png().toFile(`${process.env.LEU_QA_DIR}/${name}.png`);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/work/leu');
});

// Replaces the former single-image hero check with the paired exhibit's real
// handset and browser proportions, including the narrowest supported layout.
test('paired screens retain their proportions across phone and desktop widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/leu');
    const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
    for (const image of await gallery.getByRole('img').all()) {
      await expect.poll(() => image.evaluate(i => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
    const phone = await gallery.locator('.phone-screen').boundingBox();
    const desktop = await gallery.locator('.browser-stage').boundingBox();
    expect(phone!.height / phone!.width).toBeGreaterThan(2.05);
    expect(phone!.height / phone!.width).toBeLessThan(2.12);
    expect(Math.abs(desktop!.width / desktop!.height - 1363 / 936)).toBeLessThan(.012);
    expect(phone!.width).toBeGreaterThan(100);
    expect(desktop!.width).toBeGreaterThan(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

// Catches a focus control that hides the wrong platform or resets the scene.
test('platform focus preserves the selected scene and restores both interfaces', async ({ page }) => {
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  await expect(gallery).toBeVisible();
  await captureGallery(page, 'desktop-read');
  await gallery.getByRole('button', { name: 'Library', exact: true }).click();
  await expect(gallery.getByRole('img', { name: 'Leu on iPhone: Library' })).toBeVisible();
  await gallery.getByRole('button', { name: 'Phone', exact: true }).click();
  await expect(gallery.getByRole('img', { name: 'Leu in your browser: Library' })).toBeHidden();
  await expect(gallery.getByRole('img', { name: 'Leu on iPhone: Library' })).toBeVisible();
  await gallery.getByRole('button', { name: 'Desktop', exact: true }).click();
  await expect(gallery.getByRole('img', { name: 'Leu in your browser: Library' })).toBeVisible();
  await expect(gallery.getByRole('img', { name: 'Leu on iPhone: Library' })).toBeHidden();
  await gallery.getByRole('button', { name: 'Together', exact: true }).click();
  await expect(gallery.getByRole('img', { name: 'Leu on iPhone: Library' })).toBeVisible();
});

// Catches one scene changing only a caption while retaining the previous images.
test('every scene changes both real screens and remains keyboard operable', async ({ page }) => {
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  let lastPhone = '', lastBrowser = '';
  for (const scene of ['Home', 'Library', 'Read', 'Tell it back']) {
    const control = gallery.getByRole('button', { name: scene, exact: true });
    await control.press('Enter');
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    const phone = gallery.getByRole('img', { name: `Leu on iPhone: ${scene}` });
    const desktop = gallery.getByRole('img', { name: `Leu in your browser: ${scene}` });
    await expect(phone).toBeVisible();
    await expect(desktop).toBeVisible();
    const phoneScreen = await phone.getAttribute('data-scene');
    const browserScreen = await desktop.getAttribute('src');
    expect(phoneScreen).not.toBe(lastPhone);
    expect(browserScreen).not.toBe(lastBrowser);
    lastPhone = phoneScreen!; lastBrowser = browserScreen!;
    await expect.poll(() => desktop.evaluate(i => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await captureGallery(page, `desktop-${scene.toLowerCase().replaceAll(' ', '-')}`);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await expect(page.getByRole('region', { name: 'Interactive reading loop' })).toBeVisible();
});

// Catches fixed desktop tracks clipping phone controls or screens on small devices.
test('the gallery fits narrow screens and keeps focus controls reachable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  await gallery.getByRole('button', { name: 'Phone', exact: true }).click();
  await expect(gallery.getByRole('img', { name: 'Leu on iPhone: Read' })).toBeVisible();
  await expect(gallery.locator('.phone-screen')).toHaveCSS('opacity', '1');
  await expect(gallery.getByRole('img', { name: 'Leu in your browser: Read' })).toBeHidden();
  const control = await gallery.getByRole('button', { name: 'Desktop', exact: true }).boundingBox();
  expect(control!.height).toBeGreaterThanOrEqual(44);
  expect(control!.x + control!.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await captureGallery(page, 'mobile-phone');
  await gallery.getByRole('button', { name: 'Desktop', exact: true }).press('Enter');
  await expect(gallery.getByRole('img', { name: 'Leu in your browser: Read' })).toBeVisible();
  await gallery.getByRole('button', { name: 'Together', exact: true }).click();
  await captureGallery(page, 'mobile-together');
});
