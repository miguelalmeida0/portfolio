<script lang="ts">
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import { getApprovedMedia } from '$lib/content/project-media';

  const chapters = [
    {
      id: 'aviation',
      number: '01',
      label: 'Aviation',
      period: 'Before 2020',
      title: 'Operational clarity came before interface design.',
      body:
        'Aviation taught me that procedures, calm communication, and checklists are acts of care. That instinct still shapes how I handle empty states, recovery, QA, and software people must trust under pressure.'
    },
    {
      id: 'engineer',
      number: '02',
      label: 'UX + code',
      period: '2020 — 2021',
      title: 'A formal UX education turned visual instinct into a method.',
      body:
        'From 2020 to 2021 I completed the Professional Diploma in UX Design at the UX Design Institute, awarded on 30 August 2021. Research, hierarchy, user flows, and prototyping became a structured practice; frontend work then added real data, responsive constraints, and asynchronous state.'
    },
    {
      id: 'designer',
      number: '03',
      label: 'Designer',
      period: '2022 — 2025',
      title: 'The visual decision and the engineering decision became one.',
      body:
        'At F24 I learned production delivery inside critical communication software. Component systems, clear failure states, layout behaviour, and cross-functional handoff became part of the same product judgment. During an internal hackathon, I helped implement the company’s first AI product.'
    },
    {
      id: 'builder',
      number: '04',
      label: 'Builder',
      period: '2026',
      title: 'The work moved closer to cameras, models, and evidence.',
      body:
        'Camera Harness, Creature App, Mirror AI, Atlas, and Ghostwriter pushed the same question further: what should the interface claim, and what evidence does it actually have?'
    }
  ] as const;

  const hackathonMedia = [
    ['f24-hackathon-presentation-room', 'Briefing and internal presentation'],
    ['f24-hackathon-working-session', 'Working session'],
    ['f24-hackathon-collaboration', 'Implementation review'],
    ['f24-hackathon-standing-session', 'Shared build session'],
    ['f24-hackathon-focus-session', 'Focused product work'],
    ['f24-hackathon-team-demo', 'Team after the demo']
  ]
    .map(([mediaId, caption]) => ({ media: getApprovedMedia(mediaId), caption }))
    .filter((item) => item.media);

  const hackathonImageSizes =
    '(max-width: 680px) calc(100vw - 2.5rem), (max-width: 900px) calc(50vw - 2rem), 32rem';

  const getResponsiveSources = (src: string, format: 'avif' | 'webp') => {
    const name = src.split('/').at(-1)?.replace(/\.[^/.]+$/, '') ?? '';
    const base = `/media/v1/story/${name}`;
    return `${base}-640.${format} 640w, ${base}-1024.${format} 1024w`;
  };
</script>

<svelte:head>
  <title>Story / Miguel Almeida</title>
  <meta
    name="description"
    content="Miguel Almeida's path from aviation and UX design to frontend engineering and experimental AI interfaces."
  />
</svelte:head>

<SiteHeader />

