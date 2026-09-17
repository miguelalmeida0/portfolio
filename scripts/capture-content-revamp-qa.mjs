import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from 'playwright';
import sharp from 'sharp';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
const root = process.cwd();
const outputRoot = path.join(
  root,
  'docs/qa/screenshots/portfolio-content-revamp-2026-09-05'
);
const beforeRoot = path.join(root, 'docs/qa/screenshots/recruiter-audit-current');

const captures = [
  { file: 'after/01-home-hero-desktop.png', route: '/', width: 1058, height: 735 },
  {
    file: 'after/02-case-study-gallery-desktop.png',
    route: '/#work',
    selector: '#work',
    width: 1058,
    height: 735
  },
  {
    file: 'after/03-ghostwriter-case-study-desktop.png',
    route: '/work/ghostwriter',
    width: 1058,
    height: 735
  },
  { file: 'after/05-cv-cover-desktop.png', route: '/cv', width: 1058, height: 735 },
  { file: 'after/08-story-entry-desktop.png', route: '/story', width: 1058, height: 735 },
  { file: 'after/09-home-hero-mobile.png', route: '/', width: 287, height: 621 },
  {
    file: 'after/10-case-study-gallery-mobile.png',
    route: '/#work',
    selector: '#work',
    width: 287,
    height: 621
  },
  { file: 'verification/home-desktop-1600.png', route: '/', width: 1600, height: 1000 },
  { file: 'verification/home-tablet-768.png', route: '/', width: 768, height: 1024 },
  { file: 'verification/home-mobile-390.png', route: '/', width: 390, height: 844 },
  { file: 'verification/home-mobile-320.png', route: '/', width: 320, height: 700 },
  {
    file: 'verification/contact-desktop.png',
    route: '/#contact',
    selector: '#contact',
    width: 1440,
    height: 1000
  },
  { file: 'verification/camera-harness.png', route: '/work/camera-harness', width: 1440, height: 1000 },
  { file: 'verification/ghostwriter.png', route: '/work/ghostwriter', width: 1440, height: 1000 },
  { file: 'verification/atlas.png', route: '/work/atlas', width: 1440, height: 1000 },
  { file: 'verification/creature-app.png', route: '/work/creature-app', width: 1440, height: 1000 },
  { file: 'verification/mirror-ai.png', route: '/work/mirror-ai', width: 1440, height: 1000 }
];

const comparisons = [
  ['01-home-hero-desktop.png', '01-home-hero-desktop.png'],
  ['02-case-study-gallery-desktop.png', '02-case-study-gallery-desktop.png'],
  ['03-ghostwriter-case-study-desktop.png', '03-ghostwriter-case-study-desktop.png'],
  ['05-cv-cover-desktop.png', '05-cv-cover-desktop.png'],
  ['08-story-entry-desktop.png', '08-story-entry-desktop.png'],
  ['09-home-hero-mobile.png', '09-home-hero-mobile.png'],
  ['10-case-study-gallery-mobile.png', '10-case-study-gallery-mobile.png']
];

await mkdir(path.join(outputRoot, 'after'), { recursive: true });
await mkdir(path.join(outputRoot, 'verification'), { recursive: true });
await mkdir(path.join(outputRoot, 'comparisons'), { recursive: true });

const browser = await chromium.launch();

try {
  for (const capture of captures) {
    const context = await browser.newContext({
      viewport: { width: capture.width, height: capture.height },
      colorScheme: 'dark'
    });
    const page = await context.newPage();

    await page.goto(`${baseURL}${capture.route}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content:
        '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}'
    });

    if (capture.selector) {
      await page.locator(capture.selector).scrollIntoViewIfNeeded();
    }

    await page.evaluate(() => {
      for (const video of document.querySelectorAll('video')) video.pause();
    });

    await page.screenshot({ path: path.join(outputRoot, capture.file), fullPage: false });
    await context.close();
  }
} finally {
  await browser.close();
}

for (const [beforeFile, afterFile] of comparisons) {
  const beforePath = path.join(beforeRoot, beforeFile);
  const afterPath = path.join(outputRoot, 'after', afterFile);
  const before = sharp(beforePath);
  const after = sharp(afterPath);
  const beforeMeta = await before.metadata();
  const afterMeta = await after.metadata();
  const width = Math.max(beforeMeta.width ?? 0, afterMeta.width ?? 0);
  const height = Math.max(beforeMeta.height ?? 0, afterMeta.height ?? 0);
  const gap = 12;

  const beforeBuffer = await before
    .resize(width, height, { fit: 'contain', background: '#050505' })
    .png()
    .toBuffer();
  const afterBuffer = await after
    .resize(width, height, { fit: 'contain', background: '#050505' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: width * 2 + gap,
      height,
      channels: 4,
      background: '#050505'
    }
  })
    .composite([
      { input: beforeBuffer, left: 0, top: 0 },
      { input: afterBuffer, left: width + gap, top: 0 }
    ])
    .png()
    .toFile(path.join(outputRoot, 'comparisons', beforeFile));
}

console.log(`Captured ${captures.length} views and ${comparisons.length} before/after comparisons.`);
