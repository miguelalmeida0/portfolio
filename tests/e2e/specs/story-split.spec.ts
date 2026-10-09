/**
 * Story page (Split · Try it) — acceptance suite.  STORY_HANDOFF.md §11
 * Runs against the reference prototype today; set STORY_TARGET=prod and STORY_URL to run it on the real build.
 * The only difference between the two is the selector map below.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../../src/lib/story/story.json' with { type: 'json' };

test.use({ viewport: { width: 1920, height: 1000 } });
test.setTimeout(120000);
const PROD = true;
const S = PROD ? {
  section: '[data-story-section]', current: '[data-story-section][data-current]', next: '[data-story-next]', back: '[data-story-back]', backTip: '[data-story-back-tip]',
  progress: '[data-story-progress]', ringCount: '[data-story-ring-count]', ringDone: '[data-story-ring][data-complete]', panel: '[data-story-panel]', panelDone: '[data-story-panel][data-complete]',
  scene: (id: string) => `[data-story-scene="${id}"]`, sceneOn: '[data-story-scene][data-active]', action: (i: number) => `[data-story-action="${i}"]`, caption: '[data-story-caption]', copy: '[data-story-copy]',
} : {
  section: '.ch', current: '.ch.on', next: '[data-next]', back: '[data-back]', backTip: '.tip',
  progress: '[data-left]', ringCount: '[data-pct]', ringDone: '[data-ringw].done', panel: '[data-l50]', panelDone: '[data-l50].complete',
  scene: (id: string) => `[data-sn="${id}"]`, sceneOn: '[data-sn].on', action: (i: number) => `[data-ctrls] [data-a="${i}"]`, caption: '[data-cap]', copy: '[data-copy]',
};
const URL_ = process.env.STORY_URL ?? 'http://localhost:4173/story';
const Q = data.questions, N = Q.length;

async function open(page: Page) { await page.goto(URL_); await page.mouse.move(1500, 500); await page.waitForTimeout(600); }
const currentIndex = (page: Page) => page.$$eval(S.section, (els, cur) => els.findIndex(e => e.matches(cur)), S.current);
async function next(page: Page) { await page.click(`${S.current} ${S.next}`); await page.waitForTimeout(1200); }
async function back(page: Page) { await page.click(`${S.current} ${S.back}`); await page.waitForTimeout(1200); }
async function goTo(page: Page, i: number) { for (let k = 0; k < i; k++) await next(page); }

test.beforeEach(async ({ page }) => { await open(page); });

test('eight questions and an ending, in order, each labelled "Question n of 8"', async ({ page }) => {
  expect(await page.locator(S.section).count()).toBe(N + 1);
  for (let i = 0; i < N; i++) {
    const t = await page.locator(S.section).nth(i).innerText();
    expect(t).toContain(Q[i].question); expect(t).toContain(`Question ${i + 1} of ${N}`); expect(t).toContain(Q[i].lead);
  }
  await expect(page.locator(S.section).nth(N)).toContainText(data.ending.question);
});

test('progress says how many are left, correctly, at every step', async ({ page }) => {
  for (let i = 0; i < N; i++) {
    const t = (await page.locator(S.progress).innerText()).replace(/\s+/g, ' ');
    const left = N - i - 1;
    expect(t).toContain(`Question ${i + 1} of ${N}`);
    expect(t).toContain(left === 0 ? 'last one' : `${left} left`);
    await expect(page.locator(S.ringCount)).toHaveText(`${i}/${N}`);
    await next(page);
  }
  await expect(page.locator(S.progress)).toContainText(`All ${N} answered`);
});

test('the Next button sits at the end of each answer and names the next question', async ({ page }) => {
  for (let i = 0; i < N - 1; i++) {
    await expect(page.locator(`${S.current} ${S.next}`)).toContainText(Q[i + 1].question);
    await next(page); expect(await currentIndex(page)).toBe(i + 1);
  }
});

test('Back sits beside Next, names the previous question, and goes back', async ({ page }) => {
  expect(await page.locator(`${S.current} ${S.back}`).count()).toBe(0);           // nothing to go back to on question 1
  await goTo(page, 3);
  await expect(page.locator(`${S.current} ${S.back} ${S.backTip}`)).toHaveText(`Back: ${Q[2].question}`);
  await back(page); expect(await currentIndex(page)).toBe(2);
});

test('arrow keys retain normal page scrolling without skipping answers', async ({ page }) => {
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  expect(await currentIndex(page)).toBe(0);
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('each question shows its own scene and caption, and only that scene takes the pointer', async ({ page }) => {
  for (let i = 0; i < N; i++) {
    await expect(page.locator(S.sceneOn)).toHaveCount(1);
    await expect(page.locator(S.scene(Q[i].id))).toHaveClass(PROD ? /./ : /\bon\b/);
    await expect(page.locator(S.caption)).toHaveText(Q[i].scene.caption);
    const hidden = await page.$$eval(`${S.panel} [data-sn]:not(.on), ${S.panel} [data-story-scene]:not([data-active])`, els => els.every(e => getComputedStyle(e).pointerEvents === 'none'));
    expect(hidden).toBe(true);
    if (i < N - 1) await next(page);
  }
});

test('every "Try it" action exists with the right label and runs cleanly', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(String(e)));
  for (let i = 0; i < N; i++) {
    const labels = Q[i].scene.actions;
    for (let a = 0; a < labels.length; a++) { await expect(page.locator(S.action(a))).toHaveText(labels[a]); await page.click(S.action(a)); await page.waitForTimeout(1800); }
    if (i < N - 1) await next(page);
  }
  expect(errors).toEqual([]);
});

test('the scenes show the behaviour the story claims', async ({ page }) => {
  const sceneText = () => page.locator(S.sceneOn).innerText();
  await goTo(page, 3); await page.click(S.action(0)); await page.waitForTimeout(3800);
  expect(await sceneText()).toContain('Sent once');                                         // F24: one evacuation message
  await next(page); await page.click(S.action(0)); await page.waitForTimeout(1500);
  expect(await sceneText()).toContain('Couldn’t refresh'); expect(await sceneText()).toContain('Fire alarm');   // rows stay on failure
  await page.click(S.action(1)); await page.waitForTimeout(2200);
  expect(await sceneText()).toContain('Ignored an out-of-date answer');                    // stale answers ignored
  await goTo(page, 3); await page.click(S.action(0)); await page.waitForTimeout(1800);
  expect(await sceneText()).toContain('Time unavailable');                                  // bad field caught at the boundary
});

test('each scene plays itself once when first reached', async ({ page }) => {
  await goTo(page, 4); await page.waitForTimeout(3000);
  expect(await page.locator(S.sceneOn).innerText()).toContain('Ignored an out-of-date answer');
});

test('reaching the end reveals the short version and completes the ring', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await goTo(page, N); await page.waitForTimeout(2200);
  await expect(page.locator(S.panelDone)).toHaveCount(1); await expect(page.locator(S.ringDone)).toHaveCount(1);
  for (const chapter of data.shortVersion.chapters) await expect(page.locator(S.panel)).toContainText(chapter.title);
  await page.click(S.copy); await page.waitForTimeout(200);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(data.shortVersion.copyText);
});

test('going back from the end undoes the finish — no green panel left behind', async ({ page }) => {
  await goTo(page, N); await page.waitForTimeout(1600);
  await back(page);
  await expect(page.locator(S.panelDone)).toHaveCount(0); await expect(page.locator(S.ringDone)).toHaveCount(0);
  await expect(page.locator(S.ringCount)).toHaveText(`${N - 1}/${N}`);
  await next(page); await page.waitForTimeout(1600); await expect(page.locator(S.panelDone)).toHaveCount(1);   // and finishing again rewards again
});

test('reduced motion: nothing plays by itself', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1000 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await open(p);
  for (let k = 0; k < 4; k++) { await p.click(`${S.current} ${S.next}`); await p.waitForTimeout(900); }
  await p.waitForTimeout(2500);
  expect(await p.locator(S.sceneOn).innerText()).not.toContain('Ignored an out-of-date answer');
  await ctx.close();
});

test('only Figtree and Newsreader in the story; nothing uppercase except the wordmark', async ({ page }) => {
  const r = await page.evaluate(() => { const fonts = new Set<string>(); let upper = 0;
    document.querySelectorAll('main *').forEach(e => { if (e.closest('header')) return; const cs = getComputedStyle(e);
      if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent!.trim())) return;
      fonts.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim()); if (cs.textTransform === 'uppercase') upper++; });
    return { fonts: [...fonts].sort(), upper }; });
  expect(r.fonts.every(f => ['Figtree', 'Newsreader'].includes(f))).toBe(true);
  expect(r.upper).toBe(0);
});

test('axe: no serious or critical violations', async ({ page }) => {
  const res = await new AxeBuilder({ page }).analyze();
  const bad = res.violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''));
  expect(bad.map(v => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
});
