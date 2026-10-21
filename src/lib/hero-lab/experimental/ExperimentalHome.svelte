<script lang="ts">
  import { hero } from '$lib/hero-lab/content';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { editionHref } from '$lib/hero-lab/editions/site';
  import XStrips from './XStrips.svelte';
  import XAction from './XAction.svelte';
  import { homeMotion } from './home-motion';

  // "Frontend" and "engineer" both have eight letters: one letter rides on each
  // of the eight strips, so the photograph and the words assemble together.
  const [back, front] = hero.role;
  const [top, middle] = back.toUpperCase().split(' ');
  const [frontA, frontB] = [front.slice(0, front.lastIndexOf(' ')), front.slice(front.lastIndexOf(' ') + 1)];
  const cvHref = editionHref('experimental', 'home', hero.cv.href);
</script>

<div class="xh" id="top" data-lab-root data-direction="experimental" use:labMotion={homeMotion}>
  <section class="xh-stage" data-xh-stage aria-labelledby="intro-heading">
    <span class="xh-grid" aria-hidden="true">{#each Array(9) as _, k}<span data-grid-line style:--k={k}></span>{/each}</span>

    <p class="xh-hello" data-arm data-meta >{hero.greeting}</p>

    <h1 id="intro-heading" class="xh-title" aria-label={hero.roleLabel} >
      <span class="xh-strips" data-figure>
        <XStrips count={8} sizes="(max-width: 1023px) 90vw, 40vw">
          {#snippet overlay(i)}
            <span class="xh-letter top" aria-hidden="true" data-heading-text><span data-letter>{top[i]}</span></span>
            <span class="xh-letter mid" aria-hidden="true" data-heading-text><span data-letter>{middle[i]}</span></span>
          {/snippet}
        </XStrips>
      </span>
      <span class="xh-front" aria-hidden="true" data-front>
        <span class="xh-front-line" data-heading-text><span class="xh-mask"><span data-front-word>{frontA}</span></span></span>
        <span class="xh-front-line" data-heading-text><span class="xh-mask"><span data-front-word>{frontB}</span></span></span>
      </span>
    </h1>

    <div class="xh-facts" data-xh-side>
      <p class="xh-fact" data-arm data-meta>{hero.experience}</p>
      <p class="xh-fact xh-stack" data-arm data-meta >{hero.stackLine}</p>
      <p class="xh-fact" data-arm data-meta >{hero.impact}</p>
    </div>
    <div class="xh-actions" data-arm data-meta data-xh-side>
      <XAction href={cvHref} label={hero.cv.label}  />
      <XAction href={hero.contact.href} label={hero.contact.label} variant="line"  />
    </div>
  </section>
</div>

<style>
  .xh { background: var(--lime); color: var(--ink); font-family: var(--hero-font); }
  /* Units from the viewport, net of the rail (see the D1 notes on zoom and cq* units). */
  .xh-stage { --stage-h: max(calc(100svh / var(--lab-zoom, 1)), 760px); --cw: calc((100vw / var(--lab-zoom, 1) - 92px) / 100); --cqh: calc(var(--stage-h) / 100);
    --m: calc(4 * var(--cw)); --x-pw: min(calc(58.5 * var(--cqh)), calc(47 * var(--cw))); --x-gap: calc(1.1 * var(--cw));
    --sw: calc(var(--x-pw) / 8); --x-ph: calc(var(--x-pw) * 1448 / 1086); --letter: calc(var(--sw) * 1.72); --strips-w: calc(var(--x-pw) + 7 * var(--x-gap));
    --side: calc(var(--m) * 2 + var(--strips-w));
    position: relative; isolation: isolate; height: var(--stage-h); overflow: clip; }

  /* The structural grid: a hairline at every strip boundary, floor to ceiling. */
  .xh-grid span { position: absolute; z-index: 0; top: 0; bottom: 0; width: 1px; left: calc(var(--m) + var(--k) * (var(--sw) + var(--x-gap)) - var(--x-gap) / 2); background: rgb(20 42 34 / .16); }
  .xh-grid span:first-child { left: calc(var(--m) - var(--x-gap) / 2); }

  .xh-title { margin: 0; font: inherit; }
  .xh-strips { position: absolute; z-index: 1; left: var(--m); top: calc(7 * var(--cqh)); bottom: 0; display: block; }
  .xh-letter { position: absolute; left: 0; right: 0; display: block; overflow: clip; text-align: center; color: var(--lime); font: 700 var(--letter)/.86 'Lab Antonio', 'Arial Narrow', sans-serif; pointer-events: none; }
  .xh-letter > span { display: inline-block; }
  .xh-letter.top { bottom: calc(var(--x-ph) + 1.2 * var(--cqh)); }
  .xh-letter.mid { bottom: calc(var(--x-ph) * .4); }

  .xh-hello { position: absolute; z-index: 2; left: var(--side); top: max(calc(9 * var(--cqh)), 64px); right: var(--m); padding-top: 14px; border-top: 2px solid var(--ink); font: 600 24px/1.3 var(--hero-font); }
  .xh-facts { position: absolute; z-index: 2; left: var(--side); right: var(--m); top: calc(21 * var(--cqh)); display: grid; }
  .xh-fact { padding: 14px 0; border-top: 1px solid rgb(20 42 34 / .3); font: 600 22px/1.35 var(--hero-font); }
  .xh-fact.xh-stack { font-weight: 500; }
  /* First line shares the baseline of "ENGINEER" on the strips, so the role reads across. */
  .xh-front { position: absolute; z-index: 2; left: var(--side); right: var(--m); top: calc(var(--stage-h) - var(--x-ph) * .4 - var(--letter) * .86); display: block; }
  .xh-front-line { display: block; font: 700 var(--letter)/.86 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; white-space: nowrap; }
  .xh-mask { display: inline-block; overflow: clip; padding-block: .04em; margin-block: -.04em; }
  .xh-mask > span { display: inline-block; }
  .xh-actions { position: absolute; z-index: 2; left: var(--side); right: var(--m); bottom: calc(5 * var(--cqh)); display: flex; flex-wrap: wrap; align-items: center; gap: 12px 30px; }

  @media (max-width: 1023px) {
    .xh-stage { --stage-h: auto; --cw: calc(100vw / 100); --m: 20px; --x-pw: calc(100vw - 40px - 7 * var(--x-gap)); --x-gap: 5px;
      height: auto; display: flex; flex-direction: column; padding: 76px 0 40px; }
    .xh-grid { display: none; }
    .xh-hello, .xh-facts, .xh-front, .xh-actions, .xh-strips { position: relative; inset: auto; }
    .xh-title { display: contents; }
    .xh-hello { order: 1; margin: 0 var(--m); font-size: 19px; }
    .xh-strips { order: 2; margin: 40px var(--m) 0; height: calc(var(--x-ph) + var(--letter) * .9 + 18px); }
    .xh-front { order: 3; margin: 18px var(--m) 0; }
    .xh-front-line { font-size: min(calc(16 * var(--cw)), 92px); }
    .xh-facts { order: 4; margin: 22px var(--m) 0; }
    .xh-fact { font-size: 17px; padding: 12px 0; }
    .xh-actions { order: 5; margin: 18px var(--m) 0; }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .xh-stage { --x-pw: min(calc(100vw - 40px - 7 * var(--x-gap)), 560px); }
    .xh-strips { align-self: flex-start; }
  }
</style>
