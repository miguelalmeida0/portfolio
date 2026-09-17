<script lang="ts">
  import { experienceTeaser } from '$lib/content/folio';
  import { chapterProgress } from '$lib/motion/actions/chapterProgress';
  import { reveal } from '$lib/motion/actions/reveal';

  /** Share of rows that have actually entered the viewport, 0–1. */
  let progress = 0;
</script>

<section id="experience" class="experience page-gutter" aria-labelledby="experience-title">
  <div class="experience-inner">
    <div class="section-title">
      <p use:reveal={{ threshold: 0.1 }}>Production experience</p>
      <h2 id="experience-title" use:reveal={{ threshold: 0.1, delay: 60 }}>Built from scratch.<br />Used by hundreds of companies.</h2>
    </div>

    <div>
      <!--
        The rule advances with the rows the visitor has actually reached; the dates and
        role names never move, because they are the content people came to read.
      -->
      <ol
        class="timeline"
        style={`--rows-entered: ${progress}`}
        use:chapterProgress={{ selector: 'li', onProgress: (value) => (progress = value) }}
      >
        {#each experienceTeaser as item}
          <li>
            <time datetime={item.years.split(' ')[0]}>{item.years}</time>
            <strong>{item.role}</strong>
          </li>
        {/each}
      </ol>
      <a href="/cv">Read the full résumé <span class="motion-arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<style>
  .experience {
    padding-block: clamp(1.5rem, 2.5vw, 2.5rem);
    background: var(--color-background);
  }

  .experience-inner {
    display: grid;
    width: 100%;
    margin-inline: auto;
    grid-template-columns: minmax(14rem, 0.38fr) minmax(0, 1fr);
    gap: clamp(1rem, 3vw, 3rem);
    padding-top: 0.7rem;
    border-top: 1px solid rgb(244 234 220 / 0.15);
  }

  .section-title {
    display: grid;
    align-content: start;
    gap: 0.7rem;
  }

  .section-title p {
    margin: 0;
    color: var(--accent);
    font-family: var(--font-sans);
    font-size: var(--text-label);
    font-weight: 650;
    letter-spacing: 0.015em;
  }

  h2 {
    max-width: 24rem;
    margin: 0;
    font-size: var(--text-section);
    letter-spacing: -0.03em;
    line-height: 1.08;
  }

  ol {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* The progress rule: one hairline that grows to the share of rows reached. */
  .timeline::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -0.85rem;
    width: 1px;
    background: color-mix(in srgb, var(--accent) 60%, transparent);
    content: '';
    transform: scaleY(var(--rows-entered, 0));
    transform-origin: top center;
    transition: transform var(--motion-section) var(--motion-settle);
  }

  li {
    display: grid;
    grid-template-columns: minmax(7rem, 0.24fr) minmax(0, 1fr);
    gap: clamp(0.65rem, 1.5vw, 1.5rem);
    align-items: baseline;
    min-height: 3rem;
    padding-block: 0.65rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.12);
    opacity: 1;
    transition:
      opacity var(--motion-section) var(--motion-settle),
      transform var(--motion-section) var(--motion-settle);
  }

  /*
   * Rows arrive by 12px. `data-chapter-entered` is only ever added by the observer,
   * so with no JavaScript the list renders complete and static.
   */
  :global(html[data-motion='full']) .timeline li:not([data-chapter-entered]) {
    opacity: 0;
    transform: translate3d(0, 12px, 0);
  }

  time {
    color: rgb(244 234 220 / 0.62);
    font-family: var(--font-sans);
    font-size: var(--text-label);
    letter-spacing: 0;
  }

  strong {
    color: var(--foreground);
    font-size: 0.98rem;
    line-height: 1.35;
  }

  a {
    display: inline-flex;
    gap: 0.35rem;
    min-height: 2.75rem;
    align-items: center;
    margin-top: 0.4rem;
    color: var(--accent);
    font-size: 0.86rem;
    font-weight: 650;
    transition:
      color var(--interaction-duration) var(--interaction-ease),
      transform var(--interaction-duration) var(--interaction-ease);
  }

  a:hover {
    color: var(--foreground);
  }

  a:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }

  @media (min-width: 1400px) {
    .experience-inner { grid-template-columns: minmax(16rem, 0.7fr) minmax(0, 2fr); }
    ol { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
    li { grid-template-columns: 1fr; align-content: start; gap: 0.8rem; padding-bottom: 1rem; }

    /* The rows sit side by side here, so the rule advances across them, not down. */
    .timeline::before {
      top: -0.55rem;
      right: 0;
      bottom: auto;
      left: 0;
      width: auto;
      height: 1px;
      transform: scaleX(var(--rows-entered, 0));
      transform-origin: left center;
    }
  }

  @media (max-width: 760px) {
    .experience-inner {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .timeline::before {
      left: -0.55rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .timeline::before,
    .timeline li {
      transition: none;
      transform: none;
    }
  }

  :global(html[data-motion='reduced']) .timeline::before,
  :global(html[data-motion='reduced']) .timeline li {
    transition: none;
    transform: none;
    opacity: 1;
  }

  @media (max-width: 540px) {
    li {
      grid-template-columns: 5.8rem minmax(0, 1fr);
      gap: 0.7rem;
    }
  }
</style>
