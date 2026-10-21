<script lang="ts">
  import type { Snippet } from 'svelte';
  import PageTurn from '$lib/hero-lab/editorial-poster/PageTurn.svelte';
  import '$lib/hero-lab/editorial-poster/poster.css';
  let { children }: { children: Snippet } = $props();
</script>
{@render children()}
<PageTurn />
