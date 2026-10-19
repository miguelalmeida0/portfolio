<script lang="ts">
  import '$lib/hero-lab/lab.css';
  import '$lib/hero-lab/typographic/typographic.css';
  import TypographicHero from '$lib/hero-lab/typographic/TypographicHero.svelte';
  import WorkSection from '$lib/components/experience/work/WorkSection.svelte';
</script>
<svelte:head>
  <title>Miguel Almeida · Frontend Engineer & Product Designer</title>
  <link rel="preload" href="/fonts/antonio-700-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <meta name="description" content="Miguel Almeida — frontend engineer and product designer in Berlin. Explore selected work, case studies, and experience." />
</svelte:head>
<TypographicHero />
<WorkSection current />
