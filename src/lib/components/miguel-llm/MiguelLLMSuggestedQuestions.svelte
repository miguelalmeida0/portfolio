<script lang="ts">
  export let questions: string[] = [];
  export let compact = false;
  export let onAsk: (question: string) => void = () => {};
</script>

{#if questions.length}
  <div class:compact class="suggested-questions" aria-label="Suggested portfolio questions">
    {#each questions as question}
      <button type="button" on:click={() => onAsk(question)}>{question}</button>
    {/each}
  </div>
{/if}

<style>
  .suggested-questions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .suggested-questions button {
    min-height: 3.15rem;
    border: 1px solid rgb(194 218 233 / 0.14);
    border-radius: 0.9rem;
    background: rgb(194 218 233 / 0.06);
    padding: 0.72rem 0.8rem;
    color: rgb(241 248 252 / 0.74);
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 560;
    line-height: 1.2;
    text-align: left;
    transition:
      background-color 180ms var(--interaction-ease),
      border-color 180ms var(--interaction-ease),
      color 180ms var(--interaction-ease),
      transform 180ms var(--interaction-ease);
  }

  .suggested-questions.compact button {
    min-height: 2.6rem;
    font-size: 0.82rem;
    padding-inline: 0.72rem;
  }

  .suggested-questions button:hover,
  .suggested-questions button:focus-visible {
    border-color: rgb(194 218 233 / 0.28);
    background: rgb(194 218 233 / 0.1);
    color: var(--foreground);
    transform: translateY(-1px);
  }

  .suggested-questions button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  @media (max-width: 560px) {
    .suggested-questions {
      grid-template-columns: 1fr;
    }
  }
</style>
