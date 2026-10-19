import { expect, test } from '@playwright/test';

const directions = ['typographic', 'cinematic', 'kinetic'] as const;
const copy = [
  'Hi, I’m Miguel.',
  '4+ years building production software.',
  'Built a product used by hundreds of companies.'
];

for (const slug of directions) {
  test.describe(`hero lab: ${slug}`, () => {
    test('shows the original portrait, the exact hero copy and settles fully visible', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/hero-lab/${slug}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2400);

      const root = page.locator('[data-lab-root]');
      for (const text of copy) await expect(root.getByText(text, { exact: true })).toBeVisible();
      await expect(page.locator('#intro-heading')).toHaveAttribute('aria-label', 'Frontend engineer & product designer.');

      const portrait = await page.locator('[data-lab-root] .lab-portrait img').evaluate(img => {
        const image = img as HTMLImageElement;
        return { loaded: image.complete && image.naturalWidth > 0, src: image.currentSrc, alt: image.alt, height: image.getBoundingClientRect().height };
      });
      expect(portrait.loaded).toBe(true);
      expect(portrait.src).toMatch(/\/images\/wind-full-(720|1086)\.(avif|webp)$/);
      expect(portrait.alt).toBe('Miguel Almeida');

      // Nothing held for the opening may stay hidden once it settles.
      const hidden = await page.locator('[data-arm]').evaluateAll(nodes => nodes
        .filter(node => node.getClientRects().length && parseFloat(getComputedStyle(node).opacity) < .99).length);
      expect(hidden).toBe(0);
      expect(errors).toEqual([]);
    });

    test('keeps one geometry across engines under the desktop zoom', async ({ page }) => {
      const viewport = page.viewportSize()!;
      test.skip(viewport.width < 1024, 'desktop composition only');
      await page.goto(`/hero-lab/${slug}`);
      await page.waitForTimeout(2400);
      // Regression: WebKit resolves cq* units in zoomed pixels, shrinking the portrait ~20%.
      const ratio = await page.locator('[data-lab-root] .lab-portrait img').evaluate(img => img.getBoundingClientRect().height / innerHeight);
      expect(ratio).toBeGreaterThan(slug === 'cinematic' ? .7 : .75);
      expect(ratio).toBeLessThan(1.01);
    });

    test('never lets the heading overlap the portrait on small screens', async ({ page }) => {
      const viewport = page.viewportSize()!;
      test.skip(viewport.width >= 1024, 'compact layouts only');
      await page.goto(`/hero-lab/${slug}`);
      await page.waitForTimeout(2400);
      const boxes = await page.evaluate(() => {
        const frame = document.querySelector('[data-figure], [data-lens]')!.getBoundingClientRect();
        const heading = document.querySelector('#intro-heading')!;
        // Every visible heading text element of every direction carries this hook.
        const text = [...heading.querySelectorAll('[data-heading-text]')].map(el => el.getBoundingClientRect());
        return { frame: frame.toJSON(), text: text.map(r => r.toJSON()) };
      });
      expect(boxes.text.length).toBeGreaterThan(1);
      for (const r of boxes.text) {
        const overlaps = r.left < boxes.frame.right - 1 && r.right > boxes.frame.left + 1 && r.top < boxes.frame.bottom - 1 && r.bottom > boxes.frame.top + 1;
        expect(overlaps).toBe(false);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });

    test('reduced motion keeps everything visible with native scrolling', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`/hero-lab/${slug}`);
      await page.waitForTimeout(600);
      const state = await page.evaluate(() => ({
        hidden: [...document.querySelectorAll('[data-arm]')].filter(node => parseFloat(getComputedStyle(node).opacity) < .99).length,
        scroll: (window as Window & { __canonScroll?: { mode: string } }).__canonScroll?.mode
      }));
      expect(state.hidden).toBe(0);
      expect(state.scroll).toBe('native-reduced');
      // Direction 01 is previewed as a whole site; its CV link stays inside it.
      await expect(page.locator('[data-lab-root] a[data-ask-id="cv"]')).toHaveAttribute('href', slug === 'typographic' ? '/hero-lab/typographic/cv' : '/cv');
    });
  });
}

