import { expect, test } from '@playwright/test';
import { openPortfolioHome, openSecondVoiceStudio } from '../helpers/portfolio';

const projects = ['second-voice-ai', 'f24', 'vigia', 'mirror-ai'];

test('recruiter sees role, production experience and skills immediately', async ({ page }) => {
  await openPortfolioHome(page);
  await expect(page.getByRole('heading', { level: 1, name: /Frontend developer.*design engineer/i })).toBeVisible();
  await expect(page.getByText('F24 · 4 years in product delivery', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From scratch to hundreds of companies.' })).toBeVisible();
  await expect(page.getByLabel('Core skills')).toContainText('TypeScript');
  await expect(page.locator('main img[src*="miguel"]')).toHaveCount(0);
  await expect(page.locator('#work > article')).toHaveCount(5);
  await expect(page.locator('#project-trigger-leu')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#project-trigger-second-voice-ai')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Camera Harness', { exact: true })).toHaveCount(0);
});

for (const slug of projects) test(`${slug} exposes its current case-study structure and limits`, async ({ page }) => {
  const response = await page.goto('/work/' + slug);
  expect(response?.status()).toBe(200);
  const required = slug === 'f24'
    ? ['context', 'contribution', 'outcome']
    : ['architecture', 'context', 'decisions', 'outcome'];
  for (const id of required) await expect(page.locator('#' + id)).toBeAttached();
  if (slug === 'f24') {
    await expect(page.locator('#decisions')).toHaveCount(0);
    await expect(page.locator('#outcome')).toContainText('hundreds of companies');
    await expect(page.getByText('Product · Design · Backend · QA', { exact: true })).toBeVisible();
  } else {
    await expect(page.locator('#decisions [data-decision-item] h3')).toHaveCount(3);
    await expect(page.locator('#outcome')).toContainText(/prototype|implemented|interface|experience/i);
  }
  await expect(page.getByRole('link', { name: 'All work', exact: true })).toHaveAttribute('href', '/#work');
});

test('case study navigation completes without a full reload', async ({ page }) => {
  await openSecondVoiceStudio(page);
  await page.locator('#project-content-second-voice-ai').getByRole('link', { name: 'Case study', exact: true }).click();
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
  await expect(page.getByRole('heading', { level: 1, name: /Frontend developer.*design engineer/i })).toBeVisible();
});

test('CV download contains a real PDF and sitemap lists only selected projects', async ({ request }) => {
  const pdf = await request.get('/portfolio.pdf');
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const slug of ['leu', ...projects]) expect(sitemap).toContain('/work/' + slug);
  expect(sitemap).not.toContain('camera-harness');
});
