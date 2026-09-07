<script lang="ts">
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import { getApprovedMedia } from '$lib/content/project-media';

  const storyMedia = [
    {
      media: getApprovedMedia('f24-hackathon-presentation-room'),
      caption: 'Demo · F24’s first shared AI service'
    },
    {
      media: getApprovedMedia('f24-hackathon-working-session'),
      caption: 'Hackathon · Building with the team'
    }
  ].filter((item) => item.media);

  const chapters = [
    {
      id: 'at-work',
      number: '01',
      label: 'Production engineering',
      title: 'I built the frontend of a business application from scratch. Hundreds of companies now use the application.',
      paragraphs: [
        'I took the project from initial mockups and design into a working frontend, then migrated it to React. My responsibility grew from implementing the experience to coordinating frontend delivery through review and release.',
        'That means making the application work beyond the happy path: asynchronous state, validation, accessibility, responsive behaviour, and recovery when an operation fails.'
      ]
    },
    {
      id: 'hackathon',
      number: '02',
      label: 'AI service integration',
      title: 'I led frontend engineering for F24’s first shared AI service during an internal hackathon.',
      paragraphs: [
        'I shaped the interaction, integrated the service, and delivered the complete browser flow for the team’s demonstration.',
        'Working directly with product and backend teammates, I connected a new service to an interface people could actually use. The photographs show that build session and presentation.'
      ]
    },
    {
      id: 'side-projects',
      number: '03',
      label: 'Independent engineering',
      title: 'I build the systems around AI: request ownership, spending controls, and inspectable evidence.',
      paragraphs: [
        'Camera Harness rejects obsolete camera responses. Ghostwriter reserves budget before paid generation. Mirror AI keeps image selection responsive while models work and turns corrections into reviewable test cases.',
        'I own these projects from interaction design through implementation and targeted verification. Each exposes a different engineering boundary: concurrency, uncertain provider outcomes, or conflicting visual evidence.'
      ]
    }
  ] as const;

  const imageSizes =
    '(max-width: 560px) calc(50vw - 1.25rem), (max-width: 1050px) calc(50vw - 2rem), 46rem';

  const getResponsiveSources = (src: string, format: 'avif' | 'webp') => {
    const base = src.replace(/\.[^/.]+$/, '').replace(/-(640|1024)$/, '');
    return `${base}-640.${format} 640w, ${base}-1024.${format} 1024w`;
  };
</script>

<svelte:head>
  <title>About — Miguel Almeida</title>
  <meta
    name="description"
    content="A straightforward introduction to Miguel Almeida’s frontend work at F24, hackathon contribution, and independent projects."
  />
</svelte:head>

<SiteHeader />

