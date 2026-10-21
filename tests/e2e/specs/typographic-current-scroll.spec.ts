import { expect, test, type Page } from '@playwright/test';

const home = '/hero-lab/typographic';
test.use({ video: 'on' });

async function navigate(page: Page, label: 'work' | 'cv') {
  const index = page.getByRole('button', { name: 'Index', exact: true });
  if (await index.isVisible()) {
    await index.click();
    await page.locator(label === 'work'
      ? '#d1-index [data-mobile-route-link][href$="#work"]'
      : '#d1-index [data-mobile-route-link][href$="/cv"]').click();
  } else await page.locator(`[data-mast] [data-ask-id="nav-${label}"]`).click();
}

test('Current choreography reverses, yields to focus, and preserves full looping films', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(home);
  await expect(page.locator('.current-work')).toHaveAttribute('data-motion-owner', 'selected-work');
  const scene = page.locator('[data-current-reveal]').first();
  const art = scene.locator('[data-current-art]');
  const sceneTop = await scene.evaluate(el => el.getBoundingClientRect().top + scrollY);
  const height = (await page.viewportSize())!.height;
  const seek = async (y: number) => {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(350);
  };
  const clip = () => art.evaluate(el => getComputedStyle(el).clipPath);
  await seek(sceneTop - height * .96);
  const before = await clip();
  await seek(sceneTop - height * .35);
  const complete = await clip();
  if ((await page.viewportSize())!.width < 1024) expect(complete).not.toEqual(before);
  await seek(sceneTop - height * .96);
  expect(await clip()).toEqual(before);
  await scene.locator('.preview-link').focus();
  expect(await clip()).toEqual(complete);
  const video = scene.locator('video');
  await expect(video).toHaveJSProperty('loop', true);
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('paused', false);
  const firstTime = await video.evaluate(el => (el as HTMLVideoElement).currentTime);
  await page.waitForTimeout(300);
  expect(await video.evaluate(el => (el as HTMLVideoElement).currentTime)).not.toBe(firstTime);
  await expect(page.locator('[data-project-preview]')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: `artifacts/current-scroll/project-${(await page.viewportSize())!.width}.png` });
  await page.keyboard.press('Home');
  await page.keyboard.press('PageDown');
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('dynamic reduced motion reverts Current transforms and leaves links available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(home);
  await expect(page.locator('.current-work')).toHaveAttribute('data-motion-owner', 'selected-work');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.current-work')).not.toHaveAttribute('data-motion-owner', 'selected-work');
  const art = page.locator('[data-current-art]').first();
  expect(await art.evaluate(el => getComputedStyle(el).transform)).toEqual('none');
  expect(await art.evaluate(el => getComputedStyle(el).clipPath)).toEqual('none');
  await art.locator('..').focus();
  await expect(art.locator('..')).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.current-work')).toHaveAttribute('data-motion-owner', 'selected-work');
});

test('Work anchor and Story/CV navigation remain available without pin spacers', async ({ page }) => {
  await page.goto(`${home}/story`);
  await navigate(page, 'work');
  await expect(page).toHaveURL(new RegExp(`${home}#work$`));
  await expect.poll(() => page.locator('#work').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(200);
  await expect(page.locator('.current-work .pin-spacer')).toHaveCount(0);
  await navigate(page, 'cv');
  await expect(page).toHaveURL(new RegExp(`${home}/cv$`));
  await expect(page.locator('[data-current-reveal]')).toHaveCount(0);
  await expect(page.locator('[data-cv-action]').first()).toBeInViewport();
  await page.goBack();
  await expect(page.locator('.current-work')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
});
