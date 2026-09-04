<script lang="ts">
  export let id: string;
  export let eyebrow: string;
  export let title: string;
  export let intro = '';
  export let tone: 'default' | 'argument' | 'quiet' = 'default';
</script>

<section {id} class="case-section" data-tone={tone} aria-labelledby={`${id}-title`}>
  <header class="section-header">
    <p>{eyebrow}</p>
    <h2 id={`${id}-title`} tabindex="-1">{title}</h2>
    {#if intro}
      <div class="section-intro">{intro}</div>
    {/if}
  </header>
  <div class="section-content">
    <slot />
  </div>
</section>

<style>
  .case-section {
    scroll-margin-top: 5.5rem;
    width: min(100%, 92rem);
    margin-inline: auto;
    padding-block: clamp(3rem, 5vw, 5.5rem);
    border-top: 1px solid rgb(244 234 220 / 0.14);
  }

  .section-header {
    display: grid;
    grid-template-columns: minmax(8rem, 0.3fr) minmax(0, 1fr);
    gap: clamp(1.2rem, 4vw, 5rem);
    align-items: start;
  }

  .section-header > p {
    margin: 0.4rem 0 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 780;
    letter-spacing: 0.14em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  h2 {
    max-width: 61rem;
    margin: 0;
    color: var(--foreground);
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 2.3vw, 2.3rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.08;
    text-wrap: balance;
  }

  h2:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 0.45rem;
  }

  .section-intro {
    grid-column: 2;
    max-width: 51rem;
    color: rgb(244 234 220 / 0.72);
    font-size: clamp(0.92rem, 1.1vw, 1.02rem);
    line-height: 1.62;
  }

  .section-content {
    margin-top: clamp(1.75rem, 3vw, 3rem);
  }

  [data-tone='argument'] h2 {
    max-width: 65rem;
    font-size: clamp(1.75rem, 2.7vw, 2.65rem);
    line-height: 1.05;
  }

  [data-tone='quiet'] {
    padding-block: clamp(2.75rem, 4.5vw, 4.5rem);
  }

  @media (max-width: 720px) {
    .case-section {
      scroll-margin-top: 4.75rem;
      padding-block: 2.75rem;
    }

    .section-header {
      grid-template-columns: 1fr;
      gap: 0.8rem;
    }

    .section-intro {
      grid-column: 1;
      margin-top: 0.45rem;
    }

    [data-tone='argument'] h2 {
      font-size: clamp(1.65rem, 7vw, 2.35rem);
    }
  }
</style>
