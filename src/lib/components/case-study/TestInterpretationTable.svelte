<script lang="ts">
  export let rows: { evidence: string; proves: string; doesNotProve: string }[] = [];

  let activeIndex = 0;

  $: activeRow = rows[activeIndex];
</script>

<div class="test-boundary" role="region" aria-label="Evidence interpretation explorer">
  <div class="test-types" role="tablist" aria-label="Test evidence type">
    {#each rows as row, index}
      <button
        type="button"
        role="tab"
        aria-selected={activeIndex === index}
        aria-controls={`test-boundary-${index}`}
        on:click={() => (activeIndex = index)}
      >
        <span>{String(index + 1).padStart(2, '0')}</span>
        {row.evidence}
      </button>
    {/each}
  </div>

  {#if activeRow}
    <div id={`test-boundary-${activeIndex}`} class="test-result" role="tabpanel" aria-live="polite">
      <article>
        <span>Establishes</span>
        <p>{activeRow.proves}</p>
      </article>
      <article>
        <span>Does not establish</span>
        <p>{activeRow.doesNotProve}</p>
      </article>
    </div>
  {/if}
</div>

<style>
  .test-boundary {
    display: grid;
    grid-template-columns: minmax(17rem, 0.42fr) minmax(0, 1fr);
    gap: 1px;
    background: rgb(244 234 220 / 0.15);
    border-block: 1px solid rgb(244 234 220 / 0.18);
  }

  .test-types {
    display: grid;
    background: #080808;
  }

  button {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 0.65rem;
    align-items: center;
    min-height: 3.8rem;
    border: 0;
    border-bottom: 1px solid rgb(244 234 220 / 0.13);
    background: transparent;
    padding: 1rem;
    color: rgb(244 234 220 / 0.62);
    cursor: pointer;
    text-align: left;
    font-size: 0.88rem;
    font-weight: 700;
  }

  button span,
  article span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  button:hover,
  button:focus-visible,
  button[aria-selected='true'] {
    background: rgb(244 234 220 / 0.08);
    color: var(--foreground);
    outline: none;
  }

  button[aria-selected='true'] {
    box-shadow: inset 3px 0 0 var(--accent);
  }

  button:focus-visible {
    box-shadow:
      inset 3px 0 0 var(--accent),
      inset 0 0 0 2px var(--ring);
  }

  .test-result {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-height: 18rem;
    gap: 1px;
    background: rgb(244 234 220 / 0.14);
  }

  article {
    display: grid;
    align-content: end;
    background: #0b0b0b;
    padding: clamp(1.2rem, 3.5vw, 3.5rem);
  }

  article:last-child {
    background: #110e0c;
  }

  article p {
    margin: 1rem 0 0;
    color: rgb(244 234 220 / 0.78);
    font-size: clamp(1rem, 1.45vw, 1.35rem);
    line-height: 1.4;
  }

  @media (max-width: 760px) {
    .test-boundary,
    .test-result {
      grid-template-columns: 1fr;
    }

    .test-types {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .test-result {
      min-height: 0;
    }

    article {
      min-height: 10rem;
    }
  }
</style>
