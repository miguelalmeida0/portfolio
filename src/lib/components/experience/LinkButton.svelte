<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  let { href, label, external = false, secondary = false }: { href: string; label: string; external?: boolean; secondary?: boolean } = $props();
</script>
<a {href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
  class="group {secondary ? 'ink-link text-plum hover:underline' : 'action-button hover:bg-ink active:scale-[.98]'}">
  {label}{#if external}<ArrowUpRight aria-hidden="true" size={20} class="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />{:else}<ArrowRight aria-hidden="true" size={20} class="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />{/if}
  {#if external}<span class="sr-only">(opens in a new tab)</span>{/if}
</a>
