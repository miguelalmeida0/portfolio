import { expect, test } from '@playwright/test';

const caseStudyActions = [
  { slug: 'leu', live: 'https://leu-desktop.vercel.app/', code: 'https://github.com/miguelalmeida0/leu' },
  { slug: 'needle', live: 'https://needle.miguelalmeida.xyz', code: 'https://github.com/miguelalmeida0/needle-portfolio-release' },
  { slug: 'flow', live: undefined, code: 'https://github.com/miguelalmeida0/flow' },
  { slug: 'second-voice', live: 'https://secondvoice-ai.vercel.app/second-voice', code: 'https://github.com/miguelalmeida0/second-voice' },
];

for (const { slug, live, code } of caseStudyActions) {
  test(`${slug}: sticky app and code actions keep the case study open`, async ({ page, context }) => {
    const actions: Array<[string, string]> = [['Code', code]];
    if (live) actions.push(['Try it', live]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/work/${slug}`);
      await page.mouse.wheel(0, 1000);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
      const nav = page.locator('#pnav');
      for (const [label, href] of actions) {
        const link = nav.getByRole('link', { name: label, exact: true });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', href);
        await expect(link).toHaveAttribute('target', '_blank');
        const bounds = await link.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        expect(bounds!.y).toBeGreaterThanOrEqual(-1);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(70);
      }
      const name = nav.locator('.pname');
      await expect(name).toBeVisible();
      const nameBounds = await name.boundingBox();
      const actionBounds = await nav.locator('.project-actions').boundingBox();
      expect(nameBounds!.x + nameBounds!.width).toBeLessThanOrEqual(actionBounds!.x);
      if (!live) {
        await expect(nav.getByRole('link', { name: 'Try it', exact: true })).toHaveCount(0);
        await expect(nav.getByRole('link', { name: 'Explore demo', exact: true })).toHaveCount(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    for (const [label, href] of actions) {
      // Keep the test independent of third-party uptime and avoid loading app APIs.
      await context.route(url => url.href === new URL(href).href, route =>
        route.fulfill({ contentType: 'text/html', body: '<h1>External destination</h1>' }));
      const portfolioURL = page.url();
      const popupEvent = page.waitForEvent('popup');
      await page.locator('#pnav').getByRole('link', { name: label, exact: true }).click();
      const popup = await popupEvent;
      await expect(popup).toHaveURL(new URL(href).href);
      await expect(popup.locator('h1')).toHaveText('External destination');
      expect(await popup.evaluate(() => window.opener)).toBeNull();
      expect(page.url()).toBe(portfolioURL);
      await expect(page.locator('#pnav')).toBeVisible();
      await popup.close();
    }
  });
}

test('F24 keeps the private-work demo action visible on narrow screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/work/f24');
  await page.mouse.wheel(0, 1000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  const nav = page.locator('#pnav');
  const demo = nav.getByRole('link', { name: 'Explore demo', exact: true });
  await expect(demo).toBeVisible();
  await expect(demo).toHaveAttribute('href', '#try');
  await expect(nav.getByRole('link', { name: 'Code', exact: true })).toHaveCount(0);
  await expect(nav.locator('.pname')).toBeVisible();
  const nameBounds = await nav.locator('.pname').boundingBox();
  const actionBounds = await nav.locator('.project-actions').boundingBox();
  expect(nameBounds!.x + nameBounds!.width).toBeLessThanOrEqual(actionBounds!.x);
  const bounds = await demo.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(321);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(70);
});

test('Flow exposes only Code as its external action on the homepage', async ({ page }) => {
  await page.goto('/#work');
  const flow = page.locator('[data-selected-project="flow"]');
  await expect(flow.getByRole('link', { name: 'Live app', exact: true })).toHaveCount(0);
  await expect(flow.getByRole('link', { name: 'Code', exact: true })).toHaveAttribute('href', 'https://github.com/miguelalmeida0/flow');
  await expect(flow.getByRole('link', { name: 'Code', exact: true })).toHaveAttribute('target', '_blank');
});

test('current portfolio shell and published work routes are reachable', async ({ page }) => {
  const homeResponse = await page.goto('/');
  expect(homeResponse, 'homepage should return a document response').not.toBeNull();
  expect(homeResponse!.status(), 'homepage should not return an HTTP error').toBeLessThan(400);
  await expect(page.locator('main')).toBeVisible();

  await expect(page.locator("h1")).toHaveAccessibleName("Frontend engineer & product designer.");
  await expect(page).toHaveTitle("Miguel Almeida — Frontend engineer & product designer");
  await expect(page.locator("meta[name=description]")).toHaveAttribute("content", /frontend engineer and product designer/);

  const workRoutes = await page.locator('a[href^="/work/"]').evaluateAll((anchors) => {
    const hrefs = anchors
      .map((anchor) => anchor.getAttribute('href'))
      .filter((href): href is string => Boolean(href));

    return [...new Set(hrefs)];
  });

  expect(workRoutes.length, 'homepage should expose the current project case studies').toBeGreaterThanOrEqual(4);

  for (const href of workRoutes) {
    const response = await page.goto(href);
    expect(response, `${href} should return a document response`).not.toBeNull();
    expect(response!.status(), `${href} should not return an HTTP error`).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  }
});

test('Selected Work grid is scannable and uncropped from phone to desktop', async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#work');
    await expect(page.locator('[data-selected-project]')).toHaveCount(4);
    await expect(page.locator('#projects-heading')).toHaveText('Independent projects');
    await expect(page.locator('#work .preview-toggle')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const rows = await page.locator('[data-selected-project]').evaluateAll(elements => elements.map(el => {
      const copy = el.querySelector<HTMLElement>('.project-info')!.getBoundingClientRect();
      const media = el.querySelector<HTMLElement>('.preview-link')!.getBoundingClientRect();
      return {
        copyX:copy.x, copyY:copy.y, mediaX:media.x, mediaY:media.y, mediaWidth:media.width,
        mediaHeight:media.height,
        videoFit:getComputedStyle(el.querySelector('video')!).objectFit,
        posterFit:getComputedStyle(el.querySelector('img')!).objectFit,
        videoBorder:getComputedStyle(el.querySelector('[data-preview]')!).borderTopWidth,
        tagLayout:getComputedStyle(el.querySelector('.project-tags')!).display,
        stackFont:getComputedStyle(el.querySelector('.project-stack')!).fontStyle
      };
    }));
    for (const [index,row] of rows.entries()) {
      expect(row.videoFit).toBe('contain');
      expect(row.posterFit).toBe('contain');
      expect(row.videoBorder).toBe('0px');
      expect(row.tagLayout).toBe('flex');
      expect(row.stackFont).toBe('normal');
      expect(row.mediaWidth).toBeGreaterThan(100);
      expect(row.mediaHeight).toBeGreaterThan(0);
      expect(row.mediaX).toBeGreaterThanOrEqual(-1);
      expect(row.mediaX+row.mediaWidth).toBeLessThanOrEqual(width+1);
      if(width>=980) expect(index%2===0 ? row.copyX<row.mediaX : row.mediaX<row.copyX).toBe(true);
      else expect(row.mediaY<row.copyY).toBe(true);
    }
  }
});

test('project loops run without clicks and keep native media geometry',async({page})=>{
 await page.goto('/#work');
 for(const id of ['needle','second-voice-ai','leu','flow']) {
  const frame=page.locator(`[data-selected-project="${id}"] [data-preview]`);
  const video=frame.locator('video');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.videoWidth>0&&v.videoHeight>0&&v.readyState>=2&&!v.paused),{timeout:30000}).toBe(true);
  const actual=await video.evaluate((v:HTMLVideoElement)=>v.videoWidth/v.videoHeight);
  const box=await frame.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs(box!.width/box!.height-actual)).toBeLessThan(0.025);
  await expect(video).toHaveCSS('object-fit','contain');
 }
});
test('films autoplay even with reduced motion and Save-Data enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const connection = Object.assign(new EventTarget(), { saveData: true });
    Object.defineProperty(navigator, 'connection', { value: connection, configurable: true });
  });
  await page.goto('/#work');
  for (const id of ['needle', 'second-voice-ai', 'leu', 'flow']) {
    const video = page.locator(`[data-selected-project="${id}"] video`);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) =>
      !v.paused && v.readyState >= 2 && v.videoWidth > 0), { timeout: 25000 }).toBe(true);
  }
});

test('blocked autoplay provides an explicit retry without leaving the page', async ({ page }) => {
  let release!: () => void;
  const waitForMedia = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\.(mp4|webm)(\?|$)/, async route => {
    await waitForMedia;
    await route.continue();
  });
  await page.addInitScript(() => {
    let deny = true;
    (window as Window & { allowProjectPlayback?: () => void }).allowProjectPlayback = () => { deny = false; };
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (deny) return Promise.reject(new DOMException('Gesture required', 'NotAllowedError'));
      return nativePlay.call(this);
    };
  });
  await page.goto('/#work', { waitUntil: 'domcontentloaded' });
  const retry = page.getByRole('button', { name: 'Play Needle and other blocked project videos' });
  await expect(retry).toBeVisible({ timeout: 12000 });
  await page.evaluate(() => (window as Window & { allowProjectPlayback?: () => void }).allowProjectPlayback?.());
  release();
  await retry.click();
  for (const id of ['needle', 'second-voice-ai', 'leu', 'flow']) {
    await expect.poll(() => page.locator(`[data-selected-project="${id}"] video`).evaluate((v: HTMLVideoElement) =>
      !v.paused && v.readyState >= 2), { timeout: 25000 }).toBe(true);
  }
  await expect(page.locator('.preview-retry')).toHaveCount(0);
});

test('every project visibly renders moving video rather than a poster overlay', async ({ page }) => {
  await page.goto('/#work');
  for (const id of ['needle','second-voice-ai','leu','flow']) {
    const preview = page.locator(`[data-selected-project="${id}"] [data-preview]`);
    const video = preview.locator('video');
    await expect(video.locator('source')).toHaveCount(id === 'leu' ? 2 : 1);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) =>
      !v.paused && v.readyState >= 2 && v.videoWidth > 0 && v.currentTime >= 0),
      {timeout: 30000}).toBe(true);
    await expect(video).toHaveCSS('opacity','1');
    await expect(video).toHaveCSS('visibility','visible');
    await expect.poll(() => preview.getAttribute('data-preview-status')).toBe('playing');
    const frames = await video.evaluate((v: HTMLVideoElement) =>
      v.getVideoPlaybackQuality?.().totalVideoFrames ?? 0);
    const initial = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
    // A changing playback clock and decoded frame count prove more than
    // merely having paused === false.
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime),
      {timeout:10000}).toBeGreaterThan(initial + .4);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) =>
      v.getVideoPlaybackQuality?.().totalVideoFrames ?? 0),
      {timeout:10000}).toBeGreaterThan(frames + 2);
    // Even if an early 'playing' event is lost, video pixels stay visible.
    await preview.evaluate(el => { (el as HTMLElement).dataset.previewStatus = 'poster'; });
    await expect(video).toHaveCSS('opacity','1');
  }
});

test('Leu falls back to MP4 when its preferred WebM is unavailable', async ({ page }) => {
  await page.route(/\/projects\/leu\/leu-film-20261008\.webm$/, route =>
    route.fulfill({status: 404, contentType:'text/plain', body:'missing codec source'}));
  await page.goto('/#work');
  const video = page.locator('[data-selected-project="leu"] video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) =>
    v.currentSrc.endsWith('.mp4') && !v.paused && v.readyState >= 2), {timeout:30000}).toBe(true);
  await expect(video).toHaveCSS('opacity','1');
});

test('native media sources and a poster exist when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({javaScriptEnabled:false, viewport:{width:1440,height:900}});
  try {
    const page = await context.newPage();
    // Video downloads must not block navigation; browser autoplay may be
    // disabled independently of the page, so test the SSR fallback instead.
    await page.goto('http://127.0.0.1:4173/#work', {waitUntil:'domcontentloaded'});
    const preview = page.locator('[data-selected-project="leu"] [data-preview]');
    const video = preview.locator('video');
    await expect(video).toHaveAttribute('poster','/projects/leu/leu-film-20261008-poster.jpg');
    await expect(video.locator('source')).toHaveCount(2);
    const types = await video.locator('source').evaluateAll(sources =>
      sources.map(source => (source as HTMLSourceElement).getAttribute('type')));
    expect(types).toEqual(['video/webm; codecs="vp9"','video/mp4']);
    await expect(preview.locator('img')).toBeVisible();
    await expect(page.locator('[data-selected-project]')).toHaveCount(4);
  } finally {
    await context.close();
  }
});


// Leu's approved paired gallery has its own geometry checks in leu-showcase.
for (const slug of ['flow'] as const) {
  test(`${slug} case-study hero uses its exact image height without letterboxing`, async ({ page }) => {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/work/${slug}`);
      const figure = page.locator(`[data-case-artifact][data-project="${slug}"]`);
      const image = figure.locator('img');
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate(img =>
        (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0
      )).toBe(true);
      await expect(image).toHaveAttribute('height', '810');
      await expect(image).toHaveCSS('aspect-ratio', 'auto');
      await expect(image).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      const metrics = await image.evaluate(img => {
        const visual = img.getBoundingClientRect();
        const parent = img.closest('figure')!.getBoundingClientRect();
        const picture = img as HTMLImageElement;
        return {
          displayed: visual.width / visual.height,
          natural: picture.naturalWidth / picture.naturalHeight,
          topPadding: visual.top - parent.top,
          bottom: visual.bottom,
          width: visual.width
        };
      });
      expect(metrics.width).toBeGreaterThan(100);
      expect(Math.abs(metrics.displayed - metrics.natural)).toBeLessThan(.012);
      expect(Math.abs(metrics.topPadding)).toBeLessThan(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test('homepage typography has a consistent descending hierarchy at responsive widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({width, height:960});
    await page.goto('/#work', {waitUntil:'domcontentloaded'});
    const m = await page.evaluate(() => {
      const px = (selector: string) => {
        const node = document.querySelector(selector);
        if (!node) throw Error('Missing hierarchy node: ' + selector);
        return Number.parseFloat(getComputedStyle(node).fontSize);
      };
      return {
        hero: px('#intro-heading'),
        section: px('#work-title'),
        collection: px('#projects-heading'),
        project: px('[data-selected-project="needle"] .project-title'),
        lead: px('.wind-hero .hero-stack'),
        body: px('[data-selected-project="needle"] .project-line'),
        stack: px('[data-selected-project="needle"] .project-stack'),
        kicker: px('[data-selected-project="needle"] .project-number'),
        feature: px('[data-f24-feature] h3'),
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    expect(m.hero, `hero vs section at ${width}px`).toBeGreaterThan(m.section);
    expect(m.section, `section vs collection at ${width}px`).toBeGreaterThan(m.collection);
    expect(m.collection, `collection vs project at ${width}px`).toBeGreaterThan(m.project);
    expect(m.lead).toBeGreaterThan(m.body);
    expect(m.stack).toBeGreaterThanOrEqual(13);
    expect(m.kicker).toBeGreaterThanOrEqual(13);
    expect(m.feature).toBeLessThanOrEqual(68);
    expect(m.overflow).toBe(false);
    console.log(`TYPE HOME ${width}px ${JSON.stringify(m)}`);
  }
});

test('case studies keep a clear hierarchy and standard openings share scales', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({width, height:980});
    const titles: number[] = [];
    for (const route of ['/work/needle','/work/second-voice','/work/f24','/work/leu','/work/flow']) {
      await page.goto(route, {waitUntil:'domcontentloaded'});
      // Leu now opens with the selected paired-platform exhibit. Its distinct
      // typography is checked without requiring the superseded hero roles.
      if (route === '/work/leu') {
        const gallery = page.getByRole('region', { name: 'Leu across phone and browser' });
        await expect(gallery.getByRole('heading', { level: 1 })).toHaveText('Built around the page.');
        const exhibit = await gallery.evaluate(el => {
          const size = (selector: string) => Number.parseFloat(getComputedStyle(el.querySelector(selector)!).fontSize);
          return {
            hero: size('h1'), lead: size('.showcase-deck'),
            caption: size('figcaption p'), label: size('.platform-label'),
            overflow: document.documentElement.scrollWidth > innerWidth
          };
        });
        expect(exhibit.hero).toBeGreaterThan(40);
        expect(exhibit.hero).toBeGreaterThan(exhibit.lead);
        expect(exhibit.lead).toBeGreaterThan(exhibit.caption);
        expect(exhibit.caption).toBeGreaterThan(exhibit.label);
        expect(exhibit.label).toBeGreaterThanOrEqual(12);
        expect(exhibit.overflow).toBe(false);
        continue;
      }
      const values = await page.evaluate(() => {
        const size = (node: Element) => Number.parseFloat(getComputedStyle(node).fontSize);
        const hero = document.querySelector('main .hero h1');
        const lead = document.querySelector('main .hero .sub');
        const label = document.querySelector('main .hero .kicker');
        const section = document.querySelector('main .head h2');
        const caption = document.querySelector('main .case-artifact figcaption');
        if (!hero || !lead || !label || !caption) throw Error('Missing case study text role');
        return {
          hero: size(hero), lead: size(lead), label: size(label),
          section: section ? size(section) : null, caption: size(caption),
          overflow: document.documentElement.scrollWidth > innerWidth
        };
      });
      titles.push(values.hero);
      expect(values.hero, `${route} headline ${width}px`).toBeGreaterThan(40);
      expect(values.hero).toBeGreaterThan(values.lead);
      expect(values.lead).toBeGreaterThan(values.label);
      expect(values.label).toBeGreaterThanOrEqual(14);
      expect(values.caption).toBe(14);
      if (values.section !== null) {
        expect(values.hero).toBeGreaterThan(values.section);
        expect(values.section).toBeGreaterThan(values.lead);
      }
      expect(values.overflow, `${route} overflow at ${width}px`).toBe(false);
      console.log(`TYPE CASE ${route} ${width}px ${JSON.stringify(values)}`);
    }
    expect(Math.max(...titles) - Math.min(...titles), `case-study H1 alignment at ${width}px`).toBeLessThan(1.5);
  }
});

test('Story and web CV keep clear reading and heading contrast', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({width, height:980});
    await page.goto('/story', {waitUntil:'domcontentloaded'});
    const story = await page.evaluate(() => {
      const px = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
      return {
        hero: px('#story-title'), section: px('.story-question h2'),
        body: px('.story-intro-copy'), label: px('.story-eyebrow'),
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    expect(story.hero).toBeGreaterThan(story.section);
    expect(story.section).toBeGreaterThan(story.body);
    expect(story.body).toBeGreaterThan(story.label);
    expect(story.overflow).toBe(false);
    await page.goto('/cv', {waitUntil:'domcontentloaded'});
    const cv = await page.evaluate(() => {
      const px = (selector: string) => Number.parseFloat(getComputedStyle(document.querySelector(selector)!).fontSize);
      return {
        name: px('.cv-name'),
        section: px('#experience-title'),
        role: px('.cv-job-title'),
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    expect(cv.name).toBeGreaterThan(cv.section);
    expect(cv.section).toBeGreaterThan(cv.role);
    expect(cv.overflow).toBe(false);
    console.log(`TYPE READING ${width}px ${JSON.stringify({story,cv})}`);
  }
});

for (const route of ['/', '/work/leu']) {
  test(`Ask MiguelLLM header is a reversible desktop toggle on ${route}`, async ({ page }) => {
    await page.setViewportSize({width:1440,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
    await page.goto(route);
    const ask = page.locator('nav[aria-label="Main navigation"] [data-ask-trigger]');
    await expect(ask).toBeEnabled();
    await expect(ask).toHaveAttribute('aria-expanded','false');
    await ask.click();
    await expect(ask).toHaveAttribute('aria-expanded','true');
    await expect(ask).toHaveAttribute('aria-label','Close Ask MiguelLLM');
    await expect(page.locator('[data-ask-panel]')).toBeVisible();
    await ask.click();
    await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
    await expect(ask).toHaveAttribute('aria-expanded','false');
    await expect(ask).toBeFocused();
    await expect(page.locator('html')).not.toHaveClass(/ask-present|ask-on|ask-closing/);
    await ask.click();
    await expect(page.locator('[data-ask-panel]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
    await expect(ask).toBeFocused();
  });
}

test('mobile Ask MiguelLLM toggles without unexpectedly reopening the menu', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.goto('/');
  const menu = page.getByRole('button',{name:'Menu',exact:true});
  await expect(menu).toBeEnabled();
  await menu.click();
  const ask = page.locator('.mobile-guide-trigger');
  await expect(ask).toHaveAttribute('aria-expanded','false');
  await ask.click();
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('[data-ask-panel]')).toBeVisible();
  await menu.click();
  await expect(ask).toHaveAttribute('aria-expanded','true');
  await expect(ask).toHaveAttribute('aria-label','Close Ask MiguelLLM');
  await ask.click();
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(menu).toBeFocused();
  await menu.click();
  await expect(ask).toHaveAttribute('aria-expanded','false');
});

test('Ask MiguelLLM gives fast evidence-backed answers a readable loading interval', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.goto('/');
  const menu=page.getByRole('button',{name:'Menu',exact:true});
  if (await menu.isVisible()) await menu.click();
  const trigger=page.locator('[data-ask-trigger]:visible');
  await expect(trigger).toBeEnabled();
  await trigger.click();
  const input=page.getByRole('textbox',{name:'Type your own question'});
  await input.fill('hello');
  const began=Date.now();
  await input.press('Enter');
  const progress=page.locator('[data-ask-answer].loading');
  await expect(progress).toBeVisible();
  await expect(progress).toContainText('Reviewing the most relevant project notes');
  await expect(page.locator('[data-ask-knowledge]')).toHaveCount(0);
  await expect(page.locator('[data-ask-knowledge]')).toContainText('portfolio guide',{timeout:12000});
  expect(Date.now()-began).toBeGreaterThanOrEqual(1600);
  await expect(progress).toHaveCount(0);
  const followups=page.getByRole('navigation',{name:'Follow-up questions'});
  await expect(followups.getByRole('button').first()).toBeVisible();
});

test('closing Ask mid-answer does not leave a delayed answer or reopen', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.goto('/');
  const menu=page.getByRole('button',{name:'Menu',exact:true});
  if (await menu.isVisible()) await menu.click();
  await page.locator('[data-ask-trigger]:visible').click();
  const input=page.getByRole('textbox',{name:'Type your own question'});
  await input.fill('hello');
  await input.press('Enter');
  await expect(page.locator('[data-ask-answer].loading')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await page.waitForTimeout(2050);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await expect(page.locator('html')).not.toHaveClass(/ask-on|ask-present|ask-closing/);
});

test('Ask MiguelLLM answers a favorite-stack question in first person on desktop and mobile', async ({page}) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const menu=page.getByRole('button',{name:'Menu',exact:true});
    if (await menu.isVisible()) await menu.click();
    const trigger=page.locator('[data-ask-trigger]:visible');
    await expect(trigger).toBeEnabled();
    await trigger.click();
    await expect(page.locator('.ask-disclosure')).toContainText('Not a live chat');
    const input=page.getByRole('textbox',{name:'Type your own question'});
    await input.fill('what is your favorite tech stack?');
    await input.press('Enter');
    await expect(page.locator('[data-ask-knowledge]')).toBeVisible({timeout:15000});
    const answer=page.locator('[data-ask-knowledge]');
    await expect(answer.locator('p').first()).toContainText('I reach for React and TypeScript');
    await expect(answer).toContainText('Svelte');
    await expect(answer).not.toContainText(/\bMiguel\b|\bhe\b|\bhis\b/i);
    await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href','/cv');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  }
});

test('Ask interprets the clicked job title and stack instead of reciting CV chronology', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.goto('/');
  await page.locator('nav[aria-label="Main navigation"] [data-ask-trigger]').click();
  const role=page.locator('[data-ask-id="role"]');
  await role.click();
  const text=page.locator('[data-ask-knowledge]');
  await expect(text).toContainText("I'm a frontend engineer and product designer", {timeout:15000});
  await expect(text).toContainText('critical-communication interfaces');
  await expect(text).not.toContainText(/Connectivity Hub|UX Design Institute|CareerFoundry|I combines/);
  await page.locator('[data-ask-id="stack"]').click();
  await expect(text).toContainText('My main frontend stack is React, TypeScript, JavaScript, Svelte', {timeout:15000});
  await expect(text).toContainText('Next.js');
  await expect(text).toContainText('Playwright');
  await expect(text).not.toContainText(/From 2022 to 2023|Mid-level|UX Design Institute|career timeline/);
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href','/cv#skills');
});

test('Ask answers actual tools and education questions directly on mobile and desktop', async ({page}) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const menu=page.getByRole('button',{name:'Menu',exact:true});
    if (await menu.isVisible()) await menu.click();
    await page.locator('[data-ask-trigger]:visible').click();
    const input=page.getByRole('textbox',{name:'Type your own question'});
    const text=page.locator('[data-ask-knowledge]');
    await input.fill('What does he build with?');
    await input.press('Enter');
    await expect(text).toContainText('My main frontend stack is React, TypeScript, JavaScript, Svelte',{timeout:15000});
    await expect(text).not.toContainText(/From 2022 to 2023|UX Design Institute/);
    await input.fill('Where did you study?');
    await input.press('Enter');
    await expect(text).toContainText('Professional Diploma in UX Design at the UX Design Institute',{timeout:15000});
    await expect(text).toContainText('Full-Stack Web Development at CareerFoundry');
    await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href','/cv#education');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  }
});

test('framework preference stays relevant and grammatical on desktop and mobile', async ({page}) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const menu = page.getByRole('button',{name:'Menu',exact:true});
    if (await menu.isVisible()) await menu.click();
    await page.locator('[data-ask-trigger]:visible').click();
    const input = page.getByRole('textbox',{name:'Type your own question'});
    await input.fill('Which framework do you prefer?');
    await input.press('Enter');
    const answer = page.locator('[data-ask-knowledge]');
    await expect(answer).toContainText('I reach for React with TypeScript most often',{timeout:15000});
    await expect(answer).toContainText('soft spot for Svelte');
    await expect(answer).not.toContainText(/I does|I loses|I combines|does not want a role|no possibility to apply|role would not|voice chats|image-to-text workflows/i);
    await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href','/cv#skills');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  }
});

test('primary routes render without uncaught client exceptions', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  for (const route of ['/', '/story', '/cv']) {
    const response = await page.goto(route);
    expect(response, `${route} should return a document response`).not.toBeNull();
    expect(response!.status(), `${route} should not return an HTTP error`).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
});
