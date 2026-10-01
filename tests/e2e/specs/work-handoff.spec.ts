import { expect, test } from '@playwright/test';
import { variants, notes } from '../../../src/lib/content/second-voice';
import { originalDraft, sampleFor, type Author, type Strength } from '../../../src/lib/experience/samples';

test.beforeEach(async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.use.viewport ?? { width: 1440, height: 1020 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#work');
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
});

test('four projects, initial demo, grounded F24 decision and solo stages', async ({ page }) => {
  const buttons = page.locator('.project-index button');
  await expect(buttons.nth(0)).toHaveAttribute('aria-current', 'true');
  expect(await buttons.allTextContents()).toEqual(expect.arrayContaining([expect.stringContaining('Second Voice AI'), expect.stringContaining('F24'), expect.stringContaining('Flow'), expect.stringContaining('Leu')]));
  for (const [index, id, color] of [[1,'f24','rgb(28, 54, 45)'],[2,'flow','rgb(231, 236, 216)'],[3,'leu','rgb(89, 22, 60)']] as const) {
    // Keyboard activation must retain focus. WebKit does not focus pointer clicks.
    await buttons.nth(index).focus();
    await buttons.nth(index).press('Enter');
    await expect(page.locator('#work')).toHaveAttribute('data-project', id);
    await expect(page.locator('#work')).toHaveCSS('background-color', color);
    await expect(buttons.nth(index)).toBeFocused();
    if (id === 'f24') {
      await expect(page.getByRole('group', { name: 'F24 year' })).toHaveCount(0);
      await expect(page.locator('.decision-title')).toHaveText('From mockups to production.');
    } else {
      await expect(page.locator('.stage')).toHaveAttribute('data-kind', 'solo');
      await expect(page.locator('.card-b')).toHaveCount(0);
      await expect(page.locator('video')).toHaveCSS('object-fit', 'contain');
    }
  }
});

