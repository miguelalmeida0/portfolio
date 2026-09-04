<script lang="ts">
  export let items: { id: string; label: string }[] = [];
</script>

<nav class="section-nav" aria-label="Camera Harness sections">
  <span>Jump to</span>
  <div>
    {#each items as item}
      <a href={`#${item.id}`}>{item.label}</a>
    {/each}
  </div>
</nav>

<style>
  .section-nav {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 1rem 2rem;
    width: min(100%, 92rem);
    margin: 0 auto;
    padding-block: 1.15rem;
    border-block: 1px solid rgb(244 234 220 / 0.14);
  }

  .section-nav > span {
    padding-top: 0.7rem;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 760;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .section-nav div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  a {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    color: rgb(244 234 220 / 0.68);
    font-size: 0.88rem;
    font-weight: 650;
  }

  a:hover,
  a:focus-visible {
    background: rgb(244 234 220 / 0.08);
    color: var(--foreground);
    outline: none;
  }

  a:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }

  @media (max-width: 660px) {
    .section-nav {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
  }
</style>
