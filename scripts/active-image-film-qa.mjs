import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3010/';
const chromePath =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outputDir = path.resolve('docs/qa/screenshots/active-image-film');
const reportPath = path.resolve('docs/qa/active-image-film-qa.json');
const checks = [];
const consoleErrors = [];

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: chromePath,
  args: ['--force-device-scale-factor=1', '--hide-scrollbars']
});

const record = (name, pass, evidence) => {
  checks.push({ name, pass: Boolean(pass), evidence });
};

async function addMetrics(page) {
  await page.addInitScript(() => {
    window.__activeImageFilmQa = { cls: 0, lcpMs: null };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__activeImageFilmQa.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const latest = entries.at(-1);
      if (latest) window.__activeImageFilmQa.lcpMs = latest.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
}

async function collectLayout(page) {
  return page.evaluate(() => {
    const tile = document.querySelector('[data-project-tile="mirror-ai"]');
    const surface = tile?.querySelector('.tile-surface');
    const copy = tile?.querySelector('.tile-copy');
    const video = tile?.querySelector('video');
    const tileRect = tile?.getBoundingClientRect();
    const surfaceRect = surface?.getBoundingClientRect();
    const copyRect = copy?.getBoundingClientRect();
    const videoRect = video?.getBoundingClientRect();
    const visibleText = [...(tile?.querySelectorAll('h3, p, small, .tile-meta span') || [])]
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent?.trim() || '',
          left: rect.left,
          right: rect.right,
          width: rect.width
        };
      });
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      tileContained:
        Boolean(tileRect) &&
        Boolean(surfaceRect) &&
        Boolean(copyRect) &&
        surfaceRect.left >= tileRect.left - 1 &&
        surfaceRect.right <= tileRect.right + 1 &&
        copyRect.left >= tileRect.left - 1 &&
        copyRect.right <= tileRect.right + 1,
      videoContained:
        Boolean(videoRect) &&
        Boolean(surfaceRect) &&
        videoRect.left >= surfaceRect.left - 1 &&
        videoRect.right <= surfaceRect.right + 1 &&
        videoRect.top >= surfaceRect.top - 1 &&
        videoRect.bottom <= surfaceRect.bottom + 1,
      copySeparated:
        Boolean(copyRect) &&
        Boolean(surfaceRect) &&
        copyRect.top >= surfaceRect.bottom - 1,
      clippedText: visibleText.filter(
        (item) =>
          item.width <= 0 ||
          item.left < (tileRect?.left ?? 0) - 1 ||
          item.right > (tileRect?.right ?? innerWidth) + 1
      ),
      video: video
        ? {
            paused: video.paused,
            currentTime: video.currentTime,
            loaded: video.dataset.videoLoaded,
            active: video.dataset.videoActive,
            mobilePoster: video.dataset.mobilePoster,
            sourceCount: video.querySelectorAll('source').length,
            poster: video.poster,
            label: video.getAttribute('aria-label')
          }
        : null
    };
  });
}

async function desktopScenario() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();
  const targetVideoRequests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => {
    if (/active-image-demo\.(webm|mp4)/.test(request.url())) {
      targetVideoRequests.push(request.url());
    }
  });
  await addMetrics(page);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  record(
    'Desktop defers film sources before the tile nears the viewport',
    targetVideoRequests.length === 0,
    { targetVideoRequests: [...targetVideoRequests] }
  );

  const tile = page.locator('[data-project-tile="mirror-ai"]');
  const video = tile.locator('video');
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3200);
  const visibleLayout = await collectLayout(page);
  record(
    'Desktop attaches a preferred or fallback source near the viewport',
    targetVideoRequests.length >= 1 && visibleLayout.video?.sourceCount >= 1,
    { targetVideoRequests, video: visibleLayout.video }
  );
  record(
    'Desktop film autoplays only after meaningful visibility',
    !visibleLayout.video?.paused && (visibleLayout.video?.currentTime || 0) > 0.1,
    visibleLayout.video
  );
  const activeVideoCount = await page.locator('video:not([data-video-active="false"])').count();
  record(
    'No more than one project film is active',
    activeVideoCount <= 1,
    { activeVideoCount }
  );
  record(
    'Mirror AI media, copy, and text stay in their protected bounds',
    visibleLayout.documentOverflow <= 1 &&
      visibleLayout.tileContained &&
      visibleLayout.videoContained &&
      visibleLayout.copySeparated &&
      visibleLayout.clippedText.length === 0,
    visibleLayout
  );
  record(
    'The film exposes a meaningful accessible description',
    Boolean(visibleLayout.video?.label?.includes('giraffe') &&
      visibleLayout.video?.label?.includes('ostrich')),
    { label: visibleLayout.video?.label }
  );
  await page.screenshot({
    path: path.join(outputDir, 'desktop-1440x900.png'),
    fullPage: false
  });
  await page.waitForTimeout(3900);
  const focusTime = await video.evaluate((element) => element.currentTime);
  record(
    'The revised loop reaches the ostrich evidence-focus beat',
    focusTime >= 6.4 && focusTime <= 8.2,
    { focusTime }
  );
  await page.screenshot({
    path: path.join(outputDir, 'desktop-ostrich-focus-1440x900.png'),
    fullPage: false
  });

  await page.locator('body').press('Home');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(350);
  const pausedOffscreen = await video.evaluate((element) => element.paused);
  record('The film pauses after leaving the viewport', pausedOffscreen, {
    pausedOffscreen
  });

  const performance = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      cls: window.__activeImageFilmQa?.cls ?? null,
      lcpMs: window.__activeImageFilmQa?.lcpMs ?? null,
      domContentLoadedMs: navigation?.domContentLoadedEventEnd ?? null,
      loadMs: navigation?.loadEventEnd ?? null
    };
  });
  record(
    'Local layout shift remains within the good CLS threshold',
    performance.cls !== null && performance.cls <= 0.1,
    performance
  );
  await context.close();
  return performance;
}

