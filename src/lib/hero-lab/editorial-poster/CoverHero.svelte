<script lang="ts">
  import { hero } from '$lib/hero-lab/content';
  import LabPortrait from '$lib/hero-lab/LabPortrait.svelte';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { editionHref } from '$lib/hero-lab/editions/site';
  import PosterNav from './PosterNav.svelte';
  import PosterAction from './PosterAction.svelte';
  import { coverMotion } from './cover-motion';
  import './poster.css';

  // The masthead is set letter by letter so each can rise from its own mask.
  const masthead = [...'Miguel Almeida'];
  const cvHref = editionHref('editorial-poster', 'home', hero.cv.href);
</script>

<div class="ep-cover-root" id="top" data-lab-root data-direction="editorial-poster" use:labMotion={coverMotion}>
  <PosterNav />
  <section class="ep-cover" data-cover aria-labelledby="intro-heading">
    <!-- Masthead: behind the portrait, which breaks out of its plate in front of it. -->
    <div class="mast-scroll" data-mast-scroll>
      <div class="mast-move" data-mast-move>
        <p class="ep-masthead" aria-hidden="true">{#each masthead as char}<span class="m-mask"><span class="m-letter" data-mast-letter>{char === ' ' ? ' ' : char}</span></span>{/each}</p>
      </div>
    </div>

    <!-- The plate: a plum field masked to an offset column; the cutout escapes only upward. -->
    <div class="ep-plate" data-plate>
      <div class="plate-open" data-plate-open>
        <div class="plate-scroll" data-plate-scroll>
          <span class="ep-field" data-field-move aria-hidden="true"></span>
          <span class="ep-figure" data-figure>
            <span class="figure-move" data-figure-move>
              <span class="figure-in" data-figure-in><LabPortrait sizes="(max-width: 1023px) 86vw, 52vh" /></span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- Cover lines: a strict left column of real facts under hairlines. -->
    <div class="ep-lines" data-lines>
      <p class="ep-greeting" data-arm data-line >{hero.greeting}</p>
      <h1 id="intro-heading" aria-label={hero.roleLabel} >
        {#each hero.role as line}<span class="h-line"><span class="h-mask"><span class="h-text" data-heading-text data-h-line>{line}</span></span></span>{/each}
      </h1>
      <div class="ep-rules">
        <span class="ep-rule" data-rule aria-hidden="true"></span>
        <div class="ep-pair">
          <p class="ep-fact" data-arm data-line>{hero.experience}</p>
          <p class="ep-fact" data-arm data-line >{hero.impact}</p>
        </div>
        <span class="ep-rule" data-rule aria-hidden="true"></span>
        <p class="ep-stack" data-arm data-line >{hero.stackLine}</p>
        <span class="ep-rule" data-rule aria-hidden="true"></span>
      </div>
      <div class="ep-actions" data-arm data-line>
        <PosterAction href={cvHref} label={hero.cv.label}  />
        <PosterAction href={hero.contact.href} label={hero.contact.label} variant="line"  />
      </div>
    </div>
  </section>
</div>

<style>
  .ep-cover-root { --gap-below: var(--work-offset, 64px); margin-bottom: calc(-1 * var(--gap-below)); padding-bottom: var(--gap-below); }
  .ep-cover {
    /* Viewport-derived units (WebKit resolves cq* in zoomed pixels under #portfolio-content's zoom). */
    --stage-h: max(calc(100svh / var(--lab-zoom, 1)), 760px); --cqi: calc(100vw / var(--lab-zoom, 1) / 100); --cqh: calc(var(--stage-h) / 100);
    --edge: var(--page-x);
    /* The masthead fills the measure: "Miguel Almeida" is 6.5em in this serif. */
    --mast: min(calc((100 * var(--cqi) - 2 * var(--edge)) / 6.62), calc(25 * var(--cqh)));
    --mast-top: max(calc(11 * var(--cqh)), 100px);
    --plate-l: 50%; --plate-w: calc(30 * var(--cqi)); --plate-top: calc(var(--mast-top) + var(--mast) * .86 + 4 * var(--cqh));
    --fig-h: calc(100 * var(--cqh) - var(--mast-top) - var(--mast) * .3);
    position: relative; isolation: isolate; height: var(--stage-h); overflow: clip;
  }

  .mast-scroll { position: absolute; z-index: 2; left: 0; right: 0; top: var(--mast-top); }
  .mast-move { padding-inline: var(--edge); }
  .ep-masthead { margin: 0; white-space: nowrap; font: 400 var(--mast)/.86 var(--ep-serif); letter-spacing: -.02em; }
  .m-mask { display: inline-block; overflow: clip; padding-block: .02em .1em; margin-block: -.02em -.1em; vertical-align: top; }
  .m-letter { display: inline-block; }

  .ep-plate { position: absolute; z-index: 3; left: var(--plate-l); width: var(--plate-w); top: var(--plate-top); bottom: 0; }
  .plate-open, .plate-scroll { position: absolute; inset: 0; }
  /* Negative top inset: the clip extends above the plate so the head can break out. */
  .plate-open { clip-path: inset(-120% 0% 0% 0%); }
  .plate-scroll { clip-path: inset(-120% 0% 0% 0%); }
  .ep-field { position: absolute; inset: -24px; top: 0; background: var(--ep-plum); }
  .ep-figure { position: absolute; left: 50%; bottom: 0; height: var(--fig-h); aspect-ratio: 1086 / 1448; margin-left: calc(var(--fig-h) * -.375); }
  .figure-move, .figure-in { display: block; height: 100%; }
  .ep-figure :global(.lab-portrait) { height: 100%; }

  .ep-lines { position: absolute; z-index: 4; left: var(--edge); width: min(calc(42 * var(--cqi)), 720px); top: var(--plate-top); bottom: calc(6 * var(--cqh)); display: flex; flex-direction: column; }
  .ep-greeting { font: italic 400 28px/1.2 var(--ep-serif); color: var(--ep-plum); }
  h1 { margin: 14px 0 0; font: 400 min(calc(6.2 * var(--cqh)), calc(4 * var(--cqi)))/1.02 var(--ep-serif); letter-spacing: -.02em; }
  .h-line { display: block; }
  .h-mask { display: inline-block; overflow: clip; padding-bottom: .12em; margin-bottom: -.12em; }
  .h-text { display: inline-block; }
  .ep-rules { margin-top: auto; }
  .ep-rule { display: block; height: var(--ep-hair); background: var(--ep-ink); transform-origin: 0 50%; }
  .ep-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; padding: 18px 0 20px; }
  .ep-fact { font: 600 19px/1.4 var(--ep-sans); max-width: 24ch; }
  .ep-stack { padding: 16px 0 18px; font: 400 25px/1.3 var(--ep-serif); }
  .ep-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 34px; margin-top: 26px; }

  @media (max-width: 1023px) {
    .ep-cover { --edge: 20px; --mast: min(calc(24.5 * var(--cqi)), 170px); height: auto; overflow: visible; overflow-x: clip; display: flex; flex-direction: column; padding-top: 78px; }
    .mast-scroll, .ep-plate, .ep-lines { position: relative; inset: auto; }
    .ep-masthead { white-space: normal; font-size: var(--mast); line-height: .9; }
    .ep-plate { --plate-h: min(calc(100 * var(--cqi)), 560px); --fig-h: calc(var(--plate-h) + var(--mast) * .55); align-self: flex-end; width: min(78%, 520px); height: var(--plate-h); margin-top: calc(var(--mast) * .6); margin-right: var(--edge); }
    .ep-lines { width: auto; padding: 28px var(--edge) 44px; }
    .ep-greeting { font-size: 24px; }
    h1 { font-size: min(calc(11 * var(--cqi)), 64px); }
    .ep-rules { margin-top: 28px; }
    .ep-pair { grid-template-columns: 1fr; gap: 10px; }
    .ep-fact { font-size: 17px; }
    .ep-stack { font-size: 21px; }
  }
  @media (max-width: 1023px) and (min-width: 640px) {
    .ep-lines { display: grid; grid-template-columns: 1fr 1fr; column-gap: 32px; }
    .ep-greeting, h1 { grid-column: 1; }
    .ep-rules, .ep-actions { grid-column: 2; }
    .ep-rules { grid-row: 1 / span 2; margin-top: 0; }
  }
</style>