// Direction 01 applied to Story and CV.
const d1Pages = [
  { path: '/hero-lab/typographic/story', heading: '#story-title', nav: 'nav-story' },
  { path: '/hero-lab/typographic/cv', heading: '#cv-name', nav: 'nav-cv' }
] as const;

for (const d1 of d1Pages) {
  test.describe(`direction 01: ${d1.path}`, () => {
    test('settles visible, marks its page and raises no errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      // Regression: the masthead's section indicator once looped its own effect.
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto(d1.path);
      await page.waitForTimeout(2400);
      await expect(page.locator(d1.heading)).toBeVisible();
      const nav = page.locator(`nav[aria-label="Main navigation"] a[data-ask-id="${d1.nav}"]`);
      if (await nav.isVisible()) await expect(nav).toHaveAttribute('aria-current', 'page');
      const hidden = await page.locator('[data-arm]').evaluateAll(nodes => nodes
        .filter(node => node.getClientRects().length && parseFloat(getComputedStyle(node).opacity) < .99).length);
      expect(hidden).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });

    test('never lets the title overlap the portrait on small screens', async ({ page }) => {
      test.skip(page.viewportSize()!.width >= 1024, 'compact layouts only');
      await page.goto(d1.path);
      await page.waitForTimeout(2400);
      const boxes = await page.evaluate(() => {
        const frame = document.querySelector('[data-hero-stage] [data-figure]')!.getBoundingClientRect().toJSON();
        const text = [...document.querySelectorAll('[data-hero-stage] [data-heading-text], [data-hero-stage] [data-j-word], [data-hero-stage] [data-rise-word]')]
          .map(el => el.getBoundingClientRect().toJSON());
        return { frame, text };
      });
      expect(boxes.text.length).toBeGreaterThan(1);
      for (const r of boxes.text) {
        expect(r.left < boxes.frame.right - 1 && r.right > boxes.frame.left + 1 && r.top < boxes.frame.bottom - 1 && r.bottom > boxes.frame.top + 1).toBe(false);
      }
    });

    test('reduced motion shows final content with native scrolling', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(d1.path);
      await page.waitForTimeout(600);
      const state = await page.evaluate(() => ({
        hidden: [...document.querySelectorAll('[data-arm], [data-rise-word], [data-settle]')]
          .filter(node => parseFloat(getComputedStyle(node).opacity) < .99 || getComputedStyle(node).transform !== 'none').length,
        counts: [...document.querySelectorAll<HTMLElement>('[data-count]')].every(node => node.textContent === node.dataset.count),
        scroll: (window as Window & { __canonScroll?: { mode: string } }).__canonScroll?.mode
      }));
      expect(state).toEqual({ hidden: 0, counts: true, scroll: 'native-reduced' });
    });
  });
}

test('direction 01 pages link to each other and to Selected Work', async ({ page }) => {
  test.skip(page.viewportSize()!.width < 1024, 'desktop masthead');
  await page.goto('/hero-lab/typographic/story');
  await page.waitForTimeout(1600);
  await page.locator('nav[aria-label="Main navigation"] a[data-ask-id="nav-cv"]').click();
  await expect(page).toHaveURL(/\/hero-lab\/typographic\/cv$/);
  await expect(page.locator('#cv-name')).toBeVisible();
  await page.locator('nav[aria-label="Main navigation"] a[data-ask-id="nav-work"]').click();
  await expect(page).toHaveURL(/\/hero-lab\/typographic#work$/);
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('work')!.getBoundingClientRect().top))).toBeLessThan(200);
});

test('direction 01 menu travels to another page without errors', async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 1024, 'compact menu');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/hero-lab/typographic/cv');
  await page.waitForTimeout(1600);
  await page.locator('.index-toggle').click();
  await page.locator('#d1-index a[href="/hero-lab/typographic/story"]').click();
  await expect(page).toHaveURL(/\/hero-lab\/typographic\/story$/);
  await page.waitForTimeout(1000);
  // Regression: the menu was unmounted mid-close and its shutter then called close() on null.
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
});
