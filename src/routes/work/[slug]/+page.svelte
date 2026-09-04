<script lang="ts">
  import EvidenceStatus from '$lib/components/case-study/EvidenceStatus.svelte';
  import SystemComparison from '$lib/components/case-study/SystemComparison.svelte';
  import ProjectLinks from '$lib/components/case-study/ProjectLinks.svelte';
  import MiguelLLMDrawer from '$lib/components/miguel-llm/MiguelLLMDrawer.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import ResponsivePicture from '$lib/components/media/ResponsivePicture.svelte';
  import { getApprovedMedia } from '$lib/content/project-media';
  import type { MiguelLLMMode } from '$lib/miguel-llm/types';
  import type { PageData } from './$types';

  export let data: PageData;

  let drawerOpen = false;
  let drawerMode: MiguelLLMMode = 'engineer';

  $: projectMedia =
    data.study.slug === 'ghostwriter' ? getApprovedMedia('ghostwriter-home') : undefined;

  const askAboutProject = () => {
    drawerOpen = true;
  };
</script>

<svelte:head>
  <title>{data.study.title} / Miguel Almeida Case Study</title>
  <meta name="description" content={`${data.study.title}: ${data.study.thesis}`} />
</svelte:head>

<SiteHeader />

<main class="case-study page-gutter">
  <header class:has-media={Boolean(projectMedia)} class="case-hero">
    <div class="case-copy">
      <a class="back-link" href="/#work">← Selected work</a>
      <p>{data.study.type}</p>
      <h1>{data.study.title}</h1>
      <h2>{data.study.thesis}</h2>
      <div class="opening">
        <p>{data.study.problem}</p>
        <p class="status">{data.study.status}</p>
        <ProjectLinks links={data.study.links} />
      </div>
    </div>

    {#if projectMedia}
      <figure class="case-media">
        <ResponsivePicture
          fallbackSrc={projectMedia.src}
          alt={projectMedia.alt}
          width={projectMedia.responsive?.width ?? 1440}
          height={projectMedia.responsive?.height ?? 900}
          avifSrcset={projectMedia.responsive?.avifSrcset}
          webpSrcset={projectMedia.responsive?.webpSrcset}
          sizes={projectMedia.responsive?.sizes ?? '100vw'}
          loading="eager"
          fetchpriority="high"
          layout="intrinsic"
          objectPosition="center top"
        />
        <figcaption>Current product surface · reliability story follows below</figcaption>
      </figure>
    {/if}
  </header>

  <section class="facts" aria-label="Project facts">
    <div><span>Role</span><strong>{data.study.role}</strong></div>
    <div><span>Context</span><strong>{data.study.timeline}</strong></div>
    <div><span>Stack</span><strong>{data.study.stack}</strong></div>
  </section>

  <section class="argument" aria-labelledby="ownership-title">
    <p>Ownership</p>
    <div>
      <h2 id="ownership-title">What I built and why it mattered</h2>
      <p>{data.study.contribution}</p>
      <blockquote>{data.study.technicalSignal}</blockquote>
    </div>
  </section>

  {#if data.study.slug === 'atlas'}
    <section class="case-interaction" aria-labelledby="atlas-interaction-title">
      <header>
        <p>Interactive boundary</p>
        <h2 id="atlas-interaction-title">The model explains a risk it did not invent.</h2>
      </header>
      <SystemComparison
        label="Atlas deterministic and model boundary"
        left={{
          id: 'computed',
          label: 'Computed',
          status: 'Deterministic system',
          title: 'Risk exists before model language.',
          description:
            'Workspace, repository, and ingestion-run context produce the finding and its evidence.',
          points: ['Scoped request context', 'Deterministic rule', 'Evidence location', 'Audit record']
        }}
        right={{
          id: 'explained',
          label: 'Explained',
          status: 'Model-assisted layer',
          title: 'Explanation remains inspectable.',
          description:
            'Retrieval supplies established evidence. The model translates it, while the user can return to the source.',
          points: ['Retrieved finding', 'Model explanation', 'Evidence link', 'Human verification']
        }}
      />
    </section>
  {:else if data.study.slug === 'ghostwriter'}
    <section class="case-interaction" aria-labelledby="ghostwriter-interaction-title">
      <header>
        <p>Reliability sequence</p>
        <h2 id="ghostwriter-interaction-title">A client transition was not a successful registration.</h2>
      </header>
      <SystemComparison
        label="Ghostwriter registration reliability comparison"
        left={{
          id: 'failure',
          label: 'Failure',
          status: 'Incomplete success boundary',
          title: 'The interface moved before the database was ready.',
          description:
            'Registration looked complete while the required database state was absent after migration drift.',
          points: ['Submit request', 'Client transition', 'Missing database state', 'Later failure']
        }}
        right={{
          id: 'recovery',
          label: 'Recovery',
          status: 'Verified consistency boundary',
          title: 'Success now waits for the product contract.',
          description:
            'Consistency checks, migration drift guards, and session-family tests move recovery into the product.',
          points: ['Submit request', 'Verify database state', 'Create session family', 'Render success']
        }}
      />
    </section>
  {/if}

  <section class="sequence" aria-labelledby="sequence-title">
    <header>
      <p>System flow</p>
      <h2 id="sequence-title">The working sequence</h2>
    </header>
    <ol>
      {#each data.study.keyFlows as flow, index}
        <li><span>{String(index + 1).padStart(2, '0')}</span>{flow}</li>
      {/each}
    </ol>
  </section>

  <section class="decisions" aria-labelledby="decisions-title">
    <header>
      <p>Technical judgment</p>
      <h2 id="decisions-title">Decisions that define the architecture</h2>
    </header>
    <div>
      {#each data.study.technicalDecisions as decision, index}
        <article>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <p>{decision}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="evidence" aria-labelledby="evidence-title">
    <header>
      <p>Evidence ledger</p>
      <h2 id="evidence-title">Claims with their boundaries attached</h2>
    </header>
    <div>
      {#each data.study.evidence as item}
        <article id={item.id}>
          <EvidenceStatus status={item.status} />
          <h3>{item.title}</h3>
          <p>{item.claim}</p>
          {#if item.qualification}<small>{item.qualification}</small>{/if}
          {#if item.source}<cite>{item.source}</cite>{/if}
        </article>
      {/each}
    </div>
  </section>

  <section class="limitations" aria-labelledby="limitations-title">
    <p>Current limits</p>
    <div>
      <h2 id="limitations-title">What this work does not establish</h2>
      <ul>
        {#each data.study.limitations as limitation}
          <li>{limitation}</li>
        {/each}
      </ul>
    </div>
  </section>

  <section class="case-llm" aria-labelledby="case-llm-title">
    <div>
      <p>Need a shorter path?</p>
      <h2 id="case-llm-title">Ask MiguelLLM for the engineering version.</h2>
    </div>
    <button type="button" on:click={askAboutProject}>Ask about {data.study.title}</button>
  </section>
</main>

<MiguelLLMDrawer bind:open={drawerOpen} bind:mode={drawerMode} />

<style>
  .case-study {
    min-height: 100svh;
    padding-block: clamp(5.5rem, 8vw, 7rem) 4rem;
    background: #050505;
    color: var(--foreground);
  }

  .case-hero,
  .facts,
  .argument,
  .case-interaction,
  .sequence,
  .decisions,
  .evidence,
  .limitations,
  .case-llm {
    width: min(100%, 92rem);
    margin-inline: auto;
  }

  .case-hero {
    display: grid;
    align-items: end;
  }

  .case-hero.has-media {
    grid-template-columns: minmax(0, 0.8fr) minmax(28rem, 1.2fr);
    gap: clamp(2rem, 5vw, 6rem);
  }

  .case-copy {
    min-width: 0;
  }

  .back-link {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    margin-bottom: clamp(2rem, 5vw, 4rem);
    color: rgb(244 234 220 / 0.56);
    font-size: 0.9rem;
  }

  .case-copy > p,
  .argument > p,
  .case-interaction header p,
  .sequence header p,
  .decisions header p,
  .evidence header p,
  .limitations > p,
  .case-llm p,
  .facts span {
    margin: 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 780;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3,
  p,
  blockquote {
    margin: 0;
  }

  h1 {
    margin-top: 0.8rem;
    font-size: clamp(2.35rem, 3.6vw, 3.5rem);
    font-weight: 740;
    line-height: 0.98;
  }

  .case-hero.has-media h1 {
    font-size: clamp(2.25rem, 3.2vw, 3.2rem);
    letter-spacing: -0.03em;
  }

  .case-copy > h2 {
    max-width: 70rem;
    margin-top: 1.3rem;
    color: var(--accent);
    font-size: clamp(1.15rem, 1.6vw, 1.55rem);
    font-weight: 650;
    line-height: 1.2;
    text-wrap: balance;
  }

  .case-media {
    position: relative;
    min-height: 28rem;
    margin: 0;
    overflow: hidden;
    background: #0a0a0a;
  }

  .case-media::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgb(0 0 0 / 0.88));
    content: '';
  }

  .case-media :global(img) {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center top;
    filter: saturate(0.9) brightness(0.86);
  }

  .case-media figcaption {
    position: absolute;
    inset: auto 1rem 1rem;
    z-index: 2;
    color: rgb(244 234 220 / 0.64);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .opening {
    display: grid;
    max-width: 50rem;
    gap: 1.1rem;
    margin-top: 1.7rem;
    color: rgb(244 234 220 / 0.7);
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .opening .status {
    padding-left: 1rem;
    border-left: 2px solid var(--accent);
    font-size: 0.94rem;
  }

  .facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: clamp(2.5rem, 4vw, 4rem);
    border-block: 1px solid rgb(244 234 220 / 0.16);
  }

  .facts div {
    display: grid;
    gap: 0.65rem;
    padding: 1rem;
    border-right: 1px solid rgb(244 234 220 / 0.16);
  }

  .facts div:last-child {
    border-right: 0;
  }

  .facts strong {
    color: rgb(244 234 220 / 0.72);
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .argument,
  .limitations {
    display: grid;
    grid-template-columns: minmax(10rem, 0.3fr) minmax(0, 1fr);
    gap: clamp(1.5rem, 5vw, 6rem);
    padding-block: clamp(3.25rem, 5vw, 5.5rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .argument h2,
  .case-interaction h2,
  .sequence h2,
  .decisions h2,
  .evidence h2,
  .limitations h2,
  .case-llm h2 {
    max-width: 55rem;
    font-size: clamp(1.65rem, 2.5vw, 2.55rem);
    font-weight: 700;
    line-height: 1.08;
  }

  .argument div > p {
    max-width: 49rem;
    margin-top: 1.4rem;
    color: rgb(244 234 220 / 0.68);
    font-size: 1.08rem;
    line-height: 1.62;
  }

  blockquote {
    margin-top: 1.75rem;
    color: var(--accent);
    font-size: clamp(1.1rem, 1.7vw, 1.55rem);
    font-weight: 680;
    line-height: 1.3;
  }

  .sequence,
  .case-interaction,
  .decisions,
  .evidence {
    padding-block: clamp(3.25rem, 5vw, 5.5rem);
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
  }

  .sequence header,
  .case-interaction > header,
  .decisions header,
  .evidence header {
    display: grid;
    grid-template-columns: minmax(10rem, 0.3fr) minmax(0, 1fr);
    gap: clamp(1.5rem, 5vw, 6rem);
    margin-bottom: 2rem;
  }

  .case-interaction > :global(.system-comparison) {
    margin-top: 2rem;
  }

  .sequence ol {
    display: grid;
    margin: 0;
    padding: 0;
    border-top: 1px solid rgb(244 234 220 / 0.16);
    list-style: none;
  }

  .sequence li {
    display: grid;
    grid-template-columns: 4rem minmax(0, 1fr);
    gap: 1rem;
    padding-block: 1rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
    color: rgb(244 234 220 / 0.78);
    font-size: 1rem;
  }

  .sequence li span,
  .decisions article > span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
  }

  .decisions > div,
  .evidence > div {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1px;
    padding: 1px;
    background: rgb(244 234 220 / 0.14);
  }

  .decisions article,
  .evidence article {
    min-width: 0;
    background: #080808;
    padding: clamp(1rem, 2.5vw, 2rem);
  }

  .decisions article p {
    margin-top: 1.3rem;
    color: rgb(244 234 220 / 0.72);
    font-size: 1rem;
    line-height: 1.55;
  }

  .evidence h3 {
    margin-top: 1rem;
    font-size: clamp(1.25rem, 2.2vw, 1.9rem);
    line-height: 1.08;
  }

  .evidence article p {
    margin-top: 0.75rem;
    color: rgb(244 234 220 / 0.67);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .evidence small,
  .evidence cite {
    display: block;
    margin-top: 0.8rem;
    color: rgb(244 234 220 / 0.46);
    font-size: 0.8rem;
    font-style: normal;
    line-height: 1.45;
  }

  .limitations ul {
    display: grid;
    gap: 0.8rem;
    margin: 1.4rem 0 0;
    padding-left: 1.2rem;
    color: rgb(244 234 220 / 0.66);
    font-size: 1rem;
    line-height: 1.55;
  }

  .case-llm {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 2rem;
    padding-top: 4rem;
  }

  .case-llm h2 {
    max-width: 43rem;
    margin-top: 0.7rem;
    font-size: clamp(1.45rem, 2.2vw, 2.2rem);
  }

  button {
    min-height: 3rem;
    border: 1px solid rgb(244 234 220 / 0.3);
    border-radius: 999px;
    background: var(--foreground);
    padding: 0.75rem 1rem;
    color: var(--background);
    cursor: pointer;
    font-size: 0.86rem;
    font-weight: 820;
  }

  button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }

  @media (max-width: 1080px) {
    .case-hero.has-media {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .case-study {
      padding-top: 5.75rem;
    }

    .case-media {
      min-height: 26rem;
    }

    .facts,
    .argument,
    .limitations,
    .case-interaction > header,
    .sequence header,
    .decisions header,
    .evidence header {
      grid-template-columns: 1fr;
    }

    .facts div {
      border-right: 0;
      border-bottom: 1px solid rgb(244 234 220 / 0.16);
    }

    .facts div:last-child {
      border-bottom: 0;
    }

    .decisions > div,
    .evidence > div {
      grid-template-columns: 1fr;
    }

    .case-llm {
      display: grid;
      align-items: start;
    }

    button {
      width: 100%;
    }
  }
</style>
