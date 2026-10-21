import { expect, test } from '@playwright/test';

const routes = [
  ['/work/f24', 'Try the case demo', '#try'],
  ['/work/needle', 'Try the case demo', '#try'],
  ['/work/second-voice', 'Try the case demo', '#try'],
  ['/work/flow', 'Try the case demo', '#try'],
  ['/work/leu', 'See both versions', '#platforms'],
  ['/cv', 'Open CV PDF', '/cv/pdf']
];

for (const [route, label, href] of routes) {
  test(`SSR preserves ${route} CTA navigation with a single accessible label`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    const anchors = [...html.matchAll(/<a\b[^>]*data-circle-fill[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    const anchor = anchors.find(markup => markup.includes(`href="${href}"`) && markup.includes(label));
    expect(anchor).toBeDefined();
    expect(anchor).not.toMatch(/\b(?:role|tabindex|download)=/);
    expect(anchor).toMatch(/class="flow-label[^\"]*"/);
    expect(anchor).not.toContain("flow-reveal");
    expect(anchor).toContain('focusable="false"');
  });

  test(`${route} CTA fits mobile and shows a visible keyboard focus ring`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(route);
    const cta = page.locator('main').getByRole('link', { name: label, exact: true }).first();
    await expect(cta).toHaveAttribute('href', href);
    await expect(cta).toHaveCSS('background-color', 'rgb(104, 20, 62)');
    await cta.scrollIntoViewIfNeeded();
    const box = (await cta.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    expect(box.height).toBeGreaterThanOrEqual(44);
    await expect(cta.locator('.flow-arrow')).toHaveCSS('fill', 'none');
    await expect(cta.locator('.flow-arrow')).toHaveCSS('stroke', 'rgb(250, 248, 238)');
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
    await expect(cta.locator('.flow-reveal')).toHaveCount(0);
    await expect(cta).toHaveCSS('color', 'rgb(250, 248, 238)');
    await expect(cta).toHaveCSS('outline-style', 'solid');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(cta).toHaveCSS('transition-duration', '0s');
  });
}
