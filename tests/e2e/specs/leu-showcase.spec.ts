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
  const phone=gallery.getByRole('img',{name:'Leu on iPhone: Library'}), desktop=gallery.locator('.platform-desktop');
  await expect(phone).toBeVisible();
  await gallery.getByRole('button', { name: 'Phone', exact: true }).click();
  await expect(desktop).toBeHidden();await expect(phone).toBeVisible();
  await gallery.getByRole('button', { name: 'Desktop', exact: true }).click();
  await expect(desktop).toBeVisible();await expect(phone).toBeHidden();
  await expect(desktop.locator('[data-desktop-moment="library"]')).toBeVisible();
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
    const captureByPhoneStep: Record<string,string> = {
      Home: 'desktop-home-20261011.webp',
      Library: 'desktop-library-20261011.webp',
      Read: 'desktop-select-20261011.webp',
      'Tell it back': 'desktop-own-words-20261011.webp',
    };
    const expected = captureByPhoneStep[scene];
    const desktop = gallery.locator('.browser-stage img');
    await expect(desktop).toHaveAttribute('src', new RegExp(expected.replaceAll('.', '\\.')));
    await expect.poll(() => desktop.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth === 2048)).toBe(true);
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

test('desktop uses six matching 2048×1280 screenshots, never a Journey panel', async ({ page }) => {
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  const desktopMoments = [
    { label: 'Home', id: 'home', asset: 'desktop-home-20261011.webp' },
    { label: 'Library', id: 'library', asset: 'desktop-library-20261011.webp' },
    { label: 'Read', id: 'read', asset: 'desktop-select-20261011.webp' },
    { label: 'Explain', id: 'explain', asset: 'desktop-explain-20261011.webp' },
    { label: 'Tell it back', id: 'words', asset: 'desktop-own-words-20261011.webp' },
    { label: 'Study', id: 'study', asset: 'desktop-study-20261011.webp' },
  ];
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await gallery.getByRole('button', { name: 'Desktop', exact: true }).click();
    await expect(gallery.getByRole('button', { name: 'The journey', exact: true })).toHaveCount(0);
    await expect(gallery.getByRole('group', { name: 'Choose a desktop screen' }).getByRole('button')).toHaveCount(6);
    let previous = '';
    for (const moment of desktopMoments) {
      const button = gallery.getByRole('button', { name: moment.label, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      const frame = gallery.locator('[data-desktop-moment]');
      await expect(frame).toHaveAttribute('data-desktop-moment', moment.id);
      const img = frame.locator('img');
      await expect(img).toHaveAttribute('src', new RegExp(moment.asset.replaceAll('.', '\\.')));
      await expect.poll(() => img.evaluate((el) => ({
        loaded: (el as HTMLImageElement).complete,
        width: (el as HTMLImageElement).naturalWidth,
        height: (el as HTMLImageElement).naturalHeight,
      }))).toEqual({ loaded: true, width: 2048, height: 1280 });
      const current = await img.getAttribute('src');
      expect(current).not.toBe(previous);
      previous = current!;
      await expect(gallery.locator('.platform-desktop figcaption h2')).not.toBeEmpty();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2)).toBe(true);
  }
});

test('switching Desktop and Phone preserves each platform independently', async ({ page }) => {
  const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
  await gallery.getByRole('button', { name: 'Desktop', exact: true }).click();
  await gallery.getByRole('button', { name: 'Explain', exact: true }).click();
  await expect(gallery.locator('[data-desktop-moment]')).toHaveAttribute('data-desktop-moment', 'explain');
  await gallery.getByRole('button', { name: 'Phone', exact: true }).click();
  await gallery.getByRole('button', { name: 'Home', exact: true }).click();
  await expect(gallery.getByRole('img', { name: 'Leu on iPhone: Home' })).toBeVisible();
  await gallery.getByRole('button', { name: 'Desktop', exact: true }).click();
  await expect(gallery.locator('[data-desktop-moment]')).toHaveAttribute('data-desktop-moment', 'home');
  await gallery.getByRole('button', { name: 'Study', exact: true }).click();
  await gallery.getByRole('button', { name: 'Phone', exact: true }).click();
  await expect(gallery.getByRole('button', { name: 'Study', exact: true })).toHaveCount(0);
});

test('compact Leu showcase keeps choices, context, and active screen together across viewports', async ({ page }) => {
  const showcase = page.getByRole('region', { name: 'Leu across phone and browser' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/leu');
    for (const mode of ['Together', 'Phone', 'Desktop'] as const) {
      await showcase.getByRole('button', { name: mode, exact: true }).click();
      const choices = showcase.locator('.scene-switch');
      const controls = showcase.locator('.showcase-controls');
      const gallery = showcase.locator('.platform-gallery');
      const footprint = await Promise.all([controls.boundingBox(), gallery.boundingBox()]);
      expect(footprint[0], `${width} ${mode}: tabs must be visible`).not.toBeNull();
      expect(footprint[1], `${width} ${mode}: gallery must be visible`).not.toBeNull();
      expect(
        footprint[1]!.y + footprint[1]!.height - footprint[0]!.y,
        `${width} ${mode}: options and full image should fit in the same view`,
      ).toBeLessThan(700);
      const overflow = await choices.evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(overflow, `${width} ${mode}: all screen choices must fit without a horizontal carousel`).toBeLessThanOrEqual(2);
      const image = mode === 'Desktop'
        ? gallery.locator('.platform-desktop .browser-stage img')
        : mode === 'Phone'
          ? gallery.locator('.flow-scroll img, .phone-screen img').first()
          : gallery.locator('.journey-stage img, .platform-desktop .browser-stage img').first();
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
      const bounding = await image.boundingBox();
      expect(bounding!.width, `${width} ${mode}: image must not be cropped horizontally`).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true);
    }
    // The denser six-tab desktop flow stays available without extra scrolling.
    await showcase.getByRole('button', { name: 'Desktop', exact: true }).click();
    for (const label of ['Home', 'Library', 'Read', 'Explain', 'Tell it back', 'Study']) {
      const button = showcase.getByRole('group', { name: 'Choose a desktop screen' }).getByRole('button', { name: label, exact: true });
      await expect(button).toBeVisible();
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }
  }
});
