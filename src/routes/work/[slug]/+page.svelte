<script lang="ts">
  import { onMount } from 'svelte';

  import MiguelLLMDrawer from '$lib/components/miguel-llm/MiguelLLMDrawer.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import VideoLoop from '$lib/components/work/VideoLoop.svelte';
  import CameraArchitecture from '$lib/components/case-study/CameraArchitecture.svelte';
  import CameraFeatureGallery from '$lib/components/case-study/CameraFeatureGallery.svelte';
  import RecruiterSummary from '$lib/components/case-study/RecruiterSummary.svelte';
  import { recruiterBriefs } from '$lib/content/recruiter-briefs';
  import { recruiterCaseStudies } from '$lib/content/case-studies';
  import { getApprovedMedia } from '$lib/content/project-media';
  import type { MiguelLLMMode } from '$lib/miguel-llm/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let drawerOpen = false;
  let drawerMode: MiguelLLMMode = 'engineer';
  let engineeringOpen = true;

  $: projectMedia = data.study.mediaId ? getApprovedMedia(data.study.mediaId) : undefined;
  $: currentIndex = recruiterCaseStudies.findIndex((study) => study.slug === data.study.slug);
  $: nextStudy = recruiterCaseStudies[(currentIndex + 1) % recruiterCaseStudies.length];

  const askAboutProject = () => {
    drawerMode = 'engineer';
    drawerOpen = true;
  };

  onMount(() => {
    engineeringOpen = window.matchMedia('(min-width: 701px)').matches || ['#decisions', '#behavior-title'].includes(window.location.hash);
    const revealLinkedDetail = () => { if (['#decisions', '#behavior-title'].includes(window.location.hash)) engineeringOpen = true; };
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: MiguelLLMMode }>).detail;
      drawerMode = detail?.mode ?? 'engineer';
      drawerOpen = true;
    };

    window.addEventListener('miguel-llm:open', handleOpen as EventListener);
    window.addEventListener('hashchange', revealLinkedDetail);
    return () => { window.removeEventListener('miguel-llm:open', handleOpen as EventListener); window.removeEventListener('hashchange', revealLinkedDetail); };
  });
</script>

<svelte:head>
  <title>{data.study.title} — Miguel Almeida</title>
  <meta name="description" content={`${data.study.title}: ${data.study.thesis}`} />
</svelte:head>

<SiteHeader />

