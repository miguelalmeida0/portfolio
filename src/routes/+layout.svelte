<script lang="ts">
  import { onMount } from 'svelte';
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
  import '../app.css';
  import 'lenis/dist/lenis.css';
  import BookmarkScrollbar from '$lib/components/experience/BookmarkScrollbar.svelte';
  import Header from '$lib/components/experience/Header.svelte';
  import Contact from '$lib/components/experience/Contact.svelte';
  import PixelIntroduction from '$lib/components/experience/PixelIntroduction.svelte';

  const personStructuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Miguel Almeida',
    url: SITE_ORIGIN,
    image: SITE_IMAGE_URL,
    jobTitle: 'Frontend Engineer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Berlin',
      addressCountry: 'DE'
    },
    sameAs: ['https://github.com/miguelalmeida0', 'https://www.linkedin.com/in/miguelalmeida1/']
  });

  $: canonicalUrl = `${SITE_ORIGIN}${$page.url.pathname}`;

  // `onNavigate` has to be registered while the layout initialises.
  installRouteTransitions();

  afterNavigate(() => syncScrollPosition());
  onMount(() => {
    const disposePolicy = initMotionPolicy();
    const disposeScroll = installSmoothScroll();
    return () => { disposeScroll(); disposePolicy(); };
  });
</script>

<svelte:head>
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

{#if $page.url.pathname === '/'}<PixelIntroduction />{/if}
<div id="portfolio-content">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-plum focus:px-5 focus:py-3 focus:text-white">Skip to content</a>
  <Header />
  <main id="main"><slot /></main>
  <Contact />
</div>

<BookmarkScrollbar />
