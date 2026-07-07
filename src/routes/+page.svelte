<script lang="ts">
  import ConversationStarter from '$lib/components/revamp/ConversationStarter.svelte';
  import ExperienceTimeline from '$lib/components/revamp/ExperienceTimeline.svelte';
  import Hero from '$lib/components/revamp/Hero.svelte';
  import Marquee from '$lib/components/revamp/Marquee.svelte';
  import SelectedWork from '$lib/components/revamp/SelectedWork.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
</script>

<svelte:head>
  <title>Miguel Almeida / Frontend Product Engineer / Berlin</title>
  <meta
    name="description"
    content="Miguel Almeida is a mid-level frontend and product engineer in Berlin building calm production interfaces, reusable UI, and design-system-quality product experiences."
  />
  <meta property="og:title" content="Miguel Almeida / Frontend Product Engineer" />
  <meta
    property="og:description"
    content="Mid-level frontend engineer building product UI, reusable systems, and calm production interfaces."
  />
</svelte:head>

<main class="relative">
  <SiteHeader />
  <Hero />
  <Marquee />
  <SelectedWork />
  <ExperienceTimeline />
  <ConversationStarter />
</main>
