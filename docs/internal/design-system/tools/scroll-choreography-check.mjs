#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function arg(name, fallback = undefined) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}
const url = arg('--url');
const out = arg('--out', 'docs/qa/scroll-choreography');
function parseWidthSweep(value) {
  const [startRaw, endRaw, stepRaw] = String(value).split(':');
  const start = Number(startRaw);
  const end = Number(endRaw);
  const step = Number(stepRaw);
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step) || step <= 0 || end < start) return [];
  const widths = [];
  for (let width = start; width <= end; width += step) widths.push(width);
  if (widths[widths.length - 1] !== end) widths.push(end);
  return widths;
}
const legacyViewports = arg('--viewports');
const viewports = legacyViewports
  ? String(legacyViewports).split(',').map((value) => Number(value.trim())).filter(Boolean)
  : parseWidthSweep(arg('--width-sweep', '360:1920:40'));
const heights = String(arg('--heights', '720,844,900,1080')).split(',').map((value) => Number(value.trim())).filter(Boolean);
const failOnBlocker = String(arg('--fail-on-blocker', 'true')) !== 'false';

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function write(file, body) { ensureDir(path.dirname(file)); fs.writeFileSync(file, body); }
function fail(message) { console.error(message); process.exit(1); }

if (!url) fail('Usage: node tools/scroll-choreography-check.mjs --url <url> [--out docs/qa/scroll-choreography] [--width-sweep 360:1920:40] [--heights 720,844,900,1080]');
ensureDir(out);

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch (error) {
  const body = '# Scroll Choreography Check Blocked\n\nPlaywright is not installed or not resolvable in this repo. No scroll evidence was captured.\n\nInstall Playwright or run the check in an environment that already provides it.\n';
  write(path.join(out, 'blocked-report.md'), body);
  write(path.join(out, 'blocked-report.json'), JSON.stringify({ status: 'blocked', reason: 'playwright unavailable', message: error.message }, null, 2));
  process.exit(2);
}

const browser = await chromium.launch({ headless: true });
const samples = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1];
const report = { url, createdAt: new Date().toISOString(), viewports: [], status: 'complete' };

