import { expect, test, type Page } from '@playwright/test';

// Experimental homes connect to the supported typographic Story and CV.
const slugs = ['editorial-poster', 'kinetic-story', 'experimental'] as const;
const pages = ['', '/story', '/cv'] as const;
const profileHome = '/hero-lab/typographic';

const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
};
const armedHidden = (page: Page) => page.locator('[data-arm]').evaluateAll(nodes => nodes
  .filter(node => node.getClientRects().length && parseFloat(getComputedStyle(node).opacity) < .99).length);

for (const slug of slugs) {
  const home = `/hero-lab/${slug}`;
  test.describe(`round 5: ${slug}`, () => {
    for (const suffix of pages) {
      test(`${suffix || '/'} settles visible, without errors or overflow`, async ({ page }) => {
        const errors = watchErrors(page);
        await page.goto(home + suffix);
        await expect(page).toHaveURL(new RegExp(`${suffix ? profileHome + suffix : home}$`));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(2600);
        await expect(page.locator('h1').first()).toBeVisible();
        expect(await armedHidden(page)).toBe(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        const portrait = await page.locator('[data-lab-root] img[alt="Miguel Almeida"]').first()
          .evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0).catch(() => null);
        if (suffix === '') expect(portrait).toBe(true);
        expect(errors).toEqual([]);
      });

      test(`${suffix || '/'} reduced motion shows final content with native scrolling`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(home + suffix);
        await page.waitForTimeout(700);
        const state = await page.evaluate(() => ({
          hidden: [...document.querySelectorAll('[data-arm]')].filter(node => parseFloat(getComputedStyle(node).opacity) < .99).length,
          scroll: (window as Window & { __canonScroll?: { mode: string } }).__canonScroll?.mode
        }));
        expect(state).toEqual({ hidden: 0, scroll: 'native-reduced' });
      });
    }

    test('Home → Story → CV → Work connects to the supported profile', async ({ page }) => {
      const errors = watchErrors(page);
      await page.goto(home);
      await page.waitForTimeout(1800);
      const follow = async (href: string) => {
        // Desktop shows the links directly; compact layouts open the direction's menu first.
        let link = page.locator(`a[href="${href}"]:visible`).first();
        if (!(await link.count())) {
          await page.locator('button[aria-haspopup="dialog"]:visible').first().click();
          await page.waitForTimeout(700);
          link = page.locator(`dialog[open] a[href="${href}"]`).first();
        }
        await link.click();
      };
      await follow(`${profileHome}/story`);
      await expect(page).toHaveURL(new RegExp(`${profileHome}/story$`));
      await expect(page.locator('#story-hi')).toBeAttached();
      await expect.poll(() => page.evaluate(() => document.documentElement.dataset.labPageTransition ?? 'done'), { timeout: 4000 }).toBe('done');
      await follow(`${profileHome}/cv`);
      await expect(page).toHaveURL(new RegExp(`${profileHome}/cv$`));
      await expect(page.locator('[data-ask-id="cv-summary"]')).toBeAttached();
      await page.waitForTimeout(1200);
      await follow(`${profileHome}#work`);
      await expect(page).toHaveURL(new RegExp(`${profileHome}#work$`));
      await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('work')!.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(220);
      expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
      expect(errors).toEqual([]);
    });

    test('the page transition never leaves the next page covered', async ({ page }) => {
      await page.goto(`${home}/story`);
      await page.waitForTimeout(1600);
      await page.evaluate(href => (document.querySelector(`a[href="${href}"]`) as HTMLAnchorElement).click(), `${profileHome}/cv`);
      await expect(page).toHaveURL(new RegExp(`${profileHome}/cv$`));
      await page.waitForTimeout(1600);
      // Whatever covered the page during the change is gone: sampled points hit the new page itself.
      const top = await page.evaluate(() => [[.5, .5], [.3, .4], [.7, .6]].every(([x, y]) => {
        const hit = document.elementFromPoint(innerWidth * x, innerHeight * y);
        return Boolean(hit?.closest('[data-lab-root]'));
      }));
      expect(top).toBe(true);
    });
  });
}
