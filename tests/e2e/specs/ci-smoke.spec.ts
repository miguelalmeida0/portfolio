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
