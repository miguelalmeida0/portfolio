import { expect, test } from '@playwright/test';

test('current portfolio shell and published work routes are reachable', async ({ page }) => {
  const homeResponse = await page.goto('/');
  expect(homeResponse, 'homepage should return a document response').not.toBeNull();
  expect(homeResponse!.status(), 'homepage should not return an HTTP error').toBeLessThan(400);
  await expect(page.locator('main')).toBeVisible();

  await expect(page.locator("h1")).toHaveAccessibleName("Frontend engineer & product designer.");
  await expect(page).toHaveTitle("Miguel Almeida — Frontend engineer & product designer");
  await expect(page.locator("meta[name=description]")).toHaveAttribute("content", /frontend engineer and product designer/);

  const workRoutes = await page.locator('a[href^="/work/"]').evaluateAll((anchors) => {
    const hrefs = anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href): href is string => Boolean(href));

    return [...new Set(hrefs)];
  });

  expect(workRoutes.length, 'homepage should expose the current project case studies').toBeGreaterThanOrEqual(4);

  for (const href of workRoutes) {
    const response = await page.goto(href);
    expect(response, `${href} should return a document response`).not.toBeNull();
    expect(response!.status(), `${href} should not return an HTTP error`).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  }
});

test('Selected Work grid is scannable and uncropped from phone to desktop', async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#work');
    await expect(page.locator('[data-selected-project]')).toHaveCount(4);
    await expect(page.locator('#projects-heading')).toHaveText('Independent projects');
    await expect(page.locator('#work .preview-toggle')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const rows = await page.locator('[data-selected-project]').evaluateAll(elements => elements.map(el => {
      const copy = el.querySelector<HTMLElement>('.project-info')!.getBoundingClientRect();
      const media = el.querySelector<HTMLElement>('.preview-link')!.getBoundingClientRect();
      return {
        copyX:copy.x, copyY:copy.y, mediaX:media.x, mediaY:media.y, mediaWidth:media.width,
        mediaHeight:media.height,
        videoFit:getComputedStyle(el.querySelector('video')!).objectFit,
        posterFit:getComputedStyle(el.querySelector('img')!).objectFit,
        videoBorder:getComputedStyle(el.querySelector('[data-preview]')!).borderTopWidth,
        tagLayout:getComputedStyle(el.querySelector('.project-tags')!).display,
        stackFont:getComputedStyle(el.querySelector('.project-stack')!).fontStyle
      };
    }));
    for (const [index,row] of rows.entries()) {
      expect(row.videoFit).toBe('contain');
      expect(row.posterFit).toBe('contain');
      expect(row.videoBorder).toBe('0px');
      expect(row.tagLayout).toBe('flex');
      expect(row.stackFont).toBe('normal');
      expect(row.mediaWidth).toBeGreaterThan(100);
      expect(row.mediaHeight).toBeGreaterThan(0);
      expect(row.mediaX).toBeGreaterThanOrEqual(-1);
      expect(row.mediaX+row.mediaWidth).toBeLessThanOrEqual(width+1);
      if(width>=980) expect(index%2===0 ? row.copyX<row.mediaX : row.mediaX<row.copyX).toBe(true);
      else expect(row.mediaY<row.copyY).toBe(true);
    }
  }
});

test('project loops run without clicks and keep native media geometry',async({page})=>{
 await page.goto('/#work');
 for(const id of ['needle','second-voice-ai','leu','flow']) {
  const frame=page.locator(`[data-selected-project="${id}"] [data-preview]`);
  const video=frame.locator('video');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.videoWidth>0&&v.videoHeight>0&&v.readyState>=2&&!v.paused),{timeout:30000}).toBe(true);
  const actual=await video.evaluate((v:HTMLVideoElement)=>v.videoWidth/v.videoHeight);
  const box=await frame.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.width/box!.height-actual)).toBeLessThan(0.025);
  await expect(video).toHaveCSS('object-fit','contain');
 }
});
test('films autoplay even with reduced motion and Save-Data enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const connection = Object.assign(new EventTarget(), { saveData: true });
    Object.defineProperty(navigator, 'connection', { value: connection, configurable: true });
  });
  await page.goto('/#work');
  for (const id of ['needle', 'second-voice-ai', 'leu', 'flow']) {
    const video = page.locator(`[data-selected-project="${id}"] video`);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) =>
      !v.paused && v.readyState >= 2 && v.videoWidth > 0), { timeout: 25000 }).toBe(true);
  }
});

test('blocked autoplay provides an explicit retry without leaving the page', async ({ page }) => {
  let release!: () => void;
  const waitForMedia = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\.(mp4|webm)(\?|$)/, async route => {
    await waitForMedia;
    await route.continue();
  });
  await page.addInitScript(() => {
    let deny = true;
    (window as Window & { allowProjectPlayback?: () => void }).allowProjectPlayback = () => { deny = false; };
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (deny) return Promise.reject(new DOMException('Gesture required', 'NotAllowedError'));
      return nativePlay.call(this);
    };
  });
  await page.goto('/#work', { waitUntil: 'domcontentloaded' });
  const retry = page.getByRole('button', { name: 'Play Needle and other blocked project videos' });
  await expect(retry).toBeVisible({ timeout: 12000 });
  await page.evaluate(() => (window as Window & { allowProjectPlayback?: () => void }).allowProjectPlayback?.());
  release();
  await retry.click();
  for (const id of ['needle', 'second-voice-ai', 'leu', 'flow']) {
    await expect.poll(() => page.locator(`[data-selected-project="${id}"] video`).evaluate((v: HTMLVideoElement) =>
      !v.paused && v.readyState >= 2), { timeout: 25000 }).toBe(true);
  }
  await expect(page.locator('.preview-retry')).toHaveCount(0);
});

test('primary routes render without uncaught client exceptions', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  for (const route of ['/', '/story', '/cv']) {
    const response = await page.goto(route);
    expect(response, `${route} should return a document response`).not.toBeNull();
    expect(response!.status(), `${route} should not return an HTTP error`).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
});
