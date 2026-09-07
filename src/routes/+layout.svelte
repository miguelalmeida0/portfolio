<script lang="ts">
  import { page } from '$app/stores';
  import {
    SITE_DESCRIPTION,
    SITE_IMAGE_URL,
    SITE_NAME,
    SITE_ORIGIN
  } from '$lib/config/site';
  import '../app.css';

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

<slot />
