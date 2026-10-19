<script lang="ts">
  import '$lib/hero-lab/lab.css';
  import KineticHero from '$lib/hero-lab/kinetic/KineticHero.svelte';
  import WorkSection from '$lib/components/experience/work/WorkSection.svelte';
</script>
<svelte:head>
  <title>Hero lab 03 — The Kinetic Product Story · Miguel Almeida</title>
  <meta name="robots" content="noindex" />
</svelte:head>
<KineticHero />
<WorkSection />
<style>
  /* The dock is fixed to the bottom edge; keep the last footer line reachable. */
  :global(#portfolio-content[data-hero-lab] > .contact) { padding-bottom: 88px; }
</style>
