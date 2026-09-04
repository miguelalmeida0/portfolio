<script lang="ts">
  import ConversationStarter from '$lib/components/revamp/ConversationStarter.svelte';
  import ExperienceTimeline from '$lib/components/revamp/ExperienceTimeline.svelte';
  import Hero from '$lib/components/revamp/Hero.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import InteractiveWorkGrid from '$lib/components/work/InteractiveWorkGrid.svelte';
</script>

<svelte:head>
  <title>Miguel Almeida / Frontend Engineer / Product UI & Multimodal Systems</title>
  <meta
    name="description"
    content="Miguel Almeida is a frontend engineer in Berlin building high-stakes product interfaces, browser systems, and experimental multimodal interfaces."
  />
  <meta property="og:title" content="Miguel Almeida / Frontend Engineer" />
  <meta
    property="og:description"
    content="Frontend engineer building product UI, browser architecture, reliability, and evidence-driven multimodal interfaces."
  />
</svelte:head>

<SiteHeader />

<main class="relative">
  <Hero />
  <InteractiveWorkGrid />
  <ExperienceTimeline />
  <ConversationStarter />
</main>
