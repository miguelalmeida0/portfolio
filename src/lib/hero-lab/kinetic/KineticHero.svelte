<script lang="ts">
  import { hero, productObjects } from '$lib/hero-lab/content';
  import LabPortrait from '$lib/hero-lab/LabPortrait.svelte';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { destinationLink } from '$lib/navigation/destination-link';
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
  import KineticDock from './KineticDock.svelte';
  import { kineticMotion } from './motion';
  let active = $state<string | undefined>();
  const wall = hero.role[0].split(' ');
  // Each glyph is three nested boxes: scroll (outer), pointer (middle), opening (inner).
  const glyphs = (text: string) => [...text];
</script>

<div class="d3" id="top" data-lab-root data-direction="kinetic" data-active={active} use:labMotion={kineticMotion}>
  <section class="d3-stage" data-d3-stage aria-labelledby="intro-heading">
    <a href="#top" class="d3-identity" aria-label={hero.homeLabel}>
      <span class="d3-wordmark" data-arm>{hero.name.first} {hero.name.last}</span>
      <span class="d3-city" data-arm data-ask-id="city">{hero.city}</span>
    </a>

    <!-- One heading, three planes: a magnetic type wall behind him, the
         photograph, and a sticker-cut line in front of him. -->
    <h1 id="intro-heading" class="d3-title" aria-label={hero.roleLabel} data-ask-id="role">
      <span class="d3-wall" data-wall aria-hidden="true">
        {#each wall as word}
          <span class="d3-wall-line" data-heading-text>{#each glyphs(word) as glyph}<span class="d3-g" data-g><span class="d3-gm" data-gm><span class="d3-gi" data-gi>{glyph}</span></span></span>{/each}</span>
        {/each}
      </span>
      <span class="d3-figure" data-figure>
        <span class="d3-figure-in" data-figure-in data-arm><LabPortrait sizes="(max-width: 1023px) 70vw, 34vw" /></span>
      </span>
      <span class="d3-sticker" data-sticker aria-hidden="true">
        <span class="d3-sticker-line" data-heading-text>{#each glyphs(hero.role[1]) as glyph}<span class="d3-g" data-g><span class="d3-gm" data-gm><span class="d3-gi" data-gi>{glyph === ' ' ? '\u00a0' : glyph}</span></span></span>{/each}</span>
      </span>
    </h1>

    <div class="d3-copy" data-copy>
      <p class="d3-hello" data-arm data-ask-id="hi">{hero.greeting}</p>
      <p class="d3-years" data-arm>{hero.experience}</p>
      <p class="d3-tech" data-arm data-ask-id="stack">{hero.stackLine}</p>
      <p class="d3-reach" data-arm data-ask-id="f24">{hero.impact}</p>
      <div class="d3-actions" data-arm>
        <a href={hero.cv.href} data-circle-fill data-ask-id="cv" {...destinationLink(hero.cv.href)}><CircleFill label={hero.cv.label} /></a>
        <a href={hero.contact.href} class="d3-touch" data-ask-id="touch" {...destinationLink(hero.contact.href)}>{hero.contact.label} <span aria-hidden="true">→</span></a>
      </div>
    </div>

    <ul class="d3-plates" aria-label="Selected Work">
      {#each productObjects as item, index}
        <li class="d3-slot" data-slot={item.id}>
          <a href={item.href} class="d3-plate" data-plate={item.id} data-arm aria-label={`${item.name} case study`}
            {...destinationLink(item.href)}
            onpointerenter={() => (active = item.id)} onpointerleave={() => (active = undefined)}
            onfocus={() => (active = item.id)} onblur={() => (active = undefined)}>
            <span class="d3-float" data-float><span class="d3-tilt">
              <span class="d3-media"><img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="eager" fetchpriority="low" decoding="async" /></span>
              <span class="d3-caption">
                <span class="d3-num">{String(index + 1).padStart(2, '0')} / {item.category}</span>
                <span class="d3-name">{item.name}</span>
                <span class="d3-detail">{item.line}</span>
              </span>
            </span></span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
  <KineticDock />
</div>

<style>
  /* The homepage's work offset is painted in the hero colour (margins cancel). */
  .d3 { margin-bottom: calc(-1 * var(--work-offset, 64px)); padding-bottom: var(--work-offset, 64px); background: var(--paper); color: var(--ink); font-family: var(--hero-font); }
  /* Stage units from viewport units (see Direction 01): cq* differ across engines under zoom. */
  .d3-stage { --stage-h: max(calc(100svh / var(--lab-zoom, 1)), 780px); --cqi: calc(100vw / var(--lab-zoom, 1) / 100); --cqh: calc(var(--stage-h) / 100); position: relative; isolation: isolate; height: var(--stage-h); overflow: clip; --cx: calc(62 * var(--cqi)); --fig-h: calc(84 * var(--cqh)); }

  .d3-identity { position: absolute; z-index: 5; top: calc(4.2 * var(--cqh)); left: var(--page-x); display: inline-flex; align-items: baseline; gap: 16px; min-height: calc(44px / var(--lab-zoom, 1)); color: inherit; text-decoration: none; }
  .d3-wordmark { font: 800 24px/1 var(--hero-font); letter-spacing: -.01em; }
  .d3-city { font: 400 15px/1 'Lab Mono', ui-monospace, monospace; color: var(--muted, #4e5c54); }
  .d3-identity:focus-visible { outline: 3px solid var(--plum); }

  h1.d3-title { margin: 0; font: inherit; }
  .d3-figure { display: block; position: absolute; z-index: 2; left: calc(var(--cx) - var(--fig-h) * .375); bottom: 0; height: var(--fig-h); aspect-ratio: 1086 / 1448; pointer-events: none; }
  .d3-figure-in { display: block; height: 100%; }
  .d3-figure :global(.lab-portrait) { transition: opacity .45s; }
  .d3-figure :global(.lab-portrait) { height: 100%; }

  /* Plane 1: the wall. Two giant lines behind him; his head and neck cut into
     the ends of both words. Every glyph is its own physical object. */
  .d3-wall { position: absolute; z-index: 1; left: var(--page-x); top: calc(13.5 * var(--cqh)); display: block; }
  .d3-wall-line { display: block; white-space: nowrap; font: 800 min(calc(14 * var(--cqi)), calc(23 * var(--cqh)))/.88 var(--hero-font); letter-spacing: -.045em; color: var(--ink); }
  .d3-g, .d3-gm, .d3-gi { display: inline-block; }
  /* Plane 3: a sticker-cut line in front of his torso. The paper keyline keeps it
     legible on both the paper ground and the black sweater. */
  .d3-sticker { position: absolute; z-index: 3; left: calc(30 * var(--cqi)); top: calc(58 * var(--cqh)); display: block; }
  .d3-sticker-line { display: block; white-space: nowrap; font: 800 min(calc(4.6 * var(--cqi)), calc(7.6 * var(--cqh)))/1 var(--hero-font); letter-spacing: -.03em; color: var(--plum); -webkit-text-stroke: .16em var(--paper); paint-order: stroke fill; }

  .d3-copy { position: absolute; z-index: 4; left: var(--page-x); bottom: calc(12 * var(--cqh)); width: min(calc(28 * var(--cqi)), 540px); display: flex; flex-direction: column; gap: 12px; }
  .d3-hello { font: 600 22px/1.3 var(--hero-font); color: var(--plum); }
  .d3-years, .d3-reach { font: 600 20px/1.4 var(--hero-font); }
  .d3-tech { font: 500 22px/1.35 var(--hero-font); color: var(--muted, #4e5c54); }
  .d3-wall, .d3-sticker { pointer-events: none; }
  .d3-reach { padding-top: 12px; border-top: 1.5px solid rgb(20 42 34 / .18); }
  .d3-actions { display: flex; align-items: center; gap: 26px; margin-top: 10px; }
  .d3-touch { display: inline-flex; align-items: center; gap: 8px; min-height: calc(48px / var(--lab-zoom, 1)); color: var(--ink); font: 700 19px/1 var(--hero-font); text-decoration: none; }
  .d3-touch span { transition: transform .4s cubic-bezier(.2,.9,.25,1); }
  .d3-touch:hover { color: var(--plum); }
  .d3-touch:hover span { transform: translateX(4px); }
  .d3-touch:focus-visible { outline: 3px solid var(--plum); outline-offset: 4px; }

  /* The spread: each plate has a fixed slot on the composition grid. */
  .d3-plates { list-style: none; margin: 0; padding: 0; }
  /* --x is the slot centre, --y its top edge: no CSS transforms on GSAP targets. */
  .d3-slot { position: absolute; z-index: 1; left: calc(var(--x) - var(--w) / 2); top: var(--y); width: var(--w); }
  .d3-slot[data-slot='f24'] { --x: calc(88 * var(--cqi)); --y: calc(4 * var(--cqh)); --w: calc(8 * var(--cqi)); --tilt: -3deg; }
  .d3-slot[data-slot='needle'] { --x: calc(89 * var(--cqi)); --y: calc(28 * var(--cqh)); --w: calc(12.5 * var(--cqi)); --tilt: 2.5deg; }
  .d3-slot[data-slot='second-voice-ai'] { --x: calc(88 * var(--cqi)); --y: calc(49 * var(--cqh)); --w: calc(12.5 * var(--cqi)); --tilt: -2deg; }
  .d3-slot[data-slot='leu'] { --x: calc(89 * var(--cqi)); --y: calc(70 * var(--cqh)); --w: calc(12.5 * var(--cqi)); --tilt: 1.5deg; }
  .d3-plate { position: relative; display: block; color: inherit; text-decoration: none; }
  /* Ownership: slot → scroll, plate → intro, float → pointer, tilt → CSS only.
     GSAP never touches an element that carries CSS transitions or rotate. */
  .d3-float { display: block; }
  .d3-tilt { display: block; rotate: var(--tilt); transition: rotate .5s cubic-bezier(.2,.9,.25,1), opacity .35s; }
  .d3-media { display: block; overflow: hidden; border-radius: 6px; background: var(--sage); box-shadow: 0 1px 0 rgb(20 42 34 / .08), 0 14px 32px -18px rgb(20 42 34 / .45); }
  .d3-media img { display: block; width: 100%; height: auto; transition: scale .6s cubic-bezier(.2,.9,.25,1); }
  .d3-slot[data-slot='f24'] .d3-media img { aspect-ratio: 3 / 4; object-fit: cover; }
  .d3-slot:not([data-slot='f24']) .d3-media img { aspect-ratio: 16 / 10; object-fit: cover; object-position: 50% 0; }
  .d3-caption { display: grid; gap: 2px; padding-top: 8px; }
  .d3-num { font: 400 13px/1.2 'Lab Mono', ui-monospace, monospace; color: var(--muted, #4e5c54); }
  .d3-name { font: 800 18px/1.15 var(--hero-font); }
  .d3-detail { font: 500 15px/1.35 var(--hero-font); max-height: 0; opacity: 0; overflow: hidden; transition: max-height .45s cubic-bezier(.2,.9,.25,1), opacity .3s; }
  /* Focus or hover brings one product forward; the rest step back. */
  .d3[data-active] .d3-plate:not(:is(:hover, :focus-visible)) .d3-tilt { opacity: .42; }
  .d3[data-active] .d3-figure :global(.lab-portrait) { opacity: .82; }
  .d3-plate:is(:hover, :focus-visible) .d3-tilt { rotate: 0deg; }
  .d3-slot:has(.d3-plate:is(:hover, :focus-visible)) { z-index: 6; }
  .d3-plate:is(:hover, :focus-visible) .d3-media img { scale: 1.035; }
  .d3-plate:is(:hover, :focus-visible) .d3-detail { max-height: 3em; opacity: 1; }
  .d3-plate:focus-visible { outline: 3px solid var(--plum); outline-offset: 6px; border-radius: 6px; }

  /* Compact: the same idea at hand size. The products stay fanned behind him as a
     deck (captions move to the accessible name) and resolve into a strip on scroll. */
  @media (max-width: 1023px) {
    .d3-stage { height: auto; display: grid; grid-template-columns: minmax(0, 1fr); grid-template-areas: "id" "wall" "visual" "sticker" "copy"; padding: 18px 0 110px; overflow: clip; }
    h1.d3-title { display: contents; }
    .d3-identity, .d3-figure, .d3-copy, .d3-wall, .d3-sticker { position: relative; inset: auto; }
    .d3-wall { grid-area: wall; padding: 26px 20px 0; }
    .d3-wall-line { font-size: min(calc(20 * var(--cqi)), 120px); }
    .d3-sticker { grid-area: sticker; z-index: 3; padding: 18px 20px 0; }
    .d3-sticker-line { white-space: normal; font-size: min(calc(9 * var(--cqi)), 52px); }
    .d3-identity { grid-area: id; justify-self: start; margin-left: 20px; }
    .d3-figure { grid-area: visual; justify-self: center; width: min(calc(52 * var(--cqi)), 340px); height: auto; aspect-ratio: 1086 / 1250; overflow: hidden; margin-top: 18px; border-bottom: 1.5px solid var(--ink); }
    .d3-figure-in { height: auto; }
    .d3-figure :global(.lab-portrait) { height: auto; }
    .d3-plates { grid-area: visual; position: relative; z-index: 1; margin-top: 18px; }
    .d3-slot { left: var(--mx); top: var(--my); width: var(--mw); }
    .d3-slot[data-slot='f24'] { --mx: 4%; --my: 8%; --mw: 21%; }
    .d3-slot[data-slot='needle'] { --mx: 62%; --my: 4%; --mw: 35%; }
    .d3-slot[data-slot='second-voice-ai'] { --mx: 1%; --my: 50%; --mw: 31%; }
    .d3-slot[data-slot='leu'] { --mx: 67%; --my: 46%; --mw: 31%; }
    .d3-caption { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .d3-copy { grid-area: copy; width: auto; padding: 26px 20px 0; gap: 10px; }
    .d3-hello { font-size: 18px; }
    .d3-years, .d3-reach, .d3-tech { font-size: 17px; }
    .d3-actions { gap: 18px; flex-wrap: wrap; }
    .d3[data-active] .d3-plate:not(:is(:hover, :focus-visible)) .d3-tilt { opacity: 1; }
  }
  /* While resolving into the strip, products pass in front of him. */
  .d3:global([data-resolving]) .d3-slot { z-index: 3; }
  /* In the strip the captions may cross his sweater: give them a paper ground. */
  .d3-caption { justify-self: start; border-radius: 4px; transition: background-color .3s, padding .3s; }
  .d3:global([data-resolving]) .d3-caption { background: var(--paper); padding: 6px 8px 7px; margin-top: 6px; }
  @media (prefers-reduced-motion: reduce) {
    .d3-tilt, .d3-media img, .d3-detail, .d3-figure :global(.lab-portrait), .d3-touch span { transition: none; }
  }
</style>
