import { expect, test, type Page } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

// Observe every animation frame, including the route commit. Assertions use the
// rendered opacity/geometry and actual h1, not just the owner's phase label.
async function observe(page: Page) {
  await page.evaluate(() => {
    const samples: unknown[] = [];
    const oldHeading = document.querySelector('main h1')?.textContent;
    let started = false;
    const start = performance.now();
    (window as any).__routeSamples = samples;
    const sample = () => {
      const veil = document.querySelector<HTMLElement>('[data-route-veil]')!;
      const phase = veil.dataset.phase;
      started ||= phase !== 'idle';
      const r = veil.getBoundingClientRect();
      const menu = document.querySelector('#mobile-navigation');
      const points = [[1, 1], [innerWidth / 2, innerHeight / 2], [innerWidth - 1, innerHeight - 1]];
      samples.push({ t: performance.now() - start, phase, url: location.pathname,
        old: document.querySelector('main h1')?.textContent === oldHeading,
        heading: document.querySelector('main h1')?.textContent,
        menu: !!menu,
        menuOpacity: menu ? getComputedStyle(menu).opacity : null,
        menuBackground: menu ? getComputedStyle(menu).backgroundColor : null,
        opacity: Number(getComputedStyle(veil).opacity), hidden: veil.hidden,
        fullViewport: r.x === 0 && r.y === 0 && r.width === innerWidth && r.height === innerHeight,
        topmost: points.every(([x, y]) => document.elementFromPoint(x, y) === veil),
        scrollY,
        nativeTransition: document.documentElement.dataset.routeTransition === 'active'
      });
      if (!(started && phase === 'idle') && performance.now() - start < 5000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
}

async function settled(page: Page, path: string) {
  await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('[data-route-veil]')).toBeHidden();
  await expect(page.locator('main h1')).toBeVisible();
}

async function select(page: Page, label: string) {
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: label, exact: true }).click();
}

test.describe('mobile route veil', () => {
  test.skip(({ isMobile }) => !isMobile, 'Burger flow runs on mobile projects');
  for (const viewport of [{ width: 390, height: 844 }, { width: 393, height: 852 }, { width: 430, height: 932 }]) {
    for (const [label, slug] of [['Story', 'story'], ['CV', 'cv']]) {
      test(`${viewport.width}: Home → ${label} stays covered through commit`, async ({ page }, testInfo) => {
        await page.setViewportSize(viewport);
        await openPortfolioHome(page);
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
        await observe(page);
        await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: label, exact: true }).click();
        await settled(page, '/' + slug);
        const samples = await page.evaluate(() => (window as any).__routeSamples);
        await testInfo.attach('animation-frames.json', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' });
        const active = samples.filter((s: any) => s.phase !== 'idle');
        expect(active.length).toBeGreaterThan(0);
        expect(active.some((s: any) => s.phase === 'covering')).toBe(true);
        expect(active.some((s: any) => s.phase === 'revealing')).toBe(true);
        expect(active.every((s: any) => !s.nativeTransition)).toBe(true);
        for (const s of active) {
          // Fading the panel itself would expose the old page through its links.
          if (s.menu) {
            expect(s.menuOpacity).toBe('1');
            expect(s.menuBackground).toBe('rgb(249, 247, 238)');
          }
          if (s.old && !s.menu) expect(s.opacity === 1 && s.fullViewport && s.topmost && !s.hidden).toBe(true);
          if (s.phase === 'covered') expect(s.opacity === 1 && s.fullViewport && s.topmost).toBe(true);
          if (s.phase === 'revealing') {
            expect(s.old).toBe(false);
            expect(s.url).toBe('/' + slug);
            expect(s.scrollY).toBe(0);
          }
        }
        expect(active.at(-1).t - active[0].t).toBeLessThanOrEqual(650);
        await expect(page.locator('#main')).toBeFocused();
      });
    }
  }

  test('rapid route selection creates one history entry', async ({ page }) => {
    await openPortfolioHome(page);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    // Synchronous dispatch deliberately stresses the handler before inert paints.
    await page.locator('#mobile-navigation').evaluate(menu => {
      menu.querySelector<HTMLAnchorElement>('[href="/story"]')!.click();
      menu.querySelector<HTMLAnchorElement>('[href="/cv"]')!.click();
      menu.querySelector<HTMLAnchorElement>('[href="/story"]')!.click();
    });
    await settled(page, '/story');
    await page.goBack();
    await settled(page, '/');
    await page.goForward();
    await settled(page, '/story');
  });

  test('Story → CV → Work and browser history restore scroll', async ({ page }) => {
    await openPortfolioHome(page);
    await select(page, 'Story');
    await settled(page, '/story');
    await select(page, 'CV');
    await settled(page, '/cv');
    await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('manual');
    await page.evaluate(() => window.scrollTo(0, 500));
    expect(await page.evaluate(() => scrollY)).toBe(500);
    await page.goBack();
    await settled(page, '/story');
    await page.goForward();
    await settled(page, '/cv');
    expect(await page.evaluate(() => scrollY)).toBe(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await select(page, 'Work');
    await settled(page, '/#work');
    await expect(page.locator('#work')).toBeFocused();
  });

  test('same-page and cross-route hashes resolve under the veil', async ({ page }) => {
    await openPortfolioHome(page);
    await select(page, 'Work');
    await settled(page, '/#work');
    await expect(page.locator('#work')).toBeFocused();
    expect(await page.locator('#work').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await select(page, 'Story');
    await settled(page, '/story');
    await select(page, 'Work');
    await settled(page, '/#work');
    await expect(page.locator('#work')).toBeFocused();
  });

  test('keyboard and modified links retain their semantics', async ({ page, context }) => {
    await openPortfolioHome(page);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const story = page.locator('#mobile-navigation a[href="/story"]');
    const popup = context.waitForEvent('page');
    await story.click({ modifiers: ['ControlOrMeta'] });
    const newTab = await popup;
    await newTab.waitForURL('**/story');
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
    await expect(story).toBeVisible();
    await newTab.close();
    await story.press('Enter');
    await settled(page, '/story');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('reduced motion still conceals slow navigation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPortfolioHome(page);
    // Hold the real request to prove readiness is not a 200ms timeout.
    let release!: () => void;
    const gate = new Promise<void>(resolve => release = resolve);
    await page.route('**/*', async route => {
      // This app uses a universal load: its route module, rather than a server
      // data endpoint alone, can be the request that gates navigation.
      if (route.request().resourceType() === 'script' || route.request().url().includes('__data.json')) await gate;
      await route.continue();
    });
    await select(page, 'Story');
    try {
      await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'covered');
      await page.waitForTimeout(350);
      await expect(page.locator('[data-route-veil]')).toHaveCSS('opacity', '1');
      expect(await page.locator('[data-route-veil]').evaluate(el => el.getAnimations().length)).toBe(0);
    } finally { release(); }
    await settled(page, '/story');
  });
});

test('desktop navigation retains existing behavior', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop only');
  await openPortfolioHome(page);
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeHidden();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Story', exact: true }).click();
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
});
