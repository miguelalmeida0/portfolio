<script lang="ts">
  import { homepageReleaseProjectTiles } from '$lib/content/homepage-projects-release';
  import { reveal } from '$lib/motion/actions/reveal';
  import MediaProjectTile from './MediaProjectTile.svelte';
</script>

<section id="work" class="work-wall page-gutter" aria-labelledby="work-wall-title">
  <div class="work-wall-inner">
    <header>
      <div>
        <h2 id="work-wall-title" use:reveal={{ threshold: 0.1 }}>Selected work</h2>
        <p use:reveal={{ threshold: 0.1, delay: 70 }}>Production frontend and independent systems built around clear feedback, visible state, and human control.</p>
      </div>
      <span class="section-rule" use:reveal={{ variant: 'rule', threshold: 0.1 }} aria-hidden="true"></span>
    </header>

    <div class="work-mosaic">
      {#each homepageReleaseProjectTiles as project}
        <MediaProjectTile {project} />
      {/each}
    </div>
  </div>
</section>

<style>
  .work-wall {
    position: relative;
    z-index: 4;
    scroll-margin-top: 0;
    padding-block: clamp(3.5rem, 7vw, 7rem);
    background: #050505;
    color: var(--foreground);
  }

  .work-wall-inner {
    width: 100%;
    margin-inline: auto;
  }

  header {
    position: relative;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: clamp(1.4rem, 3vw, 2.4rem);
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.15);
  }

  /*
   * The accent rule draws along the existing section border as the wall arrives.
   * It sits on top of the border, so nothing about the resting layout changes.
   */
  .section-rule {
    position: absolute;
    inset: auto 0 -1px 0;
    display: block;
    height: 1px;
    background: color-mix(in srgb, var(--accent) 70%, transparent);
  }

  h2 {
    margin: 0;
    max-width: 48rem;
    font-size: var(--text-section);
    font-weight: 680;
    letter-spacing: -0.03em;
    line-height: 1.06;
  }

  header div {
    display: grid;
    gap: 0.7rem;
  }

  header p {
    max-width: 48rem;
    margin: 0;
    color: rgb(244 234 220 / 0.7);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.55;
  }

  .work-mosaic {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(2.5rem, 5vw, 5rem) clamp(1rem, 2vw, 2rem);
    background: transparent;
  }

  @media (min-width: 1800px) {
    .work-mosaic { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  @media (max-width: 980px) {
    .work-mosaic {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .work-wall {
      padding-block: 2.65rem 3.5rem;
    }

    header {
      align-items: start;
      flex-direction: column;
      margin-bottom: 1rem;
      padding-bottom: 0.6rem;
    }

    .work-mosaic {
      gap: 2.25rem;
    }
  }
</style>
