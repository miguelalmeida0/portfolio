<script lang="ts">
  import type { MiguelLLMMode } from '$lib/miguel-llm/types';

  export let selected: MiguelLLMMode = 'recruiter';

  const modes: Array<{ id: MiguelLLMMode; label: string }> = [
    { id: 'recruiter', label: 'Recruiter' },
    { id: 'engineer', label: 'Engineer' },
    { id: 'design', label: 'Design' },
    { id: 'curious', label: 'Curious' }
  ];
</script>

<div class="mode-tabs" role="tablist" aria-label="MiguelLLM answer mode">
  {#each modes as mode}
    <button
      type="button"
      role="tab"
      aria-selected={selected === mode.id}
      class:active={selected === mode.id}
      on:click={() => (selected = mode.id)}
    >
      {mode.label}
    </button>
  {/each}
</div>

<style>
  .mode-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .mode-tabs button {
    min-height: 2.1rem;
    border: 1px solid rgb(194 218 233 / 0.14);
    border-radius: 999px;
    background: rgb(194 218 233 / 0.06);
    padding: 0 0.78rem;
    color: rgb(241 248 252 / 0.7);
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.86rem;
    font-weight: 620;
    letter-spacing: 0;
    line-height: 1;
    text-transform: none;
    transition:
      background-color 180ms var(--interaction-ease),
      border-color 180ms var(--interaction-ease),
      color 180ms var(--interaction-ease);
  }

  .mode-tabs button:hover,
  .mode-tabs button:focus-visible,
  .mode-tabs button.active {
    border-color: rgb(194 218 233 / 0.32);
    background: rgb(194 218 233 / 0.11);
    color: var(--foreground);
  }

  .mode-tabs button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
</style>
