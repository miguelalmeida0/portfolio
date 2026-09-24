<script lang="ts">
  import ConversationStarter from '$lib/components/revamp/ConversationStarter.svelte';
  import ExperienceTimeline from '$lib/components/revamp/ExperienceTimeline.svelte';
  import Hero from '$lib/components/revamp/Hero.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import InteractiveWorkGrid from '$lib/components/work/InteractiveWorkGrid.svelte';
</script>

<svelte:head>
  <title>Miguel Almeida — Frontend Engineer</title>
  <meta
    name="description"
    content="Frontend engineer in Berlin with production Svelte and React experience at F24 and projects exploring clear, dependable camera and AI interfaces."
  />
  <meta property="og:title" content="Miguel Almeida — Frontend Engineer" />
  <meta
    property="og:description"
    content="Frontend engineer in Berlin with production Svelte and React experience at F24 and projects exploring clear, dependable camera and AI interfaces."
  />
</svelte:head>

<SiteHeader />

<main class="relative">
  <Hero />
  <InteractiveWorkGrid />
  <ExperienceTimeline />
  <ConversationStarter />
</main>