try {
  for (const width of viewports) {
    for (const height of heights) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    const maxScroll = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
    const viewportResult = { width, height, samples: [], horizontalOverflow: false, navStates: [], stageMovementDetected: false, objectMovementDetected: false, blankFrames: [], mediaTextCollisions: [], viewportEdgeClips: [], horizontalPartialContent: [], persistentMediaObjects: [] };
    const previous = new Map();
    const mediaVisibility = new Map();

    for (const sample of samples) {
      const y = Math.round(maxScroll * sample);
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(180);
      const screenshotName = 'scroll-' + width + 'x' + height + '-' + Math.round(sample * 100).toString().padStart(3, '0') + '.png';
      await page.screenshot({ path: path.join(out, screenshotName), fullPage: false });
      const state = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const rectFor = (el) => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return { x: r.x, y: r.y, width: r.width, height: r.height, transform: style.transform, opacity: style.opacity, className: el.className || '', text: (el.textContent || '').trim().slice(0, 80) };
        };
        const stages = [...document.querySelectorAll('[data-scroll-stage]')].slice(0, 12).map(rectFor);
        const objects = [...document.querySelectorAll('[data-scroll-object], [data-overlay-object], [data-media-object]')].slice(0, 20).map(rectFor);
        const nav = [...document.querySelectorAll('[data-scroll-nav] [aria-current], [data-scroll-nav] .active, [data-scroll-nav] [data-active="true"]')].map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim());
        const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
        const movingMedia = [...document.querySelectorAll('[data-scroll-object], [data-overlay-object], [data-media-object]')].filter((el) => {
          const style = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0;
        });
        const mediaObjects = [...document.querySelectorAll('[data-media-object]')].map((el, index) => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return {
            key: el.getAttribute('data-media-object') || el.id || 'media-' + index,
            role: el.getAttribute('data-media-role') || '',
            stage: el.getAttribute('data-media-stage') || '',
            heroOnly: el.hasAttribute('data-media-hero-only'),
            visible: style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height }
          };
        });
        const protectedText = [...document.querySelectorAll('[data-protected-text], [data-layout-critical]')].filter((el) => {
          const style = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0 && (el.textContent || '').trim().length > 0;
        });
        const critical = [...document.querySelectorAll('[data-layout-critical], [data-protected-text], [data-card], [data-panel], [data-active-panel], [data-text-fit], [data-nav-item], [data-nav-label], button, [role="button"], a')].filter((el) => {
          const style = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0 && (el.textContent || '').trim().length > 0 && el.getAttribute('data-viewport-crop-allowed') !== 'true' && el.getAttribute('data-editorial-crop') !== 'intentional';
        });
        const viewportEdgeClips = critical.map((el) => {
          const r = el.getBoundingClientRect();
          const clipped = r.bottom >= -1 && r.top <= window.innerHeight + 1 && (r.left < -1 || r.right > window.innerWidth + 1 || r.top < -1 || r.bottom > window.innerHeight + 1);
          return clipped ? {
            name: el.getAttribute('data-layout-critical') || el.getAttribute('data-card') || el.getAttribute('data-panel') || el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90)
          } : null;
        }).filter(Boolean);
        const horizontalStages = [...document.querySelectorAll('[data-horizontal-stage], [data-scroll-stage][data-scroll-axis="x"], [data-scroll-route="horizontal"]')].filter((el) => {
          const style = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0;
        });
        const horizontalPartialContent = [];
        for (const stage of horizontalStages) {
          const active = [...stage.querySelectorAll('[data-active-panel], [data-card][data-active="true"], [data-panel][data-active="true"], [aria-current="true"]')].filter((el) => {
            const style = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0;
          });
          const panels = active.length ? active : [...stage.querySelectorAll('[data-card], [data-panel], [data-layout-critical]')].filter((el) => {
            const style = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0 && (el.textContent || '').trim().length > 0;
          });
          for (const panel of panels) {
            const r = panel.getBoundingClientRect();
            const visibleWidth = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
            const visibleHeight = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
            const visibleRatio = r.width * r.height > 0 ? (visibleWidth * visibleHeight) / (r.width * r.height) : 1;
            if (visibleRatio < 0.92 || r.left < -1 || r.right > window.innerWidth + 1) {
              horizontalPartialContent.push({
                stage: stage.getAttribute('data-horizontal-stage') || stage.getAttribute('data-scroll-stage') || 'horizontal-stage',
                text: (panel.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
                visibleRatio
              });
            }
          }
        }
        const meaningful = [...document.querySelectorAll('h1,h2,h3,h4,p,button,a,nav,[role="button"],[data-card],[data-panel],[data-active-panel],[data-layout-critical],[data-protected-text],[data-media-object],img,video,canvas')].filter((el) => {
          const style = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return style.visibility !== 'hidden' && style.display !== 'none' && r.width > 0 && r.height > 0;
        }).reduce((sum, el) => {
          const r = el.getBoundingClientRect();
          const w = Math.max(0, Math.min(r.right, window.innerWidth) - Math.max(r.left, 0));
          const h = Math.max(0, Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0));
          return sum + w * h;
        }, 0);
        const mediaTextCollisions = [];
        for (const media of movingMedia) {
          const mediaRect = rectFor(media);
          const mediaName = media.getAttribute('data-overlay-object') || media.getAttribute('data-scroll-object') || media.getAttribute('data-media-object') || media.getAttribute('aria-label') || media.tagName.toLowerCase();
          for (const textEl of protectedText) {
            if (media.contains(textEl) || textEl.contains(media)) continue;
            const textRect = rectFor(textEl);
            if (!overlaps(mediaRect, textRect)) continue;
            mediaTextCollisions.push({
              media: mediaName,
              protectedText: textEl.getAttribute('data-protected-text') || textEl.getAttribute('data-layout-critical') || textEl.tagName.toLowerCase(),
              text: (textEl.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90)
            });
          }
        }
        return {
          scrollX: window.scrollX,
          horizontalOverflow: Math.ceil(Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth) > 2,
          stages,
          objects,
          nav,
          bodyTextLength: (body.innerText || '').trim().length,
          mediaTextCollisions,
          mediaObjects
          , viewportEdgeClips
          , horizontalPartialContent
          , meaningfulAreaRatio: meaningful / (window.innerWidth * window.innerHeight)
          , hasIntentionalBlankStage: Boolean(document.querySelector('[data-intentional-blank-stage]'))
        };
      });
      viewportResult.horizontalOverflow ||= state.horizontalOverflow;
      viewportResult.navStates.push(state.nav.join(' | '));
      if ((state.bodyTextLength < 8 || state.meaningfulAreaRatio < 0.06) && !state.hasIntentionalBlankStage) viewportResult.blankFrames.push({ sample, reason: 'very little meaningful readable content' });
      for (const collision of state.mediaTextCollisions) {
        viewportResult.mediaTextCollisions.push({ sample, ...collision });
      }
      for (const clip of state.viewportEdgeClips) {
        viewportResult.viewportEdgeClips.push({ sample, ...clip });
      }
      for (const partial of state.horizontalPartialContent) {
        viewportResult.horizontalPartialContent.push({ sample, ...partial });
      }
      for (const media of state.mediaObjects) {
        if (!media.visible) continue;
        const existing = mediaVisibility.get(media.key) || { count: 0, role: media.role, stage: media.stage, heroOnly: media.heroOnly };
        existing.count += 1;
        existing.role ||= media.role;
        existing.stage ||= media.stage;
        existing.heroOnly ||= media.heroOnly;
        mediaVisibility.set(media.key, existing);
      }

      for (const [kind, list] of [['stage', state.stages], ['object', state.objects]]) {
        list.forEach((item, index) => {
          const key = kind + '-' + index;
          const prior = previous.get(key);
          if (prior) {
            const moved = Math.abs(prior.x - item.x) > 2 || Math.abs(prior.y - item.y) > 2 || prior.transform !== item.transform || prior.className !== item.className;
            if (moved && kind === 'stage') viewportResult.stageMovementDetected = true;
            if (moved && kind === 'object') viewportResult.objectMovementDetected = true;
          }
          previous.set(key, item);
        });
      }
      viewportResult.samples.push({ sample, screenshot: screenshotName, nav: state.nav, horizontalOverflow: state.horizontalOverflow, stageCount: state.stages.length, objectCount: state.objects.length, mediaTextCollisionCount: state.mediaTextCollisions.length });
    }
    viewportResult.persistentMediaObjects = [...mediaVisibility.entries()]
      .filter(([, value]) => value.count >= Math.ceil(samples.length * 0.6) && !value.role && !value.heroOnly)
      .map(([key, value]) => ({ key, sampleCount: value.count, role: value.role, stage: value.stage, heroOnly: value.heroOnly }));
    viewportResult.navSyncDetected = new Set(viewportResult.navStates.filter(Boolean)).size > 1;
    report.viewports.push(viewportResult);
    await page.close();
    }
  }
} finally {
  await browser.close();
}

