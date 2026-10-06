import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { openPortfolioHome } from '../helpers/portfolio';

const output = path.resolve('artifacts/recruiter-audit-implementation/media');
const sizes = [[1440, 1000], [1280, 900], [1100, 900], [834, 1112], [390, 844]];

for (const [width, height] of sizes) test(`full frames and stable media geometry at ${width}x${height}`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await openPortfolioHome(page);
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveTitle('Miguel Almeida — Frontend engineer & design engineer');
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
  await expect(page.locator('#project-f24 img')).toHaveAttribute('src', '/projects/f24/hackathon.webp');
  await expect(page.locator('#project-leu .media-link')).toHaveCSS('background-color', 'rgb(250, 247, 237)');
  await expect(page.locator('#project-leu .eyebrow')).toHaveText('04 · Also: native work · Independent product · 2026');
  await expect(page.locator('#project-flow .eyebrow')).toHaveText('03 · Independent product · 2026');
  const surfaces = await page.locator('.context-project').evaluateAll(els => els.map(el => ({
    row: el.getBoundingClientRect().toJSON(),
    text: el.querySelector('.context-copy')!.getBoundingClientRect().toJSON(),
    media: el.querySelector('.media-link')!.getBoundingClientRect().toJSON()
  })));
  expect(surfaces).toHaveLength(3);
  for (const { row, text, media } of surfaces) {
    if (width >= 1100) {
      expect(media.left - text.right).toBeCloseTo(56, 0);
      expect(text.width / (row.width - 56)).toBeCloseTo(.36, 2);
      expect(media.width / (row.width - 56)).toBeCloseTo(.64, 2);
    } else {
      expect(media.top).toBeGreaterThan(text.bottom);
      expect(media.width).toBeCloseTo(row.width, 0);
      expect(text.left).toBe(media.left);
    }
  }

  const frames: Record<string, unknown> = {};
  for (const slug of ['leu', 'flow']) {
    const video = page.locator(`#project-${slug} video`);
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).videoWidth)).toBeGreaterThan(0);
    await expect(video).toHaveCSS('object-fit', 'contain');
    const frame = await video.evaluate(el => {
      const v = el as HTMLVideoElement;
      const box = v.getBoundingClientRect();
      const wrapper = v.closest('.surface')!.getBoundingClientRect();
      const scale = Math.min(box.width / v.videoWidth, box.height / v.videoHeight);
      const width = v.videoWidth * scale, height = v.videoHeight * scale;
      const left = box.left + (box.width - width) / 2, top = box.top + (box.height - height) / 2;
      return {
        intrinsic: { width: v.videoWidth, height: v.videoHeight },
        box: box.toJSON(), wrapper: wrapper.toJSON(),
        rendered: { width, height, left, top, right: left + width, bottom: top + height },
        ancestors: [v, v.parentElement!, v.closest('.surface')!].map(node => {
          const css = getComputedStyle(node);
          return { tag: node.tagName, transform: css.transform, filter: css.filter, perspective: css.perspective, clipPath: css.clipPath, overflow: css.overflow, objectPosition: css.objectPosition };
        })
      };
    });
    for (const rect of [frame.box, frame.rendered]) {
      expect(rect.left).toBeGreaterThanOrEqual(frame.wrapper.left - 1);
      expect(rect.top).toBeGreaterThanOrEqual(frame.wrapper.top - 1);
      expect(rect.right).toBeLessThanOrEqual(frame.wrapper.right + 1);
      expect(rect.bottom).toBeLessThanOrEqual(frame.wrapper.bottom + 1);
    }
    for (const ancestor of frame.ancestors) {
      expect(ancestor.transform).toBe('none');
      expect(ancestor.filter).toBe('none');
      expect(ancestor.perspective).toBe('none');
      expect(ancestor.clipPath).toBe('none');
      // Chromium clips replaced video content by default; the wrappers stay open.
      // The rendered-frame bounds above independently prove that no frame is cropped.
      expect(ancestor.overflow).toBe(ancestor.tag === 'VIDEO' ? 'clip' : 'visible');
    }
    expect(frame.ancestors[0].objectPosition).toBe('50% 50%');
    if (slug === 'flow') expect(frame.wrapper.width / frame.wrapper.height).toBeCloseTo(frame.intrinsic.width / frame.intrinsic.height, 2);
    frames[slug] = frame;
  }

  for (const slug of ['f24', 'leu', 'flow']) {
    const surface = page.locator(`#project-${slug} .surface`);
    await surface.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const geometry = () => page.locator(`#project-${slug}, #project-${slug} .surface, #project-${slug} video, #project-${slug} img`).evaluateAll(els => els.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, transform: getComputedStyle(el).transform };
    }));
    const before = await geometry();
    await surface.hover();
    await page.waitForTimeout(300);
    expect(await geometry()).toEqual(before);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);

  // Only one project writes the canonical screenshot names; every project runs assertions.
  if (testInfo.project.name === 'chromium-desktop') {
    await mkdir(output, { recursive: true });
    await writeFile(path.join(output, `geometry-${width}.json`), JSON.stringify({ surfaces, frames, errors }, null, 2));
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, width === 1440 ? 'desktop-1440.png' : width === 834 ? 'tablet-834.png' : width === 390 ? 'mobile-390.png' : `desktop-${width}.png`), fullPage: true });
    for (const slug of ['leu', 'flow']) {
      await page.locator(`#project-${slug}`).evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 48));
      await page.screenshot({ path: path.join(output, `${slug}-${width}.png`) });
    }
    if (width === 1440) {
      await page.locator('#project-f24').evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 48));
      await page.screenshot({ path: path.join(output, 'desktop-f24-leu.png') });
      await page.locator('#project-flow').evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 48));
      await page.screenshot({ path: path.join(output, 'desktop-flow.png') });
      const playback: Record<string, unknown> = {};
      for (const slug of ['leu', 'flow']) {
        const video = page.locator(`#project-${slug} video`);
        await video.scrollIntoViewIfNeeded();
        const frame = () => video.evaluate(el => {
          const v = el as HTMLVideoElement, canvas = document.createElement('canvas');
          canvas.width = v.videoWidth; canvas.height = v.videoHeight;
          canvas.getContext('2d')!.drawImage(v, 0, 0);
          return { time: v.currentTime, png: canvas.toDataURL('image/png').split(',')[1] };
        });
        const start = await frame();
        await page.waitForTimeout(1500);
        const later = await frame();
        expect(later.time).toBeGreaterThan(start.time);
        expect(later.png).not.toBe(start.png);
        await writeFile(path.join(output, `${slug}-frame-start.png`), Buffer.from(start.png, 'base64'));
        await writeFile(path.join(output, `${slug}-frame-later.png`), Buffer.from(later.png, 'base64'));
        playback[slug] = { start: start.time, later: later.time, decodedPixelsChanged: true };
      }
      await writeFile(path.join(output, 'frame-advancement.json'), JSON.stringify(playback, null, 2));
    }
  }
});