async function policyScenario({
  name,
  viewport,
  reducedMotion,
  screenshot
}) {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  const videoRequests = [];
  page.on('request', (request) => {
    if (/active-image-demo\.(webm|mp4)/.test(request.url())) {
      videoRequests.push(request.url());
    }
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const tile = page.locator('[data-project-tile="mirror-ai"]');
  await tile.scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const layout = await collectLayout(page);
  record(
    `${name} keeps a static poster and does not request film bytes`,
    videoRequests.length === 0 &&
      layout.video?.sourceCount === 0 &&
      layout.video?.paused === true,
    { videoRequests, video: layout.video }
  );
  record(
    `${name} has no horizontal overflow or media/text collision`,
    layout.documentOverflow <= 1 &&
      layout.tileContained &&
      layout.videoContained &&
      layout.copySeparated &&
      layout.clippedText.length === 0,
    layout
  );
  await page.screenshot({
    path: path.join(outputDir, screenshot),
    fullPage: false
  });
  await context.close();
}

async function responsiveSweep() {
  const context = await browser.newContext({
    viewport: { width: 360, height: 720 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const samples = [];
  const heights = [720, 844, 900, 1080];
  for (let width = 360, index = 0; width <= 1920; width += 40, index += 1) {
    const height = heights[index % heights.length];
    await page.setViewportSize({ width, height });
    await page.locator('[data-project-tile="mirror-ai"]').scrollIntoViewIfNeeded();
    const layout = await collectLayout(page);
    const pass =
      layout.documentOverflow <= 1 &&
      layout.tileContained &&
      layout.videoContained &&
      layout.copySeparated &&
      layout.clippedText.length === 0;
    samples.push({ width, height, pass, layout });
  }
  const failures = samples.filter((sample) => !sample.pass);
  record(
    'Responsive sweep passes from 360 to 1920 px in 40 px steps',
    failures.length === 0,
    { sampleCount: samples.length, failures }
  );
  await context.close();
  return samples.map(({ width, height, pass }) => ({ width, height, pass }));
}

let performance;
let responsiveSamples;
try {
  performance = await desktopScenario();
  await policyScenario({
    name: 'Reduced motion',
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    screenshot: 'reduced-motion-1440x900.png'
  });
  await policyScenario({
    name: 'Mobile 390 px',
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
    screenshot: 'mobile-390x844.png'
  });

  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
    reducedMotion: 'no-preference'
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto(baseUrl, { waitUntil: 'networkidle' });
  await tabletPage.locator('[data-project-tile="mirror-ai"]').scrollIntoViewIfNeeded();
  await tabletPage.waitForTimeout(7100);
  const tabletLayout = await collectLayout(tabletPage);
  record(
    'Tablet keeps the complete 16:10 film and readable project copy',
    tabletLayout.documentOverflow <= 1 &&
      tabletLayout.videoContained &&
      tabletLayout.copySeparated &&
      tabletLayout.clippedText.length === 0,
    tabletLayout
  );
  await tabletPage.screenshot({
    path: path.join(outputDir, 'tablet-768x1024.png'),
    fullPage: false
  });
  await tabletContext.close();

  responsiveSamples = await responsiveSweep();
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  summary: {
    passed: checks.filter((check) => check.pass).length,
    failed: checks.filter((check) => !check.pass).length,
    total: checks.length
  },
  performance,
  consoleErrors,
  responsiveSamples,
  checks
};
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report.summary)}\n`);
if (report.summary.failed > 0 || consoleErrors.length > 0) process.exitCode = 1;
