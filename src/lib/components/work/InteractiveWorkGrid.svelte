<script lang="ts">
  import { homepageProjectTiles } from '$lib/content/project-media';
  import MediaProjectTile from './MediaProjectTile.svelte';
</script>

<section id="work" class="work-wall page-gutter" aria-labelledby="work-wall-title">
  <div class="work-wall-inner">
    <header>
      <div>
        <h2 id="work-wall-title">Selected work</h2>
        <p>Production frontend and independent systems built around clear feedback, visible state, and human control.</p>
      </div>
    </header>

    <div class="work-mosaic">
      {#each homepageProjectTiles as project}
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
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: clamp(1.4rem, 3vw, 2.4rem);
    padding-bottom: 0.8rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.15);
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
