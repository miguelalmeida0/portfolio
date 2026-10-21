<script lang="ts">
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

  const directions = [
    {
      id: '01', slug: 'typographic', name: 'The Living Typographic Portrait',
      thesis: 'The role line is set around the portrait. “Frontend” and “engineer” sit behind him, split by the gutter his head occupies; “& product designer.” crosses in front on a forest band. The photograph decides where the type breaks.',
      motion: 'Words slide outward from behind his head, the portrait rises into the gutter, the band shutters open. Scrolling turns the band into a curtain that continues into Selected Work.',
      nav: 'A masthead with rolling Antonio labels that condenses after the hero; an index sheet on mobile.'
    },
    {
      id: '02', slug: 'cinematic', name: 'The Cinematic Engineer',
      thesis: 'A title card in camera depth. “Frontend” and “engineer” part around his head behind him, “& product designer.” runs across his torso as a lime lower third in front, the facts sit as credits and both actions live in the letterbox bar.',
      motion: 'The lens opens as a slit on his eyes while the title focus-pulls in glyph by glyph. The pointer moves the camera: three planes parallax and focus racks to the plane you point at. Scrolling flies the lower third past the camera, pushes in on his face and closes on the eye slit as Selected Work slides over it.',
      nav: 'A letterbox bar with viewfinder focus marks; a credit-roll menu on mobile.'
    },
    {
      id: '03', slug: 'kinetic', name: 'The Kinetic Product Story',
      thesis: 'A magnetic type wall: “Frontend / engineer” is set huge behind him and his head cuts into its ends; “& product designer.” is a sticker-cut line across his sweater; the four products he built (F24, Needle, Second Voice AI, Leu) sit in a rail, each a real case-study link.',
      motion: 'Letters drop onto the wall, the sticker is slapped on and the products are dealt from behind him. Every letter is pushed by the pointer and a press sends a ripple through the wall. Scrolling flings the letters away while the products pass in front of him into one strip in Selected Work order.',
      nav: 'A bottom dock with a moving section indicator that steps aside while you read.'
    }
  ] as const;

  let device = $state<'desktop' | 'mobile'>('desktop');
  // The site forbids framing (X-Frame-Options: DENY), so previews are real
  // browser recordings of each route; the links open the live prototypes.
  const media = (slug: string) => ({
    poster: `/hero-lab/${slug}-${device}.png`,
    video: `/hero-lab/${slug}-${device}.webm`
  });
</script>

<svelte:head>
  <title>Hero lab — three directions · Miguel Almeida</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="lab shell" aria-labelledby="lab-title">
  <header class="lab-head">
    <h1 id="lab-title">Hero lab</h1>
    <p>Three working directions for the homepage hero. Each one runs above the unchanged Selected Work, contact and footer. The production homepage at <a href="/">/</a> is untouched.</p>
    <div class="lab-device" role="group" aria-label="Preview size">
      <button type="button" aria-pressed={device === 'desktop'} onclick={() => (device = 'desktop')}>Desktop 1440</button>
      <button type="button" aria-pressed={device === 'mobile'} onclick={() => (device = 'mobile')}>Mobile 390</button>
    </div>
  </header>

  <ol class="lab-list">
    {#each directions as direction}
      <li class="lab-item" data-device={device}>
        <div class="lab-text">
          <p class="lab-num">{direction.id}</p>
          <h2>{direction.name}</h2>
          <p>{direction.thesis}</p>
          <p class="lab-sub"><strong>Motion.</strong> {direction.motion}</p>
          <p class="lab-sub"><strong>Navigation.</strong> {direction.nav}</p>
          <a class="lab-open" href={`/hero-lab/${direction.slug}`}>Open direction {direction.id} <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <figure class="lab-frame" style:aspect-ratio={device === 'desktop' ? '1440 / 900' : '390 / 844'}>
          {#key device}
            <video src={media(direction.slug).video} poster={media(direction.slug).poster} muted loop playsinline controls preload="none"
              aria-label={`Recorded motion of direction ${direction.id}, ${device}`}></video>
          {/key}
          <figcaption>Recorded in Chromium: opening, pointer and scroll hand-off.</figcaption>
        </figure>
      </li>
    {/each}
  </ol>
</section>

<style>
  .lab { padding-block: var(--page-start, 32px) 96px; font-family: var(--hero-font); color: var(--ink); }
  .lab-head { display: grid; gap: 16px; max-width: 760px; margin-bottom: 48px; }
  h1 { font: 800 var(--type-page-title, 56px)/1.05 var(--hero-font); letter-spacing: -.03em; }
  .lab-head p { font-size: 19px; line-height: 1.5; }
  .lab-head a { color: var(--plum); text-decoration: underline; text-underline-offset: 4px; }
  .lab-device { display: inline-flex; gap: 6px; }
  .lab-device button { min-height: 44px; padding: 0 16px; border: 1.5px solid var(--ink); border-radius: 999px; background: none; font: 600 15px/1 var(--hero-font); color: var(--ink); cursor: pointer; }
  .lab-device button[aria-pressed='true'] { background: var(--ink); color: var(--paper); }
  .lab-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 72px; }
  .lab-item { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 40px; align-items: start; padding-top: 28px; border-top: 2px solid var(--ink); }
  .lab-item[data-device='mobile'] { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
  .lab-text { display: grid; gap: 12px; }
  .lab-num { font: 400 15px/1 'JetBrains Mono', ui-monospace, monospace; color: var(--plum); }
  h2 { font: 800 34px/1.1 var(--hero-font); letter-spacing: -.02em; }
  .lab-text p { font-size: 17px; line-height: 1.55; max-width: 60ch; }
  .lab-sub { color: var(--muted, #4e5c54); }
  .lab-open { justify-self: start; display: inline-flex; align-items: center; gap: 6px; min-height: 48px; margin-top: 6px; padding: 0 20px; border-radius: 999px; background: var(--plum); color: var(--paper); font: 700 16px/1 var(--hero-font); text-decoration: none; }
  .lab-open:hover { background: var(--ink); }
  .lab-open:focus-visible { outline: 3px solid var(--plum); outline-offset: 3px; }
  .lab-frame { margin: 0; display: grid; gap: 8px; }
  .lab-item[data-device='mobile'] .lab-frame { max-width: 360px; justify-self: center; }
  video { display: block; width: 100%; height: auto; aspect-ratio: inherit; border-radius: 12px; border: 1.5px solid rgb(20 42 34 / .2); background: var(--sage); object-fit: cover; }
  figcaption { font-size: 14px; color: var(--muted, #4e5c54); }
  @media (max-width: 1023px) { .lab-item, .lab-item[data-device='mobile'] { grid-template-columns: 1fr; } }
</style>
