import { expect, test } from '@playwright/test';
import { leuMedia } from '../../../src/lib/content/leu-media';
import { sampleFor } from '../../../src/lib/experience/samples';

// The real homepage renders these buttons in SSR, before Svelte attaches events.
// Wait for the actual delegated handler before testing an interactive selection.
async function ready(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const button = document.querySelector('.project-index button');
    return button && Object.getOwnPropertySymbols(button).some(symbol =>
      symbol.description === 'events' && typeof (button as any)[symbol]?.click === 'function');
  });
}

test.beforeEach(async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.name.includes('mobile')
    ? { width: 390, height: 844 } : { width: 1440, height: 1020 });
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/#work');
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await ready(page);
});

test('Leu starts promptly, has product motion in the first second, and shares exact media with its case study', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    (window as any).leuSelectedAt = performance.now();
    document.querySelectorAll<HTMLButtonElement>('.project-index button')[3].click();
  });
  const film = page.locator('.leu-flow-loop video');
  const firstFrameMs = await film.evaluate(video => new Promise<number>(resolve => {
    (video as HTMLVideoElement).requestVideoFrameCallback(() => resolve(performance.now() - (window as any).leuSelectedAt));
  }));
  expect(firstFrameMs).toBeLessThan(1000);
  await expect(film).toHaveJSProperty('paused', false);
  await expect(film).toHaveJSProperty('muted', true);
  await expect(film).toHaveJSProperty('loop', true);
  await expect(film).toHaveAttribute('playsinline', '');
  await expect(film).toHaveAttribute('preload', 'auto');

  // Decode actual early frames. Advancing currentTime alone cannot detect dead footage.
  const metrics = await film.evaluate(async element => {
    const video = element as HTMLVideoElement;
    video.pause();
    const canvas = document.createElement('canvas');
    canvas.width = 360; canvas.height = 750;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    async function frame(time: number) {
      if (video.currentTime !== time) {
        const seek = new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }));
        video.currentTime = time;
        await seek;
      }
      ctx.drawImage(video, 0, 0, 360, 750);
      return ctx.getImageData(0, 0, 360, 750).data;
    }
    const first = await frame(0);
    const tap = await frame(.15);
    const opening = await frame(.55);
    const last = await frame(video.duration - 1 / 60);
    function difference(a: Uint8ClampedArray, b: Uint8ClampedArray) {
      let sum = 0, changed = 0;
      for (let i = 0; i < a.length; i += 4) {
        const delta = Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
        sum += delta;
        if (delta > 45) changed++;
      }
      return { mean: sum / (a.length / 4 * 3), changed };
    }
    const poster = new Image(); poster.src = video.poster; await poster.decode();
    ctx.drawImage(poster, 0, 0, 360, 750);
    const posterPixels = ctx.getImageData(0, 0, 360, 750).data;
    video.currentTime = 0;
    await video.play();
    return { duration: video.duration, src: video.currentSrc, poster: video.poster,
      tap: difference(first, tap), opening: difference(first, opening),
      seam: difference(first, last), posterDifference: difference(first, posterPixels) };
  });
  expect(metrics.tap.changed).toBeGreaterThan(30);
  expect(metrics.opening.changed).toBeGreaterThan(2000);
  expect(metrics.seam.mean).toBeLessThan(3);
  expect(metrics.posterDifference.mean).toBeLessThan(3);
  expect(metrics.duration).toBeCloseTo(leuMedia.duration, 1);
  expect(metrics.src).toMatch(/leu-loop-v2\.(webm|mp4)$/);
  await testInfo.attach('startup-and-frame-evidence', { body: JSON.stringify({ firstFrameMs, ...metrics }, null, 2), contentType: 'application/json' });

  await page.getByRole('link', { name: 'View Leu case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/leu$/);
  const projectFilm = page.locator('article [data-hero-media] .leu-flow-loop video');
  await projectFilm.scrollIntoViewIfNeeded();
  await expect(projectFilm).toHaveJSProperty('currentSrc', metrics.src);
  await expect(projectFilm).toHaveAttribute('poster', leuMedia.posterFallback);
  await expect(projectFilm).toHaveJSProperty('paused', false);
  expect(await projectFilm.evaluate(video => (video as HTMLVideoElement).poster)).toBe(metrics.poster);
  await expect(page.locator('.loop-controls')).toHaveCSS('font-size', '12px');
  const pause = page.getByRole('button', { name: 'Pause Leu film', exact: true });
  expect(await pause.evaluate(button => getComputedStyle(button).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  // Exercise the native loop boundary as well as comparing its decoded frames.
  await projectFilm.evaluate(video => { (video as HTMLVideoElement).currentTime = (video as HTMLVideoElement).duration - .1; });
  await expect.poll(() => projectFilm.evaluate(video => (video as HTMLVideoElement).currentTime)).toBeLessThan(1);
  await expect(projectFilm).toHaveJSProperty('paused', false);
  await page.goBack();
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await page.getByRole('button', { name: /^Leu/ }).click();
  await expect(page.locator('.leu-flow-loop video')).toHaveJSProperty('paused', false);
});

for (const activation of ['click', 'keyboard'] as const) {
  test(`media navigation uses semantic links with ${activation} activation and healthy Back navigation`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [name, slug] of [['F24', 'f24'], ['Flow', 'flow'], ['Leu', 'leu']]) {
      await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
      const link = page.getByRole('link', { name: `View ${name} case study`, exact: true });
      await expect(link).toHaveAttribute('href', `/work/${slug}`);
      expect(await link.locator('button, input, select').count()).toBe(0);
      if (activation === 'keyboard') {
        await link.focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await expect(link).toBeFocused();
        expect(await link.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
        await link.press('Enter');
      } else await link.click();
      await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
      await expect(page.locator('h1')).toBeVisible();
      await page.goBack();
      await expect(page.locator('.project-index button')).toHaveCount(4);
      await ready(page);
    }
  });
}

test('reduced motion preserves the poster, explicit Play works, and inactive media is not fetched', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const movies: string[] = [];
  page.on('request', request => { if (/\.(webm|mp4)$/.test(request.url())) movies.push(request.url()); });
  await page.reload();
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await ready(page);
  await page.getByRole('button', { name: /^Leu/ }).click();
  const film = page.locator('.leu-flow-loop video');
  await expect(film).not.toHaveAttribute('src');
  await expect(film).toHaveAttribute('poster', leuMedia.posterFallback);
  await expect(film).toHaveJSProperty('paused', true);
  expect(movies).toEqual([]);
  await page.getByRole('button', { name: 'Play Leu film', exact: true }).click();
  await expect(film).toHaveJSProperty('paused', false);
  await expect.poll(() => movies.length).toBeGreaterThan(0);
  await expect.poll(() => film.evaluate(video => (video as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  expect(movies.every(url => /\/leu\/leu-loop-v2\./.test(url))).toBe(true);
  await page.getByRole('button', { name: 'Pause Leu film', exact: true }).click();
  await expect(film).toHaveJSProperty('paused', true);
  await page.getByRole('button', { name: /^Flow/ }).click();
  await expect(page.locator('.leu-flow-loop')).toHaveCount(0);
  await expect(page.locator('#work video')).toHaveJSProperty('paused', true);
});

test('WebM failure uses the same MP4 fallback on both pages', async ({ page }) => {
  await page.route('**/leu-loop-v2.webm', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: /^Leu/ }).click();
  await expect(page.locator('.leu-flow-loop video')).toHaveAttribute('src', leuMedia.src);
  await expect(page.locator('.leu-flow-loop video')).toHaveJSProperty('paused', false);
  await page.getByRole('link', { name: 'View Leu case study', exact: true }).click();
  const film = page.locator('article [data-hero-media] .leu-flow-loop video');
  await film.scrollIntoViewIfNeeded();
  await expect(film).toHaveAttribute('src', leuMedia.src);
  await expect(film).toHaveJSProperty('paused', false);
});

test('a direct reduced-motion case-study visit can play and pause after hydration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/leu');
  const film = page.locator('article .leu-flow-loop video');
  await film.scrollIntoViewIfNeeded();
  await expect(film).not.toHaveAttribute('src');
  await page.getByRole('button', { name: 'Play Leu film', exact: true }).click();
  await expect.poll(() => film.evaluate(video => (video as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect(film).toHaveJSProperty('paused', false);
  await page.getByRole('button', { name: 'Pause Leu film', exact: true }).click();
  await expect(film).toHaveJSProperty('paused', true);
});

test('all projects retain shared geometry and Second Voice controls remain independent of navigation', async ({ page, context, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const sizes: { width: number; height: number }[] = [];
  for (const name of ['Second Voice AI', 'F24', 'Flow', 'Leu']) {
    await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
    sizes.push((await page.locator('.stage > .frame').boundingBox())!);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  sizes.forEach(size => { expect(size.width).toBeCloseTo(sizes[0].width, 1); expect(size.height).toBeCloseTo(sizes[0].height, 1); });
  expect(sizes[0].height).toBe(page.viewportSize()!.width === 390 ? 780 : 560);
  await page.getByRole('button', { name: /^Second Voice AI/ }).click();
  expect(await page.locator('.authors').evaluate(element => element.closest('a'))).toBeNull();
  await page.getByRole('tab', { name: 'King', exact: true }).click();
  await page.getByRole('radio', { name: 'Strong', exact: true }).check();
  await page.getByRole('button', { name: 'Show King example', exact: true }).click();
  await expect(page.locator('.rewrite')).toHaveText(sampleFor('King', 'Strong'));
  await page.getByRole('button', { name: 'Regenerate', exact: true }).click();
  await expect(page.locator('.rewrite')).toHaveText(sampleFor('King', 'Strong'));
  await page.getByRole('button', { name: 'Copy rewrite', exact: true }).click();
  if (browserName === 'chromium') await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(sampleFor('King', 'Strong'));
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator('.links').getByRole('link', { name: 'Case study', exact: true })).toHaveAttribute('href', '/work/second-voice-ai');
});