<main class="story-page page-gutter">
  <section class="hackathon" aria-labelledby="story-title">
    <header>
      <p>Story · Internal F24 hackathon</p>
      <h1 id="story-title">Implementing the company’s first AI product.</h1>
    </header>

    <div class="hackathon-grid">
      {#each hackathonMedia as item, index}
        {#if item.media}
          <figure>
            <div class="image-frame">
              <picture>
                <source
                  type="image/avif"
                  srcset={getResponsiveSources(item.media.src, 'avif')}
                  sizes={hackathonImageSizes}
                />
                <source
                  type="image/webp"
                  srcset={getResponsiveSources(item.media.src, 'webp')}
                  sizes={hackathonImageSizes}
                />
                <img
                  src={item.media.src}
                  alt={item.media.alt}
                  width="1600"
                  height="1000"
                  sizes={hackathonImageSizes}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchpriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </picture>
            </div>
            <figcaption>{item.caption}</figcaption>
          </figure>
        {/if}
      {/each}
    </div>
  </section>

  <section class="background" aria-labelledby="background-title">
    <header>
      <p>Background</p>
      <h2 id="background-title">A short timeline</h2>
    </header>

    <nav aria-label="Story chapters">
      <ol>
        {#each chapters as chapter}
          <li><a href={`#${chapter.id}`}>{chapter.number} · {chapter.label}</a></li>
        {/each}
      </ol>
    </nav>

    <div class="chapter-list">
      {#each chapters as chapter}
        <article id={chapter.id} class="chapter">
          <div class="chapter-meta">
            <span>{chapter.number} · {chapter.label}</span>
            <span>{chapter.period}</span>
          </div>
          <div>
            <h3>{chapter.title}</h3>
            <p>{chapter.body}</p>
          </div>
        </article>
      {/each}
    </div>
  </section>
</main>

<style>
  .story-page {
    min-height: 100svh;
    padding-block: clamp(6rem, 9vw, 8rem) clamp(4rem, 7vw, 7rem);
    background: #050505;
    color: var(--foreground);
  }

  .hackathon,
  .background {
    width: min(100%, 96rem);
    margin-inline: auto;
  }

  .hackathon > header {
    display: grid;
    grid-template-columns: minmax(10rem, 0.28fr) minmax(0, 1fr);
    gap: clamp(1rem, 4vw, 4rem);
    align-items: start;
  }

  .hackathon > header p,
  .hackathon > header h1,
  .background > header p,
  .background > header h2 {
    margin: 0;
  }

  .hackathon > header p,
  .background > header p,
  .chapter-meta,
  figcaption {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 760;
    letter-spacing: 0.09em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  h1 {
    max-width: 42rem;
    font-size: clamp(1.55rem, 2.3vw, 2.25rem);
    font-weight: 680;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .hackathon-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(2rem, 4vw, 3.5rem) clamp(0.9rem, 1.5vw, 1.5rem);
    margin-top: clamp(1.6rem, 3.5vw, 3rem);
  }

  figure {
    display: grid;
    gap: 0.65rem;
    min-width: 0;
    margin: 0;
  }

  .image-frame {
    aspect-ratio: 16 / 10;
    display: grid;
    min-width: 0;
    place-items: center;
    overflow: hidden;
    background: #090909;
  }

  picture,
  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    max-width: 100%;
    object-fit: contain;
    object-position: center;
  }

  figcaption {
    color: rgb(244 234 220 / 0.52);
  }

  .background {
    margin-top: clamp(5rem, 10vw, 9rem);
    padding-top: 1.25rem;
    border-top: 1px solid rgb(244 234 220 / 0.15);
  }

  .background > header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .background > header h2 {
    font-size: clamp(1.5rem, 2.4vw, 2.2rem);
    font-weight: 650;
    letter-spacing: -0.025em;
  }

  nav {
    margin-top: 1.3rem;
  }

  nav ol {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.4rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  nav a {
    display: inline-flex;
    min-height: 2.4rem;
    align-items: center;
    color: rgb(244 234 220 / 0.52);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  nav a:hover,
  nav a:focus-visible {
    color: var(--foreground);
    outline: none;
  }

  nav a:focus-visible {
    box-shadow: 0 2px 0 var(--ring);
  }

  .chapter-list {
    margin-top: 1rem;
    border-top: 1px solid rgb(244 234 220 / 0.12);
  }

  article {
    display: grid;
    grid-template-columns: minmax(10rem, 0.34fr) minmax(0, 1fr);
    gap: clamp(1.5rem, 5vw, 5rem);
    padding-block: clamp(1.7rem, 3.5vw, 3rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.12);
    scroll-margin-top: calc(var(--site-header-offset) + 1rem);
  }

  .chapter-meta {
    display: grid;
    align-content: start;
    gap: 0.35rem;
  }

  .chapter-meta span:last-child {
    color: rgb(244 234 220 / 0.42);
  }

  article h3,
  article p {
    margin: 0;
  }

  article h3 {
    max-width: 46rem;
    font-size: clamp(1.2rem, 1.7vw, 1.65rem);
    font-weight: 650;
    letter-spacing: -0.025em;
    line-height: 1.08;
  }

  article p {
    max-width: 52rem;
    margin-top: 0.85rem;
    color: rgb(244 234 220 / 0.62);
    font-size: 0.92rem;
    line-height: 1.6;
  }

  @media (max-width: 900px) {
    .hackathon-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    .story-page {
      padding-top: 5.5rem;
    }

    .hackathon > header,
    article {
      grid-template-columns: 1fr;
    }

    .hackathon-grid {
      grid-template-columns: 1fr;
      gap: 2.6rem;
    }

    .background > header {
      display: grid;
    }

    article {
      gap: 0.8rem;
    }
  }
</style>
