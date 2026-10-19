<script lang="ts">
  /**
   * Display text split into characters for kinetic setting. The visual copy is
   * hidden from assistive technology; the caller supplies the accessible name
   * (an aria-label on the heading, or the `label` rendered here as sr-only).
   * Each word is its own clip, so characters can rise from below their line.
   */
  let { text, label = undefined, class: extra = '' }: { text: string; label?: string; class?: string } = $props();
  const words = $derived(text.split(' '));
</script>

{#if label}<span class="sr-only">{label}</span>{/if}
<span class="ks-chars {extra}" aria-hidden="true">{#each words as word, w}<span class="ks-w" data-ks-word><span class="ks-wi" data-ks-word-in>{#each [...word] as ch}<span class="ks-c" data-ks-char>{ch}</span>{/each}</span></span>{#if w < words.length - 1}{' '}{/if}{/each}</span>

<style>
  .ks-chars { display: inline; }
  .ks-w { display: inline-block; overflow: clip; overflow-clip-margin: .04em; padding-block: .06em; margin-block: -.06em; vertical-align: top; white-space: nowrap; }
  .ks-wi { display: inline-block; }
  .ks-c { display: inline-block; }
</style>
