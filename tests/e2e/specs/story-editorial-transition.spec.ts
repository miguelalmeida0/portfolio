import { expect, test, type Page } from '@playwright/test';

type TransitionSample = {
  direction: string;
  ready: boolean;
  finished: boolean;
  oldAnimation?: string;
  newAnimation?: string;
  oldDuration?: string;
  newDuration?: string;
  headerName?: string;
  error?: string;
};

async function instrument(page: Page, reduced = false) {
  await page.addInitScript(() => {
    sessionStorage.setItem('seen-intro', 'true');
    (window as any).__storyPageTransitions = [];
    let current: TransitionSample | undefined;
    const observer = new MutationObserver(() => {
      const shutter = document.querySelector<HTMLElement>('[data-route-shutter]');
      if (!shutter) return;
      if (!shutter.hidden && !current) {
        current = { direction: '', ready: false, finished: false };
        (window as any).__storyPageTransitions.push(current);
      }
      if (current && shutter.dataset.phase === 'covered') current.ready = true;
      if (current && shutter.hidden) {
        current.direction = location.pathname; current.finished = true; current = undefined;
      }
    });
    observer.observe(document.documentElement, {subtree:true, attributes:true, attributeFilter:['hidden','data-phase']});

  });
  await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
}

async function openStory(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', {name: 'Menu', exact: true}).click();
    await page.getByRole('navigation', {name: 'Fullscreen navigation'})
      .getByRole('link', {name: 'Story', exact: true}).click();
  } else {
    await page.getByRole('navigation', {name: 'Main navigation'})
      .getByRole('link', {name: 'Story', exact: true}).click();
  }
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('#story-title')).toBeVisible();
}

async function settled(page: Page) {
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('[data-route-shutter]')).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute('data-story-route-transition', 'active');
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert', '');
}

async function verifyTransition(page: Page, index: number, destination: string) {
  await expect.poll(() => page.evaluate(i =>
    (window as any).__storyPageTransitions?.[i]?.finished === true, index
  ), {timeout: 6500}).toBe(true);
  const sample: TransitionSample = await page.evaluate(i =>
    (window as any).__storyPageTransitions[i], index
  );
  expect(sample.error).toBeUndefined();
  expect(sample.direction).toBe(destination);
  expect(sample.ready).toBe(true);
  await expect(page.locator('[data-route-shutter] .route-title-text')).toHaveText(destination === '/story' ? 'Story' : 'Home');
  await settled(page);
}

test('Story shares the full header and the named downward shutter in both directions', async ({page, isMobile}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await instrument(page);
  await page.goto('/');

  await openStory(page, isMobile);
  await verifyTransition(page, 0, '/story');
  await expect(page.locator('.story-exits')).toHaveCount(0);
  if (isMobile) {
    await expect(page.getByRole('button', {name: 'Menu', exact: true})).toBeVisible();
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
    await page.getByRole('button', {name: 'Menu', exact: true}).click();
    await expect(page.getByRole('navigation', {name: 'Fullscreen navigation'})
      .getByRole('link', {name: 'Story', exact: true})).toHaveAttribute('aria-current', 'page');
    await page.getByRole('button', {name: 'Close', exact: true}).click();
  } else {
    const nav = page.getByRole('navigation', {name: 'Main navigation'});
    await expect(nav).toBeVisible();
    for (const label of ['Work', 'Story', 'CV', 'Contact']) {
      await expect(nav.getByRole('link', {name: label, exact: true})).toBeVisible();
    }
    await expect(nav.getByRole('link', {name: 'Story', exact: true})).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('button', {name: 'Ask MiguelLLM'})).toBeVisible();
  }

  await page.locator('[data-identity-home]').click();
  await expect(page).toHaveURL(/\/#top$/);
  await verifyTransition(page, 1, '/');
  await expect(page.locator('[data-portrait-card] img.portrait')).toBeVisible();
  expect(errors).toEqual([]);
});

test('browser history navigates Story without blank overlays or scroll loss', async ({page, isMobile}) => {
  await instrument(page);
  await page.goto('/');
  await openStory(page, isMobile);
  await verifyTransition(page, 0, '/story');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await settled(page);
  await page.goForward();
  await expect(page).toHaveURL(/\/story$/);
  await settled(page);
  await page.getByRole('link', {name: 'Start with the short version'}).click();
  await expect(page.locator('#story-summary')).toBeFocused({timeout: 6000});
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
});

test('Story from another page keeps its shared navigation and transition', async ({page, isMobile}) => {
  await instrument(page);
  await page.goto('/cv');
  await openStory(page, isMobile);
  await verifyTransition(page, 0, '/story');
  await expect(page.locator('#story-title')).toBeVisible();
});

test('reduced motion keeps navigation usable without decorative transitions', async ({page, isMobile}) => {
  await instrument(page, true);
  await page.goto('/');
  await openStory(page, isMobile);
  await settled(page);
  await page.locator('[data-identity-home]').click();
  await expect(page).toHaveURL(/\/#top$/);
  await settled(page);
  const captures = await page.evaluate(() => (window as any).__storyPageTransitions as TransitionSample[]);
  expect(captures).toHaveLength(0);
});

test('Story navigation is available on a direct reload with JavaScript disabled', async ({browser, isMobile}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false, viewport: {width: isMobile ? 390 : 1440, height: 900}
  });
  try {
    const page = await context.newPage();
    await page.goto('/story');
    await expect(page.locator('#story-title')).toBeVisible();
    if (isMobile) {
      // Content remains available without scripts; the header identity is an ordinary anchor.
      await expect(page.locator('[data-identity-home]')).toBeVisible();
    } else {
      await expect(page.getByRole('navigation', {name: 'Main navigation'})).toBeVisible();
    }
  } finally {
    await context.close();
  }
});
