import { expect, test } from '@playwright/test';

for (const width of [900, 1024, 1440, 1512, 1920, 1971, 2560]) {
  test(`CV metric text aligns with surrounding card content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cv');
    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const cards = [...document.querySelectorAll('.cv-highlights > div')].map(el => el.getBoundingClientRect());
      const main = rect('#experience-title'), sidebar = rect('#signals h2');
      return {
        edges: [cards[0].left - main.left, cards[1].right - main.right,
          cards[2].left - sidebar.left, cards[3].right - sidebar.right,
          cards[0].left - rect('.cv-name').left, cards[2].left - rect('.cv-summary-text').left],
        tops: cards.map(card => card.top),
        detailTops: [...document.querySelectorAll('.cv-highlights dd span')].map(el => el.getBoundingClientRect().top),
        gaps: cards.slice(1).map((card, i) => card.left - cards[i].right),
        overflow: document.documentElement.scrollWidth - innerWidth
      };
    });
    for (const edge of geometry.edges) expect(Math.abs(edge)).toBeLessThanOrEqual(1);
    expect(Math.max(...geometry.tops) - Math.min(...geometry.tops)).toBeLessThanOrEqual(1);
    expect(Math.max(...geometry.detailTops) - Math.min(...geometry.detailTops)).toBeLessThanOrEqual(1);
    for (const gap of geometry.gaps) expect(gap).toBeGreaterThan(0);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
  });
}

for (const width of [320, 390]) {
  test(`CV metrics retain two readable columns at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/cv');
    const cards = await page.locator('.cv-highlights > div').evaluateAll(els =>
      els.map(el => ({ box: el.getBoundingClientRect().toJSON(), overflow: el.scrollWidth - el.clientWidth })));
    expect(cards).toHaveLength(4);
    expect(cards[0].box.y).toBe(cards[1].box.y);
    expect(cards[2].box.y).toBe(cards[3].box.y);
    expect(cards[2].box.y).toBeGreaterThan(cards[0].box.y);
    const content = (await page.locator('#experience-title').boundingBox())!;
    expect(Math.abs(cards[0].box.left - content.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(cards[1].box.right - content.x - content.width)).toBeLessThanOrEqual(1);
    for (const card of cards) expect(card.overflow).toBeLessThanOrEqual(1);
  });
}
