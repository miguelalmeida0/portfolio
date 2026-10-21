<script lang="ts">
  import { hero } from '$lib/hero-lab/content';
  import LabPortrait from '$lib/hero-lab/LabPortrait.svelte';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { destinationLink } from '$lib/navigation/destination-link';
  import CinematicNav from './CinematicNav.svelte';
  import { cinematicMotion } from './motion';
  const backWords = hero.role[0].split(' ');
</script>

<div class="d2" id="top" data-lab-root data-direction="cinematic" use:labMotion={cinematicMotion}>
  <CinematicNav />
  <!-- Sticky scene instead of a ScrollTrigger pin: pin measurements break under CSS zoom. -->
  <div class="d2-scene" data-d2-scene>
  <section class="d2-stage" data-d2-stage aria-labelledby="intro-heading">
    <!-- Plane 0: the backdrop of the shot (contracts with the lens on exit). -->
    <div class="d2-backdrop" data-backdrop aria-hidden="true"></div>
    <p class="d2-hello" data-roll ><span data-hello data-arm>{hero.greeting}</span></p>

    <!-- One heading, three depth planes inside the shot: the title behind him,
         the photograph, the lower-third line in front of him. -->
    <h1 id="intro-heading" aria-label={hero.roleLabel} >
      <span class="d2-back" data-back aria-hidden="true">
        <span class="d2-back-line" data-back-line data-arm>
          {#each backWords as word, w}<span class="d2-w" data-word={w} data-heading-text>{#each [...word] as glyph}<span class="d2-g" data-g>{glyph}</span>{/each}</span>{#if w < backWords.length - 1}{' '}{/if}{/each}
        </span>
      </span>
      <span class="d2-lens" data-lens>
        <span class="d2-aperture" data-aperture data-arm>
          <span class="d2-subject" data-subject>
            <span class="d2-camera" data-camera><LabPortrait sizes="(max-width: 1023px) 90vw, 40vw" /></span>
          </span>
        </span>
      </span>
      <span class="d2-front" data-front aria-hidden="true">
        <span class="d2-front-line" data-front-line data-arm><span class="d2-front-text" data-front-text data-heading-text>{hero.role[1]}</span></span>
      </span>
    </h1>

    <ul class="d2-credits" data-roll>
      <li class="d2-credit" data-credit data-arm><p>{hero.experience}</p></li>
      <li class="d2-credit" data-credit data-arm><p >{hero.stackLine}</p></li>
      <li class="d2-credit" data-credit data-arm><p >{hero.impact}</p></li>
    </ul>

    <div class="d2-lower" data-lower>
      <div class="d2-actions" data-arm data-actions>
        <a href={hero.cv.href} class="d2-cv"  {...destinationLink(hero.cv.href)}>
          <span class="d2-cv-base">{hero.cv.label} <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
          <span class="d2-cv-wipe" aria-hidden="true">{hero.cv.label} <svg viewBox="0 0 24 24" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
        </a>
        <a href={hero.contact.href} class="d2-touch"  {...destinationLink(hero.contact.href)}><span class="d2-touch-label">{hero.contact.label}</span> <span class="d2-touch-arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
  </div>
</div>

<style>
  .d2 {
    --d2-bg: #0d1915; --d2-black: var(--ink, #142a22); --hair: max(1px, calc(1.25px / var(--lab-zoom, 1))); --d2-screen: #15251f; --d2-text: #f1eee3; --d2-muted: #a9b7ae; --d2-accent: #e4edbf;
    --d2-bar-h: 72px; --d2-lower-h: 112px;
    /* Paint the homepage's work offset in the hero colour so the cut is seamless. */
    /* Desktop: Selected Work slides up over the last held frame (one stage of
       overlap; margins collapse with the section's own offset). */
    margin-bottom: calc(-1 * (var(--d2-stage-h) + var(--work-offset, 64px)));
    background: var(--forest); color: var(--d2-text);
  }
  .d2 { --d2-stage-h: max(calc(100svh / var(--lab-zoom, 1)), 760px); }
  .d2-scene { height: calc(var(--d2-stage-h) * 2.6); }
  /* Stage units from viewport units (see Direction 01): cq* differ across engines under zoom. */
  .d2-stage { --stage-h: var(--d2-stage-h); --cqi: calc(100vw / var(--lab-zoom, 1) / 100); --cqh: calc(var(--stage-h) / 100); position: sticky; top: 0; isolation: isolate; height: var(--d2-stage-h); background: var(--d2-bg); overflow: clip; }
  h1 { margin: 0; }

  /* The shot sits between the letterbox bars; --sh is its height. */
  .d2-stage { --sh: calc(var(--stage-h) - var(--d2-bar-h) - var(--d2-lower-h)); }
  .d2-backdrop, .d2-lens { position: absolute; top: var(--d2-bar-h); bottom: var(--d2-lower-h); left: 0; right: 0; clip-path: inset(0% 0% 0% 0%); }
  .d2-backdrop { z-index: 0; background: radial-gradient(70% 90% at 48% 40%, #1d3029 0%, #15251f 45%, var(--d2-bg) 100%); }
  .d2-lens { z-index: 2; display: block; pointer-events: none; }
  .d2-aperture { position: absolute; inset: 0; display: block; clip-path: inset(0% 0% 0% 0%); }
  .d2-subject { position: absolute; display: block; left: var(--subject-x, 50%); bottom: 0; height: 95%; aspect-ratio: 1086 / 1448; translate: -50% 0; }
  .d2-camera { display: block; height: 100%; transform-origin: 52% 14.5%; }
  .d2-subject :global(.lab-portrait) { height: 100%; }

  .d2-hello { position: absolute; z-index: 4; left: var(--page-x); top: calc(var(--d2-bar-h) + .035 * var(--sh)); margin: 0; font: 400 18px/1.4 'Lab Mono', ui-monospace, monospace; color: var(--d2-accent); }
  .d2-hello span { display: inline-block; }
  /* Plane 1: the title, behind him. The words part around his head: the
     gutter is derived from the portrait's size, so the break follows the photo. */
  .d2-stage { --subject-x: calc(48.5 * var(--cqi)); --head: calc(.95 * var(--sh) * .75 * .155); --gap: calc(.03 * var(--sh)); }
  .d2-back { position: absolute; z-index: 1; inset: calc(var(--d2-bar-h) + .085 * var(--sh)) 0 auto 0; display: block; }
  .d2-back-line { display: block; position: relative; height: 1em; white-space: nowrap; font: 400 min(calc(9.6 * var(--cqi)), calc(.19 * var(--sh)))/.95 'Lab Newsreader', Georgia, serif; letter-spacing: -.025em; color: var(--d2-text); }
  .d2-w { position: absolute; top: 0; display: inline-block; white-space: nowrap; }
  .d2-w[data-word='0'] { right: calc(100% - var(--subject-x) + var(--head) + var(--gap)); }
  .d2-w[data-word='1'] { left: calc(var(--subject-x) + var(--head) + var(--gap)); }
  .d2-g { display: inline-block; }
  /* Plane 3: the lower third, in front of his torso. */
  .d2-front { position: absolute; z-index: 3; left: calc(29 * var(--cqi)); top: calc(var(--d2-bar-h) + .5 * var(--sh)); display: block; }
  .d2-front-line { display: block; overflow: clip; white-space: nowrap; padding: .04em .02em .1em 0; font: 400 min(calc(5.4 * var(--cqi)), calc(.1 * var(--sh)))/1 'Lab Newsreader', Georgia, serif; letter-spacing: -.02em; color: var(--d2-accent); }
  .d2-front-text { display: inline-block; }

  .d2-credits { position: absolute; z-index: 4; right: var(--page-x); bottom: calc(var(--d2-lower-h) + .05 * var(--sh)); width: calc(27 * var(--cqi)); list-style: none; padding: 0; display: grid; margin: 0; border-bottom: var(--hair) solid rgb(241 238 227 / .22); }
  .d2-credit { padding: 11px 0; border-top: var(--hair) solid rgb(241 238 227 / .22); }
  .d2-credit p { margin: 0; font: 500 19px/1.45 var(--hero-font); color: var(--d2-text); }
  .d2-credit:nth-child(2) p { color: var(--d2-accent); font-weight: 600; }

  .d2-lower { position: absolute; z-index: 3; left: 0; right: 0; bottom: 0; height: var(--d2-lower-h); background: var(--d2-black); }
  .d2-actions { height: 100%; width: calc(100% - 2 * var(--page-x)); margin-inline: auto; display: flex; align-items: center; gap: 36px; }

  /* View CV: a slate. Ink wipes across like the next frame advancing. */
  .d2-cv { position: relative; display: inline-grid; min-height: 60px; color: var(--d2-black); text-decoration: none; font: 600 18px/1 var(--hero-font); }
  .d2-cv > span { grid-area: 1 / 1; display: inline-flex; align-items: center; gap: 14px; padding: 0 26px; }
  .d2-cv-base { background: var(--d2-accent); }
  .d2-cv-wipe { background: var(--d2-black); color: var(--d2-accent); box-shadow: inset 0 0 0 1.5px var(--d2-accent); clip-path: inset(0 100% 0 0); transition: clip-path .5s cubic-bezier(.76,0,.24,1); }
  .d2-cv svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; transition: transform .5s cubic-bezier(.76,0,.24,1); }
  .d2-cv:is(:hover, :focus-visible) .d2-cv-wipe { clip-path: inset(0 0 0 0); }
  .d2-cv:is(:hover, :focus-visible) svg { transform: translateX(6px); }
  .d2-cv:focus-visible { outline: 2px solid var(--d2-accent); outline-offset: 5px; }
  .d2-touch { display: inline-flex; align-items: center; gap: 10px; min-height: 60px; color: var(--d2-text); text-decoration: none; font: 400 17px/1 'Lab Mono', ui-monospace, monospace; }
  /* The rule is a strip of film: it slides through the label on hover. */
  .d2-touch-label { position: relative; padding-bottom: 6px; }
  .d2-touch-label::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: var(--hair); background: currentColor; transform-origin: right; transition: transform .5s cubic-bezier(.76,0,.24,1); }
  .d2-touch-arrow { display: inline-block; transition: transform .5s cubic-bezier(.76,0,.24,1); }
  .d2-touch:is(:hover, :focus-visible) { color: var(--d2-accent); }
  .d2-touch:is(:hover, :focus-visible) .d2-touch-label::after { animation: d2-film .6s cubic-bezier(.76,0,.24,1); }
  .d2-touch:is(:hover, :focus-visible) .d2-touch-arrow { transform: translateX(5px); }
  @keyframes d2-film { 0% { transform: scaleX(1); transform-origin: right; } 45% { transform: scaleX(0); transform-origin: right; } 55% { transform: scaleX(0); transform-origin: left; } 100% { transform: scaleX(1); transform-origin: left; } }
  .d2-touch:focus-visible { outline: 2px solid var(--d2-accent); outline-offset: 4px; }

  /* Compact: the planes stack in reading order; no text crosses the photograph. */
  @media (max-width: 1023px) {
    .d2 { --d2-bar-h: 60px; margin-bottom: calc(-1 * var(--work-offset, 64px)); padding-bottom: var(--work-offset, 64px); }
    .d2-scene { height: auto; }
    .d2-stage { position: relative; height: auto; display: flex; flex-direction: column; padding-top: var(--d2-bar-h); }
    .d2-backdrop { display: none; }
    .d2-hello, .d2-back, .d2-lens, .d2-front, .d2-credits, .d2-lower { position: relative; inset: auto; }
    h1 { display: flex; flex-direction: column; }
    .d2-hello { padding: 18px 20px 0; font-size: 15px; }
    .d2-back { padding: 8px 20px 12px; }
    .d2-back-line { height: auto; white-space: normal; font-size: min(calc(14 * var(--cqi)), 80px); line-height: .98; }
    .d2-w { position: static; display: block; }
    .d2-lens { height: min(36svh, 360px); background: linear-gradient(180deg, #1a2c25 0%, var(--d2-screen) 100%); }
    .d2-subject { --subject-x: 50%; height: 96%; }
    .d2-front { left: auto; padding: 14px 20px 0; }
    .d2-front { padding-top: 12px; }
    .d2-front-line { white-space: normal; font-size: min(calc(8.6 * var(--cqi)), 48px); }
    .d2-credits { right: auto; width: auto; margin: 14px 20px 18px; }
    .d2-credit { padding: 7px 0; }
    .d2-credit p { font-size: 16px; }
    .d2-lower { height: auto; padding: 10px 0 max(10px, env(safe-area-inset-bottom)); }
    .d2-actions { width: calc(100% - 32px); justify-content: space-between; gap: 12px; }
    .d2-cv { min-height: 52px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .d2-cv-wipe, .d2-cv svg, .d2-touch-label::after, .d2-touch-arrow { transition: none; animation: none !important; }
  }
</style>
