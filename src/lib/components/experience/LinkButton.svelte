<script lang="ts">
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
  import { destinationLink } from '$lib/navigation/destination-link';
  let { href, label, external = false, secondary = false }: { href: string; label: string; external?: boolean; secondary?: boolean } = $props();
</script>
<a {href} data-circle-fill={secondary ? undefined : ''} data-flow-action={secondary ? 'paper' : undefined}
  class="group {secondary ? 'ink-link text-plum hover:underline' : 'action-button hover:bg-ink'}" {...destinationLink(href)}>
  <CircleFill {label} />
  {#if external}<span class="sr-only">(opens in a new tab)</span>{/if}
</a>
