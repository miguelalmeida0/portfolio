<script module lang="ts">
  export type ComparisonSide = {
    id: string;
    label: string;
    status: string;
    title: string;
    description: string;
    points: string[];
  };
</script>

<script lang="ts">
  export let left: ComparisonSide;
  export let right: ComparisonSide;
  export let label = 'System comparison';

  let activeId = left.id;

  $: activeSide = activeId === left.id ? left : right;
</script>

<section class="system-comparison" aria-label={label} data-comparison-active={activeId}>
  <div class="comparison-tabs" role="tablist" aria-label={label}>
    {#each [left, right] as side}
      <button
        type="button"
        role="tab"
        aria-selected={activeId === side.id}
        aria-controls={`comparison-${side.id}`}
        on:click={() => (activeId = side.id)}
      >
        <span>{side.label}</span>
        <small>{side.status}</small>
      </button>
    {/each}
  </div>

  <div id={`comparison-${activeSide.id}`} class="comparison-panel" role="tabpanel">
    <div>
      <p>{activeSide.status}</p>
      <h3>{activeSide.title}</h3>
      <p>{activeSide.description}</p>
    </div>
    <ol>
      {#each activeSide.points as point, index}
        <li><span>{String(index + 1).padStart(2, '0')}</span>{point}</li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .system-comparison {
    border: 1px solid rgb(244 234 220 / 0.15);
    background: #080808;
  }

  .comparison-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1px;
    background: rgb(244 234 220 / 0.15);
  }

  .comparison-tabs button {
    display: grid;
    min-height: 4.5rem;
    align-content: center;
    gap: 0.35rem;
    border: 0;
    background: #080808;
    padding: 1rem;
    color: rgb(244 234 220 / 0.58);
    cursor: pointer;
    text-align: left;
  }

  .comparison-tabs button[aria-selected='true'] {
    background: var(--foreground);
    color: #050505;
  }

  .comparison-tabs button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: -3px;
  }

  .comparison-tabs span {
    font-size: 1rem;
    font-weight: 780;
  }

  .comparison-tabs small,
  .comparison-panel > div > p:first-child,
  li span {
    font-family: var(--font-mono);
    font-size: 0.67rem;
    font-weight: 760;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .comparison-panel {
    display: grid;
    grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
    gap: clamp(2rem, 6vw, 7rem);
    min-height: 17rem;
    align-items: end;
    padding: clamp(1.2rem, 3.5vw, 3.5rem);
  }

  .comparison-panel p,
  .comparison-panel h3 {
    margin: 0;
  }

  .comparison-panel > div > p:first-child {
    color: var(--accent);
  }

  .comparison-panel h3 {
    margin-top: 0.7rem;
    font-size: clamp(1.35rem, 2vw, 1.95rem);
    line-height: 1.08;
  }

  .comparison-panel > div > p:last-child {
    margin-top: 1rem;
    color: rgb(244 234 220 / 0.64);
    font-size: 0.96rem;
    line-height: 1.55;
  }

  ol {
    display: grid;
    margin: 0;
    padding: 0;
    border-top: 1px solid rgb(244 234 220 / 0.15);
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 0.8rem;
    padding-block: 0.85rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.15);
    color: rgb(244 234 220 / 0.76);
    font-size: 0.9rem;
    line-height: 1.4;
  }

  li span {
    color: var(--accent);
  }

  @media (max-width: 680px) {
    .comparison-panel {
      grid-template-columns: 1fr;
      gap: 2rem;
      min-height: 0;
    }

    .comparison-tabs button {
      min-height: 4.75rem;
    }
  }
</style>
