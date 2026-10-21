<script lang="ts">
  import { onMount } from 'svelte';
  import { motionSnapshot, motionState } from '$lib/motion/policy';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { selectedProjects } from '$lib/components/experience/work/selected-projects';
  import TypographicNav from './TypographicNav.svelte';
  import { typographicMotion } from './motion';
  import { d1Href } from './site';
  import { createTurntableHeader, DEFAULT_CONTENT, type HeaderContent, type HeaderInstance } from './turntable/src';
  import { renderHeader, renderRoleControls } from './turntable/src/template';
  import './turntable/styles/fonts.css';
  import './turntable/styles/turntable-header.css';
  import './reference-home.css';

  const needle = selectedProjects.find(project => project.id === 'needle')!;
  const assets = {
    front: '/images/wind-full-1086.webp',
    frontCompact: '/turntable-header/miguel-front-contour.webp',
    back: '/turntable-header/miguel-back-repaired.webp',
    room: '/turntable-header/room.jpg'
  };
  const content: HeaderContent = {
    ...DEFAULT_CONTENT,
    years: '4 years in frontend engineering.',
    introduction: {
      engineer: '6 years in UX.',
      designer: '6 years in UX.',
      project: { name: 'Needle', description: 'Search art in your browser.', image: needle.poster, href: needle.live! }
    },
    ctas: [
      { label: 'See the work', href: '#work', variant: 'primary', askId: 'selwork' },
      { label: 'View CV', href: d1Href('/cv', 'home'), variant: 'link', askId: 'cv' }
    ]
  };
  let root: HTMLDivElement;
  let host: HTMLDivElement;
  let controls: HTMLDivElement;
  let header: HeaderInstance | undefined;
  let paused = $state(false);
  function togglePlayback() {
    paused = !paused;
    if (paused) header?.pause(); else header?.play();
  }
  onMount(() => {
    header = createTurntableHeader(host, {
      assets, content, controlsContainer: controls, presentation: 'editorial',
      motion: { reduced: motionSnapshot().reduced, subscribe: notify => motionState.subscribe(state => notify(state.reduced)) }
    });
    host.querySelectorAll<HTMLAnchorElement>('.mah-ctas a').forEach(link => {
      Object.entries(destinationLink(link.getAttribute('href') ?? '')).forEach(([key, value]) => {
        if (value !== undefined) link.setAttribute(key, value);
      });
    });
    const photo = host.querySelector<HTMLElement>('.mah-photo')!;
    const drift = document.createElement('div');
    drift.className = 'mah-portrait-drift';
    photo.before(drift);
    drift.append(photo);
    const motion = labMotion(root, typographicMotion);
    return () => { motion.destroy(); header?.destroy(); header = undefined; };
  });
</script>

<svelte:head>
  <link rel="preload" href="/turntable-header/fonts/big-shoulders-display-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/turntable-header/fonts/schibsted-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/turntable-header/fonts/schibsted-grotesk-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/turntable-header/fonts/big-shoulders-display-latin-900-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div bind:this={root} class="d1 reference-hero" id="top" data-lab-root data-direction="typographic">
  <TypographicNav overHero />
  <div class="reference-hero-frame">
    <div bind:this={host} class="turntable-host">
      {@html renderHeader(content, assets, 'engineer', 'lime', false)}
    </div>
    <div bind:this={controls} hidden aria-hidden="true">
      {@html renderRoleControls(content, 'engineer', true)}
    </div>
  </div>
  <ul class="hero-facts" aria-label="Experience at a glance">
    <li><strong>{selectedProjects.length} projects</strong> of my own · live demos available</li>
    <li class="hero-facts-stack"><span>React · TypeScript · Svelte · Playwright</span>
      {#if !$motionState.reduced}
        <button type="button" class="portrait-pause" onclick={togglePlayback} aria-label={paused ? 'Play the role animation' : 'Pause the role animation'} aria-pressed={paused}>{paused ? '▶' : 'Ⅱ'}</button>
      {/if}
    </li>
  </ul>
</div>
