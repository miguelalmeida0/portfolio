<script lang="ts">
  import { onMount } from 'svelte';

  import MiguelLLMDrawer from '$lib/components/miguel-llm/MiguelLLMDrawer.svelte';
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import VideoLoop from '$lib/components/work/VideoLoop.svelte';
  import CameraArchitecture from '$lib/components/case-study/CameraArchitecture.svelte';
  import CameraFeatureGallery from '$lib/components/case-study/CameraFeatureGallery.svelte';
  import ProjectLinks from '$lib/components/case-study/ProjectLinks.svelte';
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
      {#if data.study.links.length}<ProjectLinks links={data.study.links} />{/if}
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
            srcset={['ghostwriter', 'second-voice-ai', 'mirror-ai'].includes(data.study.slug) ? `/projects/${data.study.slug === 'second-voice-ai' ? 'ghostwriter' : data.study.slug}/interface-720.webp 720w, /projects/${data.study.slug === 'second-voice-ai' ? 'ghostwriter' : data.study.slug}/interface-1600.webp 1600w` : undefined}
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

  {#if ['ghostwriter', 'second-voice-ai'].includes(data.study.slug)}
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
</style>
