<script>
  let { nodes = [] } = $props();
</script>
{#snippet render(items)}{#each items as node}{#if node.text !== undefined}{node.text}{:else if node.tag === 'br'}<br />{:else}<svelte:element this={node.tag} class={node.class}>{@render render(node.children)}</svelte:element>{/if}{/each}{/snippet}
{@render render(nodes)}
