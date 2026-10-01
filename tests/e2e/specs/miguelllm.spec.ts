// Restores the guide contracts removed from modals.spec.ts/forms.spec.ts in 9d585ce.
import { expect, test, type Page } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

async function openGuide(page: Page) {
  await expect(page.locator('header button[aria-haspopup="dialog"]').first()).toBeEnabled();
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  const mobile = await menu.isVisible();
  if (mobile) await menu.click();
  const trigger = page.getByRole('button', { name: 'Ask MiguelLLM', exact: true }).filter({ visible: true });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Portfolio guide', exact: true });
  await expect(dialog).toBeVisible();
  return { trigger: mobile ? menu : trigger, dialog };
}

test('blank prompt, empty submit, focus containment, Escape and original trigger restoration', async ({ page }) => {
  await page.goto('/story');
  let requests = 0;
  page.on('request', request => { if (request.url().includes('/api/miguel-llm')) requests++; });
  const { trigger, dialog } = await openGuide(page);
  await expect(dialog).toBeFocused();
  await expect(dialog.getByRole('textbox')).toHaveValue('');
  await expect(dialog.getByRole('button', { name: 'Ask', exact: true })).toBeDisabled();
  await dialog.getByRole('textbox').fill('   ');
  await dialog.getByRole('textbox').press('Enter');
  expect(requests).toBe(0);
  await expect(page.locator('[data-guide-background]')).toHaveAttribute('inert', '');
  await page.locator('header a').first().evaluate((node: HTMLElement) => node.focus());
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await dialog.focus();
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Reset portfolio guide conversation' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('[data-guide-background]')).not.toHaveAttribute('inert');
  await expect(trigger).toBeFocused();
});

test('real endpoint supports a preset, reset, typed question and internal answer link', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/story');
  const { dialog } = await openGuide(page);
  await dialog.getByRole('button', { name: 'Which project should I start with?' }).click();
  await expect(dialog.locator('.llm-answer')).toContainText('Second Voice');
  await expect(dialog.locator('.llm-answer')).toContainText('Flow');
  await dialog.getByRole('button', { name: 'Reset portfolio guide conversation' }).click();
  await expect(dialog.getByRole('textbox')).toHaveValue('');
  await expect(dialog.locator('.llm-answer')).toHaveCount(0);
  await dialog.getByRole('textbox').fill('What did Miguel build in Flow?');
  await dialog.getByRole('button', { name: 'Ask', exact: true }).click();
  await expect(dialog.locator('.llm-answer')).toContainText('React interface');
  await dialog.locator('.source-chips a[href="/work/flow"]').click();
  await expect(page).toHaveURL(/\/work\/flow$/);
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText('Flow');
  expect(errors).toEqual([]);
});

for (const [width, height] of [[1440, 1020], [430, 932], [393, 852], [390, 844]]) {
  test(`dialog fits ${width}x${height}, including a reduced viewport for keyboard space`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await page.goto('/story');
    const { trigger, dialog } = await openGuide(page);
    await expect(dialog.getByRole('button', { name: 'Which project should I start with?' })).toBeInViewport();
    await expect(dialog.getByRole('textbox')).toBeInViewport();
    await expect(dialog.getByRole('button', { name: 'Close portfolio guide', exact: true })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`guide-${width}.png`) });
    if (width === 390) {
      await dialog.getByRole('button', { name: 'Which project should I start with?' }).click();
      await expect(dialog.locator('.llm-answer')).toContainText('Second Voice');
      await dialog.getByRole('button', { name: 'Reset portfolio guide conversation' }).click();
      await expect(dialog.getByRole('textbox')).toHaveValue('');
    }
    if (width < 500) {
      await page.setViewportSize({ width, height: 430 });
      await dialog.getByRole('textbox').fill('What is Leu?');
      await expect(dialog.getByRole('textbox')).toBeInViewport();
      await expect(dialog.getByRole('button', { name: 'Close portfolio guide', exact: true })).toBeInViewport();
      await dialog.getByRole('button', { name: 'What production frontend experience does he have?' }).scrollIntoViewIfNeeded();
      await expect(dialog.getByRole('textbox')).toBeInViewport();
    }
    await dialog.getByRole('button', { name: 'Close portfolio guide', exact: true }).click();
    await expect(trigger).toBeFocused();
  });
}

test('existing shortcut opens the shared drawer with project context; offline fallback and reset preserve session limit', async ({ page }) => {
  await page.goto('/story');
  await page.route('**/api/miguel-llm', route => route.abort());
  await expect(page.locator('header button[aria-haspopup="dialog"]').first()).toBeEnabled();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('miguel-llm:open', { detail: { projectSlug: 'leu', mode: 'engineer' } })));
  const dialog = page.getByRole('dialog', { name: 'Portfolio guide' });
  await dialog.getByRole('button', { name: 'What did Miguel build in Leu?' }).click();
  await expect(dialog.locator('.llm-answer')).toContainText('native learning');
  await expect(dialog).toContainText('This attempt did not use a question');
  await page.keyboard.press('Escape');
  await page.evaluate(() => sessionStorage.setItem('miguel-llm-question-count', '5'));
  await page.reload();
  await openGuide(page);
  await dialog.getByRole('button', { name: 'Reset portfolio guide conversation' }).click();
  await expect(dialog.getByRole('textbox')).toBeDisabled();
  await expect(dialog).toContainText('limited to 5 questions');
});

test('current Story, CV and project routes render and share the restored guide', async ({ page }) => {
  await page.goto('/story');
  for (const route of ['/story', '/cv', '/work/second-voice-ai', '/work/f24', '/work/flow', '/work/leu']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const { trigger, dialog } = await openGuide(page);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test('390px menu opens spatial Ask and Leu retains its v2 loop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(menu.getByRole('link')).toHaveText(['Work', 'Story', 'CV', 'Contact']);
  const guideTrigger = menu.getByRole('button', { name: 'Ask MiguelLLM', exact: true });
  await expect(guideTrigger).toBeVisible();
  await guideTrigger.click();
  await expect(menu).toHaveCount(0);
  await expect(page.locator('[data-ask-panel]')).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Portfolio guide', exact: true })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await expect(page.locator('[data-ask-trigger]:visible')).toBeFocused();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.locator('.project-index button').filter({ hasText: 'Leu' }).click();
  const video = page.locator('#work video');
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentSrc)).toMatch(/leu-loop-v2\.(webm|mp4)$/);
  await expect(video).toHaveJSProperty('paused', false);
  const start = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(start);
  await page.goto('/work/leu');
  await expect.poll(() => page.locator('video').first().evaluate((el: HTMLVideoElement) => el.currentSrc)).toMatch(/leu-loop-v2\.(webm|mp4)$/);
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
