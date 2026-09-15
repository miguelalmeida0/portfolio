<script lang="ts">
  import { caseStudies } from '$lib/content/case-studies';
  import { secondVoiceStudy, vigiaStudy } from '$lib/content/release-case-studies';

  const cameraHarness = caseStudies.find((project) => project.slug === 'camera-harness')!;
</script>

<section id="work" class="selected-work page-gutter" aria-labelledby="selected-work-title">
  <div class="selected-work-inner">
    <header class="selected-work-header">
      <p>Selected engineering work</p>
      <h2 id="selected-work-title">Three systems, three different trust problems.</h2>
    </header>

    <div class="work-layout">
      <article class="project flagship" data-testid="camera-harness-card">
        <a class="project-link" href={`/work/${cameraHarness.slug}`}>
          <div class="project-visual camera-visual" aria-hidden="true">
            <span class="signal signal-a">frame</span>
            <span class="signal signal-b">track</span>
            <span class="signal signal-c">answer</span>
            <i></i>
            <strong>evidence<br />boundary</strong>
          </div>
          <div class="project-copy">
            <div class="project-index">01 · Flagship · Experimental</div>
            <h3>{cameraHarness.title}</h3>
            <p class="thesis">{cameraHarness.thesis}</p>
            <p>{cameraHarness.problem}</p>
            <dl>
              <div><dt>My contribution</dt><dd>{cameraHarness.contribution}</dd></div>
              <div><dt>Technical signal</dt><dd>{cameraHarness.technicalSignal}</dd></div>
            </dl>
            <span class="cta">Read the engineering case study →</span>
          </div>
        </a>
      </article>

      <div class="supporting-work">
        {#each [vigiaStudy, secondVoiceStudy] as project, index}
          {@const isVigia = project.slug === 'vigia'}
          <article class="project supporting">
            <a class="project-link" href={`/work/${project.slug}`}>
              <div
                class:vigia-visual={isVigia}
                class:second-voice-visual={!isVigia}
                class="project-visual supporting-visual"
                aria-hidden="true"
              >
                <span class="scope">{isVigia ? 'incident' : 'author'}</span>
                <span class="scope">{isVigia ? 'route' : 'mood'}</span>
                <span class="scope">{isVigia ? 'consequence' : 'rewrite'}</span>
                <strong>
                  {isVigia
                    ? 'real console → synthetic public boundary'
                    : 'visible rewrite → bounded live deployment'}
                </strong>
              </div>
              <div class="project-copy">
                <div class="project-index">{String(index + 2).padStart(2, '0')} · {project.type}</div>
                <h3>{project.title}</h3>
                <p class="thesis">{project.thesis}</p>
                <p>{project.problem}</p>
                <dl>
                  <div><dt>My contribution</dt><dd>{project.contribution}</dd></div>
                  <div><dt>Technical signal</dt><dd>{project.technicalSignal}</dd></div>
                </dl>
                <span class="cta">Open case study →</span>
              </div>
            </a>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .selected-work {
    scroll-margin-top: 4.5rem;
    padding-block: clamp(4.5rem, 9vw, 9rem);
    background: var(--color-background);
  }

  .selected-work-inner {
    width: min(100%, 92rem);
    margin-inline: auto;
  }

  .selected-work-header {
    display: grid;
    grid-template-columns: minmax(10rem, 0.32fr) minmax(0, 1fr);
    gap: clamp(1.5rem, 5vw, 6rem);
    margin-bottom: clamp(2.5rem, 6vw, 5rem);
  }

  .selected-work-header p {
    margin: 0.45rem 0 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 780;
    letter-spacing: 0.12em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  .selected-work-header h2 {
    max-width: 62rem;
    margin: 0;
    font-size: clamp(2.7rem, 6.5vw, 7.2rem);
    font-weight: 820;
    letter-spacing: 0;
    line-height: 0.92;
    text-wrap: balance;
  }

  .work-layout {
    display: grid;
    gap: 1rem;
  }

  .project {
    min-width: 0;
    border-block: 1px solid rgb(244 234 220 / 0.16);
    background: #080808;
  }

  .project-link {
    display: grid;
    min-width: 0;
    color: inherit;
  }

  .flagship .project-link {
    grid-template-columns: minmax(0, 1.12fr) minmax(23rem, 0.88fr);
    min-height: 38rem;
  }

  .project-visual {
    position: relative;
    min-height: 21rem;
    overflow: hidden;
    background: #050505;
  }

  .camera-visual {
    background:
      linear-gradient(rgb(244 234 220 / 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgb(244 234 220 / 0.05) 1px, transparent 1px),
      #050505;
    background-size: 3.2rem 3.2rem;
  }

  .camera-visual i {
    position: absolute;
    inset: 19% 24%;
    border: 1px solid rgb(232 168 120 / 0.7);
    border-radius: 50%;
    box-shadow:
      0 0 0 3.5rem rgb(232 168 120 / 0.035),
      0 0 0 7rem rgb(232 168 120 / 0.025);
  }

  .camera-visual strong {
    position: absolute;
    bottom: 8%;
    left: 7%;
    color: rgb(244 234 220 / 0.9);
    font-size: clamp(2.4rem, 5vw, 5.6rem);
    font-weight: 820;
    line-height: 0.82;
  }

  .signal {
    position: absolute;
    z-index: 2;
    border: 1px solid rgb(244 234 220 / 0.22);
    background: #080808;
    padding: 0.65rem 0.8rem;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .signal-a { top: 10%; left: 7%; }
  .signal-b { top: 22%; right: 9%; }
  .signal-c { right: 12%; bottom: 12%; }

  .project-copy {
    display: grid;
    min-width: 0;
    align-content: end;
    gap: 0.9rem;
    padding: clamp(1.25rem, 3.2vw, 3rem);
  }

  .project-index,
  dt {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 780;
    letter-spacing: 0.1em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  h3, p, dl, dd { margin: 0; }

  h3 {
    font-size: clamp(2.5rem, 5vw, 5.4rem);
    font-weight: 850;
    line-height: 0.9;
  }

  .thesis {
    max-width: 39rem;
    color: var(--foreground);
    font-size: clamp(1.2rem, 2vw, 1.75rem);
    font-weight: 680;
    line-height: 1.16;
  }

  .project-copy > p:not(.thesis),
  dd {
    color: rgb(244 234 220 / 0.63);
    font-size: 0.94rem;
    line-height: 1.52;
  }

  dl {
    display: grid;
    gap: 0.8rem;
    padding-top: 0.4rem;
  }

  dl div {
    display: grid;
    grid-template-columns: minmax(7rem, 0.32fr) minmax(0, 1fr);
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgb(244 234 220 / 0.13);
  }

  .cta {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    justify-self: start;
    margin-top: 0.5rem;
    border-bottom: 1px solid var(--accent);
    color: var(--foreground);
    font-size: 0.9rem;
    font-weight: 760;
  }

  .project-link:hover .cta,
  .project-link:focus-visible .cta { color: var(--accent); }

  .project-link:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 4px;
  }

  .supporting-work {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 1rem;
  }

  .supporting .project-link {
    height: 100%;
    grid-template-rows: minmax(18rem, auto) 1fr;
  }

  .supporting h3 { font-size: clamp(2.4rem, 4.5vw, 4.5rem); }
  .supporting dl div { grid-template-columns: 1fr; gap: 0.35rem; }

  .supporting-visual {
    display: grid;
    align-content: center;
    gap: 0.55rem;
    padding: clamp(1.25rem, 3vw, 3rem);
  }

  .vigia-visual {
    background:
      linear-gradient(90deg, rgb(232 168 120 / 0.05), transparent 48%),
      #050505;
  }

  .second-voice-visual {
    background:
      linear-gradient(135deg, rgb(244 234 220 / 0.05), transparent 52%),
      #050505;
  }

  .supporting-visual .scope {
    width: min(100%, 24rem);
    border: 1px solid rgb(244 234 220 / 0.18);
    padding: 0.65rem 0.8rem;
    color: rgb(244 234 220 / 0.58);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.08em;
  }

  .supporting-visual .scope:nth-child(2) { margin-left: 1.5rem; }
  .supporting-visual .scope:nth-child(3) { margin-left: 3rem; }

  .supporting-visual strong {
    margin-top: 2rem;
    color: var(--foreground);
    font-size: clamp(1.35rem, 2.6vw, 2.5rem);
    line-height: 1.04;
  }

  @media (max-width: 980px) {
    .flagship .project-link { grid-template-columns: 1fr; min-height: 0; }
    .supporting-work { grid-template-columns: 1fr; }
    .project-copy { align-content: start; }
  }

  @media (max-width: 700px) {
    .selected-work-header { grid-template-columns: 1fr; gap: 0.8rem; }
    .selected-work-header h2 { font-size: clamp(2.8rem, 14vw, 4.7rem); }
    .project-visual { min-height: 17rem; }
    .camera-visual strong { font-size: clamp(2.4rem, 13vw, 4rem); }
    .project-copy { padding: 1.2rem; }
    h3, .supporting h3 { font-size: clamp(2.35rem, 13vw, 4rem); }
    dl div { grid-template-columns: 1fr; gap: 0.35rem; }
  }
</style>
