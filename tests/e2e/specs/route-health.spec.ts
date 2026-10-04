import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const routes = [
  ['/', /Frontend developer\s*& design engineer\./],
  ['/cv', /Miguel\s*Almeida\./],
  ['/story', /^Story$/],
  ['/work/needle', /^Needle$/],
  ['/work/second-voice-ai', /^Choose a literary voice\. See exactly what changes\.$/],
  ['/work/f24', /^From mockup to production system\.$/],
  ['/work/leu', /^From PDF text to learner state\.$/],
  ['/work/flow', /^From speech to deterministic state\.$/]
] as const;

for (const [path, heading] of routes) {
  test(`${path}: direct load, refresh and history retain route content`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const serverHeading = ((await response.text()).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
      .replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    expect(serverHeading).toMatch(heading);
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveText(heading);
    // Firefox exposes a successful conditional reload as 304; the rendered
    // heading and subsequent navigation still verify the cached document.
    expect([200, 304]).toContain((await page.reload())?.status());
    await expect(page.locator('main h1')).toHaveText(heading);
    if (path !== '/') {
      await openPortfolioHome(page);
      const isProject = path.startsWith('/work/');
      if (isProject) {
        const names: Record<string, string> = { needle: 'Needle', 'second-voice-ai': 'Second Voice AI', f24: 'F24', flow: 'Flow', leu: 'Leu' };
        await page.locator('.project-index button').filter({ hasText: names[path.split('/').at(-1)!] }).click();
      }
      const link = isProject
        ? page.locator('#work .links').getByRole('link', { name: 'Case study', exact: true })
        : page.locator(`header a[href="${path}"]:visible`).first();
      // Mobile CV/Story are available through the real burger navigation.
      let destinationLink = link;
      if (!(await link.isVisible())) {
        await page.getByRole('button', { name: 'Menu', exact: true }).click();
        destinationLink = page.locator(`#mobile-navigation a[href="${path}"]`);
      }
      await expect(destinationLink).not.toHaveAttribute('target', '_blank');
      await destinationLink.click();
      await expect(page).toHaveURL(new RegExp(`${path.replace('second-voice-ai', 'second-voice')}$`));
      await expect(page.locator('main h1')).toHaveText(heading);
      await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
      await page.goBack();
      await expect(page.locator('main h1')).toHaveText(routes[0][1]);
      await expect(page.locator('[data-pixel-intro]')).toBeHidden();
      await page.goForward();
      await expect(page).toHaveURL(new RegExp(`${path.replace('second-voice-ai', 'second-voice')}$`));
      await expect(page.locator('main h1')).toHaveText(heading);
      await expect(page.locator('[data-route-veil]')).toBeHidden();
    }
    expect(errors).toEqual([]);
  });
}
