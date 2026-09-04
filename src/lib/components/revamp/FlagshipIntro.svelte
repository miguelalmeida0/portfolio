<script lang="ts">
  import ProjectLinks from '$lib/components/case-study/ProjectLinks.svelte';
  import { flagshipStudy } from '$lib/content/case-studies';
  import CameraEvidencePreview from './CameraEvidencePreview.svelte';
</script>

<section class="flagship page-gutter" aria-labelledby="flagship-title">
  <div class="flagship-inner">
    <header>
      <p>Flagship engineering case study · Experimental system</p>
      <h2 id="flagship-title">{flagshipStudy.title}</h2>
    </header>

    <div class="flagship-argument">
      <h3>{flagshipStudy.thesis}</h3>
      <p>
        A browser research prototype combining camera lifecycle management, motion gating, local
        object tracking, bounded semantic analysis, and speech-driven questions.
      </p>
      <p>
        The central challenge became keeping every label, crop, track, and answer attached to the
        same visual evidence.
      </p>
    </div>

    <CameraEvidencePreview />

    <ol class="technical-anchors" aria-label="Key Camera Harness engineering patterns">
      <li><span>01</span>Generation-owned asynchronous work</li>
      <li><span>02</span>Latest-frame backpressure</li>
      <li><span>03</span>Bounded transient image memory</li>
    </ol>

    <footer>
      <ProjectLinks links={flagshipStudy.links} />
      <p>Research prototype · Local object runtime · Public case study available</p>
    </footer>
  </div>
</section>

<style>
  .flagship {
    padding-block: clamp(4.5rem, 9vw, 9rem);
    background: #050505;
    color: var(--foreground);
  }

  .flagship-inner {
    display: grid;
    width: min(100%, 92rem);
    margin-inline: auto;
    grid-template-columns: minmax(11rem, 0.36fr) minmax(0, 1fr);
    gap: clamp(2rem, 5vw, 6rem);
    padding-block: clamp(2rem, 5vw, 4rem);
    border-block: 1px solid rgb(244 234 220 / 0.16);
  }

  header p,
  footer p {
    margin: 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 780;
    letter-spacing: 0.12em;
    line-height: 1.5;
    text-transform: uppercase;
  }

  header h2 {
    margin: 0.75rem 0 0;
    font-size: clamp(2rem, 3.5vw, 3.8rem);
    line-height: 0.96;
  }

  .flagship-argument h3 {
    max-width: 48rem;
    margin: 0;
    font-size: clamp(2.25rem, 4.2vw, 4.65rem);
    font-weight: 820;
    line-height: 0.96;
    text-wrap: balance;
  }

  .flagship-argument p {
    max-width: 49rem;
    margin: 1.2rem 0 0;
    color: rgb(244 234 220 / 0.68);
    font-size: clamp(1rem, 1.45vw, 1.22rem);
    line-height: 1.58;
  }

  .technical-anchors {
    display: grid;
    grid-column: 2;
    margin: clamp(2rem, 5vw, 4rem) 0 0;
    padding: 0;
    border-top: 1px solid rgb(244 234 220 / 0.16);
    list-style: none;
  }

  .technical-anchors li {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 1rem;
    padding-block: 1rem;
    border-bottom: 1px solid rgb(244 234 220 / 0.16);
    color: rgb(244 234 220 / 0.82);
    font-size: clamp(0.96rem, 1.3vw, 1.12rem);
  }

  .technical-anchors span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
  }

  footer {
    display: grid;
    grid-column: 2;
    gap: 1rem;
    margin-top: 1.6rem;
  }

  footer p {
    color: rgb(244 234 220 / 0.48);
  }

  @media (max-width: 760px) {
    .flagship-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .technical-anchors,
    footer {
      grid-column: 1;
    }

    .flagship-argument h3 {
      font-size: clamp(2.15rem, 10.5vw, 3.4rem);
    }
  }
</style>