test('reduced motion on initial load keeps both posters and never advances either loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(500);
  for (const slug of ['leu', 'flow']) {
    const video = page.locator(`#project-${slug} video`);
    await expect(video).not.toHaveAttribute('autoplay');
    await expect(page.locator(`#project-${slug} img`)).toHaveCSS('opacity', '1');
    expect(await video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBe(0);
  }
  await page.waitForTimeout(1500);
  expect(await page.locator('#work video').evaluateAll(vs => vs.map(v => (v as HTMLVideoElement).currentTime))).toEqual([0, 0]);
});

test('autoplay rejection leaves valid posters without an unhandled error', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Autoplay rejected for this test', 'NotAllowedError'));
    // Also suppress the browser's native autoplay path to model a blocked policy.
    Object.defineProperty(HTMLMediaElement.prototype, 'autoplay', { configurable: true, get: () => false, set: () => undefined });
    const original = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (this instanceof HTMLVideoElement && name === 'autoplay') return;
      original.call(this, name, value);
    };
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.waitForTimeout(500);
  for (const slug of ['leu', 'flow']) {
    await page.locator(`#project-${slug}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#project-${slug} img`)).toHaveCSS('opacity', '1');
    await expect.poll(() => page.locator(`#project-${slug} img`).evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});
