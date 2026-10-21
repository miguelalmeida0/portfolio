<script lang="ts">
  import { hero } from '$lib/hero-lab/content';
  import LabPortrait from '$lib/hero-lab/LabPortrait.svelte';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { editionHref } from '$lib/hero-lab/editions/site';
  import { destinationLink } from '$lib/navigation/destination-link';
  import data from '$lib/story/story.json';
  import Chars from './Chars.svelte';
  import KsNav from './KsNav.svelte';
  import KsAction from './KsAction.svelte';
  import { homeMotion } from './home-motion';

  const [roleA, roleB] = hero.role;
  // "& product designer." breaks before its last word so "&" never sits alone.
  const lines = [...roleA.split(' '), roleB.slice(0, roleB.lastIndexOf(' ')), roleB.slice(roleB.lastIndexOf(' ') + 1)];
  const cvHref = editionHref('kinetic-story', 'home', hero.cv.href);
  const chapters = data.shortVersion.chapters;
</script>

<div class="ks" id="top" data-lab-root data-direction="kinetic-story" use:labMotion={homeMotion}>
  <KsNav page="home" />

  <section class="hero" data-hero aria-labelledby="intro-heading">
    <p class="ks-greeting" data-arm data-meta >{hero.greeting}</p>
    <h1 id="intro-heading" aria-label={hero.roleLabel} >
      {#each lines as line, i}
        <span class="line" class:second={i > 1} data-line data-heading-text><Chars text={line} /></span>
      {/each}
    </h1>

    <!-- The portrait seen through a cabin window: the frame moves with the page, the view inside against it. -->
    <div class="window" data-window>
      <div class="window-in" data-window-in data-arm>
        <div class="window-view" data-window-view><LabPortrait sizes="(max-width: 1023px) 40vw, 26vh" /></div>
      </div>
    </div>

    <div class="ks-facts" data-facts>
      <p class="ks-years" data-arm data-meta>{hero.experience}</p>
      <p class="ks-stack" data-arm data-meta >{hero.stackLine}</p>
      <p class="ks-impact" data-arm data-meta >{hero.impact}</p>
      <div class="ks-actions" data-arm data-meta>
        <KsAction href={cvHref} label={hero.cv.label}  />
        <a href={hero.contact.href} class="ks-touch"  {...destinationLink(hero.contact.href)}><span>{hero.contact.label}</span> <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

  <!-- The short version as a sequence: one chapter at a time while the stage holds. -->
  <section class="journey" data-journey aria-labelledby="journey-title">
    <div class="j-stage" data-j-stage>
      <h2 id="journey-title" class="j-title">My path into frontend</h2>
      <svg class="j-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path data-j-path d="M -2 92 C 18 99, 38 76, 56 86 S 84 70, 90 40 S 97 6, 103 2" pathLength="1" />
      </svg>
      <ol class="j-rail" aria-hidden="true">
        <span class="j-rail-line"><span class="j-rail-fill" data-j-fill></span></span>
        {#each chapters as chapter, i}
          <li class="j-stop" data-j-stop={i} class:on={i === 0}><span class="j-num">{String(i + 1).padStart(2, '0')}</span>{chapter.period}</li>
        {/each}
      </ol>
      <div class="j-frame" data-j-frame>
        <span class="j-ground" data-j-ground></span>
        <div class="j-portrait"><LabPortrait sizes="(max-width: 1023px) 60vw, 40vh" eager={false} /></div>
      </div>
      <ol class="j-chapters">
        {#each chapters as chapter, i}
          <li class="j-chapter" data-j-chapter={i}>
            <p class="j-period"><span class="j-num">{String(i + 1).padStart(2, '0')}</span> {chapter.period}</p>
            <h3 class="j-word"><Chars text={chapter.title} label={chapter.title} /></h3>
            <p class="j-text" data-j-text>{chapter.text}</p>
          </li>
        {/each}
      </ol>
    </div>
  </section>
</div>

<style>
  .ks { --ground: var(--forest); background: var(--ground); color: var(--paper); font-family: var(--hero-font); }
  .hero, .j-stage { --stage-h: max(calc(100svh / var(--lab-zoom, 1)), 760px); --cqi: calc(100vw / var(--lab-zoom, 1) / 100); --cqh: calc(var(--stage-h) / 100); --edge: var(--page-x); }

  /* ——— Hero ——— */
  .hero { position: relative; height: var(--stage-h); overflow: clip; }
  .ks-greeting { position: absolute; left: var(--edge); top: max(calc(15 * var(--cqh)), 116px); font: 600 24px/1.3 var(--hero-font); }
  h1 { position: absolute; left: var(--edge); top: calc(22 * var(--cqh)); margin: 0; font: 700 min(calc(16.5 * var(--cqh)), calc(9.6 * var(--cqi)))/.95 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; color: var(--lime); letter-spacing: -.005em; }
  .line { display: block; perspective: 600px; }
  .line.second { color: var(--paper); }
  .window { position: absolute; left: calc(64 * var(--cqi)); top: calc(17 * var(--cqh)); width: calc(29 * var(--cqh)); height: calc(43 * var(--cqh)); }
  .window { border-radius: 46% / 32%; outline: 2px solid rgb(228 237 191 / .4); outline-offset: 12px; }
  .window-in { width: 100%; height: 100%; border-radius: 46% / 32%; clip-path: inset(0% 0% 0% 0%); }
  .window-view { position: absolute; inset: -6% -10% 0; background: var(--lime); border-radius: inherit; overflow: hidden; }
  .window-in { position: relative; overflow: hidden; background: var(--lime); }
  .window-view :global(.lab-portrait) { position: absolute; left: 50%; bottom: -36%; width: 132%; height: auto; margin-left: -66%; }
  .ks-facts { position: absolute; left: calc(64 * var(--cqi)); right: var(--edge); top: calc(66 * var(--cqh)); display: grid; gap: 10px; }
  .ks-years, .ks-impact { font: 700 22px/1.35 var(--hero-font); }
  .ks-stack { font: 500 22px/1.35 var(--hero-font); color: var(--lime); }
  .ks-impact { max-width: 26ch; }
  .ks-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 28px; margin-top: 10px; }
  .ks-touch { display: inline-flex; align-items: center; gap: 8px; min-height: 60px; color: var(--paper); font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; text-decoration: none; }
  .ks-touch span:first-child { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 7px; transition: text-underline-offset .3s, color .3s; }
  .ks-touch span:last-child { display: inline-block; transition: transform .4s cubic-bezier(.16,1,.3,1); }
  .ks-touch:is(:hover, :focus-visible) span:first-child { color: var(--lime); text-underline-offset: 10px; }
  .ks-touch:is(:hover, :focus-visible) span:last-child { transform: translateX(4px); }
  .ks-touch:focus-visible { outline: 3px solid var(--lime); outline-offset: 4px; }

  /* ——— Journey: static by default (no JS, reduced motion) — a readable stack ——— */
  .journey { position: relative; border-top: 2px solid rgb(228 237 191 / .2); }
  .j-stage { position: relative; padding: clamp(72px, 9vw, 140px) var(--edge); }
  .j-title { font: 400 14px/1 'Lab Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--lime); }
  .j-path, .j-rail { display: none; }
  .j-frame { position: relative; width: min(340px, 60%); aspect-ratio: 1086 / 1300; margin: 40px 0 0 auto; overflow: hidden; }
  .j-ground { position: absolute; inset: 0; background: var(--lime); border-radius: 46% / 32%; }
  .j-portrait { position: absolute; inset: 0; }
  .j-portrait :global(.lab-portrait) { width: 100%; height: 100%; }
  .j-chapters { list-style: none; margin: 32px 0 0; padding: 0; display: grid; gap: 56px; }
  .j-period { font: 400 13px/1 'Lab Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--lime); }
  .j-num { margin-right: .6em; color: var(--paper); }
  .j-word { margin-top: 12px; font: 700 clamp(64px, 11vw, 200px)/.95 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; color: var(--lime); }
  .j-word :global(.ks-w) { perspective: 700px; }
  .j-text { max-width: 38ch; margin-top: 18px; font: 500 clamp(18px, 1.5vw, 23px)/1.5 var(--hero-font); }

  /* ——— Journey: the held sequence (full motion only) ——— */
  :global([data-lab-motion='full']) .journey { height: calc(var(--j-stage-h) * 4); --j-stage-h: max(calc(100svh / var(--lab-zoom, 1)), 760px); }
  :global([data-lab-motion='full']) .j-stage { position: sticky; top: 0; height: var(--j-stage-h); padding: 0; overflow: clip; }
  :global([data-lab-motion='full']) .j-title { position: absolute; left: var(--edge); top: max(calc(15 * var(--cqh)), 112px); }
  :global([data-lab-motion='full']) .j-path { display: block; position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
  .j-path path { fill: none; stroke: var(--lime); stroke-width: 2; stroke-dasharray: 1; stroke-dashoffset: 1; vector-effect: non-scaling-stroke; opacity: .7; }
  :global([data-lab-motion='full']) .j-rail { display: block; position: absolute; left: var(--edge); top: calc(28 * var(--cqh)); height: calc(46 * var(--cqh)); margin: 0; padding: 0 0 0 22px; list-style: none; }
  .j-rail-line { position: absolute; left: 0; top: 4px; bottom: 4px; width: 2px; background: rgb(228 237 191 / .2); }
  .j-rail-fill { position: absolute; inset: 0; background: var(--lime); transform-origin: 50% 0; transform: scaleY(0); }
  :global([data-lab-motion='full']) .j-stop { position: absolute; left: 22px; white-space: nowrap; font: 400 13px/1 'Lab Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: rgb(249 247 238 / .45); transition: color .4s; }
  .j-stop:nth-of-type(1) { top: 0; } .j-stop:nth-of-type(2) { top: 50%; } .j-stop:nth-of-type(3) { top: 100%; transform: translateY(-100%); }
  .j-stop.on { color: var(--lime); }
  .j-stop.on .j-num { color: var(--lime); }
  :global([data-lab-motion='full']) .j-frame { position: absolute; z-index: 2; margin: 0; right: var(--edge); bottom: 0; width: calc(56 * var(--cqh)); height: calc(86 * var(--cqh)); aspect-ratio: auto; overflow: visible; }
  :global([data-lab-motion='full']) .j-ground { border-radius: 0; }
  :global([data-lab-motion='full']) .j-portrait :global(.lab-portrait img) { object-position: 50% 100%; }
  :global([data-lab-motion='full']) .j-chapters { position: absolute; z-index: 3; left: calc(var(--edge) + 13 * var(--cqi)); right: calc(var(--edge) + 60 * var(--cqh)); top: calc(30 * var(--cqh)); margin: 0; display: grid; gap: 0; }
  :global([data-lab-motion='full']) .j-chapter { grid-area: 1 / 1; }
  :global([data-lab-motion='full']) .j-period { display: none; }
  :global([data-lab-motion='full']) .j-word { margin-top: 0; font-size: min(calc(13 * var(--cqh)), calc(7.6 * var(--cqi))); }
  :global([data-lab-motion='full']) .j-text { margin-top: 28px; }

  @media (max-width: 1023px) {
    .hero { --edge: 20px; height: auto; padding: calc(64px + 28px) var(--edge) 48px; display: flex; flex-direction: column; }
    .ks-greeting, h1, .window, .ks-facts { position: relative; inset: auto; }
    .ks-greeting { font-size: 18px; }
    h1 { margin-top: 14px; font-size: min(calc(19 * var(--cqi)), 128px); }
    .window { position: absolute; right: var(--edge); left: auto; top: calc(64px + 70px); width: calc(28 * var(--cqi)); height: calc(42 * var(--cqi)); }
    .window { outline-offset: 6px; }
    .ks-facts { margin-top: 28px; }
    .ks-years, .ks-impact, .ks-stack { font-size: 18px; }
    .ks-actions { margin-top: 6px; }
    :global([data-lab-motion='full']) .journey { height: calc(100svh * 3.6); }
    :global([data-lab-motion='full']) .j-stage { --j-stage-h: 100svh; --stage-h: 100svh; --edge: 20px; height: 100svh; }
    :global([data-lab-motion='full']) .j-title { top: 84px; }
    :global([data-lab-motion='full']) .j-rail { top: 112px; left: var(--edge); right: var(--edge); height: 30px; padding: 0; }
    .j-rail-line { left: 0; right: 0; top: auto; bottom: 0; width: auto; height: 2px; }
    .j-rail-fill { transform-origin: 0 50%; transform: scaleX(0); }
    :global([data-lab-motion='full']) .j-stop { top: 0; transform: none; font-size: 11px; }
    .j-stop:nth-of-type(1) { left: 0; } .j-stop:nth-of-type(2) { left: 50%; transform: translateX(-50%); } .j-stop:nth-of-type(3) { left: auto; right: 0; }
    :global([data-lab-motion='full']) .j-stop:nth-of-type(1) { left: 0; }
    :global([data-lab-motion='full']) .j-stop:nth-of-type(2) { left: 50%; transform: translateX(-50%); }
    :global([data-lab-motion='full']) .j-stop:nth-of-type(3) { left: auto; right: 0; }
    :global([data-lab-motion='full']) .j-chapters { left: var(--edge); right: var(--edge); top: 170px; }
    :global([data-lab-motion='full']) .j-word { font-size: min(calc(16 * var(--cqi)), 104px); }
    :global([data-lab-motion='full']) .j-text { margin-top: 16px; font-size: 17px; max-width: 30ch; }
    :global([data-lab-motion='full']) .j-frame { right: var(--edge); width: min(calc(56 * var(--cqi)), 340px); height: min(calc(44svh), 440px); }
  }
  @media (prefers-reduced-motion: reduce) { .ks-touch span, .j-stop { transition: none; } }
</style>
