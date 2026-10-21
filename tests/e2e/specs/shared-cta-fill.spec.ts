import { expect, test } from '@playwright/test';

const routes = [
  ['/work/f24', 'Explore demo', '#try'],
  ['/work/needle', 'Explore demo', '#try'],
  ['/work/second-voice', 'Explore demo', '#try'],
  ['/work/flow', 'Explore demo', '#try'],
  ['/work/leu', 'Explore the experience', '#platforms'],
  ['/cv', 'Open CV PDF', '/cv/pdf']
];

for (const [route, label, href] of routes) {
  test(`SSR preserves ${route} CTA navigation with accessible fill layers`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const anchors = [...html.matchAll(/<a\b[^>]*data-circle-fill[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    const anchor = anchors.find(markup => markup.includes(`href="${href}"`) && markup.includes(label));
    expect(anchor).toBeDefined();
    expect(anchor).not.toMatch(/\b(?:role|tabindex|download)=/);
    expect(anchor).toMatch(/class="fill-label[^\"]*"/);
    expect(anchor).toMatch(/class="fill-reveal[^\"]*" aria-hidden="true"/);
    expect(anchor).toMatch(/class="fill-orbit[^\"]*" aria-hidden="true"/);
  });

  test(`${route} CTA fits mobile and reveals its fill on keyboard focus`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(route);
    const cta = page.locator('main').getByRole('link', { name: label, exact: true }).first();
    await expect(cta).toHaveAttribute('href', href);
    await expect(cta).toHaveCSS('background-color', 'rgb(89, 22, 60)');
    await cta.scrollIntoViewIfNeeded();
    const box = (await cta.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    await expect(cta).toHaveCSS('white-space', 'nowrap');
    await expect(cta.locator('.fill-arrow-out')).toHaveCSS('fill', 'none');
    await expect(cta.locator('.fill-arrow-out')).toHaveCSS('stroke', 'rgb(89, 22, 60)');
    const identity = page.locator('.pnav .pname');
    if (await identity.count()) {
      const title = (await identity.boundingBox())!;
      const action = (await page.locator('.pnav .project-actions').boundingBox())!;
      expect(title.x + title.width).toBeLessThanOrEqual(action.x);
      expect(await identity.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
    await page.keyboard.press('Tab');
    await cta.focus();
    await expect(cta).toBeFocused();
    await expect(cta.locator('.fill-reveal')).toHaveCSS('clip-path', 'inset(0px round 999px)');
    await expect(cta.locator('.fill-reveal')).toHaveCSS('color', 'rgb(89, 22, 60)');
    await expect(cta).toHaveCSS('outline-style', 'solid');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(cta.locator('.fill-reveal')).toHaveCSS('transition-property', 'none');
  });
}
