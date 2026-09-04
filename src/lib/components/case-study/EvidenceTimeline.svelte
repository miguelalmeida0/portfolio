<script lang="ts">
  export let items: { ref: string; title: string; detail: string; status?: string }[] = [];

  let activeIndex = 0;

  $: activeItem = items[activeIndex];
</script>

<div class="timeline-explorer" data-timeline-active={activeIndex}>
  <ol class="evidence-timeline">
    {#each items as item, index}
      <li>
        <button
          type="button"
          aria-pressed={activeIndex === index}
          on:click={() => (activeIndex = index)}
        >
          <span class="timeline-ref">{item.ref}</span>
          <strong>{item.title}</strong>
        </button>
      </li>
    {/each}
  </ol>

  {#if activeItem}
    <article class="timeline-detail" aria-live="polite">
      <span>{activeItem.ref}</span>
      <h3>{activeItem.title}</h3>
      <p>{activeItem.detail}</p>
      {#if activeItem.status}<strong>{activeItem.status}</strong>{/if}
    </article>
  {/if}
</div>

<style>
  .timeline-explorer {
    display: grid;
    grid-template-columns: minmax(17rem, 0.42fr) minmax(0, 1fr);
    gap: 1px;
    background: rgb(244 234 220 / 0.15);
  }

  .evidence-timeline {
    margin: 0;
    padding: 0;
    background: #080808;
    list-style: none;
  }

  li {
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  button {
    display: grid;
    width: 100%;
    grid-template-columns: 5rem minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
    border: 0;
    background: transparent;
    padding: 1rem;
    color: rgb(244 234 220 / 0.62);
    cursor: pointer;
    text-align: left;
  }

  button:hover,
  button:focus-visible,
  button[aria-pressed='true'] {
    background: rgb(244 234 220 / 0.07);
    color: var(--foreground);
    outline: none;
  }

  button[aria-pressed='true'] {
    box-shadow: inset 3px 0 0 var(--accent);
  }

  button:focus-visible {
    box-shadow:
      inset 3px 0 0 var(--accent),
      inset 0 0 0 2px var(--ring);
  }

  .timeline-ref {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 760;
    letter-spacing: 0.08em;
  }

  button strong {
    font-size: 0.88rem;
    line-height: 1.4;
  }

  h3,
  p {
    margin: 0;
  }

  .timeline-detail {
    min-height: 19rem;
    align-content: end;
    background: #0b0b0b;
    padding: clamp(1.2rem, 4vw, 4rem);
  }

  .timeline-detail > span,
  .timeline-detail > strong {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  h3 {
    max-width: 48rem;
    margin-top: 0.8rem;
    font-size: clamp(1.35rem, 2vw, 1.95rem);
    line-height: 1.08;
  }

  p {
    max-width: 47rem;
    margin-top: 1rem;
    color: rgb(244 234 220 / 0.68);
    font-size: 1rem;
    line-height: 1.55;
  }

  .timeline-detail > strong {
    display: inline-block;
    margin-top: 1rem;
    color: rgb(244 234 220 / 0.5);
  }

  @media (max-width: 720px) {
    .timeline-explorer {
      grid-template-columns: 1fr;
    }

    .evidence-timeline {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    button {
      grid-template-columns: 1fr;
      gap: 0.35rem;
      height: 100%;
    }

    .timeline-detail {
      min-height: 16rem;
    }
  }
</style>