const failures = [];
for (const viewport of report.viewports) {
  const label = viewport.width + 'x' + viewport.height;
  if (viewport.horizontalOverflow) failures.push(label + ': horizontal overflow detected');
  if (viewport.blankFrames.length) failures.push(label + ': possible blank/dead frames');
  for (const clip of viewport.viewportEdgeClips) {
    failures.push(label + ': viewport-edge clipping at ' + Math.round(clip.sample * 100) + '% scroll - ' + clip.name + ' "' + clip.text + '"');
  }
  for (const partial of viewport.horizontalPartialContent) {
    failures.push(label + ': horizontal partial content at ' + Math.round(partial.sample * 100) + '% scroll - ' + partial.stage + ' shows "' + partial.text + '" at ' + Math.round(partial.visibleRatio * 100) + '% visible');
  }
  for (const collision of viewport.mediaTextCollisions) {
    failures.push(label + ': media/text collision at ' + Math.round(collision.sample * 100) + '% scroll - ' + collision.media + ' overlaps ' + collision.protectedText + ' "' + collision.text + '"');
  }
  for (const media of viewport.persistentMediaObjects) {
    failures.push(label + ': persistent media object "' + media.key + '" visible across ' + media.sampleCount + ' scroll samples without data-media-role or data-media-hero-only');
  }
  if (!viewport.stageMovementDetected && !viewport.objectMovementDetected) failures.push(label + ': no stage/object movement detected from data-scroll hooks');
}
report.failures = failures;

const md = ['# Scroll Choreography Check', '', '- URL: ' + url, '- Created: ' + report.createdAt, '- Status: ' + (failures.length ? 'issues detected' : 'no automated blocker detected'), '', '## Findings', failures.length ? failures.map((f) => '- ' + f).join('\n') : '- No automated blockers detected by v3 checker.', '', '## Evidence', ...report.viewports.map((vp) => '### ' + vp.width + 'x' + vp.height + '\n' + vp.samples.map((s) => '- ' + Math.round(s.sample * 100) + '%: ' + s.screenshot).join('\n'))].join('\n');
write(path.join(out, 'scroll-choreography-report.md'), md + '\n');
write(path.join(out, 'scroll-choreography-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log('Scroll choreography report written to ' + out);
if (failOnBlocker && failures.length > 0) process.exit(1);
