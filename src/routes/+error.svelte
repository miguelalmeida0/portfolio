<script lang="ts">
  import { page } from '$app/stores';
  import LinkButton from '$lib/components/experience/LinkButton.svelte';
</script>
<svelte:head><title>{$page.status} — Miguel Almeida</title><meta name="robots" content="noindex" /></svelte:head>
<section class="shell utility-page">
  <p class="label-type text-plum">{$page.status} / A small detour</p>
  <h1 class="page-title mt-6 max-w-3xl">{$page.status===404 ? 'Nothing here. Plenty to explore.' : 'That didn’t go as planned.'}</h1>
  <p class="page-lead mb-8 mt-6">{$page.status===404 ? 'This page may have moved. The selected work is a good place to pick up the thread.' : 'Please try again, or head back to the portfolio.'}</p>
  <LinkButton href="/" label="Back to the work" />
</section>
