<script lang="ts">
  import { experienceTeaser } from '$lib/content/folio';
</script>

<section id="experience" class="experience-timeline page-gutter" aria-labelledby="experience-title">
  <div class="experience-timeline-inner">
    <header class="experience-timeline-header">
      <p>Timeline</p>
      <h2 id="experience-title">Experience</h2>
    </header>

    <ol class="timeline-list">
      {#each experienceTeaser as item}
        <li class="timeline-item">
          <time datetime={item.years.split(' ')[0]}>{item.years}</time>
          <div class="timeline-copy">
            <h3>{item.role}</h3>
            <p>{item.company}</p>
          </div>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .experience-timeline {
    padding-block: clamp(3.5rem, 7vw, 6rem);
    background: var(--color-background);
  }

  .experience-timeline-inner {
    display: grid;
    width: min(100%, 1480px);
    margin-inline: auto;
    grid-template-columns: minmax(0, 0.65fr) minmax(0, 1fr);
    gap: clamp(2rem, 6vw, 7rem);
  }

  .experience-timeline-header {
    align-self: start;
  }

  .experience-timeline-header p {
    margin: 0;
    color: var(--color-muted-foreground);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.18em;
    line-height: 1;
    text-transform: uppercase;
  }

  .experience-timeline-header h2 {
    margin: 0.55rem 0 0;
    color: var(--foreground);
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 5.2vw, 4.4rem);
    line-height: 0.95;
    letter-spacing: 0;
  }

  .timeline-list {
    position: relative;
    display: grid;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .timeline-list::before {
    position: absolute;
    inset-block: 0;
    left: 0.35rem;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--color-border) 12%,
      var(--color-border) 88%,
      transparent
    );
    content: '';
  }

  .timeline-item {
    position: relative;
    display: grid;
    grid-template-columns: minmax(7.5rem, 0.35fr) minmax(0, 1fr);
    gap: clamp(1rem, 3vw, 2.5rem);
    padding-block: clamp(1.1rem, 2.4vw, 1.7rem);
    padding-left: 2rem;
    border-bottom: 1px solid color-mix(in oklch, var(--color-border) 72%, transparent);
  }

  .timeline-item:first-child {
    padding-top: 0.2rem;
  }

  .timeline-item:last-child {
    border-bottom: 0;
    padding-bottom: 0.2rem;
  }

  .timeline-item::before {
    position: absolute;
    top: clamp(1.45rem, 2.6vw, 1.95rem);
    left: 0;
    width: 0.7rem;
    height: 0.7rem;
    border: 1px solid var(--color-accent);
    border-radius: 999px;
    background: var(--color-background);
    content: '';
  }

  .timeline-item time {
    color: var(--color-muted-foreground);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  .timeline-copy h3 {
    margin: 0;
    color: var(--foreground);
    font-family: var(--font-display);
    font-size: clamp(1.2rem, 2.2vw, 1.7rem);
    font-weight: 650;
    line-height: 1.05;
    letter-spacing: 0;
  }

  .timeline-copy p {
    margin: 0.45rem 0 0;
    color: var(--color-muted-foreground);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    line-height: 1.35;
    text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .experience-timeline-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  @media (max-width: 640px) {
    .experience-timeline {
      padding-block: 3.5rem;
    }

    .timeline-item {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding-left: 1.65rem;
    }

    .timeline-list::before {
      left: 0.28rem;
    }

    .timeline-item::before {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
</style>
