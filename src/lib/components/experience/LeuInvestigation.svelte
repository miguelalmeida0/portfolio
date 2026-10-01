<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { pipeline, incidents, evidenceLayers, leuSources } from '$lib/content/leu-investigation';
  import LeuProductFilm from './LeuProductFilm.svelte';
  import LinkButton from './LinkButton.svelte';
  const sections = [
    ['pipeline', 'The dependency chain'], ['architecture', 'Architecture evolution'],
    ['failure-log', 'Investigations'], ['benchmark', 'Benchmark discipline'],
    ['evidence-boundaries', 'What the evidence proves'], ['product-trace', 'The native product']
  ];
  const versions = [
    { name: 'Early pipeline', path: ['PDF text', 'Heuristics', 'Question'], note: 'Raw extraction and local context carried too much authority.' },
    { name: 'V36', path: ['PDF', 'Semantic / vector logic', 'Judge'], note: 'Fewer harmful writes; weak-reasoning detection still 0/16 on the sealed set.' },
    { name: 'V37', path: ['Canonical source', 'Structured model read', 'Deterministic checks', 'Existing judge', 'Learner model'], note: 'Interpretation is a proposal. The judge still owns the state decision.' }
  ];
</script>

<div class="leu-investigation">
  <header class="investigation-hero">
    <div>
      <p class="eyebrow">Leu · Independent native project · 2026</p>
      <h1 data-ask-id="project-leu">Leu: from PDF text<br />to learner state.</h1>
      <p class="lead">I built Leu as a native PDF reading and learning app. The hard part became preserving one trustworthy chain from document text to the decisions stored about a learner.</p>
      <p class="ownership">My work spans product design, SwiftUI/PDFKit integration, source reconstruction, learning logic, model evaluation and native verification.</p>
      <p class="stack">Swift · SwiftUI · PDFKit · Persistence · Apple Foundation Models experiments</p>
      <div class="hero-actions"><LinkButton href="#failure-log" label="Read the investigations" /><LinkButton href="https://github.com/miguelalmeida0/leu" label="View source" external secondary /></div>
    </div>
    <aside class="premise" aria-label="Project status and central engineering decision">
      <p class="eyebrow">An end-to-end product under development</p>
      <h2>A model may interpret an answer.<br />It does not own learner state.</h2>
      <p>A bad explanation affects one interaction. False mastery persists and can change what the learner studies next.</p>
      <p class="status">No public launch, App Store release or validation with real users is claimed. The results below separate development measurements from unfinished native and device gates.</p>
    </aside>
  </header>

  <section id="pipeline" aria-labelledby="pipeline-heading" class="pipeline-section">
    <h2 id="pipeline-heading">One source, seven places to lose trust.</h2>
    <p class="section-intro">Corruption did not stay in the extractor. Every later stage could look internally consistent while reasoning about the wrong text.</p>
    <ol class="pipeline">
      {#each pipeline as step}<li><h3>{step.name}</h3><p>{step.detail}</p></li>{/each}
    </ol>
    <p class="pipeline-note">Learner memory feeds future study decisions. A mistake written here survives the answer that caused it.</p>
  </section>

  <div class="reading-layout">
    <nav class="contents" aria-label="Leu engineering case study">
      {#each sections as [id, label]}<a href={'#' + id} {...destinationLink('#' + id)}>{label}</a>{/each}
    </nav>
    <div class="reading-body">
      <section id="architecture" aria-labelledby="architecture-heading">
        <p class="eyebrow">Architecture evolution</p>
        <h2 id="architecture-heading">Change who is allowed to decide.</h2>
        <p>V36’s sealed evaluation ended the assumption that more matching rules would eventually become reasoning. V37 kept the existing judge and changed what fed it: structured model observations, checked before they could influence learning credit.</p>
        <div class="versions">
          {#each versions as version}
            <div class="version">
              <h3>{version.name}</h3>
              <ol aria-label={version.name + ' processing order'}>{#each version.path as step}<li>{step}</li>{/each}</ol>
              <p>{version.note}</p>
            </div>
          {/each}
        </div>
        <p class="callout">The model reads. Code checks. The judge decides. Checks may downgrade, ask or reject; they cannot manufacture mastery.</p>
      </section>

      <section id="decision-metrics" aria-labelledby="metrics-heading">
        <p class="eyebrow">Numbers that changed decisions</p>
        <h2 id="metrics-heading">The failed result mattered as much as the gain.</h2>
        <div class="metric-pair">
          <div><p class="metric">25.90 s → 2.03 s</p><h3>Intelligence generation</h3><p>Recorded V28.1 measurement after separating incremental and persisted work.</p></div>
          <div><p class="metric">10.34 s → 64 ms</p><h3>Reopen p50</h3><p>Previously processed material. This measures reuse, not a cold model request.</p></div>
        </div>
        <div class="failed-result"><p class="metric">52% → 51%</p><div><h3>The result that ended the vector-only direction</h3><p>V35 → V36 coarse accuracy on the same sealed 160-case set. Weak reasoning: 0/16 in both versions.</p><a href={leuSources.plateau.href} {...destinationLink(leuSources.plateau.href)}>Read the V36 evaluation</a></div></div>
        <h3 class="subheading">V37 dev14 · three fresh Mac runs · 80 development answers</h3>
        <dl class="dev-metrics">
          <div><dt>Coarse accuracy</dt><dd>75%</dd></div><div><dt>Commit accuracy</dt><dd>91.4%</dd></div>
          <div><dt>False mastery</dt><dd>2/58</dd></div><div><dt>Harmful writes</dt><dd>3/80</dd></div>
        </dl>
        <p class="caption">Each run produced these values. Commit accuracy measures correctness among committed decisions. The 58-case denominator covers answers that should not receive mastery; harmful writes use all 80 answers. These are development results, not blind-holdout or customer outcomes.</p>
        <p><a href={leuSources.development.href} {...destinationLink(leuSources.development.href)}>Read the Mac development report</a></p>
      </section>

      <section id="failure-log" aria-label="Engineering investigations">
        {#each incidents as incident}
          <section id={incident.id} class="incident" aria-labelledby={incident.id + '-heading'}>
            <h3 data-ask-id={`project-leu-incident-${incident.id}`} id={incident.id + '-heading'}>{incident.title}</h3>
            <dl class="investigation-record">
              <div><dt>Observed</dt><dd>{incident.observed}</dd></div>
              <div><dt>Cause</dt><dd>{incident.cause}</dd></div>
              <div><dt>Change</dt><dd>{incident.change}</dd></div>
              <div class="result"><dt>Result</dt><dd>{incident.result}</dd></div>
              <div><dt>Tradeoff</dt><dd>{incident.tradeoff}</dd></div>
            </dl>
            {#if incident.id === 'source-integrity'}
              <div class="migration" aria-label="Data ownership through a source migration">
                <div><h4>Source</h4><p>Version extraction; preserve document and passage identity.</p></div>
                <div><h4>Regeneratable derived data</h4><p>Invalidate questions, claims, concepts and semantic caches.</p></div>
                <div><h4>Learner state & history</h4><p>Preserve attempts, confidence, review state, sessions and authored material.</p></div>
              </div>
              <p class="callout">AI quality starts before the model.</p>
            {:else if incident.id === 'question-quality'}
              <p class="callout">Grounded is not the same as good. A citation establishes a source; it does not establish a useful teaching question.</p>
            {/if}
            {#if incident.evidence}<a class="evidence-link" href={incident.evidence.href} {...destinationLink(incident.evidence.href)}>{incident.evidence.label}</a>{/if}
          </section>
        {/each}
      </section>

      <section id="benchmark" aria-labelledby="benchmark-heading">
        <p class="eyebrow">Benchmark discipline</p>
        <h2 id="benchmark-heading">Freeze the candidate before opening the test.</h2>
        <p>Known examples can turn an evaluation into a development loop. When the original holdout’s passphrase and details became exposed, it was retired. Its replacement, NH, contained 240 cases: six author profiles, Q–V, with 40 cases each, covering 36 targets across seven documents.</p>
        <p>These were authored evaluation cases, not real learner submissions. Profiles covered non-native English, rushed typing, confident wrong answers, analogies and reasoning aloud. The cases tested negation, quantifiers, causal and role reversal, terse answers, and long answers with one false clause.</p>
        <div class="reasoning-example"><h3>A correct conclusion can carry an incorrect reason.</h3><p>The benchmark separated what the learner concluded from why they believed it. Right conclusion / wrong reason and wrong conclusion / plausible reason were explicit cases. Novel vocabulary tested whether meaning could survive without matching the PDF’s words.</p></div>
        <ol class="protocol">
          <li><strong>Seal the evaluation.</strong> Encrypt the holdout, keep its passphrase outside the repository, and destroy plaintext after sealing.</li>
          <li><strong>Freeze the architecture.</strong> Record the candidate and hashes before the blind run. The development loop uses open sets.</li>
          <li><strong>Score without tuning.</strong> Run the frozen candidate against the holdout. Seeing a failed gate is not permission to adjust the candidate and reuse the same blind claim.</li>
        </ol>
        <p class="caption">Author and second-labeller agents shared a model family. Agreement measured consistency under the labelling guide, not independent human judgement. This page makes no claim that the NH holdout passed.</p>
        <a href={leuSources.holdout.href} {...destinationLink(leuSources.holdout.href)}>Read the frozen-evaluation protocol</a>
        <details><summary>What the development headline leaves out</summary><div class="detail-body">
          <p>Paraphrase accuracy was 72%, novel vocabulary 67.9%, weak-reasoning recall 55% and mean precision about 63.5%. Five canonical source checks passed in each fresh run.</p>
          <p>Semantic signatures matched on 78/80 answers (97.5%) across the reported three runs. But only 16 of 35 three-run windows in seven re-scored runs reached 97.5%. Secondary-claim selection remained nondeterministic.</p>
          <p>Mac warm p50 was about 4.2 seconds and p95 6.9 seconds under the reported conditions. Earlier runs under Apple Intelligence background load were substantially slower. Physical-iPhone latency remained an open gate.</p>
        </div></details>
      </section>

      <section id="evidence-boundaries" aria-labelledby="boundaries-heading">
        <p class="eyebrow">Evidence boundaries</p>
        <h2 id="boundaries-heading">“Green” needs a named layer.</h2>
        <p>A portable test, an installed binary, a model evaluation and a listening session answer different questions. Leu needed all of them; none could stand in for the others.</p>
        <dl class="evidence-layers">{#each evidenceLayers as [layer, status, detail]}<div><dt>{layer}<span>{status}</span></dt><dd>{detail}</dd></div>{/each}</dl>
        <details><summary>Voice: synthesis succeeded before the product sounded right</summary><div class="detail-body">
          <p>Compact Apple voices could produce technically valid but robotic narration. Supertonic and Kokoro experiments introduced runtime and reuse costs of their own. Recreating speech runtime state for every utterance was unnecessary work; runtime reuse needed explicit lifecycle and memory handling.</p>
          <p>A generated waveform, a passing synthesis test or a Simulator recording cannot settle listening quality. Blind listening on actual hardware remains the quality gate. Voice is not presented as solved.</p>
        </div></details>
        <details><summary>Native state, automation state and design state could diverge</summary><div class="detail-body">
          <p>Reader integration crossed Read and Original modes, fit-page scaling, horizontal and vertical navigation, gesture interception and PDFKit position. A correct state model did not guarantee that a swipe reached the PDF view.</p>
          <p>Identifiers such as <code>reader-page-count</code>, <code>teach-leu-result</code> and <code>session-summary-done</code> became stable automation contracts. A harness looking for yesterday’s control or the previous screen could fail while the app had already transitioned correctly.</p>
          <p>The same distinction applied to design. Preparing the Simulator film revealed that the native repository still built the old Night Field interface while the approved Kinetic Paper direction existed only in handoff material. A separate native implementation branch was required. A successful build had proved the wrong visual generation.</p>
        </div></details>
      </section>

      <section id="product-trace" aria-labelledby="product-heading">
        <p class="eyebrow">The native product</p>
        <h2 id="product-heading">The interface is where these contracts meet.</h2>
        <p>Select a passage, work through a learning activity, explain it back and return to the source. The product recording shows that interaction context; it does not certify a particular V37 model build, physical-device performance or listening quality.</p>
        <div class="product-film"><LeuProductFilm compact /></div>
        <p class="closing">The result is an end-to-end native project with a more explicit account of what it knows—and what its tests have actually established. Hardware validation, blind evaluation and human listening remain separate from the development results shown here.</p>
      </section>
    </div>
  </div>
</div>

<style>
  .leu-investigation { font-family: var(--font-sans); color: var(--color-ink); }
  section { scroll-margin-top: 100px; }
  p { line-height: 1.65; }
  h1, h2, h3, h4 { text-wrap: balance; }
  h1 { font-size: clamp(2.3rem, 3.4vw, 3.7rem); font-weight: 700; letter-spacing: -.04em; line-height: 1.08; max-width: 21ch; }
  h2 { font-size: clamp(1.65rem, 2.4vw, 2.5rem); font-weight: 650; letter-spacing: -.035em; line-height: 1.16; }
  h3 { font-weight: 650; }
  a:not(:global(.action-button)) { text-decoration: underline; text-underline-offset: 4px; }
  a:hover { color: var(--color-plum); }
  a:focus-visible, summary:focus-visible { outline: 2px solid var(--color-plum); outline-offset: 5px; }
  .eyebrow { font-size: 14px; color: var(--color-plum); font-weight: 600; margin-bottom: 16px; }
  .investigation-hero { display: grid; grid-template-columns: minmax(0,1.6fr) minmax(0,1fr); gap: 64px; align-items: end; padding: 48px 0 64px; }
  .lead { margin-top: 24px; font-size: 21px; max-width: 56ch; }
  .ownership { margin-top: 20px; max-width: 62ch; }
  .stack { font-size: 14px; margin-top: 18px; color: var(--color-muted); }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .premise { padding: 30px; border-radius: 16px; background: var(--color-sage); }
  .premise h2 { font-size: clamp(1.5rem, 2vw, 2rem); }
  .premise p:not(.eyebrow) { margin-top: 18px; }
  .status { border-top: 1px solid var(--color-rule); padding-top: 18px; font-size: 14px; }
  .pipeline-section { border-block: 1px solid var(--color-rule); padding-block: 40px; }
  .section-intro { max-width: 72ch; margin-top: 16px; }
  .pipeline { display: grid; grid-template-columns: repeat(7,minmax(0,1fr)); list-style: none; gap: 0; margin-top: 32px; }
  .pipeline li { padding: 16px 16px 16px 0; border-top: 3px solid var(--color-plum); position: relative; }
  .pipeline li + li { padding-left: 16px; border-left: 1px solid var(--color-rule); }
  .pipeline h3 { font-size: 16px; }
  .pipeline p { font-size: 14px; margin-top: 8px; color: var(--color-muted); }
  .pipeline-note { margin-top: 16px; font-size: 14px; color: var(--color-plum); }
  .reading-layout { display: grid; grid-template-columns: minmax(180px,.65fr) minmax(0,2fr); gap: 72px; padding-top: 56px; }
  .contents { position: sticky; top: 100px; align-self: start; display: flex; flex-direction: column; gap: 0; font-size: 14px; }
  .contents a { padding: 12px 0; border-bottom: 1px solid var(--color-rule); text-decoration: none; }
  .reading-body { max-width: 900px; min-width: 0; }
  .reading-body > section { padding-bottom: 56px; margin-bottom: 48px; border-bottom: 1px solid var(--color-rule); }
  .reading-body > section > p:not(.eyebrow) { margin-top: 20px; max-width: 76ch; }
  .versions { margin-top: 28px; }
  .version { padding: 22px 0; border-top: 1px solid var(--color-rule); }
  .version h3 { color: var(--color-plum); font-size: 17px; }
  .version ol { display: flex; flex-wrap: wrap; gap: 8px 0; margin-top: 12px; list-style: none; font-weight: 600; }
  .version li:not(:last-child)::after { content: '→'; padding-inline: 12px; color: var(--color-muted); }
  .version p { font-size: 14px; margin-top: 10px; color: var(--color-muted); }
  .callout { border-left: 3px solid var(--color-plum); padding-left: 20px; font-size: 20px; font-weight: 550; margin-top: 24px; }
  .metric-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: 32px 0; }
  .metric { font-size: clamp(1.65rem, 2.8vw, 2.6rem); line-height: 1.15; font-weight: 650; letter-spacing: -.04em; color: var(--color-plum); font-variant-numeric: tabular-nums; }
  .metric-pair h3 { margin: 10px 0 6px; }
  .metric-pair p:not(.metric), .failed-result p:not(.metric) { font-size: 14px; }
  .failed-result { background: var(--color-sage); padding: 24px; display: grid; grid-template-columns: auto 1fr; gap: 24px; border-radius: 12px; }
  .failed-result a { display: inline-block; margin-top: 10px; font-size: 14px; }
  .subheading { margin-top: 30px; font-size: 16px; }
  .dev-metrics { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 20px; }
  .dev-metrics div { display: flex; flex-direction: column-reverse; gap: 4px; }
  .dev-metrics dt { font-size: 14px; }
  .dev-metrics dd { font-size: 32px; font-weight: 650; color: var(--color-plum); }
  .caption { font-size: 14px; color: var(--color-muted); }
  .incident { border-top: 1px solid var(--color-rule); padding-top: 36px; margin-top: 40px; }
  .incident > h3 { font-size: clamp(1.5rem, 2vw, 2rem); line-height: 1.2; letter-spacing: -.025em; margin-bottom: 24px; }
  .investigation-record > div { display: grid; grid-template-columns: 76px minmax(0,1fr); gap: 20px; padding-block: 12px; }
  .investigation-record dt { font-size: 14px; font-weight: 600; color: var(--color-plum); padding-top: 3px; }
  .investigation-record dd { line-height: 1.7; }
  .investigation-record .result { border-block: 1px solid var(--color-rule); margin-block: 6px; padding-block: 18px; }
  .evidence-link { display: inline-block; font-size: 14px; margin-top: 20px; }
  .migration { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); margin-top: 28px; background: var(--color-sage); border-radius: 12px; padding: 24px; gap: 20px; }
  .migration h4 { font-weight: 650; line-height: 1.3; }
  .migration p { font-size: 14px; margin-top: 8px; }
  .reasoning-example { border-left: 3px solid var(--color-plum); padding-left: 20px; margin-top: 24px; }
  .reasoning-example p { margin-top: 10px; }
  .protocol { list-style: decimal; padding-left: 22px; margin-top: 24px; }
  .protocol li { padding: 0 0 14px 8px; line-height: 1.65; }
  details { border-block: 1px solid var(--color-rule); margin-top: 24px; }
  summary { padding: 20px 4px; cursor: pointer; font-weight: 600; }
  .detail-body { padding: 0 4px 20px; }
  .detail-body p + p { margin-top: 16px; }
  code { font-size: .9em; overflow-wrap: anywhere; }
  .evidence-layers { margin-top: 28px; }
  .evidence-layers > div { display: grid; grid-template-columns: 190px minmax(0,1fr); gap: 24px; border-top: 1px solid var(--color-rule); padding: 18px 0; }
  .evidence-layers dt { font-weight: 600; }
  .evidence-layers dt span { display: block; font-size: 13px; font-weight: 400; margin-top: 6px; color: var(--color-plum); }
  .evidence-layers dd { font-size: 15px; line-height: 1.6; }
  .product-film { max-width: 660px; margin: 28px auto; }
  .closing { font-size: 20px; }
  @media (max-width: 1099px) {
    .investigation-hero { gap: 28px; grid-template-columns: 1.3fr 1fr; }
    .pipeline { grid-template-columns: repeat(4,minmax(0,1fr)); row-gap: 20px; }
    .reading-layout { gap: 32px; grid-template-columns: 170px minmax(0,1fr); }
    .failed-result { grid-template-columns: 1fr; gap: 12px; }
  }
  @media (max-width: 767px) {
    section { scroll-margin-top: 80px; }
    .investigation-hero { grid-template-columns: 1fr; padding-block: 28px 36px; }
    h1 { font-size: clamp(2.2rem, 7vw, 3.2rem); }
    .lead { font-size: 18px; }
    .premise { padding: 24px; }
    .pipeline { grid-template-columns: 1fr; margin-top: 24px; gap: 0; }
    .pipeline li, .pipeline li + li { padding: 14px 0 14px 20px; border-top: 0; border-left: 3px solid var(--color-plum); }
    .pipeline p { margin-top: 4px; }
    .reading-layout { display: block; padding-top: 28px; }
    .contents { position: static; margin-bottom: 36px; }
    .reading-body > section { padding-bottom: 36px; margin-bottom: 36px; }
    .metric-pair { grid-template-columns: 1fr; gap: 24px; }
    .metric { font-size: 32px; }
    .dev-metrics { grid-template-columns: 1fr 1fr; row-gap: 20px; }
    .investigation-record > div { grid-template-columns: 1fr; gap: 6px; }
    .migration { grid-template-columns: 1fr; }
    .migration > div + div { border-top: 1px solid var(--color-rule); padding-top: 18px; }
    .evidence-layers > div { grid-template-columns: 1fr; gap: 10px; }
  }
</style>
