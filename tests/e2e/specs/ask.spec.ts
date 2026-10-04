/**
 * Ask MiguelLLM — acceptance suite (ASK_HANDOFF.md §10)
 *
 * Runs against the reference prototype today and the production build later.
 * The only thing that differs between them is the naming map below — switch with ASK_TARGET=prod.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { selectWorkProject } from '../helpers/portfolio';
import plans from '../../../src/lib/ask/question-plans.json' with { type: 'json' };

const PROD = true;
const N = PROD
  ? { root: 'html', attr: 'data-ask-id', lit: 'is-lit', quoted: 'is-quoted', sway: 'is-swaying', flag: '.ask-flag', on: 'ask-on',
      open: '[data-ask-trigger]:visible', close: '.ask-close', heading: '.ask-heading', answer: '[data-ask-answer]', chip: '.ask-chip', chipOn: 'is-on' }
  : { root: '.root', attr: 'data-pt', lit: 'lit', quoted: 'hl', sway: 'sway', flag: '.flag', on: 'asking',
      open: '[data-ask]', close: '[data-close]', heading: '[data-qlabel]', answer: '[data-a]', chip: '[data-chipq]', chipOn: 'on' };
const TARGET = process.env.ASK_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
// These acceptance tests exercise the desktop pointer choreography. Mobile
// sheet/touch behavior is covered in ask-production and ask-global.
test.use({ isMobile:false, hasTouch:false });
// Each test owns a fresh page; keep failures independent so every contract runs.
const area = (id: string) => `[${N.attr}="${id}"]`;

const norm = (s: string) => s.toLowerCase().replace(/’/g, "'").replace(/[^\w&'+.]+/g, ' ').trim().split(/\s+/);
function validateStep(quote: string, sourceText: string) {
  const src = norm(sourceText), q = norm(quote); let i = 0;
  for (const w of q) { while (i < src.length && src[i] !== w) i++; if (i === src.length) return false; i++; }
  return true;
}

async function openAsk(page: Page) {
  await page.mouse.move(1900, 950);                      // park the cursor away from every area
  await page.click(N.open);
  await expect(page.locator(N.root)).toHaveClass(new RegExp(N.on));
}
async function logSways(page: Page) {
  await page.evaluate(({ attr, sway }) => {
    (window as any).__sways = [];
    const mo = new MutationObserver(ms => ms.forEach(m => {
      const e = m.target as HTMLElement;
      if (e.classList.contains(sway)) (window as any).__sways.push([performance.now(), e.getAttribute(attr)]);
    }));
    document.querySelectorAll(`[${attr}]`).forEach(e => mo.observe(e, { attributes: true, attributeFilter: ['class'] }));
    (window as any).__t0 = performance.now();
  }, { attr: N.attr, sway: N.sway });
}
const beats = (log: [number, string][]) => {
  const out: { t: number; ids: string[] }[] = [];
  for (const [t, id] of log) { const last = out[out.length - 1];
    if (last && t - last.t < 1000) { if (!last.ids.includes(id)) last.ids.push(id); } else out.push({ t, ids: [id] }); }
  return out;
};

test.beforeEach(async ({ page }) => { await page.setViewportSize({ width: 1920, height: 963 }); await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true')); await page.goto(TARGET); await page.evaluate(() => document.fonts.ready); await selectWorkProject(page, 'second-voice'); await page.evaluate(() => scrollTo(0, 0)); });

test('every current area carries the attribute and has a plan', async ({ page }) => {
  const onPage = await page.$$eval(`[${N.attr}]`, (els, a) => els.map(e => e.getAttribute(a)!), N.attr);
  expect(onPage.sort()).toEqual(plans.areas.map(area => area.id).sort());
  for (const a of plans.areas) expect(onPage).toContain(a.id);
});

test('every quote in question-plans.json is on the page, in its source', async ({ page }) => {
  const texts = await page.$$eval(`[${N.attr}]`, (els, a) => Object.fromEntries(els.map(e => [e.getAttribute(a)!, (e as HTMLElement).innerText])), N.attr);
  const steps = [...plans.areas.flatMap(a => a.steps), ...Object.values(plans.freeQuestionPlans).flat()];
  const bad = steps.filter(s => !validateStep(s.quote, texts[s.source] ?? ''));
  expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
});

test('a quote that is not on the page is dropped; an empty plan is the refusal', async ({ page }) => {
  await openAsk(page);
  await page.route('**/api/ask', route => route.fulfill({ json: { question: 'Test', steps: [{ lead: 'The page says:', source: 'f24', quote: 'GraphQL and Kubernetes' }] } }));
  await page.getByRole('textbox', { name: 'Type your own question' }).fill('Does he know GraphQL?');
  await page.getByRole('button', { name: 'Ask your question' }).click();
  await page.waitForTimeout(1500);
  await expect(page.locator(N.answer)).toContainText('not established in Miguel’s portfolio knowledge');
  await expect(page.locator(`.${N.quoted}`)).toHaveCount(0);
});

