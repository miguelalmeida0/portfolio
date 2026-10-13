import { expect, test, type Locator, type Page } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const plum = 'rgb(89, 22, 60)';
const cream = 'rgb(241, 243, 228)';
const expanded = 'inset(0px round 999px)';

test('server renders one native CV link with decorative duplicates hidden', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  const anchors = [...html.matchAll(/<a\b[^>]*data-ask-id="cv"[^>]*>[\s\S]*?<\/a>/g)];
  expect(anchors).toHaveLength(1);
  const anchor = anchors[0][0];
  expect(anchor).toMatch(/href="\/cv"/);
  expect(anchor).not.toMatch(/\b(?:target|download|role|tabindex)=/);
  expect(anchor).toMatch(/<span class="cv-label[^\"]*">View CV<\/span>/);
  expect(anchor).toMatch(/<span class="cv-reveal[^\"]*" aria-hidden="true">View CV<\/span>/);
  expect(anchor).toMatch(/<span class="cv-orbit[^\"]*" aria-hidden="true">/);
});

async function tabToLink(page: Page, link: Locator) {
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    if (await link.evaluate(element => element === document.activeElement)) return;
  }
  throw new Error('View CV was not reachable with the keyboard');
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`hero CV preserves its destination and legible states at ${width}px`, async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await openPortfolioHome(page);
    await page.evaluate(() => document.fonts.ready);
    const link = page.locator('.hero-actions').getByRole('link', { name: 'View CV', exact: true });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', '/cv');
    await expect(link).not.toHaveAttribute('target', '_blank');
    await expect(link).not.toHaveAttribute('download');
    await expect(link).toHaveCSS('background-color', plum);
    await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(link).toHaveCSS('font-size', width < 768 ? '16px' : '17px');
    await expect(link).toHaveCSS('white-space', 'nowrap');
    await expect(link).toHaveCSS('border-radius', '999px');
    const reveal = link.locator('.cv-reveal');
    const orbit = link.locator('.cv-orbit');
    await expect(reveal).toHaveAttribute('aria-hidden', 'true');
    await expect(reveal).toHaveCSS('background-color', cream);
    await expect(reveal).toHaveCSS('color', plum);
    const orbitBounds = (await orbit.boundingBox())!;
    expect(orbitBounds.width).toBeCloseTo(36, 1);
    expect(orbitBounds.height).toBeCloseTo(36, 1);
    await expect(orbit).toHaveCSS('background-color', cream);
    const bounds = await link.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(48);
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    const initialClip = await reveal.evaluate(element => getComputedStyle(element).clipPath);
    await page.locator('.hero-actions').screenshot({ path: testInfo.outputPath(`default-${width}.png`) });

    if (await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)) {
      await link.hover();
      await expect(reveal).toHaveCSS('clip-path', expanded);
      await expect(orbit).toHaveCSS('background-color', plum);
      await expect(orbit).toHaveCSS('color', cream);
      await expect(link).toHaveCSS('border-color', plum);
      const filledBounds = (await link.boundingBox())!;
      expect(filledBounds.width).toBe(bounds!.width);
      expect(filledBounds.height).toBe(bounds!.height);
      await expect.poll(() => link.locator('.cv-arrow-in').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBe(1);
      await expect.poll(() => link.locator('.cv-arrow-out').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBe(0);
      const arrowBounds = (await link.locator('.cv-arrow-in').boundingBox())!;
      const filledOrbit = (await orbit.boundingBox())!;
      expect(arrowBounds.x).toBeGreaterThan(filledOrbit.x);
      expect(arrowBounds.x + arrowBounds.width).toBeLessThan(filledOrbit.x + filledOrbit.width);
      await page.locator('.hero-actions').screenshot({ path: testInfo.outputPath(`hover-${width}.png`) });
      await page.mouse.move(0, 0);
      await expect(reveal).toHaveCSS('clip-path', initialClip);
    }

    await tabToLink(page, link);
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    // The portfolio's 80% desktop zoom quantizes a 3px outline to 2.5 CSS px.
    expect(await link.evaluate(element => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(2.5);
    await expect(link).toHaveCSS('outline-color', plum);
    await expect(reveal).toHaveCSS('clip-path', expanded);
    await page.locator('.hero-actions').screenshot({ path: testInfo.outputPath(`focus-${width}.png`) });
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/cv$/);
    await expect(page.locator('main h1')).toBeVisible();
    expect(context.pages()).toHaveLength(1);
    expect(errors).toEqual([]);
  });
}

test('reduced motion keeps both states immediate and legible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolioHome(page);
  const link = page.locator('.hero-actions').getByRole('link', { name: 'View CV', exact: true });
  await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
  await tabToLink(page, link);
  await expect(link.locator('.cv-reveal')).toHaveCSS('clip-path', expanded);
  await expect(link.locator('.cv-reveal')).toHaveCSS('color', plum);
  for (const element of await link.locator('.cv-reveal, .cv-arrow').all()) {
    await expect(element).toHaveCSS('transition-property', 'none');
  }
  for (const element of await link.locator('span, svg').all()) {
    await expect(element).toHaveCSS('pointer-events', 'none');
  }
});

test('touch press reveals the fill and cancellation restores it without navigation', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP supplies real touch press/cancel events');
  await openPortfolioHome(page);
  const link = page.locator('.hero-actions').getByRole('link', { name: 'View CV', exact: true });
  const reveal = link.locator('.cv-reveal');
  await link.scrollIntoViewIfNeeded();
  const initialClip = await reveal.evaluate(element => getComputedStyle(element).clipPath);
  const box = (await link.boundingBox())!;
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
  await expect(reveal).toHaveCSS('clip-path', expanded);
  await expect(link.locator('.cv-orbit')).toHaveCSS('background-color', plum);
  await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(reveal).toHaveCSS('clip-path', initialClip);
  await expect(page).not.toHaveURL(/\/cv$/);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page).toHaveURL(/\/cv$/);
  expect(page.context().pages()).toHaveLength(1);
});
