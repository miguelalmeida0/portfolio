import { expect, test } from '@playwright/test';

const expectNoHorizontalOverflow = async (page: import('@playwright/test').Page) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
};

test.describe('media-first portfolio', () => {
  test('hero prioritizes work and moves into the living project wall', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('/');

    const hero = page.locator('#top');
    const portrait = hero.getByLabel('Portrait of Miguel Almeida').locator('img');
    await expect(
      hero.getByRole('heading', {
        name: 'I’m Miguel, a frontend engineer building multimodal and computer-vision systems.'
      })
    ).toBeVisible();
    await expect(portrait).toHaveCSS('object-fit', 'contain');
    await expect(portrait).toHaveCSS('object-position', '50% 100%');
    await expect(hero.getByRole('link', { name: 'Explore my work' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'View résumé' })).toBeVisible();
    await expect(hero.getByRole('button', { name: /Ask MiguelLLM/i })).toBeVisible();

    const workLink = hero.getByRole('link', { name: 'Explore my work' });
    await workLink.click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.getByRole('heading', { name: 'Selected work' })).toBeVisible();

    const headerBottom = await page
      .getByTestId('site-header')
      .evaluate((element) => element.getBoundingClientRect().bottom);
    const workHeadingTop = await page
      .getByRole('heading', { name: 'Selected work' })
      .evaluate((element) => element.getBoundingClientRect().top);
    expect(workHeadingTop).toBeGreaterThan(headerBottom);
  });

  test('project gallery is orderly, factual, keyboard-reachable, and media-led', async ({
    page
  }) => {
    await page.goto('/#work');

    const camera = page.locator('[data-project-tile="camera-harness"]');
    const ghostwriter = page.locator('[data-project-tile="ghostwriter"]');
    const creature = page.locator('[data-project-tile="creature-mirror"]');
    const mirrorAi = page.locator('[data-project-tile="mirror-ai"]');

    await expect(camera.getByRole('link', { name: /Camera Harness/i })).toBeVisible();
    await expect(camera.getByText(/Experimental · hybrid local \/ hosted/i)).toBeVisible();
    await expect(camera.getByText(/latest-frame queue/i)).toBeVisible();
    await expect(camera.locator('video')).not.toHaveAttribute('poster', /.+/);
    await expect(camera.locator('video source')).toHaveAttribute(
      'src',
      '/projects/camera-harness/book-recognition-loop-1080.m4v'
    );
    await expect(camera.locator('video')).toHaveAttribute('muted', '');
    await expect(ghostwriter.getByText(/Keep the meaning/i)).toBeVisible();
    await expect(ghostwriter.getByText(/inspect rewrite/i)).toBeVisible();
    await expect(ghostwriter.locator('video')).not.toHaveAttribute('poster', /.+/);
    await expect(ghostwriter.locator('video')).toHaveAttribute('muted', '');
    await expect(ghostwriter.locator('video')).toHaveAttribute('playsinline', '');
    await expect(creature.getByRole('link', { name: /Creature App/i })).toBeVisible();
    await expect(mirrorAi.getByRole('link', { name: /Mirror AI/i })).toBeVisible();

    const cameraBox = await camera.boundingBox();
    const ghostwriterBox = await ghostwriter.boundingBox();
    expect(Math.abs((cameraBox?.width ?? 0) - (ghostwriterBox?.width ?? 0))).toBeLessThan(3);

    await creature.getByRole('link', { name: /Creature App/i }).focus();
    await expect(creature.getByRole('link', { name: /Creature App/i })).toBeFocused();

    const publicImages = await page.locator('img').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src') ?? '')
    );
    expect(publicImages.join(' ')).not.toContain('movement-mug');
    expect(publicImages.join(' ')).not.toContain('movement-peace-sign');
    expect(publicImages.join(' ')).not.toContain('movement-confirmation');
  });

  test('all project films load, autoplay, and loop without hover', async ({ page }) => {
    await page.goto('/#work');

    const ghostwriterVideo = page.locator('[data-project-tile="ghostwriter"] video');
    const mirrorAiVideo = page.locator('[data-project-tile="mirror-ai"] video');
    const cameraVideo = page.locator('[data-project-tile="camera-harness"] video');

    await expect(cameraVideo).toHaveAttribute('data-autoplay-visible', 'true');
    await expect(ghostwriterVideo).toHaveAttribute('data-autoplay-visible', 'true');
    await expect(mirrorAiVideo).toHaveAttribute('data-autoplay-visible', 'true');

    for (const video of [cameraVideo, ghostwriterVideo, mirrorAiVideo]) {
      await expect(video).toHaveAttribute('autoplay', '');
      await expect(video).toHaveAttribute('loop', '');
      await expect(video.locator('source').first()).toBeAttached();
      await expect
        .poll(() => video.evaluate((element) => (element as HTMLVideoElement).paused))
        .toBe(false);
    }

    await page.getByRole('heading', { name: 'Selected work' }).hover();
    await expect
      .poll(() =>
        page
          .locator('[data-project-tile] video')
          .evaluateAll(
            (videos) =>
              videos.filter((video) => !(video as HTMLVideoElement).paused).length
          )
      )
      .toBe(3);
  });

  test('mobile homepage keeps work and navigation readable without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Explore my work' })).toBeVisible();
    await expect(page.getByTestId('primary-navigation')).toBeHidden();

    const menuToggle = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(menuToggle).toBeVisible();
    await expect(page.getByRole('link', { name: 'Miguel Almeida, homepage' })).toBeVisible();
    await menuToggle.click();

    const mobileNavigation = page.getByRole('navigation', { name: 'Mobile primary' });
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole('link')).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await page.keyboard.press('Escape');
    await expect(mobileNavigation).toBeHidden();
    await expectNoHorizontalOverflow(page);

    await page.getByRole('link', { name: 'Explore my work' }).click();
    const camera = page.locator('[data-project-tile="camera-harness"]');
    await expect(camera).toBeVisible();
    await expect(camera.locator('small')).toBeHidden();
    await expect(camera.locator('.tile-meta span').nth(1)).toBeHidden();
    const ghostwriter = page.locator('[data-project-tile="ghostwriter"]');
    await expect(ghostwriter).toBeVisible();
    await expect(ghostwriter.locator('video')).toHaveAttribute('data-mobile-poster', 'false');
    await expect(ghostwriter.locator('video source').first()).toBeAttached();
    await expect
      .poll(() =>
        ghostwriter.locator('video').evaluate((video) => (video as HTMLVideoElement).paused)
      )
      .toBe(false);
    await expectNoHorizontalOverflow(page);

    await page.goto('/#contact');
    await expect(page.getByRole('heading', { name: 'Want the practical version?' })).toBeVisible();
    await expect(page.locator('.contact-grid > *')).toHaveCount(5);
    const shortcutBox = await page.locator('.llm-shortcut').boundingBox();
    const firstShortcutBox = await page.locator('.contact-llm-chip').first().boundingBox();
    expect(shortcutBox?.height ?? Infinity).toBeLessThan(220);
    expect(firstShortcutBox?.height ?? Infinity).toBeLessThan(48);
    await expectNoHorizontalOverflow(page);
  });

  test('retired Lab route returns visitors to the project grid', async ({ page }) => {
    await page.goto('/lab');

    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.getByRole('heading', { name: 'Selected work' })).toBeVisible();
  });

  test('Camera Harness exposes interactive current, historical, and proposed truth states', async ({
    page
  }) => {
    await page.goto('/work/camera-harness#runtime-architecture');

    await expect(page.getByRole('heading', { name: 'Camera Harness' })).toBeVisible();
    await expect(
      page.locator('.case-hero').getByAltText(/raising a phone/i)
    ).toBeVisible();
    await expect(page.getByText(/not\s+general recognition accuracy/i).first()).toBeVisible();

    const architecture = page.locator(
      '[aria-label="Camera Harness architecture states"]'
    );
    await expect(architecture).toHaveAttribute('data-architecture-mode', 'current');
    await architecture.getByRole('button', { name: /Ask frame window/i }).click();
    await expect(architecture.getByRole('heading', { name: 'Ask frame window' })).toBeVisible();
    await expect(architecture.getByText(/separate short frame window/i)).toBeVisible();

    await architecture.getByRole('tab', { name: 'Historical' }).click();
    await expect(architecture).toHaveAttribute('data-architecture-mode', 'historical');
    await expect(architecture.getByText(/not active in the current product/i)).toBeVisible();
    await architecture.getByRole('button', { name: /AirScript/i }).click();
    await expect(architecture.getByText(/not mounted in the current product/i)).toBeVisible();

    await architecture.getByRole('tab', { name: 'Proposed' }).click();
    await expect(architecture).toHaveAttribute('data-architecture-mode', 'proposed');
    await expect(architecture.getByText(/not currently implemented/i)).toBeVisible();
    await architecture.getByRole('button', { name: /Answer-to-evidence links/i }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(architecture.getByRole('heading', { name: 'User confirm or discard' })).toBeVisible();
  });

  test('Camera Harness comparisons, timeline, and test interpretation change state', async ({
    page
  }) => {
    await page.goto('/work/camera-harness#ask-provenance');

    const askComparison = page.locator(
      '.system-comparison[aria-label="Ask evidence continuity comparison"]'
    );
    await askComparison.getByRole('tab', { name: /What currently happens/i }).click();
    await expect(askComparison).toHaveAttribute('data-comparison-active', 'actual');
    await expect(askComparison.getByText(/Separate Ask frame window/i)).toBeVisible();

    const timeline = page.locator('.timeline-explorer');
    await timeline.getByRole('button', { name: /Stabilization removes active integration/i }).click();
    await expect(timeline.getByText('Commit a0f0f5a2', { exact: true })).toBeVisible();
    await timeline.getByRole('button', { name: /AirScript and Spatial Lasso exposed/i }).click();
    await expect(timeline.getByText('Commit 4b18fce8', { exact: true })).toBeVisible();

    const testBoundary = page.getByRole('region', {
      name: 'Evidence interpretation explorer'
    });
    await testBoundary.getByRole('tab', { name: /Real-model sample/i }).click();
    await expect(testBoundary.getByText(/A model executed on one machine/i)).toBeVisible();
    await expect(testBoundary.getByText(/An accuracy distribution/i)).toBeVisible();

    const architectureComparison = page.locator(
      '.system-comparison[aria-label="Current and proposed evidence architecture"]'
    );
    await architectureComparison.getByRole('tab', { name: /Proposed architecture/i }).click();
    await expect(architectureComparison).toHaveAttribute(
      'data-comparison-active',
      'proposed'
    );
    await expect(
      architectureComparison
        .locator('.comparison-panel')
        .getByText('Recommendation · not implemented', { exact: true })
    ).toBeVisible();

    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/production-ready spatial intelligence/i);
    expect(body).not.toMatch(/fully local AI/i);
    expect(body).not.toMatch(/accurate object recognition/i);
    await expect(page.locator('img[src*="movement-"]')).toHaveCount(0);
  });

  test('supporting case studies use distinct interactive evidence', async ({ page }) => {
    await page.goto('/work/atlas');
    await expect(
      page.getByRole('heading', { name: /Deterministic risk first/i })
    ).toBeVisible();
    const atlasComparison = page.locator(
      '.system-comparison[aria-label="Atlas deterministic and model boundary"]'
    );
    await atlasComparison.getByRole('tab', { name: /Explained/i }).click();
    await expect(
      atlasComparison.getByRole('heading', { name: /Explanation remains inspectable/i })
    ).toBeVisible();
    await expect(atlasComparison.getByText(/Retrieval supplies established evidence/i)).toBeVisible();

    await page.goto('/work/ghostwriter');
    await expect(page.getByRole('heading', { name: 'Ghostwriter', exact: true })).toBeVisible();
    await expect(page.getByText('Reliability case study', { exact: true })).toBeVisible();
    await expect(page.getByAltText(/Ghostwriter editorial interface/i)).toBeVisible();
    const ghostwriterComparison = page.locator(
      '.system-comparison[aria-label="Ghostwriter registration reliability comparison"]'
    );
    await ghostwriterComparison.getByRole('tab', { name: /Recovery/i }).click();
    await expect(ghostwriterComparison.getByText(/migration/i).first()).toBeVisible();
  });

  test('Story opens on the hackathon gallery and keeps a compact four-part timeline', async ({ page }) => {
    await page.goto('/story');

    await expect(
      page.getByRole('heading', { name: 'Implementing the company’s first AI product.' })
    ).toBeVisible();
    await expect(page.locator('.chapter')).toHaveCount(4);
    await expect(page.getByRole('navigation', { name: 'Story chapters' }).getByRole('link')).toHaveCount(
      4
    );
    await expect(page.locator('.hackathon-grid img')).toHaveCount(6);
    await expect(page.locator('.hackathon-grid picture')).toHaveCount(6);

    const firstStoryPicture = page.locator('.hackathon-grid picture').first();
    await expect(firstStoryPicture.locator('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      /presentation-room-640\.avif 640w, .*presentation-room-1024\.avif 1024w/
    );
    await expect(firstStoryPicture.locator('source[type="image/webp"]')).toHaveAttribute(
      'srcset',
      /presentation-room-640\.webp 640w, .*presentation-room-1024\.webp 1024w/
    );
    await expect(firstStoryPicture.locator('img')).toHaveAttribute('loading', 'eager');
    await expect(page.locator('.hackathon-grid img').nth(1)).toHaveAttribute('loading', 'lazy');
    await expect
      .poll(() =>
        firstStoryPicture
          .locator('img')
          .evaluate((image) => (image as HTMLImageElement).currentSrc)
      )
      .toMatch(/presentation-room-(640|1024)\.(avif|webp)$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expectNoHorizontalOverflow(page);
    await page
      .getByRole('navigation', { name: 'Story chapters' })
      .getByRole('link', { name: /Builder/i })
      .click();
    await expect(page).toHaveURL(/#builder$/);
    await expect(page.getByRole('heading', { name: /work moved closer to cameras/i })).toBeVisible();
  });

  test('reduced motion keeps a featured video frame visible without autoplay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const videoRequests: string[] = [];
    page.on('request', (request) => {
      if (/\.(webm|mp4|m4v)(?:\?|$)/i.test(request.url())) videoRequests.push(request.url());
    });

    await page.goto('/');
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.locator('[data-project-tile="camera-harness"]').hover();

    const cameraVideo = page.locator('[data-project-tile="camera-harness"] video');
    const ghostwriterVideo = page.locator('[data-project-tile="ghostwriter"] video');
    await expect(cameraVideo).toBeVisible();
    await expect(cameraVideo.locator('source')).toHaveAttribute(
      'src',
      '/projects/camera-harness/book-recognition-loop-1080.m4v'
    );
    await expect(cameraVideo).toHaveAttribute('data-video-active', 'false');
    await expect(ghostwriterVideo).toBeVisible();
    await expect(ghostwriterVideo.locator('source').first()).toBeAttached();
    await expect(ghostwriterVideo).toHaveAttribute('data-video-active', 'false');
    expect(videoRequests.some((url) => url.endsWith('book-recognition-loop-1080.m4v'))).toBe(true);

    const transform = await cameraVideo.evaluate((video) => getComputedStyle(video).transform);
    expect(transform).toBe('none');
  });

  test('resume, MiguelLLM, and internal routes remain functional', async ({ page, request }) => {
    await page.goto('/cv');
    await expect(page.getByRole('heading', { name: /Frontend Engineer/i }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
    const pdf = await request.get('/portfolio.pdf');
    expect(pdf.ok()).toBeTruthy();
    expect(pdf.headers()['content-type']).toContain('application/pdf');

    await page.goto('/');
    const trigger = page.getByRole('button', { name: /Ask MiguelLLM/i }).first();
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'MiguelLLM' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /strongest technical project/i }).click();
    await expect(dialog.getByText(/Camera Harness/i).last()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();

    const hrefs = await page.locator('a[href]').evaluateAll((links) =>
      Array.from(
        new Set(
          links
            .map((link) => link.getAttribute('href'))
            .filter((href): href is string => Boolean(href?.startsWith('/')))
            .map((href) => href.split('#')[0])
        )
      )
    );
    for (const href of hrefs) {
      const response = await request.get(href || '/');
      expect(response.status(), `${href} should resolve`).toBeLessThan(400);
    }
  });
});
