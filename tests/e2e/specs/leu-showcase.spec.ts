import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

async function captureGallery(page: import('@playwright/test').Page, name: string) {
  if (!process.env.LEU_QA_DIR) return;
  mkdirSync(process.env.LEU_QA_DIR, { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  const box = await page.getByRole('region', { name: 'Leu across phone and browser' }).boundingBox();
  const image = await page.screenshot({ fullPage: true, animations: 'disabled' });
  const scroll = await page.evaluate(() => window.scrollY);
  await sharp(image).extract({ left: Math.round(box!.x), top: Math.round(box!.y + scroll), width: Math.floor(box!.width), height: Math.floor(box!.height) }).png().toFile(`${process.env.LEU_QA_DIR}/${name}.png`);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/work/leu');
});

test('supplied journey opens intact and adapts to a readable phone on mobile', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/leu');
    const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
    const hero = gallery.locator('picture img');
    await expect.poll(() => hero.evaluate(i => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
    const dimensions = await hero.evaluate(i => { const r=i.getBoundingClientRect(), img=i as HTMLImageElement;return {display:r.width/r.height,natural:img.naturalWidth/img.naturalHeight,src:img.currentSrc}; });
    expect(Math.abs(dimensions.display-dimensions.natural)).toBeLessThan(.01);
    expect(dimensions.src).toContain(width<=600?'iphone-home-20261009.webp':'iphone-hero-20261009.webp');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if(width===390||width===1440) await captureGallery(page,`journey-${width}`);
  }
});

test('paired screens preserve the supplied handset and desktop proportions', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/leu');
    const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
    await gallery.getByRole('button',{name:'Read',exact:true}).click();
    const phone = await gallery.locator('.phone-screen').boundingBox();
    const desktop = await gallery.locator('.browser-stage').boundingBox();
    expect(phone!.height / phone!.width).toBeGreaterThan(2.05);
    expect(phone!.height / phone!.width).toBeLessThan(2.12);
    expect(Math.abs(desktop!.width / desktop!.height - 2048 / 1280)).toBeLessThan(.012);
    expect(phone!.width).toBeGreaterThan(100);
    expect(desktop!.width).toBeGreaterThan(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('platform focus preserves the selected scene and restores both interfaces', async ({ page }) => {
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  await gallery.getByRole('button', { name: 'Library', exact: true }).click();
  const phone=gallery.getByRole('img',{name:'Leu on iPhone: Library'}), desktop=gallery.locator('.browser-stage img');
  await expect(phone).toBeVisible();
  await gallery.getByRole('button', { name: 'Phone', exact: true }).click();
  await expect(desktop).toBeHidden();await expect(phone).toBeVisible();
  await gallery.getByRole('button', { name: 'Desktop', exact: true }).click();
  await expect(desktop).toBeVisible();await expect(phone).toBeHidden();
  await gallery.getByRole('button', { name: 'Together', exact: true }).click();
  await expect(phone).toBeVisible();await expect(desktop).toBeVisible();
  await expect(gallery.getByRole('button',{name:'Library',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('every learning step changes the phone and description with keyboard controls', async ({ page }) => {
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  let lastPhone='';
  for (const scene of ['Home', 'Library', 'Read', 'Tell it back']) {
    const control = gallery.getByRole('button', { name: scene, exact: true });
    await control.press('Enter');await expect(control).toHaveAttribute('aria-pressed', 'true');
    const phone = gallery.getByRole('img', { name: `Leu on iPhone: ${scene}` });
    await expect(phone).toBeVisible();
    const phoneScreen=await phone.getAttribute('data-scene');expect(phoneScreen).not.toBe(lastPhone);lastPhone=phoneScreen!;
    await expect.poll(() => phone.evaluate(i => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await expect(gallery.locator('.platform-phone h2')).not.toBeEmpty();
    await expect(gallery.locator('.browser-stage img')).toHaveAttribute('src',/desktop-reading-20261009.webp$/);
    await captureGallery(page,`step-${scene.toLowerCase().replaceAll(' ','-')}`);
  }
  await expect(page.getByRole('region', { name: 'Interactive reading loop' })).toBeVisible();
});

test('complete phone flow scrolls inside its own viewport without page overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });await page.setViewportSize({width:390,height:844});await page.reload();
  const gallery=page.getByRole('region',{name:'Leu across phone and browser'});
  await gallery.getByRole('button',{name:'Phone',exact:true}).click();
  const flow=gallery.locator('.flow-scroll');await expect(flow.getByRole('img')).toHaveAttribute('src',/iphone-flow-20261009.webp$/);
  const m=await flow.evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));expect(m.scroll).toBeGreaterThan(m.client);
  await flow.focus();await page.keyboard.press('ArrowRight');
  await expect.poll(()=>flow.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
  await gallery.getByRole('button',{name:'Read',exact:true}).press('Enter');
  await expect(gallery.locator('.phone-screen')).toHaveCSS('opacity','1');
  for(const button of await gallery.getByRole('button').all()){const b=await button.boundingBox();expect(b!.height).toBeGreaterThanOrEqual(44);expect(b!.x+b!.width).toBeLessThanOrEqual(391);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  await captureGallery(page,'mobile-phone-read');
});
