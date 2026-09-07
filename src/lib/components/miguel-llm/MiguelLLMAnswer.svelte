<script lang="ts">
  import type { MiguelLLMAnswer as MiguelAnswer } from '$lib/miguel-llm/types';
  import MiguelLLMSourceChips from './MiguelLLMSourceChips.svelte';

  export let answer: MiguelAnswer | null = null;
  export let onNavigate: () => void = () => {};
</script>

{#if answer}
  <article class="llm-answer">
    <p class="short-answer">{answer.shortAnswer}</p>
    {#if answer.bullets.length}
      <ul>
        {#each answer.bullets as bullet}<li>{bullet}</li>{/each}
      </ul>
    {/if}
    <MiguelLLMSourceChips sources={answer.sources} {onNavigate} />
  </article>
{/if}

<style>
  .llm-answer {
    max-width: 100%;
  }

  .short-answer {
    margin: 0;
    color: var(--llm-ink, #f5eee8);
    font-family: var(--font-display);
    font-size: clamp(1.08rem, 2.18vw, 1.22rem);
    font-weight: 720;
    letter-spacing: 0;
    line-height: 1.58;
  }

  ul {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0 0;
    padding-left: 1.15rem;
    color: var(--llm-muted, #a9a19a);
    font-size: 0.9rem;
    line-height: 1.48;
  }

  :global(.source-chips) {
    margin-top: 1rem;
  }
</style>
