<script lang="ts">
  import ProjectCard, { type ProjectCardProps } from './ProjectCard.svelte';

  const projects: ProjectCardProps[] = [
    {
      title: 'Tiny Invite',
      description:
        'A soft social planning interface with guest presence, prompts, vibe filters, send states, and mobile-first interaction details.',
      imgSrc: '/projects/tiny-invite.png',
      imageAlt: 'Tiny Invite product UI showing invite composer, guests, prompts, and live plans.',
      link: '/story#building-from-zero',
      linkText: 'View project'
    },
    {
      title: 'Tolkien Rewrite',
      description:
        'A cinematic AI writing prototype that makes voice, mood, and output control feel visible instead of generic.',
      imgSrc: '/projects/toikien.png',
      imageAlt: 'Tolkien Rewrite interface with author illustration and writing actions.',
      link: '/story#first-code',
      linkText: 'Explore concept'
    },
    {
      title: 'Tickerbase',
      description:
        'A dense market dashboard shaped for scanning, filtering, watchlists, and readable financial hierarchy.',
      imgSrc: '/projects/tickerbase.png',
      imageAlt: 'Tickerbase market dashboard with charts, portfolio metrics, filters, and securities table.',
      link: '/cv#sheet',
      linkText: 'View project'
    }
  ];
</script>

<section id="work" class="selected-work page-gutter" aria-labelledby="selected-work-title">
  <div class="selected-work-inner">
    <header class="selected-work-header">
      <p>Selected work</p>
      <h2 id="selected-work-title">Projects</h2>
    </header>

    <div class="project-grid">
      {#each projects as project}
        <ProjectCard {...project} />
      {/each}
    </div>
  </div>
</section>

<style>
  .selected-work {
    scroll-margin-top: 5.5rem;
    padding-block: clamp(4rem, 8vw, 7rem);
    background: var(--color-background);
  }

  .selected-work-inner {
    width: min(100%, 1480px);
    margin-inline: auto;
  }

  .selected-work-header {
    margin-bottom: clamp(1.4rem, 3vw, 2.4rem);
  }

  .selected-work-header p {
    margin: 0;
    color: var(--color-muted-foreground);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.18em;
    line-height: 1;
    text-transform: uppercase;
  }

  .selected-work-header h2 {
    margin: 0.55rem 0 0;
    color: var(--foreground);
    font-family: var(--font-display);
    font-size: clamp(2.3rem, 5.5vw, 4.6rem);
    line-height: 0.95;
    letter-spacing: 0;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1rem, 2.2vw, 2rem);
  }

  @media (max-width: 1080px) {
    .project-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .project-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
