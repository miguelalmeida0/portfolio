import { expect, test, type Page, type Locator } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const routes = ['/', '/story', '/cv', '/work/second-voice-ai', '/work/f24', '/work/flow', '/work/leu', '/out/linkedin'];

for (const width of [1440, 390]) {
  for (const entry of ['/#top', '/story', '/work/flow']) {
    test(`header stays in the same tab from ${entry} at ${width}px`, async ({ page, context }) => {
      await page.setViewportSize({ width, height: 844 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(entry);
      for (const [label, path] of [['Story', '/story'], ['CV', '/cv'], ['Work', '/#work'], ['Contact', '/#contact']]) {
        if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
        const nav = page.getByRole('navigation', { name: width === 390 ? 'Mobile navigation' : 'Main navigation', exact: true });
        const link = nav.getByRole('link', { name: label, exact: true });
        await expect(link).not.toHaveAttribute('target', '_blank');
        await link.click();
        await expect(page).toHaveURL('http://localhost:4173' + path);
        await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
        await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
        await expect(page.locator('main h1')).toBeVisible();
        await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
        if (width === 390) await expect(page.locator('#mobile-navigation')).toHaveCount(0);
        expect(context.pages()).toHaveLength(1);
      }
      await page.goBack();
      await expect(page).toHaveURL('http://localhost:4173/#work');
      await page.goForward();
      await expect(page).toHaveURL('http://localhost:4173/#contact');
      expect(context.pages()).toHaveLength(1);
      expect(errors).toEqual([]);
    });
  }
}

async function auditLinks(page: Page) {
  const links = await page.locator('a[href]').evaluateAll(elements => elements.map(element => {
    const a = element as HTMLAnchorElement;
    return { href: a.getAttribute('href')!, target: a.target, rel: a.rel, download: a.hasAttribute('download'), identityHome: a.hasAttribute('data-identity-home'), headerNavigation: Boolean(a.closest('header nav')) };
  }));
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) {
    expect(link.href).not.toMatch(/mirror-ai|mirror-replay/);
    if (link.identityHome) {
      expect(link.href).toBe('/#top');
      expect(link.target).not.toBe('_blank');
    } else if (/\.pdf(?:[?#]|$)/i.test(link.href)) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    } else if (link.headerNavigation || !/^(https?:)?\/\//i.test(link.href) || new URL(link.href, 'https://miguelalmeida.is-a.dev').origin === 'https://miguelalmeida.is-a.dev' || link.download) {
      expect(link.target, link.href).not.toBe('_blank');
    } else {
      expect(link.target, link.href).toBe('_blank');
      expect(link.rel.split(' '), link.href).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
    }
  }
}

async function openDestination(page: Page, link: Locator, path: string) {
  const count = page.context().pages().length;
  await expect(link).not.toHaveAttribute('target', '_blank');
  await link.click();
  await page.waitForURL(url => url.pathname === path);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  expect(page.context().pages()).toHaveLength(count);
}

for (const width of [1440, 390]) test(`project images and case-study links stay in this tab at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  for (const [name, slug] of [['F24', 'f24'], ['Flow', 'flow'], ['Leu', 'leu']]) {
    await openPortfolioHome(page);
    await page.locator('.project-index button').filter({ hasText: name }).click();
    await openDestination(page, page.getByRole('link', { name: `View ${name} case study`, exact: true }), `/work/${slug}`);
    await page.goBack();
    await expect(page.locator('.wind-hero')).toBeVisible();
    expect(page.context().pages()).toHaveLength(1);
  }
});

test('live app and contact profiles open a new tab while the portfolio remains open', async ({ page, context }) => {
  await openPortfolioHome(page);
  await context.route('https://**/*', route => route.fulfill({ contentType: 'text/html', body: '<h1>External destination</h1>' }));
  for (const link of [page.locator('#work .links').getByRole('link', { name: 'Open app', exact: true }), page.locator('#contact a[href*="linkedin.com"]').first(), page.locator('#contact a[href*="github.com"]').first()]) {
    const href = await link.getAttribute('href');
    const original = page.url();
    const next = page.waitForEvent('popup');
    await link.click();
    const popup = await next;
    await popup.waitForLoadState();
    expect(popup.url()).toBe(href);
    expect(page.url()).toBe(original);
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await popup.close();
  }
});

test('destination targets exist in server HTML before JavaScript runs', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of routes) {
    const response = await page.goto('http://localhost:4173' + route);
    expect(response?.status(), route).toBe(200);
    await auditLinks(page);
  }
  await context.close();
});

for (const width of [1440, 390]) test(`all live routes and dynamically selected projects use the policy at ${width}px`, async ({ page, request }) => {
  await page.setViewportSize({ width, height: 1020 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const internal = new Set<string>();
  for (const route of routes) {
    if (route === '/') await openPortfolioHome(page);
    else await page.goto(route);
    await auditLinks(page);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll(links => links.map(a => a.getAttribute('href')!));
    hrefs.forEach(href => internal.add(href.split('#')[0]));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    if (width === 390) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await auditLinks(page);
      await page.getByRole('button', { name: 'Close', exact: true }).click();
    }
  }
  await openPortfolioHome(page);
  for (const name of ['Second Voice AI', 'F24', 'Flow', 'Leu']) {
    await page.locator('.project-index button').filter({ hasText: name }).click();
    await auditLinks(page);
  }
  for (const path of internal) expect((await request.get(path)).status(), path).toBe(200);
  expect(errors).toEqual([]);
});

test('case studies stay in this tab and external evidence opens separately', async ({ page, context }) => {
  await openPortfolioHome(page);
  await openDestination(page, page.locator('#work .links').getByRole('link', { name: 'Case study', exact: true }), '/work/second-voice-ai');
  await openPortfolioHome(page);
  await page.locator('.project-index button').filter({ hasText: 'Leu' }).click();
  await openDestination(page, page.getByRole('link', { name: 'View Leu case study', exact: true }), '/work/leu');
  await page.goto('/work/leu');
  await expect(page.locator('.incident-index')).toHaveCount(0);
  await expect(page.getByText('Seven investigations that changed the system.', { exact: true })).toHaveCount(0);
  await expect(page.locator('.incident')).toHaveCount(7);
  const evidence = page.getByRole('link', { name: 'Read the V36 evaluation', exact: true });
  const href = await evidence.getAttribute('href');
  // Isolate tab behavior from third-party availability. The real href is retained.
  await context.route('https://github.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Evidence destination</h1>' }));
  const original = page.url();
  const next = page.waitForEvent('popup');
  await evidence.click();
  const popup = await next;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(href);
  expect(page.url()).toBe(original);
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await popup.close();
});

test('mobile menu navigates in the same tab and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'CV', exact: true }).click();
  await expect(page).toHaveURL(/\/cv$/);
  expect(page.context().pages()).toHaveLength(1);
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert', '');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/\/cv#contact$/);
  await expect(page.locator('#contact')).toBeFocused();
});

test('Ask interception still asks while internal answer sources navigate in this tab', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolioHome(page);
  await page.keyboard.press('/');
  await expect(page.locator('html')).toHaveClass(/ask-on/);
  await page.locator('[data-ask-id="cv"]').click();
  await expect(page.locator('.ask-heading')).toHaveText('Can I see his CV?');
  expect(page.context().pages()).toHaveLength(1);
  await expect(page.locator('.ask-sources a').first()).toBeVisible();
  await auditLinks(page);
  const source = page.locator('.ask-sources a').first();
  const path = new URL((await source.getAttribute('href'))!, page.url()).pathname;
  await openDestination(page, source, path);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
});

test('Mirror AI route, assets, sitemap and next-project link are removed', async ({ page, request }) => {
  for (const path of ['/work/mirror-ai', '/projects/mirror-ai/active-image-demo.mp4', '/projects/mirror-ai/active-image-demo.webm', '/projects/mirror-ai/active-image-demo-poster.jpg', '/projects/mirror-ai/interface-720.webp', '/projects/mirror-ai/interface-1600.webp', '/projects/mirror-ai/aquarium-selection.png', '/evidence/mirror-replay-check.json']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('mirror-ai');
  await page.goto('/work/leu');
  await expect(page.locator('a[href*="mirror"]')).toHaveCount(0);
  await expect(page.locator('a').filter({ hasText: 'Next case study' })).toHaveAttribute('href', '/work/second-voice-ai');
});
