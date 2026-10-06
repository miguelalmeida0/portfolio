import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { installClipboardStub, openPortfolioHome } from '../helpers/portfolio';

const projects = [['f24', 'F24'], ['flow', 'Flow'], ['leu', 'Leu']];
const output = path.resolve('artifacts/recruiter-audit-implementation/links');

test('hero presents the role, stack and exact footer portrait', async ({ page }) => {
  await openPortfolioHome(page);
  const hero = page.locator('[aria-labelledby="intro-heading"]');
  await expect(hero.locator("h1")).toHaveAccessibleName("Frontend engineer & product designer.");
  await expect(hero.locator(".facts")).toContainText("JavaScript");
  await expect(hero.locator(".facts dt")).toHaveText(["F24", "Stack", "Quality"]);
  const portrait = hero.locator(".portrait");
  await expect(portrait).toHaveAttribute("src", "/images/wind-portrait-1054.png");
  await expect(portrait).toHaveCSS("object-fit", "cover");
  await expect(portrait).toHaveCSS("filter", "none");
  await expect(hero.locator('canvas')).toHaveCount(0);
  await expect(hero.locator('h2')).toHaveCount(0);
  await expect(hero.getByRole('link', { name: 'View CV' })).toHaveAttribute('href', '/cv');
  await expect(hero.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact');
});

test('each real media surface and title navigate to their internal case study', async ({ page }) => {
  await openPortfolioHome(page);
  for (const [slug, name] of projects) {
    const media = page.locator(`#project-${slug} .media-link`);
    await expect(media).toHaveAttribute('href', `/work/${slug}`);
    await expect(media).toHaveAccessibleName(`View ${name} case study`);
    await expect(media).not.toHaveAttribute('target');
    await expect(media).toHaveCSS('cursor', 'pointer');
    if (slug !== 'f24') await expect(media.locator('video')).not.toHaveAttribute('controls');
    // Videos retain their existing transparent poster layer; click the rendered
    // region so either the video or its fallback bubbles to the same anchor.
    if (slug === 'f24') await media.locator('img').click();
    else await media.click();
    await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
    await expect(page.locator('main h1')).toHaveText(slug === 'f24' ? 'F24' : slug === 'leu' ? 'Leu' : 'Flow');
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#intro-heading')).toBeVisible();
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
    await page.locator(`#project-${slug} .project-link`).click();
    await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
    await expect(page.locator('main h1')).toHaveText(slug === 'f24' ? 'F24' : slug === 'leu' ? 'Leu' : 'Flow');
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#intro-heading')).toBeVisible();
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  }
});

test('Tab reaches each media anchor and Enter opens its case study', async ({ page }) => {
  await openPortfolioHome(page);
  for (const [slug] of projects) {
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
    await page.locator(`#project-${slug} .project-link`).focus();
    await expect(page.locator(`#project-${slug} .project-link`)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator(`#project-${slug} .view-project`)).toBeFocused();
    await page.keyboard.press('Tab');
    if (slug === 'f24') {
      await expect(page.locator(`#project-${slug} a[href="/work/f24#production-decision"]`)).toBeFocused();
    } else {
      await expect(page.locator(`#project-${slug} a[target="_blank"]`)).toBeFocused();
    }
    await page.keyboard.press('Tab');
    const media = page.locator(`#project-${slug} .media-link`);
    await expect(media).toBeFocused();
    await expect(media).toHaveCSS('outline-style', 'solid');
    await expect(media).toHaveCSS('outline-width', '2px');
    expect(await media.evaluate(el => getComputedStyle(el).outlineColor)).not.toBe('rgba(0, 0, 0, 0)');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
    await expect(page.locator('main h1')).toHaveText(slug === 'f24' ? 'F24' : slug === 'leu' ? 'Leu' : 'Flow');
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#intro-heading')).toBeVisible();
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  }
});

test('Second Voice controls remain interactive without navigating away', async ({ page }) => {
  await installClipboardStub(page);
  await openPortfolioHome(page);
  const voice = page.locator('#project-second-voice-ai .surface');
  expect(await voice.evaluate(el => el.closest('a') === null)).toBe(true);
  await expect(voice.locator('a.media-link')).toHaveCount(0);
  const fullApp = voice.getByRole('link', { name: 'Rewrite your own text in the full app' });
  await expect(fullApp).toBeVisible();
  await expect(fullApp).toHaveAttribute('href', 'https://secondvoice-ai.vercel.app/second-voice');
  await expect(fullApp).toHaveAttribute('target', '_blank');
  await voice.getByText('Hemingway', { exact: true }).click();
  await expect(voice.getByRole('radio', { name: 'Hemingway', exact: true })).toBeChecked();
  await voice.getByText('Strong', { exact: true }).click();
  await expect(voice.getByRole('radio', { name: 'Strong', exact: true })).toBeChecked();
  await voice.getByRole('button', { name: 'Show Hemingway example' }).click();
  await expect(voice.getByRole('region', { name: 'Result' })).toContainText('Hemingway · Strong');
  await voice.getByRole('button', { name: 'Compare original' }).click();
  await expect(voice.locator('[data-playback-phase]')).toHaveText('Every winter, the harbor lights went dark. Elias kept the last lamp burning, though no ship had returned in twenty years.');
  await voice.getByRole('button', { name: 'Copy this draft' }).click();
  await expect(voice.getByRole('status').filter({ hasText: 'Draft copied.' })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#project-second-voice-ai .project-link')).toHaveAttribute('href', '/work/second-voice-ai');
});

test('media links preserve their dimensions on hover and focus', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await openPortfolioHome(page);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  const capture = testInfo.project.name === 'chromium-desktop';
  if (capture) {
    await mkdir(output, { recursive: true });
    await page.locator('[aria-labelledby="intro-heading"]').screenshot({ path: path.join(output, 'hero-f24-copy.png') });
  }
  for (const [slug] of projects) {
    const media = page.locator(`#project-${slug} .media-link`);
    await media.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const geometry = () => media.evaluate(el => [el, ...el.querySelectorAll('video, img')].map(node => {
      const r = node.getBoundingClientRect(), css = getComputedStyle(node);
      return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, transform: css.transform };
    }));
    const before = await geometry();
    before.forEach(item => expect(item.transform).toBe('none'));
    await media.hover();
    await page.waitForTimeout(250);
    expect(await geometry()).toEqual(before);
    await media.focus();
    expect(await geometry()).toEqual(before);
    if (slug === 'f24') {
      await expect(media.locator('img')).toHaveAttribute('src', '/projects/f24/hackathon.webp');
    } else {
      const video = media.locator('video');
      await expect(video).toHaveCSS('object-fit', 'contain');
      await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
      await expect(media.locator('img')).toHaveCSS('opacity', '0');
    }
    if (capture) await media.screenshot({ path: path.join(output, `${slug}-media.png`) });
  }
  expect(errors).toEqual([]);
});
