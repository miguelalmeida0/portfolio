<script lang="ts">
  import { experienceTeaser } from '$lib/content/folio';
</script>

<section id="experience" class="experience page-gutter" aria-labelledby="experience-title">
  <div class="experience-inner">
    <div class="section-title">
      <p>Production experience</p>
      <h2 id="experience-title">Built from scratch.<br />Used by hundreds of companies.</h2>
    </div>

    <div>
      <ol>
        {#each experienceTeaser as item}
          <li>
            <time datetime={item.years.split(' ')[0]}>{item.years}</time>
            <strong>{item.role}</strong>
          </li>
        {/each}
      </ol>
      <a href="/cv">Read the full résumé →</a>
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
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: minmax(7rem, 0.24fr) minmax(0, 1fr);
    gap: clamp(0.65rem, 1.5vw, 1.5rem);
    align-items: baseline;
    min-height: 3rem;
    padding-block: 0.65rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.12);
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
    transform: translateX(2px);
  }

  a:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }

  @media (min-width: 1400px) {
    .experience-inner { grid-template-columns: minmax(16rem, 0.7fr) minmax(0, 2fr); }
    ol { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
    li { grid-template-columns: 1fr; align-content: start; gap: 0.8rem; padding-bottom: 1rem; }
  }

  @media (max-width: 760px) {
    .experience-inner {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 540px) {
    li {
      grid-template-columns: 5.8rem minmax(0, 1fr);
      gap: 0.7rem;
    }
  }
</style>
