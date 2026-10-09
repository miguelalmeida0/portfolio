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
    const start = document.startViewTransition?.bind(document);
    if (!start) return;
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (update: () => void | Promise<void>) => {
        const isStory = document.documentElement.dataset.storyRouteTransition === 'active';
        const direction = document.documentElement.dataset.routeDestination || '';
        const transition = start(update);
        if (!isStory) return transition;
        const sample: TransitionSample = { direction, ready: false, finished: false };
        ((window as any).__storyPageTransitions as TransitionSample[]).push(sample);
        transition.ready.then(() => {
          const old = getComputedStyle(document.documentElement, '::view-transition-old(root)');
          const incoming = getComputedStyle(document.documentElement, '::view-transition-new(root)');
          const header = document.querySelector<HTMLElement>('.wind-header');
          sample.oldAnimation = old.animationName;
          sample.newAnimation = incoming.animationName;
          sample.oldDuration = old.animationDuration;
          sample.newDuration = incoming.animationDuration;
          sample.headerName = header ? getComputedStyle(header).viewTransitionName : '';
          sample.ready = true;
        }).catch(error => { sample.error = String(error); });
        transition.finished.then(() => { sample.finished = true; })
          .catch(error => { sample.error = String(error); });
        return transition;
      }
    });
  });
  await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
}

async function openStory(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole('button', {name: 'Menu', exact: true}).click();
    await page.getByRole('navigation', {name: 'Mobile navigation'})
      .getByRole('link', {name: 'Story', exact: true}).click();
  } else {
    await page.getByRole('navigation', {name: 'Main navigation'})
      .getByRole('link', {name: 'Story', exact: true}).click();
  }
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('#story-title')).toBeVisible();
}

async function settled(page: Page) {
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('[data-route-veil]')).toBeHidden();
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
  expect(sample.oldAnimation).toContain('story-editorial-out');
  expect(sample.newAnimation).toContain('story-editorial-in');
  expect(sample.headerName).toBe('story-site-header');
  expect(parseFloat(sample.newDuration!)).toBeGreaterThanOrEqual(.45);
  expect(parseFloat(sample.newDuration!)).toBeLessThanOrEqual(.7);
  await settled(page);
}

test('Story shares the full header and an overlapping editorial transition in both directions', async ({page, isMobile}) => {
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
    await expect(page.getByRole('navigation', {name: 'Mobile navigation'})
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
