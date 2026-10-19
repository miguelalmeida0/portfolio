<script lang="ts">
  import type { Snippet } from 'svelte';
  /**
   * A section title set in Direction 01's display face. Each word sits in its
   * own mask so the motion can raise it from behind the line, as the hero does.
   */
  let { text, tag = 'h2', id = undefined, size = 'section', class: extra = '', after }:
    { text: string; tag?: 'h1' | 'h2' | 'h3' | 'p'; id?: string; size?: 'section' | 'chapter' | 'display'; class?: string; after?: Snippet } = $props();
  const words = $derived(text.split(' '));
</script>

<svelte:element this={tag} {id} class="d1-title {size} {extra}" data-rise-title tabindex={id && tag !== 'h1' ? -1 : undefined}>
  {#each words as word, i}<span class="mask"><span class="word" data-rise-word>{word}</span></span>{#if i < words.length - 1}{' '}{/if}{/each}{@render after?.()}
</svelte:element>

<style>
  .d1-title { margin: 0; font-family: var(--d1-display, 'Lab Antonio'), 'Arial Narrow', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: -.005em; text-wrap: balance; }
  .section { font-size: var(--d1-section, 64px); line-height: 1.02; }
  .chapter { font-size: var(--d1-section, 64px); line-height: 1.02; }
  .display { font-size: var(--d1-page-title, 80px); line-height: .98; }
  .mask { display: inline-block; overflow: clip; padding-block: .06em; margin-block: -.06em; vertical-align: top; }
  .word { display: inline-block; }
</style>
