<script lang="ts">
  import type { CaseStudy } from '$lib/content/case-studies';
  import { getApprovedMedia } from '$lib/content/project-media';
  import ResponsivePicture from '$lib/components/media/ResponsivePicture.svelte';
  import ProjectLinks from './ProjectLinks.svelte';

  export let study: CaseStudy;
  export let headline: string;

  const heroMedia = getApprovedMedia('camera-harness-hero-phone');
</script>

<header class="case-hero">
  <div class="hero-copy">
    <a class="back-link" href="/#work">← Selected work</a>
    <p class="eyebrow">{study.type}</p>
    <h1>{study.title}</h1>
    <h2>{headline}</h2>
    <p class="opening">
      <slot name="opening" />
    </p>
    <p class="status">{study.status}</p>
    <ProjectLinks links={study.links} />
  </div>

  {#if heroMedia}
    <figure class="hero-visual">
      <ResponsivePicture
        fallbackSrc={heroMedia.src}
        alt={heroMedia.alt}
        width={heroMedia.responsive?.width ?? 2108}
        height={heroMedia.responsive?.height ?? 902}
        avifSrcset={heroMedia.responsive?.avifSrcset}
        webpSrcset={heroMedia.responsive?.webpSrcset}
        sizes={heroMedia.responsive?.sizes ?? '100vw'}
        loading="eager"
        fetchpriority="high"
        layout="intrinsic"
        objectPosition="center top"
      />
      <figcaption>
        <div>
          <span>Recorded state</span>
          <strong>Raised phone</strong>
        </div>
        <p>
          One captured result from the working interface. It demonstrates the interaction, not
          general recognition accuracy.
        </p>
      </figcaption>
    </figure>
  {/if}
</header>

<style>
  .case-hero {
    display: grid;
    min-height: min(46rem, 92svh);
    grid-template-columns: minmax(0, 0.88fr) minmax(28rem, 1.12fr);
    gap: clamp(2rem, 5vw, 6rem);
    align-items: center;
    width: min(100%, 96rem);
    margin-inline: auto;
    padding-block: clamp(5.5rem, 8vw, 7rem) clamp(3rem, 5vw, 5rem);
  }

  .hero-copy {
    min-width: 0;
  }

  .back-link {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    margin-bottom: clamp(2rem, 5vw, 4.5rem);
    color: rgb(244 234 220 / 0.58);
    font-size: 0.88rem;
    font-weight: 680;
  }

  .back-link:hover,
  .back-link:focus-visible {
    color: var(--foreground);
    outline: none;
  }

  .back-link:focus-visible {
    box-shadow: 0 2px 0 var(--ring);
  }

  .eyebrow {
    margin: 0 0 1rem;
    color: var(--accent);
    font-size: 0.76rem;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(2.35rem, 3.5vw, 3.4rem);
    font-weight: 740;
    letter-spacing: -0.03em;
    line-height: 0.94;
  }

  h2 {
    max-width: 39rem;
    margin-top: 1.35rem;
    color: var(--accent);
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 1.5vw, 1.45rem);
    font-weight: 650;
    letter-spacing: 0;
    line-height: 1.02;
    text-wrap: balance;
  }

  .opening {
    max-width: 41rem;
    margin-top: 1.5rem;
    color: rgb(244 234 220 / 0.76);
    font-size: clamp(1rem, 1.3vw, 1.16rem);
    line-height: 1.62;
  }

  .status {
    max-width: 41rem;
    margin-block: 1.4rem;
    padding-left: 1rem;
    border-left: 2px solid var(--accent);
    color: rgb(244 234 220 / 0.66);
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .hero-visual {
    position: relative;
    margin: 0;
    overflow: hidden;
    border-block: 1px solid rgb(244 234 220 / 0.17);
    background: #0a0a0a;
  }

  .hero-visual :global(img) {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    object-position: center top;
  }

  figcaption {
    display: grid;
    grid-template-columns: minmax(10rem, 0.35fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: end;
    border-top: 1px solid rgb(244 234 220 / 0.12);
    padding: clamp(1rem, 2.5vw, 2rem);
  }

  figcaption > div {
    display: grid;
    gap: 0.25rem;
  }

  figcaption span,
  figcaption strong {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  figcaption span {
    color: var(--accent);
  }

  figcaption strong {
    color: var(--foreground);
  }

  figcaption p {
    max-width: 31rem;
    color: rgb(244 234 220 / 0.68);
    font-size: 0.82rem;
    line-height: 1.45;
  }

  @media (max-width: 1120px) {
    .case-hero {
      min-height: auto;
      grid-template-columns: 1fr;
    }

  }

  @media (max-width: 600px) {
    .case-hero {
      padding-top: 5.5rem;
    }

    h1 {
      font-size: clamp(2.2rem, 10vw, 3rem);
    }

    figcaption {
      grid-template-columns: 1fr;
      gap: 0.55rem;
    }
  }
</style>
