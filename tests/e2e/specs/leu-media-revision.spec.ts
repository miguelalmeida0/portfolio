import { expect, test } from '@playwright/test';
import { leuMedia } from '../../../src/lib/content/leu-media';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
});

test('current Leu film plays silently in the gallery and preserves the shared media configuration', async ({ page }) => {
  await page.goto('/#work');
  const row = page.locator('[data-selected-project="leu"]');
  const video = row.locator('video');
  await row.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('poster', leuMedia.poster);
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveCSS('object-fit', 'contain');
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  const metrics = await video.evaluate(v => { const p=v as HTMLVideoElement; return {duration:p.duration,src:p.currentSrc,width:p.videoWidth,height:p.videoHeight}; });
  expect(Math.abs(metrics.duration - leuMedia.duration)).toBeLessThan(1);
  expect(metrics.src).toMatch(/leu-film-original-20261009\.mp4$/);
  // The preferred WebM previously delivered only 960×540 source pixels.
  expect(metrics.width).toBe(1440);
  expect(metrics.height).toBe(810);
  await row.getByRole('link', {name:'Leu case study',exact:true}).click();
  await expect(page).toHaveURL(/\/work\/leu$/);
  await expect(page.locator('h1')).toBeVisible();
});

test('gallery requests current film generations once and the visitor can pause and resume every loop', async ({ page }) => {
  const requests:string[]=[];
  page.on('request',r=>{if(/\/projects\/leu\/.*\.(webm|mp4)$/.test(r.url()))requests.push(r.url());});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#work');
  const video=page.locator('[data-selected-project="leu"] video');
  await expect.poll(()=>video.evaluate(v=>!((v as HTMLVideoElement).paused))).toBe(true);
  await page.getByRole('button',{name:'Pause project videos'}).click();
  for(const v of await page.locator('[data-selected-project] video').all())await expect(v).toHaveJSProperty('paused',true);
  await page.getByRole('button',{name:'Play project videos'}).click();
  await expect.poll(()=>video.evaluate(v=>!((v as HTMLVideoElement).paused))).toBe(true);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every(url=>/leu-film-original-20261009\./.test(url))).toBe(true);
  expect(new Set(requests).size).toBe(requests.length);
});

test('the original master is the only Leu video request', async ({ page }) => {
  const requests:string[]=[];
  page.on('request',r=>{if(/\/projects\/leu\/.*\.(webm|mp4)$/.test(r.url()))requests.push(r.url());});
  await page.goto('/#work');
  const video=page.locator('[data-selected-project="leu"] video');
  await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every(url=>url.endsWith('leu-film-original-20261009.mp4'))).toBe(true);
});

test('missing film retains the real poster and the case-study destination', async ({ page }) => {
  await page.route(/leu-film-original-20261009\.(mp4|webm)$/,r=>r.fulfill({status:404,body:'Missing film'}));
  await page.goto('/#work');
  const row=page.locator('[data-selected-project="leu"]');
  await row.scrollIntoViewIfNeeded();
  await expect.poll(() => row.locator('video').evaluate(v => (v as HTMLVideoElement).readyState)).toBe(0);
  await expect(row.locator('img')).toHaveAttribute('src',leuMedia.poster);
  await expect.poll(() => row.locator('img').evaluate(i => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await expect(row.locator('img')).toBeVisible();
  await expect(row.getByRole('link',{name:'Leu case study',exact:true})).toHaveAttribute('href','/work/leu');
});

test('blocked autoplay retains a poster and an explicit retry action', async ({ page }) => {
  await page.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Blocked','NotAllowedError'));};});
  await page.goto('/#work');
  const row=page.locator('[data-selected-project="leu"]');
  await row.scrollIntoViewIfNeeded();
  await expect(row.locator('[data-preview]')).toHaveAttribute('data-preview-status','blocked');
  await expect(row.locator('img')).toBeVisible();
  await expect(row.locator('.preview-retry')).toBeVisible();
});
