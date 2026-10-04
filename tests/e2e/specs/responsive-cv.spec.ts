import { expect, test } from '../fixtures';
import { openPortfolioHome } from '../helpers/portfolio';

const routes = ['/', '/cv', '/story', '/work/second-voice-ai', '/work/f24', '/work/leu', '/work/flow'];

for (const width of [320, 390, 600, 768, 820, 1024, 1440, 1920, 2560]) {
  test(`all public layouts fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      if (route === '/') await openPortfolioHome(page);
      else await page.goto(route);
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, route).toBeLessThanOrEqual(1);

      const identity = page.locator('[data-identity-home]');
      await expect(identity).toBeVisible();
      const box = await identity.boundingBox();
      expect(box, route).not.toBeNull();
      expect(box!.x, route).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width, route).toBeLessThanOrEqual(width + 1);

      const main = page.getByRole('main');
      const mainBox = await main.boundingBox();
      expect(mainBox, route).not.toBeNull();
      expect(mainBox!.x + mainBox!.width, route).toBeLessThanOrEqual(width + 1);
    }
  });
}
