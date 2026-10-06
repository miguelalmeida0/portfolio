import { expect, test } from '@playwright/test';
import { openPortfolioHome, openSecondVoiceStudio } from '../helpers/portfolio';

const projects = ['second-voice-ai', 'f24', 'leu', 'flow'];

test('recruiter sees identity and exactly four real projects without an accordion', async ({ page }) => {
  await openPortfolioHome(page);
  await expect(page.getByRole('heading', { level: 1, name: /Frontend engineer.*design engineer/i })).toBeVisible();
  await expect(page.locator('[data-identity-name]')).toHaveText('MIGUEL ALMEIDA');
  await expect(page.locator('[data-identity-location]')).toHaveText('Berlin');
  await expect(page.locator('main img[src*="miguel"]')).toHaveCount(1);
  await expect(page.locator('.project-index button')).toHaveCount(4);
  await expect(page.locator('.project-index button').nth(0)).toContainText('Second Voice AI');
  await expect(page.locator('#work [aria-expanded], #work [data-project-panel]')).toHaveCount(0);
  await expect(page.locator('#work a[href="/work/mirror-ai"], #work a[href="/work/vigia"]')).toHaveCount(0);
  await page.locator('.project-index button').nth(1).click();
  await expect(page.locator('#work img')).toHaveAttribute('src', '/projects/f24/hackathon.webp');
  await expect(page.getByText('Camera Harness', { exact: true })).toHaveCount(0);
});

for (const slug of projects) test(`${slug} exposes its current case-study structure and limits`, async ({ page }) => {
  const response = await page.goto('/work/' + slug);
  expect(response?.status()).toBe(200);
  const required = slug === 'f24'
    ? ['architecture', 'production-decision', 'activity-history', 'dry-run', 'engineering-proof']
    : ['architecture', 'context', 'decisions', 'outcome'];
  for (const id of required) await expect(page.locator('#' + id)).toBeAttached();
  if (slug === 'f24') {
    await expect(page.locator('#decisions')).toHaveCount(0);
    await expect(page.locator('#production-decision')).toContainText('Svelte product work and React implementation continued alongside each other');
    await expect(page.locator('.team-context')).toContainText('backend colleagues owned services; QA helped verify behavior');
  } else {
    await expect(page.locator('#decisions [data-decision-item] h3')).toHaveCount(3);
    await expect(page.locator('#outcome')).toContainText(/prototype|implemented|interface|experience|persistent|native/i);
  }
  await expect(page.getByRole('link', { name: 'All work', exact: true })).toHaveAttribute('href', '/#work');
});

test('case study navigation completes without a full reload', async ({ page }) => {
  await openSecondVoiceStudio(page);
  await page.locator('#work').getByRole('link', { name: 'Case study' }).click();
  await expect(page).toHaveURL(/\/work\/second-voice-ai$/);
  await page.getByRole('link', { name: 'Next case study F24' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'F24' })).toBeVisible();
});

test('product video is a silent loop with a poster fallback when autoplay is unavailable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/work/second-voice-ai');
  const video = page.locator('video');
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).not.toHaveAttribute('controls');
  await expect(video).toHaveAttribute('poster', /ghostwriter-demo-poster\.webp$/);
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).muted)).toBe(true);

  const playback = await video.evaluate(async v => {
    const player = v as HTMLVideoElement;
    player.muted = true;
    try {
      await player.play();
      return { supported: true, started: !player.paused };
    } catch {
      return { supported: false, started: false };
    }
  });

  if (playback.supported) expect(playback.started).toBe(true);
  else await expect(video).toHaveAttribute('poster', /\.webp$/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
});

test('legacy product URL redirects and removed projects return an honest 404', async ({ page, request }) => {
  const old = await request.get('/work/ghostwriter', { maxRedirects: 0 });
  expect(old.status()).toBe(308);
  expect(old.headers().location).toBe('/work/second-voice-ai');
  const missing = await page.goto('/work/camera-harness');
  expect(missing?.status()).toBe(404);
  await page.getByRole('link', { name: 'Back to the work' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Frontend engineer.*design engineer/i })).toBeVisible();
});

test('CV download contains a real PDF and sitemap lists only selected projects', async ({ request }) => {
  const pdf = await request.get('/portfolio.pdf');
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const slug of projects) expect(sitemap).toContain('/work/' + slug);
  expect(sitemap).not.toContain('camera-harness');
  expect(sitemap).not.toContain('/work/vigia');
});

test('removed VIGIA route is not redirected to Flow', async ({ request }) => {
  const response = await request.get('/work/vigia', { maxRedirects: 0 });
  expect(response.status()).toBe(404);
  expect(response.headers().location).toBeUndefined();
});

test('Flow film loads, plays silently and restores its poster for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/work/flow');
  const video = page.locator('video');
  await expect(video).toHaveAttribute('src', '/projects/flow/flow-loop-web-final.mp4');
  await expect(video).toHaveAttribute('poster', '/projects/flow/flow-loop-poster-final.jpg');
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).muted)).toBe(true);
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(video).toBeHidden();
  await expect(page.locator('img[src="/projects/flow/flow-loop-poster-final.jpg"]')).toBeVisible();
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
});
