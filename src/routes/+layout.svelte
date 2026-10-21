<script lang="ts">
  import { buildInfo } from '$lib/build-info';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { onMount, setContext } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { installSmoothScroll, syncScrollPosition } from '$lib/motion/smooth-scroll';
  import { page } from '$app/stores';
  import { initMotionPolicy } from '$lib/motion/policy';
  import { installRouteTransitions } from '$lib/motion/routeTransition';
  import {
    SITE_DESCRIPTION,
    SITE_IMAGE_URL,
    SITE_NAME,
    SITE_ORIGIN
  } from '$lib/config/site';
  import entryStyles from '../app.css?inline';
  import 'lenis/dist/lenis.css';
  import LineMJourney from '$lib/components/experience/footer/LineMJourney.svelte';
  import { LINE_M, createLineService } from '$lib/components/experience/footer/service';
  setContext(LINE_M, createLineService());
  import BookmarkScrollbar from '$lib/components/experience/BookmarkScrollbar.svelte';
  import Header from '$lib/components/experience/Header.svelte';
  import Contact from '$lib/components/experience/footer/LineMFooter.svelte';
  const personStructuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Almeida',
    url: SITE_ORIGIN,
    image: SITE_IMAGE_URL,
    jobTitle: 'Frontend engineer & product designer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE'
    },
    sameAs: ['https://github.com/miguelalmeida0', 'https://www.linkedin.com/in/miguelalmeida1/']
  });

  $: canonicalUrl = `${SITE_ORIGIN}${$page.url.pathname.replace(/^\/hero-lab\/typographic(?=\/|$)/, '') || '/'}`;
  // Hero-lab prototypes supply their own navigation. A direction's home keeps the
  // unchanged homepage sections; its Story and CV pages are full-page previews.
  $: typographicCase = /^\/work\/(f24|needle|second-voice|leu|flow)\/?$/.test($page.url.pathname);
  $: heroLab = ['/', '/story', '/cv'].includes($page.url.pathname) || typographicCase || /^\/hero-lab\/[^/]+(\/(story|cv))?\/?$/.test($page.url.pathname);
  $: heroLabHome = $page.url.pathname === '/' || heroLab && /^\/hero-lab\/[^/]+\/?$/.test($page.url.pathname);

  // `onNavigate` has to be registered while the layout initialises.
  let routeShutter: HTMLDivElement;
  const { mobileState, navigationError, routeLabel, navigateFromMenu } = installRouteTransitions(() => routeShutter);

  setContext('route-navigation', navigateFromMenu);
  afterNavigate(() => syncScrollPosition());
  onMount(() => {
    if ($page.url.pathname === '/cv/pdf') return;
    const disposePolicy = initMotionPolicy();
    let disposeScroll: (() => void) | undefined;
    let scrollPath: string | undefined;
    const disposePage = page.subscribe(current => {
      // A same-page hash update must not destroy the anchor's active scroll.
      if (current.url.pathname === scrollPath) return;
      scrollPath = current.url.pathname;
      disposeScroll?.();
      disposeScroll = current.url.pathname === '/cv/pdf' ? undefined : installSmoothScroll();
    });
    return () => { disposePage(); disposeScroll?.(); disposePolicy(); };
  });
</script>

<svelte:head>
  <meta name="portfolio-build" content={buildInfo.commit} />
  <meta name="portfolio-build-time" content={buildInfo.builtAt} />
  <meta name="portfolio-build-dirty" content={String(buildInfo.dirty)} />
  {@html `<style data-entry-styles>${entryStyles}</style>`}
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={SITE_IMAGE_URL} />
  <meta property="og:image:alt" content="Portrait of Miguel Almeida" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={SITE_NAME} />
  <meta name="twitter:description" content={SITE_DESCRIPTION} />
  <meta name="twitter:image" content={SITE_IMAGE_URL} />
  {@html `<script type="application/ld+json">${personStructuredData}</script>`}
</svelte:head>

{#if $page.url.pathname === '/cv/pdf'}
  <slot />
{:else}

<div>
<div class="wind-theme" data-homepage={$page.url.pathname === '/' || heroLabHome ? '' : undefined} data-hero-lab={heroLab || undefined} id="portfolio-content" inert={$mobileState !== 'idle'}>
  <a href="#main" class="wind-skip sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-plum focus:px-5 focus:py-3 focus:text-white" {...destinationLink("#main")}>Skip to content</a>
  {#if !heroLab}<Header homepage={$page.url.pathname === '/'} story={$page.url.pathname === '/story'} {navigateFromMenu} navigationTransitionActive={$mobileState !== 'idle'} />{/if}
  {#if ['/work/flow','/work/leu','/work/f24','/work/second-voice','/work/needle'].includes($page.url.pathname)}<slot />{:else}<main id="main"><slot /></main>{/if}
  <section class="contact" aria-label="Contact"><Contact /></section>
</div>

<div inert={$mobileState !== 'idle'}><BookmarkScrollbar /></div>
</div>



{#key $page.url.pathname}<LineMJourney suppressed={$mobileState !== 'idle'} />{/key}


{/if}

<!-- Root sibling: never inherits a page/header transform or stacking context. -->
<div bind:this={routeShutter} data-route-shutter data-phase={$mobileState} hidden aria-hidden="true" popover="manual" class="route-shutter no-print">
  {#each Array(6) as _, i}<span class="route-strip" style:--i={i}></span>{/each}
  <p class="route-title"><span class="route-title-mask"><span class="route-title-text">{$routeLabel}</span></span></p>
</div>
<p role="status" class="sr-only">{$navigationError}</p>

<style>
  .route-shutter {
    position: fixed; inset: 0; z-index: 1000; display: grid;
    width: 100%; height: 100%; max-width: none; max-height: none; margin: 0; padding: 0; border: 0;
    grid-template-columns: repeat(var(--route-strips, 6), 1fr);
    background: transparent; pointer-events: auto; touch-action: none; contain: layout paint;
  }
  .route-shutter[hidden] { display: none; }
  .route-shutter::backdrop { background: transparent; }
  .route-strip { background: var(--forest); transform: scaleY(0); }
  .route-strip:nth-child(even) { background: var(--ink); }
  .route-title { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; pointer-events: none;
    font: 800 clamp(72px, 11vw, 184px)/.9 'Figtree', sans-serif; letter-spacing: -.035em; color: var(--lime); }
  .route-title-mask { display: block; overflow: clip; padding: .08em .04em; max-width: 94vw; text-align: center; }
  .route-title-text { display: block; transform: translateY(110%); }
  @media (max-width: 767px) {
    .route-shutter { --route-strips: 4; }
    .route-strip:nth-child(n + 5) { display: none; }
    .route-title { font-size: clamp(56px, 17vw, 104px); }
  }
  @media print { .route-shutter { display: none !important; } }
</style>
