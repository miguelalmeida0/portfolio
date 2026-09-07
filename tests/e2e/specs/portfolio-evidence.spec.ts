import { expect, test, type Page } from '@playwright/test';

import { homeHeroHeading, selectedWork } from '../fixtures/testData';

const expectNoHorizontalOverflow = async (page: Page) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
};

test.describe('portfolio content revamp', () => {
  test('homepage presents the restored positioning and three primary actions', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto('/');

    const hero = page.locator('#top');
    await expect(hero.getByRole('heading', { name: homeHeroHeading })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'Explore my work' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'View résumé' })).toBeVisible();
    await expect(hero.getByRole('button', { name: 'Ask MiguelLLM' })).toBeVisible();
    await expect(hero.getByRole('figure', { name: 'Portrait of Miguel Almeida' })).toBeVisible();
  });

  test('work wall follows the canonical sequence and every project route resolves', async ({ page }) => {
    await page.goto('/#work');
    const tiles = page.locator('[data-project-tile]');
    await expect(tiles).toHaveCount(selectedWork.length);

    for (const [index, title] of selectedWork.entries()) {
      await expect(tiles.nth(index)).toContainText(title);
    }

    for (const slug of ['camera-harness', 'ghostwriter', 'atlas', 'creature-app', 'mirror-ai']) {
      const response = await page.goto(`/work/${slug}`);
      expect(response?.ok(), slug).toBe(true);
      await expect(page.locator('#contribution')).toBeVisible();
      await expect(page.locator('#reflection')).toBeVisible();
    }
  });

  test('media is poster-first, controllable, and lazily mounts sources', async ({ page }) => {
    await page.goto('/#work');
    const cameraVideo = page.locator('[data-project-tile="camera-harness"] video');

    await expect(cameraVideo).toHaveAttribute('poster', /.+/);
    await expect(cameraVideo).toHaveAttribute('preload', 'none');
    await expect(cameraVideo).toHaveAttribute('loop', '');
    await expect(cameraVideo).toHaveAttribute('playsinline', '');
    await expect.poll(() => cameraVideo.getAttribute('data-video-sources-mounted')).toBe('true');
    await expect
      .poll(() =>
        cameraVideo.evaluate((video) => {
          const videoRect = video.getBoundingClientRect();
          const shellRect = video.parentElement?.getBoundingClientRect();
          return {
            fit: getComputedStyle(video).objectFit,
            sameWidth: Math.abs(videoRect.width - (shellRect?.width ?? 0)) < 1,
            sameHeight: Math.abs(videoRect.height - (shellRect?.height ?? 0)) < 1
          };
        })
      )
      .toEqual({ fit: 'cover', sameWidth: true, sameHeight: true });

    const control = page.locator('[data-project-tile="camera-harness"]').getByRole('button', {
      name: /Pause project film|Play project film/
    });
    await expect(control).toBeVisible();
    await control.click();
    await expect(control).toHaveAccessibleName(/Play project film|Pause project film/);
  });

  for (const viewport of [
    { width: 1366, height: 900 },
    // A 1600px desktop viewport at 200% browser zoom reflows to roughly 800 CSS pixels.
    { width: 800, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 700 }
  ]) {
    test(`homepage has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.getByRole('heading', { name: homeHeroHeading })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }

  test('reduced motion starts with complete content and paused films', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#work');

    await expect(page.getByRole('heading', { name: homeHeroHeading })).toBeVisible();
    const videos = page.locator('[data-project-tile] video');
    for (let index = 0; index < (await videos.count()); index += 1) {
      await expect.poll(() => videos.nth(index).evaluate((video) => (video as HTMLVideoElement).paused)).toBe(true);
    }
  });

  test('public copy avoids unsupported positioning and metrics', async ({ page }) => {
    for (const route of ['/', '/story', '/cv', '/work/camera-harness', '/work/atlas']) {
      await page.goto(route);
      const body = await page.locator('body').innerText();
      expect(body).not.toMatch(/company.?s first AI product/i);
      expect(body).not.toMatch(/fully local AI/i);
      expect(body).not.toMatch(/accurate object recognition/i);
      expect(body).not.toMatch(/senior frontend engineer/i);
    }
  });
});