test('author tabs and strength preserve the submitted rewrite until explicit apply', async ({ page }) => {
  const original = await page.locator('.draft').textContent();
  const before = await page.locator('.rewrite').textContent();
  await page.getByRole('tab', { name: 'King', exact: true }).click();
  await expect(page.locator('.rewrite')).toHaveText(before!);
  await expect(page.locator('.note')).toHaveText('Press the button to apply this voice.');
  await page.getByRole('button', { name: 'Show King example' }).click();
  await expect(page.locator('mark')).toHaveCount(variants['King-Balanced'].filter(t => t.changed).length);
  await expect(page.locator('.rewrite')).toHaveText(variants['King-Balanced'].map(t => t.text).join(''));
  await page.getByRole('tab', { name: 'King', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Tolstoy', exact: true })).toBeFocused();
  await page.getByRole('radio', { name: 'Strong', exact: true }).check();
  await page.getByRole('button', { name: 'Show Tolstoy example' }).click();
  await expect(page.locator('.rewrite')).toHaveText(variants['Tolstoy-Strong'].map(t => t.text).join(''));
  await expect(page.locator('.note')).toContainText(notes['Tolstoy-Strong']);
  await expect(page.locator('.draft')).toHaveText(original!);
});

test('all twelve prepared examples expose their own text and marks', async ({ page }) => {
  for (const [key,tokens] of Object.entries(variants)) {
    const [author,strength] = key.split('-');
    await page.getByRole('tab', { name: author, exact: true }).click();
    await page.getByRole('radio', { name: strength, exact: true }).check();
      await page.getByRole('button', { name: `Show ${author} example` }).click();
    await expect(page.locator('.rewrite')).toHaveText(tokens.map(t => t.text).join(''));
    await expect(page.locator('mark')).toHaveCount(tokens.filter(t => t.changed).length);
  }
});

test('recovered edit playback, comparison and copy work for the requested voices', async ({ page, context, browserName }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  for (const [author, strength] of [['Tolkien','Subtle'], ['Tolkien','Strong'], ['King','Balanced'], ['Tolstoy','Balanced'], ['Hemingway','Strong']] as [Author, Strength][]) {
    const previous = await page.locator('.rewrite').textContent();
    await page.getByRole('tab', { name: author, exact: true }).click();
    await page.getByRole('radio', { name: strength, exact: true }).check();
    await expect(page.locator('.rewrite')).toHaveText(previous!);
    await page.getByRole('button', { name: `Show ${author} example` }).click();
    await expect(page.locator('[data-playback-phase]')).not.toHaveAttribute('data-playback-phase', 'complete');
    await expect(page.getByRole('button', { name: 'Playing the edit…', exact: true })).toBeDisabled();
    await expect(page.locator('[data-playback-phase]')).toHaveAttribute('data-playback-phase', 'complete');
    await expect(page.locator('.rewrite')).toHaveText(sampleFor(author, strength));
    await page.getByRole('button', { name: 'Compare original', exact: true }).click();
    await expect(page.locator('.rewrite')).toHaveText(originalDraft);
    if (browserName === 'chromium') {
      await page.getByRole('button', { name: 'Copy original', exact: true }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(originalDraft);
    }
    await page.getByRole('button', { name: 'Show rewrite', exact: true }).click();
    if (browserName === 'chromium') {
      await page.getByRole('button', { name: 'Copy rewrite', exact: true }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(sampleFor(author, strength));
    }
    await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
    await expect(page.locator('[data-playback-phase]')).not.toHaveAttribute('data-playback-phase', 'complete');
    await page.getByRole('button', { name: 'Skip animation', exact: true }).click();
    await expect(page.locator('.rewrite')).toHaveText(sampleFor(author, strength));
  }
});

test('rapid control changes and unmount cancel older playback timers', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await page.getByRole('tab', { name: 'King', exact: true }).click();
  await page.getByRole('button', { name: 'Show King example', exact: true }).click();
  await page.getByRole('tab', { name: 'Tolstoy', exact: true }).click();
  await page.getByRole('radio', { name: 'Subtle', exact: true }).check();
  await page.getByRole('tab', { name: 'Hemingway', exact: true }).click();
  await page.getByRole('radio', { name: 'Strong', exact: true }).check();
  await page.getByRole('button', { name: 'Show Hemingway example', exact: true }).click();
  await expect(page.locator('[data-playback-phase]')).toHaveAttribute('data-playback-phase', 'complete');
  await page.waitForTimeout(1000);
  await expect(page.locator('.submitted')).toHaveText('Hemingway · Strong');
  await expect(page.locator('.rewrite')).toHaveText(sampleFor('Hemingway', 'Strong'));
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await page.locator('.project-index button').nth(2).click();
  await page.waitForTimeout(3500);
  await page.locator('.project-index button').first().click();
  await expect(page.locator('.rewrite')).toHaveText(sampleFor('Tolkien', 'Balanced'));
  expect(errors).toEqual([]);
});

test('all four stage shells have identical geometry at every requested breakpoint', async ({ page }) => {
  for (const [width, height] of [[1440,1000], [834,1112], [430,932], [393,852], [390,844]]) {
    await page.setViewportSize({ width, height });
    const boxes = [];
    const stages = [];
    for (const button of await page.locator('.project-index button').all()) {
      await button.click();
      boxes.push((await page.locator('.frame').boundingBox())!);
      stages.push((await page.locator('.stage').boundingBox())!);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    for (const group of [boxes, stages]) for (const box of group) {
      expect(Math.abs(box.width - group[0].width)).toBeLessThan(.1);
      expect(Math.abs(box.height - group[0].height)).toBeLessThan(.1);
    }
  }
});

test('project navigation has clean typography without counters, numbering or arrows', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const button of await page.locator('.project-index button').all()) {
      await button.click();
      await expect(page.locator('.work-heading')).toHaveText('Selected Work');
      expect(await page.locator('.project-index').textContent()).not.toMatch(/0[1-4]|[↗→]/);
      expect(await page.locator('.links').textContent()).not.toMatch(/[↗→]/);
      const typography = await page.locator('.project-name, .subtitle, .links a, .role, .stack').evaluateAll(elements => elements.map(element => {
        const style = getComputedStyle(element);
        return { family: style.fontFamily, style: style.fontStyle };
      }));
      expect(typography.every(font => font.family.includes('Figtree') && font.style === 'normal')).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('unselected films fetch nothing; reduced motion requires explicit playback', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', req => { if (/\.(mp4|webm)(?:\?|$)/.test(req.url())) requests.push(req.url()); });
  await page.reload();
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await page.waitForTimeout(400);
  expect(requests).toEqual([]);
  await page.locator('.project-index button').nth(2).click();
  await expect(page.locator('video')).not.toHaveAttribute('src');
  await expect(page.locator('video')).toHaveJSProperty('networkState', 0);
  await expect(page.locator('video')).toHaveJSProperty('paused', true);
  await expect(page.locator('video')).toHaveAttribute('preload', 'none');
  expect(requests).toEqual([]);
  await page.getByRole('button', { name: 'Play film' }).click();
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
  await expect.poll(() => requests.some(url => url.includes('/flow/'))).toBe(true);
  expect(requests.some(url => url.includes('/leu/'))).toBe(false);
});

test('normal film playback pauses offscreen and while document is hidden', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', req => { if (/\.(mp4|webm)(?:\?|$)/.test(req.url())) requests.push(req.url()); });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);
  await page.locator('.project-index button').nth(2).click();
  const video = page.locator('video');
  await expect(video).toHaveJSProperty('paused', false);
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('loop', true);
  await expect(video).toHaveJSProperty('autoplay', true);
  expect(requests.some(url => url.includes('/leu/'))).toBe(false);
  await expect(page.locator('.video-frame > *')).toHaveCount(1);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(video).toHaveJSProperty('paused', true);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(video).toHaveJSProperty('paused', false);
  await page.setViewportSize({ width: 1440, height: 600 });
  await page.evaluate(() => scrollTo(0, 0));
  await expect(video).toHaveJSProperty('paused', true);
});

test('work preserves the tidy spacing and stacked minimum card height', async ({ page }) => {
  for (const [width,height] of [[1440,1020],[390,844]]) {
    await page.setViewportSize({ width,height });
    await page.evaluate(() => document.fonts.ready);
    const spacing = await page.locator('#work').evaluate(el => {
      const s = getComputedStyle(el);
      return [s.paddingTop, s.paddingBottom];
    });
    expect(spacing).toEqual(width === 390 ? ['56px', '64px'] : ['96px', '112px']);
    const cards = await page.locator('.stage-card').all();
    for (const card of cards) expect((await card.boundingBox())!.height).toBeGreaterThanOrEqual(440);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const name of ['Flow', 'Leu', 'F24']) {
      await page.locator('.project-index button').filter({ hasText: name }).click();
      await expect(page.locator('.primary-link')).toBeVisible();
      await expect(page.locator('.stack')).not.toBeEmpty();
    }
  }
});

test('no JavaScript leaves four posters and working links', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.static-projects article')).toHaveCount(4);
  await expect(page.locator('.static-projects img')).toHaveCount(4);
  await expect(page.locator('.static-projects a')).toHaveCount(8);
  await expect(page.locator('h1')).toHaveAccessibleName('Frontend developer & design engineer.');
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await context.close();
});
