<script lang="ts">
  import Hero from '$lib/components/experience/Hero.svelte';
  import WorkSection from '$lib/components/experience/work/WorkSection.svelte';
</script>
<svelte:head>
  <link rel="preload" href="/images/avatar-192.png" as="image" />
  <link rel="preload" href="/fonts/figtree-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <title>Miguel Almeida — Frontend engineer & product designer</title>
  <meta name="description" content="Miguel Almeida, frontend engineer and product designer in Berlin. Explore Needle, Second Voice AI, F24, Leu and Flow." />
</svelte:head>
<Hero />
<WorkSection />
