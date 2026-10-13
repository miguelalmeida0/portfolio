import { expect, test, type Page } from '@playwright/test';

const projects = ['needle', 'second-voice', 'leu', 'f24', 'flow'];

async function assertNavFits(page: Page) {
  const home = page.locator('#pnav').getByRole('link', { name: 'Back home', exact: true });
  await expect(home).toBeVisible();
  await expect(home).toHaveAttribute('href', '/');
  await expect(home.locator('svg')).toHaveCSS('fill', 'none');
  await expect(home.locator('svg')).not.toHaveCSS('stroke', 'none');
  const box = await home.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  expect(await home.evaluate(el => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  })).toBe(true);
  const layout = await page.locator('#pnav').evaluate(nav => {
    const links = [...nav.querySelectorAll('a')].filter(a => a.getBoundingClientRect().width > 0);
    const boxes = links.map(a => a.getBoundingClientRect());
    return {
      contained: boxes.every(r => r.left >= 0 && r.right <= innerWidth && r.top >= 0),
      overlap: boxes.some((a, i) => boxes.slice(i + 1).some(b =>
        a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)),
      clipped: links.some(a => a.scrollWidth > a.clientWidth + 1),
    };
  });
  expect(layout).toEqual({ contained: true, overlap: false, clipped: false });
  return home;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
});

for (const project of projects) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`${project} ${width}px: home works from direct entry, middle and bottom`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      for (const position of ['top', 'middle', 'bottom']) {
        await page.goto(`/work/${project}`);
        await expect(page.locator('#pnav')).toBeVisible();
        // Wait for hydration so this exercises the portfolio's navigation/scroll owners.
        await expect(page.locator('#pnav ul a[aria-current]')).not.toHaveCount(0);
        if (position !== 'top') {
          await page.evaluate(position => window.scrollTo({
            top: (document.documentElement.scrollHeight - innerHeight) * (position === 'middle' ? 0.5 : 1),
            behavior: 'instant',
          }), position);
          await expect.poll(() => page.locator('#pnav').evaluate(el => el.getBoundingClientRect().top)).toBe(0);
          if (position === 'bottom') {
            // Lazy images may extend the document after the first scroll.
            await expect.poll(() => page.evaluate(() => {
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
              return Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY);
            })).toBeLessThanOrEqual(1);
          }
        }
        const home = await assertNavFits(page);
        if (width === 1440) await expect(home.locator('span')).toBeVisible();
        if (width <= 390) await expect(home.locator('span')).toBeHidden();
        const actionName = project === 'f24' ? 'Explore demo' : project === 'flow' ? 'Code' : 'Try it';
        await expect(page.locator('#pnav').getByRole('link', { name: actionName, exact: true })).toBeVisible();
        if (project !== 'f24') await expect(page.locator('#pnav').getByRole('link', { name: 'Code', exact: true })).toBeVisible();
        if (position === 'bottom') await page.screenshot({ path: testInfo.outputPath('bottom.png') });
        await home.click();
        await expect(page).toHaveURL('/');
        await expect(page.locator('[data-homepage]')).toBeVisible();
      }
    });
  }

  test(`${project}: home interrupts an active section scroll`, async ({ page }) => {
    await page.goto(`/work/${project}`);
    await expect(page.locator('#pnav ul a[aria-current]')).not.toHaveCount(0);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'instant' }));
    await page.locator('#pnav [data-project-identity]').click();
    const moving = await page.evaluate(async () => {
      const before = scrollY;
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      return { before, after: scrollY };
    });
    expect(moving.before).toBeGreaterThan(100);
    expect(moving.after).toBeLessThan(moving.before);
    await page.locator('#pnav').getByRole('link', { name: 'Back home', exact: true }).click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-homepage]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  });
}

test('keyboard focus and reduced motion keep the compact home control accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/work/f24');
  const home = await assertNavFits(page);
  await home.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(home).toBeFocused();
  await expect(home).toHaveCSS('outline-style', 'solid');
  await expect(home).toHaveCSS('outline-width', '2px');
  await expect(home).toHaveCSS('transition-duration', '0s');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
});