<main class="story-page page-gutter">
  <header class="story-intro">
    <div class="intro-copy">
      <p class="eyebrow">About · Berlin</p>
      <h1>Frontend engineering. From zero to production.</h1>
      <p class="lede">
        I built a business application’s frontend from its first mockups through production, then
        migrated it to React. Hundreds of companies now use the application. Today I build production frontends
        and independent AI systems in Berlin.
      </p>
    </div>

    <div class="opening-media" aria-label="F24 hackathon photographs">
      {#each storyMedia as item}
        {#if item.media}
          <figure>
            <picture>
              <source
                type="image/avif"
                srcset={getResponsiveSources(item.media.src, 'avif')}
                sizes={imageSizes}
              />
              <source
                type="image/webp"
                srcset={getResponsiveSources(item.media.src, 'webp')}
                sizes={imageSizes}
              />
              <img
                src={item.media.src}
                alt={item.media.alt}
                width="1600"
                height="1000"
                sizes={imageSizes}
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </picture>
            <figcaption>{item.caption}</figcaption>
          </figure>
        {/if}
      {/each}
    </div>
  </header>

  <div class="chapter-list">
    {#each chapters as chapter}
      <section id={chapter.id} class="chapter" aria-labelledby={`${chapter.id}-title`}>
        <div class="chapter-meta">
          <span>{chapter.number}</span>
          <span>{chapter.label}</span>
        </div>
        <div class="chapter-copy">
          <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
          {#each chapter.paragraphs as paragraph}<p>{paragraph}</p>{/each}
        </div>
      </section>
    {/each}
  </div>

</main>

<style>
  .story-page {
    min-height: 100svh;
    padding-block: clamp(6.25rem, 8vw, 7.5rem) clamp(4rem, 7vw, 7rem);
    background: #050505;
    color: var(--foreground);
  }

  .story-intro,
  .chapter-list {
    width: 100%;
    margin-inline: auto;
  }

  .story-intro {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    align-items: start;
    padding-bottom: clamp(2.5rem, 5vw, 5rem);
  }

  .intro-copy {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    align-items: end;
    gap: 16px 48px;
  }

  .intro-copy .eyebrow { grid-column: 1 / -1; }

  .eyebrow,
  h1,
  .lede,
  .chapter h2,
  .chapter p,
  figure {
    margin: 0;
  }

  .eyebrow,
  .chapter-meta,
  figcaption {
    color: var(--accent);
    font-family: var(--font-sans);
    font-size: var(--text-label);
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1.45;
  }

  h1 {
    max-width: 640px;
    overflow-wrap: normal;
    font-family: var(--font-serif);
    font-size: var(--text-page);
    font-weight: 430;
    letter-spacing: -0.046em;
    line-height: 0.98;
    text-wrap: balance;
    word-break: normal;
  }

  .lede {
    max-width: 540px;
    color: rgb(244 234 220 / 0.74);
    font-size: var(--text-body);
    line-height: 1.62;
  }

  .opening-media {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(0.7rem, 1.2vw, 1rem);
    min-width: 0;
    width: min(100%, 80rem);
    margin-inline: auto;
  }

  figure {
    display: grid;
    min-width: 0;
    gap: 0.75rem;
  }

  picture,
  img {
    display: block;
    width: 100%;
  }

  picture {
    overflow: hidden;
    aspect-ratio: 16 / 9;
    background: #0a0a0a;
  }

  img {
    height: 100%;
    object-fit: cover;
  }

  figcaption {
    color: rgb(244 234 220 / 0.68);
    font-size: var(--text-label);
    line-height: 1.52;
  }

  .chapter-list {
    border-top: 1px solid rgb(244 234 220 / 0.16);
  }

  .chapter {
    display: grid;
    grid-template-columns: minmax(10rem, 0.28fr) minmax(0, 1fr);
    gap: clamp(1.5rem, 5vw, 6rem);
    padding-block: clamp(3.25rem, 5.5vw, 5.5rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .chapter-meta {
    display: grid;
    align-content: start;
    gap: 0.4rem;
  }

  .chapter-meta span:last-child {
    color: rgb(244 234 220 / 0.62);
  }

  .chapter-copy h2 {
    max-width: 52rem;
    font-size: min(var(--text-card), 1.375rem);
    font-weight: 600;
    letter-spacing: -0.034em;
    line-height: 1.35;
  }

  .chapter-copy > p {
    max-width: 48rem;
    margin-top: 1.15rem;
    color: rgb(244 234 220 / 0.72);
    font-size: var(--text-body);
    line-height: 1.65;
  }

  @media (min-width: 1400px) {
    .chapter { grid-template-columns: 10rem minmax(0, 1fr); gap: 3rem; padding-block: 3rem; }
    .chapter-copy { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: clamp(2rem, 4vw, 5rem); align-content: start; }
    .chapter-copy h2 { grid-column: 1; grid-row: 1 / span 2; max-width: none; }
    .chapter-copy > p { grid-column: 2; margin-top: 0; max-width: none; }
    .chapter-copy > p + p { margin-top: 1rem; }
  }

  @media (max-width: 1050px) {
    .story-intro {
      grid-template-columns: 1fr;
      min-height: auto;
      align-items: start;
      gap: 2.5rem;
    }

    h1 {
      max-width: 50rem;
    }
  }

  @media (max-width: 720px) {
    .intro-copy { grid-template-columns: 1fr; gap: 12px; }

    .story-page {
      padding-top: 80px;
    }

    .story-intro {
      gap: 2rem;
      padding-bottom: 3.5rem;
    }

    h1 {
      font-size: var(--text-page);
    }

    .chapter {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }
  }

  @media (max-width: 520px) {
    .opening-media {
      gap: 0.55rem;
    }

    figure {
      gap: 0.55rem;
    }

    figcaption {
      font-size: 0.72rem;
    }
  }

  @media (max-width: 360px) {
    h1 {
      font-size: 30px;
      overflow-wrap: normal;
      word-break: normal;
    }
  }
</style>