test('opening lights every visible area within 3 s, left before right', async ({ page }) => {
  await openAsk(page);
  const t: Record<string, number> = await page.evaluate(({ attr, lit }) => new Promise(res => {
    const seen: Record<string, number> = {}; const t0 = performance.now();
    const mo = new MutationObserver(ms => ms.forEach(m => { const e = m.target as HTMLElement;
      if (e.classList.contains(lit) && !(e.getAttribute(attr)! in seen)) seen[e.getAttribute(attr)!] = performance.now() - t0; }));
    document.querySelectorAll(`[${attr}]`).forEach(e => mo.observe(e, { attributes: true, attributeFilter: ['class'] }));
    setTimeout(() => res(seen), 3000);
  }), { attr: N.attr, lit: N.lit });
  expect(Object.keys(t).length).toBeGreaterThanOrEqual(18);
  expect(t['hi']).toBeLessThan(t['nav-contact']);        // hero-left before nav-right
});

test('heartbeat: first beat ~2.9 s, beats ≥ 2.9 s apart, one whole group per beat, 140 ms stagger', async ({ page }) => {
  await openAsk(page); await logSways(page);
  await page.waitForTimeout(9300);
  const log = await page.evaluate(() => (window as any).__sways.map(([t, id]: any) => [t - (window as any).__t0, id]));
  const b = beats(log);
  expect(b.length).toBeGreaterThanOrEqual(3);
  expect(b[0].t).toBeGreaterThan(2500); expect(b[0].t).toBeLessThan(3400);
  for (let i = 1; i < b.length; i++) expect(b[i].t - b[i - 1].t).toBeGreaterThanOrEqual(2800);
  expect(b[0].ids).toEqual(plans.groups[0]);
  expect(b[1].ids).toEqual(plans.groups[1]);
  const firstGroup = log.filter((entry: [number, string]) => plans.groups[0].includes(entry[1])).slice(0, 2);
  expect(firstGroup[1][0] - firstGroup[0][0]).toBeGreaterThanOrEqual(120);
  expect(firstGroup[1][0] - firstGroup[0][0]).toBeLessThanOrEqual(200);
});

test('no sway while the cursor is near an area', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(2600);
  const r = (await page.locator(area('stack')).boundingBox())!;
  await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
  await logSways(page); await page.waitForTimeout(6500);
  expect(await page.evaluate(() => (window as any).__sways.length)).toBe(0);
});

test('no sway for 4.5 s after an area is clicked', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(3200);
  await page.locator(area('f24')).click(); await page.mouse.move(1900, 950);
  await logSways(page); await page.waitForTimeout(4200);
  expect(await page.evaluate(() => (window as any).__sways.length)).toBe(0);
});

test('the chip reads "{question} · Click to ask" near an area', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(2600);
  const r = (await page.locator(area('cv')).boundingBox())!;
  await page.mouse.move(r.x + r.width / 2 + 30, r.y + r.height / 2); await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
  await expect(page.locator(N.chip)).toHaveClass(new RegExp(N.chipOn));
  await expect(page.locator(N.chip)).toContainText('Can I see his CV?');
  await expect(page.locator(N.chip)).toContainText('Click to ask');
  await expect(page.locator(area('cv'))).toHaveCSS('color', 'rgb(18, 42, 34)');
  await expect(page.locator(area('cv'))).toHaveCSS('background-color', 'rgba(201, 224, 138, 0.7)');
});

test('clicking View CV while asking asks instead of navigating', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(2600);
  const before = page.url();
  await page.locator(area('cv')).click();
  await expect(page.locator(N.heading)).toHaveText('Can I see his CV?');
  expect(page.url()).toBe(before);
});

test('Esc closes cleanly and reopening preserves the current answer', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(2600);
  await page.locator(area('stack')).click(); await page.waitForTimeout(3500);
  await page.keyboard.press('Escape'); await page.waitForTimeout(2200);
  const left = await page.evaluate(n => document.querySelectorAll(`.${n.lit},.${n.quoted},.${n.sway},${n.flag}`).length, N);
  expect(left).toBe(0);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await openAsk(page);
  await expect(page.locator(N.heading)).toHaveText('What does he build with?');
});

test('reduced motion: nothing animates, but underlines and highlights still appear', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(TARGET); await openAsk(page); await page.waitForTimeout(3200);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(await page.locator(`.${N.lit}`).count()).toBeGreaterThanOrEqual(18);
  await page.locator(area('f24')).click(); await page.waitForTimeout(2500);
  expect(await page.locator(`.${N.quoted}`).count()).toBeGreaterThan(0);
});

test('only Figtree and Newsreader, and nothing uppercase-transformed, inside the feature', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(2600);
  await page.locator(area('stack')).click(); await page.waitForTimeout(3500);
  const r = await page.evaluate(n => {
    const fonts = new Set<string>(); let upper = 0;
    document.querySelectorAll(`[data-ask-panel] *, ${n.chip}, ${n.chip} *, ${n.close}, ${n.close} *, ${n.flag}`).forEach(e => {
      const cs = getComputedStyle(e);
      if (![...e.childNodes].some(c => c.nodeType === 3 && c.textContent!.trim()) || cs.opacity === '0') return;
      fonts.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      if (cs.textTransform === 'uppercase') upper++;
    });
    return { fonts: [...fonts].sort(), upper };
  }, N);
  expect(r.fonts).toContain('Figtree');
  expect(r.fonts.every(font => ['Figtree', 'Newsreader'].includes(font))).toBe(true);
  expect(r.upper).toBe(0);
});

test('axe: no violations with ask mode open', async ({ page }) => {
  await openAsk(page); await page.waitForTimeout(3000);
  const res = await new AxeBuilder({ page }).analyze();
  expect(res.violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
});
