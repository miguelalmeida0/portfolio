<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { flowIncidents, flowLedger, flowLessons, flowSources } from '$lib/content/flow-investigation';
  import FlowProductFilm from '$lib/components/experience/FlowProductFilm.svelte';
  import FlowTransactionWalkthrough from '$lib/components/experience/FlowTransactionWalkthrough.svelte';
  import LinkButton from '$lib/components/experience/LinkButton.svelte';
  const pipeline = ['Normalize', 'Interpret', 'Actions / selectors / constraints', 'Resolve references', 'Transform draft', 'Validate invariants', 'Atomic commit', 'Render / persist'];
  const wakeSamples = [48.8, 35.4, 65.7, 51.3, 53.7, 34, 51.2, 22, 31.6, 31];
</script>

<svelte:head>
  <title>Flow — From speech to deterministic state | Miguel Almeida</title>
  <meta name="description" content="An engineering investigation into transactional voice actions: event loss, intent routing, conversational state, wake measurements and the limits of synthetic verification." />
</svelte:head>

<article class="shell portfolio-study flow-study">
  <a href="/#work" class="back-link study-back" {...destinationLink('/#work')}>All work</a>
  <header class="flow-hero">
    <div><h1 data-ask-id="project-flow">Flow</h1><p class="hero-statement">From speech to<br />deterministic state.</p></div>
    <div class="hero-context">
      <p class="lead">Flow started as a voice-controlled calendar. The difficult part was making natural-language actions predictable, reversible and safe across an evolving application.</p>
      <p>I designed and built the product across interaction design, frontend implementation, command interpretation and verification. The work moved from matching phrases to resolving structured operations against a shared domain model.</p>
      <p class="stack">React · TypeScript · Motion · Zod · Playwright</p>
      <div class="actions"><LinkButton href="#architecture" label="Explore the architecture" /><LinkButton href="https://github.com/miguelalmeida0/flow" label="View source" external secondary /></div>
    </div>
  </header>

  <section class="opening" aria-labelledby="opening-title">
    <p class="eyebrow">Where it broke</p>
    <h2 id="opening-title">“Move lunch after standup<br />and protect my workout.”</h2>
    <div class="hidden-work"><p>Which lunch? Which standup?</p><p>Two actions. One relative constraint.</p><p>Can both succeed? Can both be undone?</p></div>
    <p class="opening-note">A sentence is not a button click. It can refer to several objects, depend on previous turns and leave the application in a half-changed state if one operation fails.</p>
  </section>

  <section id="architecture" class="section" aria-labelledby="architecture-title">
    <div class="section-heading"><p class="eyebrow">Architecture evolution</p><h2 id="architecture-title">Interpret first.<br />Earn the right to commit.</h2></div>
    <div class="architecture">
      <div class="before"><h3>Early path</h3><ol><li>Utterance</li><li>Phrase / regex match</li><li>Direct mutation</li></ol><p>Useful against known phrases and seeded events. Ordinary language fell through; compound commands had no reliable transaction boundary.</p></div>
      <div class="after"><h3>Action pipeline</h3><ol>{#each pipeline as step}<li>{step}</li>{/each}</ol><p>Interpretation proposes operations. Resolution identifies their targets. Deterministic checks decide whether a candidate document is safe to return.</p></div>
    </div>
    <p class="boundary">The inspected engine clones the document, applies actions to the draft and validates the result. It returns either a successful document or a clarification, confirmation or conflict. The caller owns the next transition.</p>
    <a class="source-link" href={flowSources.transaction} {...destinationLink(flowSources.transaction)}>Inspect applyLifeTransaction</a>
    <FlowTransactionWalkthrough />
  </section>

  <div id="investigations">
    {#each flowIncidents as incident}
      <section class="incident section" id={incident.id} aria-labelledby={incident.id + '-title'}>
        <div class="incident-heading"><p class="eyebrow">Investigation {incident.number}</p><h2 data-ask-id={`project-flow-incident-${incident.id}`} id={incident.id + '-title'}>{incident.title}</h2><p class="command">{incident.command}</p></div>
        <div class="incident-body"><dl>
          <div><dt>Observed</dt><dd>{incident.observed}</dd></div>
          <div><dt>Cause</dt><dd>{incident.cause}</dd></div>
          <div><dt>Change</dt><dd>{incident.change}</dd></div>
          <div class="result"><dt>Evidence</dt><dd>{incident.result}</dd></div>
          <div><dt>Tradeoff</dt><dd>{incident.tradeoff}</dd></div>
        </dl><a class="source-link" href={incident.link} {...destinationLink(incident.link)}>{incident.linkLabel}</a>
        {#if incident.id === 'conversation-state'}
          <div class="authority-diagram" aria-label="Preview ownership"><strong>Authoritative document</strong><span aria-hidden="true">↓</span><strong>Current proposal</strong><span aria-hidden="true">↓</span><strong>Derived preview</strong><p>A preview describes a proposal. It does not become a second calendar.</p></div>
        {/if}
        </div>
      </section>
    {/each}
  </div>

  <section class="section" aria-labelledby="performance-title">
    <div class="section-heading"><p class="eyebrow">Performance investigation</p><h2 id="performance-title">Measure the acknowledgement.<br />Name what it leaves out.</h2></div>
    <div class="measurement-story">
      <div><p class="measurement">227.1 ms</p><h3>Initial observation</h3><p>One wake first-paint sample, on a machine with competing workloads. It justified an investigation, not an optimization claim.</p></div>
      <div><p class="measurement">50.5 ms</p><h3>Earlier isolated median</h3><p>Ten attempts, 33.4–73.5 ms; p95 73.5 ms. A historical candidate, not a certificate for subsequent repairs.</p></div>
      <div><p class="measurement">42.1 ms</p><h3>Later isolated median</h3><p>Ten acknowledgements below 100 ms; p95 65.7 ms. Source and build hashes stayed unchanged during this isolation run.</p></div>
    </div>
    <figure class="wake-chart"><figcaption>Later isolated run · wake-handler → acknowledgement paint · milliseconds</figcaption><ol>{#each wakeSamples as value, i}<li><span class="trial">{i + 1}</span><span class="bar" style:width={(value / 100) * 75 + '%'}></span><strong>{value.toFixed(1)}</strong></li>{/each}</ol><p>Raw samples from the retained report. This excludes physical speech recognition and the complete Home transition.</p></figure>
    <a class="source-link" href={flowSources.verification} {...destinationLink(flowSources.verification)}>Read the original wake measurements</a>
  </section>

  <section class="section" aria-labelledby="ledger-title">
    <div class="section-heading"><p class="eyebrow">Reliability ledger</p><h2 id="ledger-title">Smaller failures exposed<br />the same missing boundaries.</h2></div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (The overflow region needs keyboard focus for horizontal scrolling.) -->
    <div class="table-scroll" tabindex="0" role="region" aria-label="Reliability ledger, horizontally scrollable on small screens"><table><thead><tr><th scope="col">Failure</th><th scope="col">Layer</th><th scope="col">Engineering response</th></tr></thead><tbody>{#each flowLedger as [failure, layer, response]}<tr><th scope="row">{failure}</th><td>{layer}</td><td>{response}</td></tr>{/each}</tbody></table></div>
    <p class="caption">The first distributed ZIP declared almost no dependencies; installation left Vite unavailable. Rebuilding the package with its actual dependency graph and a Node requirement made reproducibility the first reliability gate.</p>
  </section>

  <section id="verification" class="section" aria-labelledby="verification-title">
    <div class="section-heading"><p class="eyebrow">Testing evolution</p><h2 id="verification-title">“All tests pass” needed<br />a more precise meaning.</h2></div>
    <div class="test-evolution"><div><h3>Early recorded gate</h3><p class="test-count">33 tests · 91 utterances</p><p>7 Chromium E2E checks. Quick-command shortcuts could exercise the UI without proving the real language path.</p></div><div><h3>Later recorded checkpoint</h3><p class="test-count">581 tests · 982 semantic outcomes</p><p>46 Chromium checks; 11 screenshot checks and 75 motion frames reported. Coverage expanded toward ambiguity, compound recovery, protected anchors, persistence and history.</p></div></div>
    <p class="boundary">That later checkpoint was still rejected on visual review. Present frame files and passing automated checks did not prove that the motion was usable. Blank, frozen or clipped frames invalidated the broader release claim.</p>
    <a class="source-link" href={flowSources.checkpoint} {...destinationLink(flowSources.checkpoint)}>Read the checkpoint and rejection</a>
    <div class="evidence-layers"><div><h3>Source and deterministic tests</h3><p>Prove bounded interpretation, document invariants and rollback behavior. The linked test definitions were inspected for this case study, not rerun here.</p></div><div><h3>Synthetic browser voice</h3><p>Exercises transcript → interpretation → proposal → mutation without relying on microphone hardware or browser speech services.</p></div><div><h3>Physical microphone acceptance</h3><p>Must separately cover permissions, device selection, recognition lifecycle and real speech. It remained unverified at several otherwise passing intermediate gates.</p></div></div>
    <div class="baseline-note"><h3>463 failures were not automatically 463 regressions.</h3><p>A later full-suite run needed a baseline comparison. A retained implementation ledger records the same 463 failure-heading multiset before and after one checkpoint. That limits the regression claim; it does not make the suite healthy.</p><a class="source-link" href={flowSources.baseline} {...destinationLink(flowSources.baseline)}>Inspect the baseline comparison</a></div>
  </section>

  <section class="section" aria-labelledby="approach-title"><div class="section-heading"><p class="eyebrow">What changed in my engineering approach</p><h2 id="approach-title">Make the boundaries explicit.</h2></div><ol class="lessons">{#each flowLessons as [title, detail], i}<li><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{detail}</p></div></li>{/each}</ol></section>

  <section class="section" aria-labelledby="film-title"><div class="section-heading"><p class="eyebrow">The product surface</p><h2 id="film-title">Inspect the change. Undo it.</h2><p>The interaction is the visible end of the pipeline. This is authentic Flow UI with controlled speech input; the film does not demonstrate live microphone recognition.</p></div><figure class="film"><FlowProductFilm /><figcaption>The film’s exact source revision is not established by the code links above.</figcaption></figure></section>

  <footer class="study-footer"><p>Evidence note: early incidents and gate counts come from the project development history supplied for this case study. Linked code and reports are pinned to public revision aa63e018. They describe different checkpoints, not one fully certified release.</p><a href="/work/leu" class="source-link" {...destinationLink('/work/leu')}>Next case study: Leu</a></footer>
</article>

<style>
  .flow-study { padding-bottom: 5rem; }
  .back-link, .source-link { display: inline-block; text-decoration: underline; text-underline-offset: 5px; color: var(--color-plum); }
  .back-link { margin-top: 1.5rem; font-size: .9rem; }
  .flow-hero { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(2rem, 5vw, 5rem); padding: 3rem 0 4rem; }
  h1, .eyebrow { font-size: .9rem; font-weight: 650; color: var(--color-plum); }
  .hero-statement { font-size: clamp(2.8rem, 5.2vw, 5.5rem); font-weight: 650; line-height: 1.02; letter-spacing: -.05em; margin-top: 1.2rem; }
  .hero-context { padding-top: 2.3rem; }
  p, dd { line-height: 1.65; }
  .hero-context > p + p { margin-top: 1.25rem; }
  .lead { font-size: clamp(1.2rem, 1.6vw, 1.5rem); line-height: 1.5; }
  .stack { font-weight: 600; font-size: .95rem; }
  .actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.75rem; }
  .opening { padding: clamp(1.5rem, 4vw, 3.5rem); background: var(--color-ink); color: var(--color-ivory); border-radius: 16px; }
  .opening .eyebrow { color: #cedb9e; }
  .opening h2 { font-size: clamp(1.9rem, 3.6vw, 3.5rem); max-width: 30ch; margin: 1.4rem 0 2rem; }
  h2 { font-size: clamp(1.8rem, 3vw, 3rem); font-weight: 600; line-height: 1.12; letter-spacing: -.035em; }
  .hidden-work { display: flex; flex-wrap: wrap; gap: .5rem 2rem; color: #cedb9e; border-top: 1px solid #668375; padding-top: 1.25rem; }
  .opening-note { max-width: 75ch; margin-top: 1.3rem; }
  .section { padding: clamp(3rem, 6vw, 5.5rem) 0; border-bottom: 1px solid var(--color-rule); scroll-margin-top: 6rem; }
  .section-heading { margin-bottom: 2.2rem; }
  .section-heading h2 { margin-top: .85rem; max-width: 30ch; }
  .section-heading > p:last-child:not(.eyebrow) { max-width: 72ch; margin-top: 1.4rem; }
  h3 { font-weight: 650; font-size: 1.15rem; line-height: 1.35; }
  .architecture { display: grid; grid-template-columns: 1fr 2fr; gap: 3rem; }
  .architecture h3 { margin-bottom: 1.5rem; }
  .architecture ol { list-style: none; margin: 0 0 1.5rem; padding: 0; }
  .architecture li { padding: .9rem 0; border-top: 1px solid var(--color-rule); font-size: 1.1rem; }
  .after ol { display: grid; grid-template-columns: 1fr 1fr; column-gap: 2rem; counter-reset: pipeline; }
  .after li { counter-increment: pipeline; }
  .after li::before { content: counter(pipeline, decimal-leading-zero); font-size: .8rem; margin-right: .7rem; color: var(--color-plum); }
  .boundary { max-width: 86ch; padding-left: 1.3rem; border-left: 3px solid var(--color-plum); margin: 2rem 0 1.3rem; font-size: 1.1rem; }
  .incident { display: grid; grid-template-columns: 1fr 1.45fr; gap: clamp(2rem, 5vw, 5rem); }
  .incident h2 { margin-top: 1rem; }
  .command { margin-top: 1.75rem; color: var(--color-plum); font-size: 1.2rem; }
  dl { margin: 0; }
  dl > div { margin-bottom: 1.5rem; }
  dt { font-size: .85rem; font-weight: 650; color: var(--color-plum); margin-bottom: .45rem; }
  dd { margin: 0; }
  .result { border-left: 2px solid var(--color-plum); padding-left: 1rem; }
  .authority-diagram { margin-top: 2rem; border-block: 1px solid var(--color-rule); padding: 1.25rem 0; display: flex; flex-direction: column; gap: .4rem; }
  .authority-diagram span { color: var(--color-plum); }
  .authority-diagram p { font-size: .9rem; margin-top: .5rem; }
  .measurement-story { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .measurement { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 600; letter-spacing: -.04em; color: var(--color-plum); line-height: 1.1; margin-bottom: 1rem; }
  .measurement-story h3 { margin-bottom: .6rem; }
  .wake-chart { margin: 2.5rem 0 1.4rem; max-width: 780px; }
  .wake-chart figcaption { font-weight: 600; margin-bottom: 1.2rem; }
  .wake-chart ol { list-style: none; margin: 0; padding: 0; }
  .wake-chart li { display: flex; align-items: center; gap: .75rem; height: 30px; }
  .trial { width: 1.25rem; font-size: .75rem; }
  .bar { height: 10px; background: var(--color-plum); }
  .wake-chart strong { font-size: .8rem; font-weight: 550; }
  .wake-chart p, .caption, figcaption { font-size: .875rem; line-height: 1.6; }
  .wake-chart p, .caption { margin-top: 1rem; max-width: 85ch; }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; min-width: 640px; text-align: left; }
  th, td { border-bottom: 1px solid var(--color-rule); padding: 1rem 1.5rem 1rem 0; vertical-align: top; line-height: 1.55; }
  thead th { color: var(--color-plum); font-size: .85rem; }
  tbody th { font-weight: 600; width: 28%; }
  td:nth-child(2) { width: 22%; }
  .test-evolution { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
  .test-count { font-size: clamp(1.4rem, 2.3vw, 2rem); letter-spacing: -.02em; color: var(--color-plum); margin: .8rem 0; font-weight: 600; }
  .evidence-layers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
  .evidence-layers > div { border-top: 2px solid var(--color-plum); padding-top: 1rem; }
  .evidence-layers h3 { margin-bottom: .8rem; }
  .baseline-note { margin-top: 2.5rem; max-width: 85ch; }
  .baseline-note p { margin: .8rem 0; }
  .lessons { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 4rem; list-style: none; padding: 0; margin: 0; }
  .lessons li { display: flex; gap: 1rem; }
  .lessons span { font-size: .8rem; color: var(--color-plum); padding-top: .25rem; }
  .lessons p { margin-top: .5rem; }
  .film { overflow: clip; border-radius: 12px; }
  .film figcaption { padding-top: 1rem; }
  .study-footer { padding-top: 2rem; }
  .study-footer p { font-size: .875rem; max-width: 100ch; margin-bottom: 1.5rem; }
  @media (max-width: 900px) { .flow-hero { grid-template-columns: 1fr; gap: 1.5rem; } .hero-context { padding-top: 0; max-width: 75ch; } .incident { grid-template-columns: 1fr; } .incident-heading { max-width: 65ch; } .measurement-story, .evidence-layers { gap: 1.5rem; } }
  @media (max-width: 600px) { .architecture, .measurement-story, .test-evolution, .evidence-layers, .lessons { grid-template-columns: 1fr; } .architecture { gap: 2rem; } .after ol { grid-template-columns: 1fr; } .hero-statement { font-size: clamp(2.4rem, 10vw, 3.7rem); } .hidden-work { display: block; } .hidden-work p + p { margin-top: .5rem; } .measurement-story { gap: 2rem; } .measurement { font-size: 2.7rem; } }
</style>
