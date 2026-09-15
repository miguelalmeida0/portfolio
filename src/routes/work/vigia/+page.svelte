<script lang="ts">
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';

  const demoUrl = 'https://vigia-public-demo.onrender.com';
  const shots = [
    {
      src: `${demoUrl}/portfolio-media/intelligence.png`,
      alt: 'VIGIA Intelligence interface showing the product’s operational intelligence workspace.',
      label: 'Intelligence'
    },
    {
      src: `${demoUrl}/portfolio-media/operations.png`,
      alt: 'VIGIA Operations interface showing the operational workflow and action surface.',
      label: 'Operations'
    },
    {
      src: `${demoUrl}/portfolio-media/command-overview.png`,
      alt: 'VIGIA Command Overview showing the main crisis-intelligence operating picture.',
      label: 'Command overview'
    }
  ];
</script>

<svelte:head>
  <title>VIGIA — Miguel Almeida</title>
  <meta
    name="description"
    content="VIGIA is a Portugal-first crisis-intelligence system connecting incidents, routes, facilities, resources and operational consequences."
  />
</svelte:head>

<SiteHeader />

<main class="vigia page-gutter">
  <a class="back" href="/#work">← Selected work</a>

  <header class="hero">
    <div class="hero-copy">
      <p class="eyebrow">CRISIS INTELLIGENCE · PORTUGAL</p>
      <h1>VIGIA</h1>
      <p class="lead">
        A crisis-intelligence system that connects incidents, routes, facilities, resources,
        restrictions and operational consequences into one usable picture.
      </p>
      <div class="actions">
        <a class="primary" href={demoUrl} target="_blank" rel="noopener noreferrer">Open live synthetic demo ↗</a>
        <span>Public portfolio scenario · no operational services connected</span>
      </div>
    </div>

    <figure class="hero-shot">
      <img src={shots[0].src} alt={shots[0].alt} />
      <figcaption>Real VIGIA interface capture · Intelligence</figcaption>
    </figure>
  </header>

  <section class="summary">
    <div>
      <span>My role</span>
      <strong>Product strategy · interaction design · frontend engineering · intelligence architecture</strong>
    </div>
    <div>
      <span>System</span>
      <strong>Node.js · PostGIS · MapLibre · OSRM · deterministic domain engines</strong>
    </div>
    <div>
      <span>Public boundary</span>
      <strong>Synthetic scenario · read-only · no auth, database, model or dispatch dependency</strong>
    </div>
  </section>

  <section class="story">
    <div class="story-copy">
      <p class="eyebrow">THE PROBLEM</p>
      <h2>A map alone does not tell an operator what changed.</h2>
      <p>
        VIGIA was built around the operational questions that matter during a fast-moving incident:
        which facilities are relevant, how far away they are, which routes are available, what changed,
        what depends on that change, and what still needs confirmation.
      </p>
    </div>
    <div class="story-copy">
      <p class="eyebrow">THE DECISION</p>
      <h2>Keep real product logic. Remove operational risk.</h2>
      <p>
        The public portfolio build preserves the real console structure and consequence/planning logic,
        but replaces operational transport with a fail-closed boundary and feeds it a deterministic synthetic scenario.
      </p>
    </div>
  </section>

  <section class="gallery" aria-labelledby="vigia-gallery-title">
    <header>
      <p class="eyebrow">REAL PRODUCT CAPTURES</p>
      <h2 id="vigia-gallery-title">The system, not a placeholder.</h2>
    </header>

    {#each shots as shot}
      <figure>
        <img src={shot.src} alt={shot.alt} loading="lazy" />
        <figcaption>{shot.label}</figcaption>
      </figure>
    {/each}
  </section>

  <section class="capabilities">
    <p class="eyebrow">WHAT THE PRODUCT CONNECTS</p>
    <div class="capability-grid">
      <article><span>01</span><h3>Incidents</h3><p>Current incident context, history, changes and source state.</p></article>
      <article><span>02</span><h3>Routes</h3><p>Stored route options, distances, road restrictions and access implications.</p></article>
      <article><span>03</span><h3>Facilities</h3><p>Addresses, distances, verified capabilities and reception/support locations.</p></article>
      <article><span>04</span><h3>Consequences</h3><p>Dependencies, operational-period impact and what needs human inspection next.</p></article>
    </div>
  </section>
</main>

<style>
  .vigia {
    min-height: 100svh;
    padding-block: clamp(6rem, 9vw, 8rem) 5rem;
    background: #050505;
    color: var(--foreground);
  }

  .back {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    color: rgb(244 234 220 / 0.68);
    font-size: 0.9rem;
  }

  .back:hover,
  .back:focus-visible { color: var(--accent); }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 0.78fr) minmax(30rem, 1.22fr);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: end;
    margin-top: 1.5rem;
  }

  .eyebrow {
    margin: 0;
    color: var(--accent);
    font-size: var(--text-label);
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  h1, h2, h3, p, figure { margin: 0; }

  h1 {
    margin-top: 0.7rem;
    font-family: var(--font-serif);
    font-size: clamp(4.5rem, 11vw, 10rem);
    font-weight: 400;
    letter-spacing: -0.06em;
    line-height: 0.86;
  }

  .lead {
    max-width: 38rem;
    margin-top: 1.2rem;
    color: rgb(244 234 220 / 0.78);
    font-size: clamp(1.2rem, 2vw, 1.7rem);
    line-height: 1.45;
  }

  .actions {
    display: grid;
    gap: 0.75rem;
    margin-top: 1.7rem;
  }

  .primary {
    width: fit-content;
    border-bottom: 1px solid var(--accent);
    padding-block: 0.55rem;
    color: var(--foreground);
    font-weight: 700;
  }

  .actions span,
  figcaption,
  .summary span {
    color: rgb(244 234 220 / 0.55);
    font-size: 0.8rem;
  }

  .hero-shot,
  .gallery figure {
    overflow: hidden;
    background: #0a0a0a;
  }

  .hero-shot img,
  .gallery img {
    display: block;
    width: 100%;
    height: auto;
  }

  figcaption { padding: 0.7rem 0.15rem 0; }

  .summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: clamp(3rem, 6vw, 6rem);
    border-block: 1px solid rgb(244 234 220 / 0.15);
  }

  .summary div {
    display: grid;
    gap: 0.6rem;
    padding: 1.1rem;
    border-right: 1px solid rgb(244 234 220 / 0.15);
  }

  .summary div:last-child { border-right: 0; }
  .summary strong { font-size: 0.92rem; line-height: 1.5; }

  .story {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(2rem, 7vw, 7rem);
    padding-block: clamp(4rem, 8vw, 8rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.15);
  }

  .story h2,
  .gallery h2 {
    margin-top: 0.8rem;
    font-size: clamp(2.3rem, 5vw, 5rem);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .story-copy > p:last-child {
    margin-top: 1.2rem;
    color: rgb(244 234 220 / 0.7);
    line-height: 1.65;
  }

  .gallery { padding-block: clamp(4rem, 8vw, 8rem); }
  .gallery header { margin-bottom: 2rem; }
  .gallery figure + figure { margin-top: clamp(2rem, 5vw, 4rem); }

  .capabilities {
    padding-block: 1rem 4rem;
  }

  .capability-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    margin-top: 1.5rem;
    background: rgb(244 234 220 / 0.12);
  }

  .capability-grid article {
    min-height: 14rem;
    background: #050505;
    padding: 1.3rem;
  }

  .capability-grid span { color: var(--accent); font-size: 0.78rem; }
  .capability-grid h3 { margin-top: 2.5rem; font-size: 1.35rem; }
  .capability-grid p { margin-top: 0.7rem; color: rgb(244 234 220 / 0.66); line-height: 1.5; }

  @media (max-width: 900px) {
    .hero,
    .story,
    .summary,
    .capability-grid { grid-template-columns: 1fr; }

    .summary div { border-right: 0; border-bottom: 1px solid rgb(244 234 220 / 0.15); }
    .summary div:last-child { border-bottom: 0; }
  }
</style>
