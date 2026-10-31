import { expect, test } from '@playwright/test';

test.use({ video: 'off' });
test.afterEach(async ({ page }, info) => {
 if (info.status !== info.expectedStatus) console.log('Morrow state:', await page.locator('#morrow video').evaluate((v: HTMLVideoElement) => ({src:v.currentSrc,paused:v.paused,time:v.currentTime,ready:v.readyState,error:v.error?.message,codec:v.canPlayType('video/mp4; codecs=\"avc1.64001F\"')})));
});

for (const width of [390, 1440]) {
  test(`project previews have no playback or Bollard action controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const controls = page.locator('#work').getByRole('button', {
      name: /^(play|pause|resume)|^inspect evidence$|^approve preview$/i
    });
    await expect(controls).toHaveCount(0);
    await expect(page.locator('#morrow').getByRole('link', { name: 'Open Morrow app in a new tab' })).toHaveCount(1);
    await expect(page.locator('#bollard .project-shot')).toHaveAttribute('data-case', 'bollard');
  });
}

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`Morrow autoplays inline on mobile with ${reducedMotion} and resumes after its case study`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    const video = page.locator('#morrow video');
    test.skip(await video.evaluate((v: HTMLVideoElement) => !v.canPlayType('video/mp4; codecs=\"avc1.64001F\"')), 'This browser build does not include H.264 decoding.');
    await expect(video).not.toHaveAttribute('src', /.+/);
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.readyState >= 2 && v.currentTime > 0)).toBe(true);
    const before = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(before + .05);
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.playsInline)).toBe(true);
    await page.locator('#morrow .project-shot').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await page.getByRole('button', { name: 'Close case study' }).click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
    await page.locator('#home').scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });
}

test('an old saved pause cannot stop automatic mobile previews', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => sessionStorage.setItem('portfolio-previews-paused', 'true'));
  await page.goto('/');
  const scene = page.locator('#leu .project-scene');
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-film-playing', 'true');
  const before = await scene.getAttribute('data-film-time');
  await expect.poll(() => scene.getAttribute('data-film-time')).not.toBe(before);
});

test('a temporary mobile autoplay rejection recovers on the next page gesture', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    let gesture = false;
    document.addEventListener('pointerdown', () => { gesture = true; }, { capture: true, once: true });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this.matches('#morrow video') && !gesture) return Promise.reject(new DOMException('Gesture required', 'NotAllowedError'));
      return play.call(this);
    };
  });
  await page.goto('/');
  const video = page.locator('#morrow video');
  test.skip(await video.evaluate((v: HTMLVideoElement) => !v.canPlayType('video/mp4; codecs=\"avc1.64001F\"')), 'This browser build does not include H.264 decoding.');
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('src', /morrow-loop-mobile/);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.locator('#morrow .project-summary').click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
});
