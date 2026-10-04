// Acceptance coverage for the shared, non-modal Ask guide.
import { expect, test, type Page } from '../fixtures';
import { openPortfolioHome, selectWorkProject } from '../helpers/portfolio';

async function openGuide(page: Page) {
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  if (await menu.isVisible()) await menu.click();
  const trigger = page.locator('[data-ask-trigger]:visible');
  await trigger.press('Enter');
  const panel = page.locator('[data-ask-panel]');
  await expect(panel).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/ask-on/);
  return { trigger, panel };
}

async function closeGuide(page: Page) {
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await expect(page.locator('[data-ask-trigger]:visible')).toBeFocused();
}

test('blank prompt prevents empty requests; non-modal page access and Escape restore focus', async ({ page }) => {
  await page.goto('/story');
  let requests = 0;
  page.on('request', request => { if (request.url().includes('/api/ask')) requests++; });
  const { panel } = await openGuide(page);
  const input = panel.getByRole('textbox', { name: 'Type your own question' });
  await expect(input).toHaveValue('');
  await expect(panel.getByRole('button', { name: 'Ask your question' })).toBeDisabled();
  await input.fill('   '); await input.press('Enter');
  expect(requests).toBe(0);
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  const topic = page.locator('[data-ask-id="story-hi"]');
  await topic.focus(); await expect(topic).toBeFocused();
  await input.focus(); await input.press('Tab');
  await expect(page.locator('.ask-close')).toBeFocused();
  await closeGuide(page);
});

test('real endpoint supports a preset, a new question and internal answer navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/story');
  const { panel } = await openGuide(page);
  await panel.getByRole('button', { name: 'Second Voice', exact: true }).click();
  await expect(panel.locator('[data-ask-knowledge]')).toContainText('writer');
  await expect(panel.locator('.ask-sources a[href="/work/second-voice-ai"]')).toBeVisible();
  const input = panel.getByRole('textbox', { name: 'Type your own question' });
  await input.fill('What did Miguel build in Flow?');
  await panel.getByRole('button', { name: 'Ask your question' }).click();
  await expect(panel.locator('[data-ask-knowledge]')).toContainText('deterministic action');
  await panel.locator('.ask-sources a[href="/work/flow"]').first().click();
  await expect(page).toHaveURL(/\/work\/flow$/);
  await expect(panel).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText('From speech to deterministic state.');
  expect(errors).toEqual([]);
});

for (const [width, height] of [[1440, 1020], [430, 932], [393, 852], [390, 844]]) {
  test(`guide fits ${width}x${height}, including keyboard space`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await page.goto('/story');
    const { panel } = await openGuide(page);
    const input = panel.getByRole('textbox', { name: 'Type your own question' });
    await expect(panel.getByRole('button', { name: 'F24', exact: true })).toBeInViewport();
    await expect(input).toBeInViewport();
    await expect(page.locator('.ask-close')).toBeInViewport();
    expect(await panel.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`guide-${width}.png`) });
    if (width < 500) {
      await page.setViewportSize({ width, height: 430 });
      await input.fill('What is Leu?');
      await expect(input).toBeInViewport();
      await expect(page.locator('.ask-close')).toBeInViewport();
      await input.press('Enter');
      await expect(panel.locator('[data-ask-knowledge]')).toContainText('native learning loop');
      await expect(panel.locator('.ask-sources a[href="/work/leu"]').first()).toBeVisible();
      await expect(input).toBeInViewport();
    }
    await closeGuide(page);
  });
}

test('shared shortcut opens Ask; offline and rate-limit failures remain retryable', async ({ page }) => {
  await page.goto('/work/leu');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('miguel-llm:open')));
  const panel = page.locator('[data-ask-panel]');
  await expect(panel).toBeVisible();
  await page.route('**/api/ask', route => route.abort());
  const input = panel.getByRole('textbox', { name: 'Type your own question' });
  await input.fill('What did Miguel build in Leu?'); await input.press('Enter');
  await expect(panel.locator('[data-ask-answer]')).toContainText('connect');
  await expect(panel.getByRole('button', { name: 'Try again' })).toBeVisible();
  await page.unroute('**/api/ask');
  await page.route('**/api/ask', route => route.fulfill({ status: 429, json: {} }));
  await panel.getByRole('button', { name: 'Try again' }).click();
  await expect(panel.locator('[data-ask-answer]')).toContainText('Give it a minute');
  await page.unroute('**/api/ask');
  await panel.getByRole('button', { name: 'Try again' }).click();
  await expect(panel.locator('[data-ask-knowledge]')).toContainText('native learning loop');
      await expect(panel.locator('.ask-sources a[href="/work/leu"]').first()).toBeVisible();
});

test('current Story, CV and all project routes share Ask and restore its trigger', async ({ page }) => {
  for (const route of ['/story', '/cv', '/work/needle', '/work/second-voice-ai', '/work/f24', '/work/flow', '/work/leu']) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await openGuide(page); await closeGuide(page);
  }
});

test('390px menu opens Ask and the visible Leu film advances', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  await openGuide(page);
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Portfolio guide' })).toHaveCount(0);
  await closeGuide(page);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await selectWorkProject(page, 'leu');
  const video = page.locator('#work video');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentSrc)).toMatch(/leu-loop-v2\.(webm|mp4)$/);
  await expect(video).toHaveJSProperty('paused', false);
  const start = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(start);
  await page.goto('/work/leu');
  await expect(page.locator('.cs-leu #try')).toBeVisible();
  await expect(page.locator('.cs-leu .cap')).toContainText('prepared answers');
});

test('uncached refresh preserves current first paint across all seven routes', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Chromium CDP supplies browser-level cache bypass');
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.addInitScript(() => {
    (window as any).__paintViolations = [];
    (window as any).__paintFrames = 0;
    const start = performance.now();
    const sample = () => {
      const header = document.querySelector('header');
      const hero = document.querySelector('.wind-hero');
      if (header && getComputedStyle(header).visibility === 'visible') {
        (window as any).__paintFrames++;
        if (!header.classList.contains('wind-header') || !getComputedStyle(header).fontFamily.includes('Figtree')) (window as any).__paintViolations.push('old or unstyled header');
        if (hero && getComputedStyle(hero).display !== 'grid') (window as any).__paintViolations.push('unstyled hero');
        const card = document.querySelector('.wind-hero .content-card');
        if (card && getComputedStyle(card).backgroundColor !== 'rgb(228, 237, 191)') (window as any).__paintViolations.push('unexpected hero palette');
      }
      if (performance.now() - start < 3000) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await openPortfolioHome(page);
  for (const route of ['/', '/story', '/cv', '/work/second-voice-ai', '/work/f24', '/work/flow', '/work/leu']) {
    await page.goto(route);
    await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
    await Promise.all([page.waitForEvent('domcontentloaded'), cdp.send('Page.reload', { ignoreCache: true })]);
    await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as any).__paintFrames)).toBeGreaterThan(0);
    expect(await page.evaluate(() => (window as any).__paintViolations)).toEqual([]);
  }
});
