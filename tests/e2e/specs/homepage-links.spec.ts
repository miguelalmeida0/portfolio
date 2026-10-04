import { expect, test } from '@playwright/test';
import { installClipboardStub, openPortfolioHome, openSecondVoiceStudio, selectWorkProject } from '../helpers/portfolio';

const projects = [['f24', 'F24'], ['flow', 'Flow'], ['leu', 'Leu']] as const;

test('hero presents the role, stack and complete portrait', async ({ page }) => {
  await openPortfolioHome(page);
  const hero = page.locator('.wind-hero');
  await expect(hero.locator('h1')).toHaveAccessibleName('Frontend developer & design engineer.');
  await expect(hero.locator('.hero-stack')).toHaveText('React · TypeScript · Svelte · JavaScript');
  await expect(hero.locator('.experience')).toHaveText('Built a product used by hundreds of companies.');
  await expect(hero.locator('.quality')).toHaveText('Playwright · accessibility');
  const portrait = hero.locator('.portrait');
  await expect(portrait).toHaveAttribute('src', '/images/miguel-contact-editorial.webp');
  await expect(portrait).toHaveCSS('object-fit', 'contain');
  await expect(portrait).toHaveCSS('filter', 'none');
  await expect(hero.locator('canvas, h2')).toHaveCount(0);
  await expect(hero.getByRole('link', { name: 'View CV' })).toHaveAttribute('href', '/cv');
  await expect(hero.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact');
});

test('each selected media surface and case-study link navigate in the same tab', async ({ page }) => {
  await openPortfolioHome(page);
  for (const [slug, name] of projects) {
    for (const surface of ['media', 'caption']) {
      const stage = await selectWorkProject(page, slug);
      const link = surface === 'media'
        ? stage.getByRole('link', { name: `View ${name} case study`, exact: true })
        : page.locator('#work .links').getByRole('link', { name: 'Case study', exact: true });
      await expect(link).toHaveAttribute('href', `/work/${slug}`);
      await expect(link).not.toHaveAttribute('target', '_blank');
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
      await expect(page.locator('main h1')).toContainText(name);
      await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
      expect(page.context().pages()).toHaveLength(1);
      await page.goBack();
      await expect(page.locator('#intro-heading')).toBeVisible();
    }
  }
});

test('keyboard reaches each media anchor and Enter opens its case study', async ({ page }) => {
  await openPortfolioHome(page);
  for (const [slug, name] of projects) {
    const stage = await selectWorkProject(page, slug);
    const media = stage.getByRole('link', { name: `View ${name} case study`, exact: true });
    await media.focus();
    await expect(media).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(media).toBeFocused();
    await expect(media).toHaveCSS('outline-style', 'solid');
    await expect(media).toHaveCSS('outline-width', '3px');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
    await expect(page.locator('main h1')).toContainText(name);
    await page.goBack();
    await expect(page.locator('#intro-heading')).toBeVisible();
  }
});

test('Second Voice controls remain interactive without navigating away', async ({ page }) => {
  await installClipboardStub(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openSecondVoiceStudio(page);
  const voice = page.locator('#work .stage');
  expect(await voice.evaluate(el => el.closest('a'))).toBeNull();
  await expect(page.locator('#work .links').getByRole('link', { name: 'Open app', exact: true })).toHaveAttribute('target', '_blank');
  await voice.getByRole('tab', { name: 'Hemingway', exact: true }).click();
  await expect(voice.getByRole('tab', { name: 'Hemingway', exact: true })).toHaveAttribute('aria-selected', 'true');
  await voice.getByRole('radio', { name: 'Strong', exact: true }).check();
  await voice.getByRole('button', { name: 'Show Hemingway example', exact: true }).click();
  await expect(voice.getByRole('tabpanel')).toContainText('Hemingway · Strong');
  await voice.getByRole('button', { name: 'Compare original', exact: true }).click();
  await expect(voice.locator('[data-playback-phase]')).toHaveText('Every winter, the harbor lights went dark. Elias kept the last lamp burning, though no ship had returned in twenty years.');
  await voice.getByRole('button', { name: 'Copy original', exact: true }).click();
  await expect(voice.getByRole('status').filter({ hasText: /^Copied$/ })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#work .links').getByRole('link', { name: 'Case study', exact: true })).toHaveAttribute('href', '/work/second-voice-ai');
});

test('media links preserve their dimensions on hover and focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openPortfolioHome(page);
  await page.evaluate(() => document.fonts.ready);
  for (const [slug, name] of projects) {
    const stage = await selectWorkProject(page, slug);
    const media = stage.getByRole('link', { name: `View ${name} case study`, exact: true });
    await media.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const geometry = () => media.evaluate(el => [el, ...el.querySelectorAll('video, img')].map(node => {
      const r = node.getBoundingClientRect();
      return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, transform: getComputedStyle(node).transform };
    }));
    const before = await geometry();
    before.forEach(item => expect(item.transform).toBe('none'));
    await media.hover();
    expect(await geometry()).toEqual(before);
    await media.focus();
    expect(await geometry()).toEqual(before);
  }
});