<main class="case-study page-gutter">
  <div class="case-back"><a class="back-link" href="/#work">← Selected work</a></div>
  <header class="case-hero" class:has-media={Boolean(projectMedia)}>
    <div class="case-copy">
      <p class="eyebrow">{data.study.type}</p>
      <h1>{data.study.title}</h1>
      <p class="thesis">{data.study.thesis}</p>
      {#if recruiterBriefs[data.study.slug]}<RecruiterSummary brief={recruiterBriefs[data.study.slug]} compact />{/if}
    </div>

    {#if data.study.slug === 'camera-harness'}
      <div id="artifact" class="camera-examples"><CameraFeatureGallery compact /></div>
    {:else}
    <div id="artifact" class="artifact" class:text-only={!projectMedia}>
      {#if projectMedia}
        {#if projectMedia.kind === 'video'}
          <VideoLoop
            alt={projectMedia.alt}
            poster={projectMedia.poster ?? projectMedia.src}
            webm={projectMedia.src.endsWith('.webm') ? projectMedia.src : undefined}
            mp4={projectMedia.fallbackSrc ?? (projectMedia.src.endsWith('.mp4') ? projectMedia.src : undefined)}
            featured
          />
        {:else}
          <img
            src={projectMedia.src}
            srcset={['ghostwriter', 'mirror-ai'].includes(data.study.slug) ? `/projects/${data.study.slug}/interface-720.webp 720w, /projects/${data.study.slug}/interface-1600.webp 1600w` : undefined}
            sizes="(max-width: 900px) 92vw, 52vw"
            alt={projectMedia.alt}
            width="1600"
            height="1000"
            fetchpriority="high"
            decoding="async"
          />
        {/if}
      {:else}
        <ol aria-label={`${data.study.title} architecture sequence`}>
          {#each data.study.keyFlows as flow, index}
            <li><span>{index + 1}</span><strong>{flow}</strong></li>
          {/each}
        </ol>
      {/if}
      <p>{data.study.artifactCaption}</p>
    </div>
    {/if}
  </header>


  <section class="facts" aria-label="Project facts">
    <div><span>My role</span><strong>{data.study.role}</strong></div>
    <div><span>Context</span><strong>{data.study.timeline}</strong></div>
    <div><span>Built with</span><strong>{data.study.stack}</strong></div>
  </section>

  <section class="problem-section story-section" aria-labelledby="problem-title">
    <div class="main-copy">
      <h2 id="problem-title">{data.study.sectionTitles.problem}</h2>
      <p>{data.study.problem}</p>
    </div>
    <aside id="contribution">
      <h3>{data.study.sectionTitles.responsibility}</h3>
      <p>{data.study.contribution}</p>
      <blockquote>{data.study.technicalSignal}</blockquote>
    </aside>
  </section>

  {#if data.study.slug === 'camera-harness'}<CameraArchitecture />{/if}

  {#if data.study.slug === 'mirror-ai'}
    <section id="corrections" class="story-section incident" aria-labelledby="corrections-title">
      <header><p class="eyebrow">Correction → evaluation</p><h2 id="corrections-title">A wrong answer becomes a test.</h2></header>
      <ol class="incident-steps">
        <li><span>01 · Inspect</span><h3>Give the answer a visible subject</h3><p>Select a contour, inspect its crop and interpretation, or deliberately mark a missed region for targeted analysis.</p></li>
        <li><span>02 · Correct</span><h3>Preserve the user’s evidence</h3><p>Append-only correction history takes precedence over weaker model results that arrive later.</p></li>
        <li><span>03 · Evaluate</span><h3>Keep enough context to revisit it</h3><p>Eval Lab stores the question, answer, correction, and a compressed image with focus-region information locally. Saving a case does not retrain the model or prove a fix.</p></li>
      </ol>
    </section>
  {/if}

  {#if data.study.slug === 'ghostwriter'}
    <section id="incident" class="story-section incident" aria-labelledby="incident-title">
      <header><p class="eyebrow">Server orchestration</p><h2 id="incident-title">Reserve before the rewrite.</h2></header>
      <ol class="incident-steps">
        <li><span>01 · Authorize</span><h3>Validate policy & identity</h3><p>Server-controlled models and token limits, verified identity, and approved-beta access define who can generate.</p></li>
        <li><span>02 · Reserve</span><h3>Give spending an operation</h3><p>Reserve budget before dispatch. Durable identifiers, input fingerprints, and account/global limits coordinate overlapping requests.</p></li>
        <li><span>03 · Reconcile</span><h3>Account for uncertainty</h3><p>Replay completed operations. Keep the reservation when the provider or settlement outcome is unknown.</p></li>
      </ol>
      <details class="incident-evidence"><summary>Private until deliberately shared</summary><p>A rewrite is not permission to publish a draft. Sharing uses explicit consent and signed artifact provenance; public output hides the source by default. Private feedback stores metadata and a rewrite hash, without the passage itself. Public sharing is disabled under the closed-beta policy. Generation can send writing to the configured model provider.</p></details>
    </section>
  {/if}

  <details class="engineering-detail" bind:open={engineeringOpen}>
  <summary>Technical decisions & failure states</summary>
  <section id="decisions" class="alternatives story-section" aria-labelledby="alternatives-title">
    <header>
      <h2 id="alternatives-title">{data.study.sectionTitles.alternatives}</h2>
    </header>
    <div class="option-grid">
      {#each data.study.alternatives as alternative, index}
        <article>
          <span>Option {String.fromCharCode(65 + index)}</span>
          <h3>{alternative.title}</h3>
          <p>{alternative.body}</p>
        </article>
      {/each}
    </div>
    <div class="choice-grid">
      <div>
        <h3>What I chose</h3>
        <p>{data.study.decision}</p>
      </div>
      <div>
        <h3>The tradeoff</h3>
        <p>{data.study.tradeoff}</p>
      </div>
    </div>
  </section>

  <section class="behavior story-section" aria-labelledby="behavior-title">
    <header>
      <h2 id="behavior-title">{data.study.sectionTitles.behavior}</h2>
    </header>
    <div class="behavior-table" aria-label="Behavior before and after the decision">
      <div class="behavior-row behavior-head">
        <span>State</span>
        <span>Condition</span>
        <span>Implemented response</span>
      </div>
      {#each data.study.behavior as row}
        <div class="behavior-row">
          <strong>{row.state}</strong>
          <p>{row.before}</p>
          <p>{row.after}</p>
        </div>
      {/each}
    </div>
  </section>

  </details>

  <section id="result" class="result story-section" aria-labelledby="result-title">
    <div class="main-copy">
      <h2 id="result-title">{data.study.sectionTitles.result}</h2>
      <p>{data.study.outcome}</p>
    </div>
    <aside id="reflection">
      <h3>Conditions and limits</h3>
      <p>{data.study.conditions}</p>
    </aside>
  </section>


  <footer class="case-footer">
    <button type="button" on:click={askAboutProject}>Ask the portfolio guide about {data.study.title}</button>
    <a href={`/work/${nextStudy.slug}`}>
      Next project <span>{nextStudy.title} →</span>
    </a>
  </footer>
</main>

<MiguelLLMDrawer bind:open={drawerOpen} bind:mode={drawerMode} projectSlug={data.study.slug} />

<style>
  .case-back { width: min(100%, 100rem); margin-inline: auto; }
  .case-hero > .artifact, .case-hero > .camera-examples { margin-top: 0; }
  .camera-examples { min-width: 0; width: min(100%, 36rem); justify-self: end; }
  .engineering-detail { width: 100%; margin-inline: auto; }
  .engineering-detail > summary { padding: 20px 0; border-block: 1px solid rgb(244 234 220 / 0.16); color: var(--foreground); cursor: pointer; font-size: var(--text-small); }
  .engineering-detail > summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  :global(.case-study [id]) { scroll-margin-top: 100px; }
  .incident header { margin-bottom: 24px; }
  .incident header .eyebrow { margin-bottom: 12px; }
  .incident-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin: 0; padding: 0; list-style: none; }
  .incident-steps li { border-top: 1px solid rgb(244 234 220 / 0.2); padding-top: 18px; }
  .incident-steps span { color: var(--accent); font-size: var(--text-label); }
  .incident-steps h3 { font-size: 19px; margin-block: 12px; }
  .incident-steps p, .incident-evidence p { color: rgb(244 234 220 / 0.68); font-size: var(--text-small); line-height: 1.65; }
  .incident-evidence { margin-top: 24px; }
  .incident-evidence summary { cursor: pointer; padding-block: 12px; font-size: var(--text-label); }
  .incident-evidence p { max-width: 80ch; padding-top: 12px; }
  .incident-evidence summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
  @media (max-width: 700px) { .incident-steps { grid-template-columns: 1fr; gap: 20px; } }
  .case-study {
    min-height: 100svh;
    padding-block: clamp(6rem, 9vw, 8rem) 4rem;
    background: #050505;
    color: var(--foreground);
  }

  .case-hero,
  .facts,
  .story-section,
  .case-footer {
    width: 100%;
    margin-inline: auto;
  }

  .case-hero {
    display: grid;
    gap: clamp(1.5rem, 3vw, 3rem);
    align-items: start;
    max-width: 100rem;
  }

  .case-hero.has-media {
    grid-template-columns: minmax(20rem, 0.82fr) minmax(28rem, 1.18fr);
  }

  .case-copy {
    min-width: 0;
  }

  .back-link {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    margin-bottom: 1.5rem;
    color: rgb(244 234 220 / 0.72);
    font-size: 0.9rem;
    transition:
      color var(--interaction-duration) var(--interaction-ease),
      transform var(--interaction-duration) var(--interaction-ease);
  }

  .back-link:hover {
    color: var(--accent);
    transform: translateX(-2px);
  }

  .back-link:focus-visible,
  .case-footer a:focus-visible,
  .case-footer button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }

  .eyebrow,
  .facts span,
  .artifact > p,
  .option-grid article > span {
    margin: 0;
    color: var(--accent);
    font-family: var(--font-sans);
    font-size: var(--text-label);
    font-weight: 600;
    letter-spacing: 0.015em;
    line-height: 1.5;
  }

  h1,
  h2,
  h3,
  p,
  blockquote {
    margin: 0;
  }

  h1 {
    margin-top: 0.7rem;
    font-family: var(--font-serif);
    font-size: var(--text-page);
    font-weight: 400;
    letter-spacing: -0.045em;
    line-height: 1.02;
  }

  .thesis {
    max-width: 42rem;
    margin-top: 1.15rem;
    color: rgb(244 234 220 / 0.78);
    font-size: var(--text-lead);
    line-height: 1.5;
  }

  .artifact {
    position: relative;
    display: grid;
    min-width: 0;
    aspect-ratio: 16 / 10;
    max-height: 30rem;
    overflow: hidden;
    background: #0a0a0a;
  }

  .artifact :global(.video-shell),
  .artifact img {
    width: 100%;
    height: 100%;
  }

  .artifact img {
    object-fit: contain;
  }

  .artifact > p {
    position: absolute;
    inset: auto 1rem 0.8rem;
    z-index: 3;
    width: fit-content;
    max-width: calc(100% - 8rem);
    padding: 0.4rem 0.55rem;
    background: rgb(5 5 5 / 0.88);
    color: rgb(244 234 220 / 0.82);
  }

  .artifact.text-only {
    align-content: center;
    padding: clamp(1.2rem, 3vw, 2.5rem);
    border: 1px solid rgb(244 234 220 / 0.16);
  }

  .artifact ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .artifact li {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    min-height: 3.7rem;
    border-top: 1px solid rgb(244 234 220 / 0.16);
    color: rgb(244 234 220 / 0.76);
  }

  .artifact li:last-child {
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .artifact li span {
    color: var(--accent);
    font-family: var(--font-technical);
    font-size: var(--text-label);
  }

  .artifact li strong {
    font-size: 1rem;
    line-height: 1.4;
  }

  .facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: clamp(2.5rem, 4vw, 4rem);
    border-block: 1px solid rgb(244 234 220 / 0.16);
  }

  .facts div {
    display: grid;
    gap: 0.55rem;
    padding: 1rem;
    border-right: 1px solid rgb(244 234 220 / 0.16);
  }

  .facts div:last-child {
    border-right: 0;
  }

  .facts strong {
    color: rgb(244 234 220 / 0.78);
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .story-section {
    padding-block: clamp(3.5rem, 7vw, 7rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .problem-section,
  .result {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(18rem, 0.7fr);
    gap: clamp(2rem, 7vw, 8rem);
  }

  .story-section h2 {
    max-width: 22ch;
    font-size: var(--text-section);
    font-weight: 650;
    letter-spacing: -0.035em;
    line-height: 1.08;
  }

  .main-copy > p,
  .story-section aside > p,
  .option-grid p,
  .choice-grid p {
    max-width: 68ch;
    margin-top: 1.1rem;
    color: rgb(244 234 220 / 0.75);
    font-size: var(--text-body);
    line-height: 1.65;
  }

  .story-section h3 {
    color: var(--foreground);
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .problem-section aside,
  .result aside {
    align-self: end;
    padding-top: 1rem;
    border-top: 1px solid rgb(244 234 220 / 0.2);
  }

  blockquote {
    max-width: 34ch;
    margin-top: 1.5rem;
    color: var(--accent);
    font-family: var(--font-serif);
    font-size: clamp(1.1rem, 1.5vw, 1.35rem);
    line-height: 1.5;
  }

  .alternatives > header,
  .behavior > header {
    margin-bottom: clamp(1.75rem, 4vw, 3rem);
  }

  .option-grid,
  .choice-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .option-grid article {
    min-width: 0;
    padding: clamp(1.25rem, 3vw, 2rem);
    border: 1px solid rgb(244 234 220 / 0.16);
  }

  .option-grid article + article {
    border-left: 0;
  }

  .option-grid h3 {
    margin-top: 0.8rem;
    font-size: clamp(1.15rem, 1.6vw, 1.4rem);
  }

  .choice-grid {
    gap: clamp(1.5rem, 5vw, 5rem);
    padding-top: clamp(1.75rem, 4vw, 3rem);
  }

  .choice-grid > div:first-child {
    padding-left: 1rem;
    border-left: 2px solid var(--accent);
  }

  .behavior-table {
    border-top: 1px solid rgb(244 234 220 / 0.16);
  }

  .behavior-row {
    display: grid;
    grid-template-columns: minmax(7rem, 0.32fr) repeat(2, minmax(0, 1fr));
    gap: clamp(1rem, 3vw, 2.5rem);
    align-items: start;
    padding-block: 1rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .behavior-row strong,
  .behavior-row span {
    color: var(--accent);
    font-size: var(--text-label);
    font-weight: 650;
  }

  .behavior-row p {
    color: rgb(244 234 220 / 0.74);
    font-size: 0.96rem;
    line-height: 1.5;
  }

  .behavior-head span {
    color: rgb(244 234 220 / 0.58);
  }

  .case-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: clamp(2rem, 4vw, 4rem);
  }

  .case-footer button,
  .case-footer a {
    display: inline-flex;
    min-height: 2.85rem;
    align-items: center;
    border: 0;
    background: transparent;
    padding: 0;
    color: rgb(244 234 220 / 0.7);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition:
      color var(--interaction-duration) var(--interaction-ease),
      transform var(--interaction-duration) var(--interaction-ease);
  }

  .case-footer a {
    gap: 0.75rem;
  }

  .case-footer a span {
    color: var(--foreground);
    font-size: 1rem;
    font-weight: 700;
  }

  .case-footer button:hover,
  .case-footer a:hover {
    color: var(--accent);
    transform: translateY(-1px);
  }

  @media (max-width: 900px) {
    .camera-examples { width: 100%; }
    .case-hero.has-media,
    .problem-section,
    .result {
      grid-template-columns: 1fr;
    }

    .artifact {
      aspect-ratio: 16 / 9;
    }
  }

  @media (max-width: 700px) {
    .case-study {
      padding-top: 5.75rem;
    }

    h1 {
      font-size: var(--text-page);
    }

    .facts,
    .option-grid,
    .choice-grid {
      grid-template-columns: 1fr;
    }

    .facts div {
      border-right: 0;
      border-bottom: 1px solid rgb(244 234 220 / 0.16);
    }

    .facts div:last-child {
      border-bottom: 0;
    }

    .option-grid article + article {
      border-top: 0;
      border-left: 1px solid rgb(244 234 220 / 0.16);
    }

    .behavior-head {
      display: none;
    }

    .behavior-row {
      grid-template-columns: 1fr;
      gap: 0.4rem;
    }

    .behavior-row p::before {
      display: block;
      margin-bottom: 0.2rem;
      color: rgb(244 234 220 / 0.52);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .behavior-row p:nth-child(2)::before {
      content: 'Before';
    }

    .behavior-row p:nth-child(3)::before {
      content: 'After';
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .back-link,
    .case-footer button,
    .case-footer a {
      transition: none;
    }

    .back-link:hover,
    .case-footer button:hover,
    .case-footer a:hover {
      transform: none;
    }
  }
</style>
