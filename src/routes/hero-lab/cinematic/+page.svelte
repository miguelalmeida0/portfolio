<script lang="ts">
  import '$lib/hero-lab/lab.css';
  import CinematicHero from '$lib/hero-lab/cinematic/CinematicHero.svelte';
  import WorkSection from '$lib/components/experience/work/WorkSection.svelte';
</script>
<svelte:head>
  <title>Hero lab 02 — The Cinematic Engineer · Miguel Almeida</title>
  <meta name="robots" content="noindex" />
  <link rel="preload" href="/fonts/newsreader-400-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>
<CinematicHero />
<WorkSection />
<style>
  /* Desktop cut: the unchanged Selected Work section slides over the held final frame. */
  @media (min-width: 1024px) { :global(#portfolio-content[data-hero-lab] #work) { position: relative; z-index: 2; } }
</style>
