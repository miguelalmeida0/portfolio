<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  let { href, label, external = false, secondary = false }: { href: string; label: string; external?: boolean; secondary?: boolean } = $props();
</script>
<a {href}
  class="group {secondary ? 'ink-link text-plum hover:underline' : 'action-button hover:bg-ink'}" {...destinationLink(href)}>
  {label}
  {#if external}<span class="sr-only">(opens in a new tab)</span>{/if}
</a>
