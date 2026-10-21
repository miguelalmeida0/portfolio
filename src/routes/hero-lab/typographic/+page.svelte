<script lang="ts">
  import '$lib/hero-lab/lab.css';
  import TypographicHero from '$lib/hero-lab/typographic/TypographicHero.svelte';
  import WorkSection from '$lib/components/experience/work/WorkSection.svelte';
</script>
<svelte:head>
  <title>Hero lab 01 — The Living Typographic Portrait · Miguel Almeida</title>
  <meta name="robots" content="noindex" />
  <link rel="preload" href="/fonts/antonio-700-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>
<TypographicHero />
<WorkSection current />
