import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const routes = [
  ['/', /Frontend engineer\s*& design engineer\./],
  ['/cv', /Miguel\s*Almeida\./],
  ['/story', /I started in UX\.\s*Then built the frontend\./],
  ['/work/second-voice-ai', /^Second Voice$/],
  ['/work/f24', /^F24$/],
  ['/work/leu', /^Leu: from PDF text\s*to learner state\.$/],
  ['/work/flow', /^Flow$/]
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
    expect((await page.reload())?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveText(heading);
    if (path !== '/') {
      await openPortfolioHome(page);
      const isProject = path.startsWith('/work/');
      if (isProject) {
        const names: Record<string, string> = { 'second-voice-ai': 'Second Voice AI', f24: 'F24', flow: 'Flow', leu: 'Leu' };
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
      const popup = page.waitForEvent('popup');
      await destinationLink.click();
      const destination = await popup;
      destination.on('pageerror', error => errors.push(error.message));
      await expect(destination.locator('main h1')).toHaveText(heading);
      await expect(destination.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
      await expect(page.locator('main h1')).toHaveText(routes[0][1]);
      await expect(page.locator('[data-pixel-intro]')).toBeHidden();
      await destination.goto(path === '/story' ? '/cv' : '/story');
      await destination.goBack();
      await expect(destination.locator('main h1')).toHaveText(heading);
      await destination.goForward();
      await expect(destination).toHaveURL(path === '/story' ? /\/cv$/ : /\/story$/);
      await expect(destination.locator('[data-route-veil]')).toBeHidden();
      await destination.close();
    }
    expect(errors).toEqual([]);
  });
}
