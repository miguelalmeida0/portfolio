<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { destinationLink } from '$lib/navigation/destination-link';
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
  let { href, label, variant = 'block', on = 'light', external = false, ...rest }:
    { href: string; label: string; variant?: 'block' | 'line'; on?: 'light' | 'forest'; external?: boolean } & HTMLAnchorAttributes = $props();
</script>

<a {href} class={variant === 'block' ? 'd1-block' : 'd1-line'} data-flow-action={on === 'forest' ? 'light' : variant === 'line' ? 'paper' : ''} {...destinationLink(href, rest.download)} {...rest}>
  <CircleFill {label} />
  {#if external}<span class="sr-only">(opens in a new tab)</span>{/if}
</a>
