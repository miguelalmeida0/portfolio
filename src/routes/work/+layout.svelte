<script lang="ts">
  import { setContext } from 'svelte';
  import { page } from '$app/stores';
  import { caseReadingMotion } from '$lib/hero-lab/typographic/case-reading-motion';
  import { caseChrome } from '$lib/hero-lab/typographic/case-chrome';
  import TypographicNav from '$lib/hero-lab/typographic/TypographicNav.svelte';
  import '$lib/hero-lab/lab.css';
  import '$lib/hero-lab/typographic/typographic.css';
  import '$lib/hero-lab/typographic/case-study.css';

  // The selected portfolio's case-study tree opts into the selected direction.
  setContext('typographic-case', true);
</script>

<svelte:head>
  <link rel="preload" href="/fonts/antonio-700-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{#key $page.url.pathname}
<div data-direction="typographic" data-typographic-case use:caseChrome use:caseReadingMotion>
  <TypographicNav page="work" />
  <slot />
</div>
{/key}
