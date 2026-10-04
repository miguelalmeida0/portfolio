import { expect, test } from '../fixtures';
import { openPortfolioHome, selectWorkProject } from '../helpers/portfolio';

const projects = ['needle', 'second-voice', 'f24', 'flow', 'leu'] as const;

test('recruiter hero and five selectable projects preserve the desktop hierarchy', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openPortfolioHome(page);
  await expect(page.locator('.experience')).toHaveText('Built a product used by hundreds of companies.');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Frontend developer & design engineer.');
  await expect(page.locator('.wind-hero').getByRole('link', { name: 'View CV', exact: true })).toBeVisible();
  expect(await page.locator('[data-project-row]').evaluateAll(rows => rows.map(row => row.getAttribute('data-ask-id')))).toEqual(['w-needle','w-sv','w-f24','w-flow','w-leu']);
  const hero = (await page.locator('.wind-hero').boundingBox())!;
  const work = (await page.locator('#work').boundingBox())!;
  expect(work.y).toBeCloseTo(553.6,1); expect(work.y - hero.y - hero.height).toBeCloseTo(51.2,1);
  for (const id of projects) {
    await selectWorkProject(page, id);
    await expect(page.locator('#work .stage')).toHaveCount(1);
    await expect(page.locator('[data-index-meta] .role')).toHaveText(/\S/);
  }
  expect(await page.locator('#contact').evaluate(el => el.getBoundingClientRect().top + scrollY)).toBeGreaterThan(await page.locator('#work').evaluate(el => el.getBoundingClientRect().bottom + scrollY));
  await expect(page.locator('#work a[href*="mirror-ai"], #work a[href*="vigia"]')).toHaveCount(0);
  for (const asset of ['/projects/f24/hackathon.webp','/projects/leu/leu-loop-v2-poster.jpg','/projects/flow/flow-loop-web-final.mp4']) expect((await request.head(asset)).status()).toBe(200);
});

test('hover and keyboard focus leave each selected media rectangle unchanged', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await openPortfolioHome(page);
  for (const id of ['needle', 'f24', 'leu', 'flow'] as const) {
    const stage = await selectWorkProject(page, id);
    const link = stage.getByRole('link').first();
    await link.scrollIntoViewIfNeeded();
    const bounds = () => link.evaluate(el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y+scrollY, width:r.width, height:r.height, transform:getComputedStyle(el).transform }; });
    const before = await bounds();
    await link.hover(); expect(await bounds()).toEqual(before);
    await link.focus(); expect(await bounds()).toEqual(before);
  }
});

test('selected films advance while visible and reduced motion stops playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await openPortfolioHome(page);
  for (const id of ['flow', 'leu'] as const) {
    await selectWorkProject(page, id);
    const video = page.locator('#work video');
    await expect(video).toHaveCount(1); await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty('paused', false);
    await expect(video).toHaveJSProperty('muted', true); await expect(video).toHaveJSProperty('loop', true);
    await expect(video).toHaveAttribute('playsinline', '');
    const start = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(start);
    const frame = () => video.evaluate(v => { const canvas=document.createElement('canvas'); canvas.width=320;canvas.height=180;canvas.getContext('2d')!.drawImage(v as HTMLVideoElement,0,0,320,180);return canvas.toDataURL(); });
    const first = await frame(); await expect.poll(frame).not.toBe(first);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(video).toHaveJSProperty('paused', true); await expect(video).toHaveAttribute('poster', /.+/);
    const stopped = await video.evaluate(v => (v as HTMLVideoElement).currentTime);
    await page.waitForTimeout(200); expect(await video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBe(stopped);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

test('tablet and phone keep project order and the complete interactive studio', async ({ page }) => {
  for (const width of [834,390]) {
    await page.setViewportSize({ width,height:1112 }); await openPortfolioHome(page);
    const rows = await page.locator('[data-project-row]').all();
    expect(rows).toHaveLength(5);
    await selectWorkProject(page, 'second-voice');
    await expect(page.getByRole('tab')).toHaveCount(4); await expect(page.getByRole('radio')).toHaveCount(3);
    await expect(page.getByRole('button', { name:'Copy rewrite', exact:true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    await selectWorkProject(page, 'f24');
    await page.getByRole('link', { name:'View F24 case study', exact:true }).click();
    await expect(page).toHaveURL(/\/work\/f24$/);
  }
});
