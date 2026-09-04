<script lang="ts">
  import { experienceTeaser } from '$lib/content/folio';
</script>

<section id="experience" class="experience page-gutter" aria-labelledby="experience-title">
  <div class="experience-inner">
    <h2 id="experience-title">Experience</h2>

    <div>
      <ol>
        {#each experienceTeaser as item}
          <li>
            <time datetime={item.years.split(' ')[0]}>{item.years}</time>
            <strong>{item.role}</strong>
          </li>
        {/each}
      </ol>
      <a href="/cv">Full résumé →</a>
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
    width: min(100%, 96rem);
    margin-inline: auto;
    grid-template-columns: minmax(7rem, 0.18fr) minmax(0, 1fr);
    gap: clamp(1rem, 3vw, 3rem);
    padding-top: 0.7rem;
    border-top: 1px solid rgb(244 234 220 / 0.15);
  }

  h2 {
    margin: 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    text-transform: uppercase;
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
    min-height: 2rem;
    padding-block: 0.35rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.12);
  }

  time {
    color: rgb(244 234 220 / 0.48);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  strong {
    color: var(--foreground);
    font-size: 0.78rem;
    line-height: 1.35;
  }

  a {
    display: inline-flex;
    min-height: 2rem;
    align-items: center;
    margin-top: 0.4rem;
    color: var(--accent);
    font-size: 0.72rem;
    font-weight: 720;
  }

  a:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
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
