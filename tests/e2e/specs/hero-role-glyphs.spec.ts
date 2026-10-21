import { test, expect } from '@playwright/test';

for (const width of [390, 768, 1440, 1920]) {
  test(`hero role glyphs fit their reveal masks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hero-lab/typographic');
    await page.evaluate(() => document.fonts.ready);
    const failures = await page.locator('.d1 .word, .d1 .band-word').evaluateAll(words => {
      const context = document.createElement('canvas').getContext('2d')!;
      return words.flatMap(word => {
        const style = getComputedStyle(word);
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = context.measureText(word.textContent ?? '');
        // An empty inline block's bottom is the actual text baseline.
        const marker = document.createElement('span');
        marker.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline';
        word.append(marker);
        const baseline = marker.getBoundingClientRect().bottom;
        marker.remove();
        const rect = word.getBoundingClientRect();
        const scale = rect.height / (word as HTMLElement).offsetHeight;
        const top = baseline - metrics.actualBoundingBoxAscent * scale;
        const bottom = baseline + metrics.actualBoundingBoxDescent * scale;
        const errors: string[] = [];
        for (let ancestor = word.parentElement; ancestor; ancestor = ancestor.parentElement) {
          if (!['clip', 'hidden'].includes(getComputedStyle(ancestor).overflowY)) continue;
          const clip = ancestor.getBoundingClientRect();
          if (top < clip.top - 1 || bottom > clip.bottom + 1) {
            errors.push(`${word.textContent}: glyph bounds ${top}..${bottom} exceed ${ancestor.className} ${clip.top}..${clip.bottom}`);
          }
        }
        return errors;
      });
    });
    expect(failures).toEqual([]);
  });
}

for (const width of [1280, 1440, 1920]) {
  test(`hero copy retains aligned rails while the headline sits inward at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hero-lab/typographic');
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.evaluate(() => {
      const rect = (selector: string) => {
        const r = document.querySelector(selector)!.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      };
      return {
        greeting: rect('.d1-greeting'), frontend: rect('[data-back-word="left"]'),
        engineer: rect('[data-back-word="right"]'), years: rect('.d1-years'),
        tech: rect('.d1-tech'), reach: rect('.d1-reach'), actions: rect('.d1 .actions'),
        band: rect('.d1 .band')
      };
    });
    for (const left of [bounds.years.left, bounds.tech.left]) {
      expect(Math.abs(left - bounds.greeting.left)).toBeLessThan(1);
    }
    expect(Math.abs(bounds.reach.left - bounds.actions.left)).toBeLessThan(1);
    expect(bounds.frontend.left).toBeGreaterThan(bounds.greeting.left);
    expect(bounds.engineer.left).toBeLessThan(bounds.reach.left);
    const leftInset = bounds.frontend.left - bounds.greeting.left;
    const rightInset = bounds.reach.left - bounds.engineer.left;
    expect(Math.abs(leftInset - rightInset)).toBeLessThan(1);
    expect(Math.abs(bounds.years.top - bounds.reach.top)).toBeLessThan(1);
    const techCenter = (bounds.tech.top + bounds.tech.bottom) / 2;
    const actionsCenter = (bounds.actions.top + bounds.actions.bottom) / 2;
    expect(Math.abs(techCenter - actionsCenter)).toBeLessThan(1);
    expect(bounds.actions.bottom).toBeLessThan(bounds.band.top);
  });
}
