<script>
  import ProductNav from "$lib/case-studies/shared/ProductNav.svelte";
  import StoryPage from "$lib/components/story/StoryPage.svelte";
</script>
<svelte:head><title>Story | Miguel Almeida</title><meta name="description" content="About Miguel Almeida, from aviation and UX design to frontend engineering, with work at F24 and independent projects." /></svelte:head>
<ProductNav name="Story" standalone overviewHref="#story-title" links={[
  ['story-summary', 'Short version'], ['story-hi', 'Background'],
  ['story-f24', 'Work'], ['story-own', 'Projects']
]} />
<StoryPage />
