<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
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
  import BookmarkScrollbar from '$lib/components/experience/BookmarkScrollbar.svelte';
  import Header from '$lib/components/experience/Header.svelte';
  import Contact from '$lib/components/experience/footer/LineMFooter.svelte';
  import IntroWelcome from '$lib/components/experience/IntroWelcome.svelte';
  import PixelIntroduction from '$lib/components/experience/PixelIntroduction.svelte';
  import AskExperience from '$lib/components/ask/AskExperience.svelte';
  import { askView, askController, createAskController } from '$lib/ask/state';

  let guideReady = false;
  function openGuide(event: Event) { window.dispatchEvent(new CustomEvent('ask:open', { detail: (event as CustomEvent).detail })); }
  beforeNavigate(() => $askController?.dismiss());

  // SSR supplies the intro markup. The synchronous head policy controls its first
  // paint; a seen session never instantiates the component during hydration.
  let introAvailable = !browser || document.documentElement.dataset.presentation === 'pending';

  const personStructuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Almeida',
    url: SITE_ORIGIN,
    image: SITE_IMAGE_URL,
    jobTitle: 'Frontend developer & design engineer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE'
    },
    sameAs: ['https://github.com/miguelalmeida0', 'https://www.linkedin.com/in/miguelalmeida1/']
  });

  $: canonicalUrl = `${SITE_ORIGIN}${$page.url.pathname}`;

  // `onNavigate` has to be registered while the layout initialises.
  let routeVeil: HTMLDivElement;
  const { mobileState, navigationError, navigateFromMenu } = installRouteTransitions(() => routeVeil);

  afterNavigate(() => syncScrollPosition());
  onMount(() => {
    if ($page.url.pathname === '/cv/pdf') return;
    window.addEventListener('miguel-llm:open', openGuide);
    const controller = createAskController();
    askController.set(controller);
    guideReady = true;
    const disposePolicy = initMotionPolicy();
    const presentation = new MutationObserver(() => {
      if (document.documentElement.dataset.presentation === 'complete') introAvailable = false;
    });
    presentation.observe(document.documentElement, { attributes: true, attributeFilter: ['data-presentation'] });
    let disposeScroll: (() => void) | undefined;
    let scrollPath: string | undefined;
    const disposePage = page.subscribe(current => {
      // A same-page hash update must not destroy the anchor's active scroll.
      if (current.url.pathname === scrollPath) return;
      scrollPath = current.url.pathname;
      disposeScroll?.();
      disposeScroll = current.url.pathname === '/cv/pdf' ? undefined : installSmoothScroll({ smoothWheel: current.url.pathname !== '/story' });
    });
    return () => { controller.destroy(); askController.set(undefined); window.removeEventListener('miguel-llm:open', openGuide); presentation.disconnect(); disposePage(); disposeScroll?.(); disposePolicy(); };
  });
</script>

<svelte:head>
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
{#if $page.url.pathname === '/' && introAvailable}<PixelIntroduction />{/if}
<IntroWelcome />
<!-- Keep guide isolation independent of the landing's inert lifecycle. -->
<div data-guide-background>
<div class="wind-theme" data-homepage={$page.url.pathname === '/' ? '' : undefined} id="portfolio-content" inert={$mobileState !== 'idle'}>
  <a href="#main" class="wind-skip sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-plum focus:px-5 focus:py-3 focus:text-white" {...destinationLink("#main")}>Skip to content</a>
  <Header guideOpen={$askView.state !== 'idle'} {guideReady} homepage={$page.url.pathname === '/'} askActive={$askView.state !== 'idle'} {navigateFromMenu} navigationTransitionActive={$mobileState !== 'idle'} />
  {#if ['/work/flow','/work/leu','/work/f24','/work/second-voice','/work/needle'].includes($page.url.pathname)}<slot />{:else}<main id="main"><slot /></main>{/if}
  <section class="contact" aria-label="Contact"><Contact /></section>
</div>

{#if $page.url.pathname !== '/'}<div inert={$mobileState !== 'idle'}><BookmarkScrollbar /></div>{/if}
</div>

{#if $page.url.pathname !== '/'}<AskExperience floating />{/if}

<!-- Root sibling: never inherits a page/header transform or stacking context. -->
<div bind:this={routeVeil} data-route-veil data-phase={$mobileState} hidden aria-hidden="true" class="route-veil no-print"></div>
<p role="status" class="sr-only">{$navigationError}</p>
{/if}

<style>
  .route-veil {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--color-paper);
    opacity: 0;
    touch-action: none;
  }
</style>
