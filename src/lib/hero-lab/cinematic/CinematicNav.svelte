<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { gsap } from 'gsap';
  import { hero, labNavigation } from '$lib/hero-lab/content';
  import { followMenuLink, lockPage } from '$lib/hero-lab/sheet';
  import { motionState } from '$lib/motion/policy';
  import { curves } from '$lib/hero-lab/runtime';

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let open = $state(false);
  let release = () => {};

  async function show() {
    if (!dialog) return;
    open = true;
    await tick();
    dialog.showModal();
    release = lockPage();
    if ($motionState.reduced) return;
    // The menu arrives like a credit roll: rows rise into a fixed reading line.
    gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: .3, ease: 'power1.out' });
    gsap.fromTo(dialog.querySelectorAll('[data-credit]'), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: curves.dolly, stagger: .07, delay: .05 });
  }
  async function hide() {
    if (!dialog?.open) return;
    if (!$motionState.reduced) await gsap.to(dialog, { opacity: 0, duration: .28, ease: 'power1.in' });
    dialog.close();
    // The `close` event is queued; unlock scrolling now so a menu link can travel.
    release(); release = () => {};
  }
  let travelling = false;
  function closed() {
    open = false; release(); release = () => {};
    // After a menu link moves focus to its destination, do not pull it back.
    if (!travelling) trigger?.focus({ preventScroll: true });
    travelling = false;
  }
  function travel(event: MouseEvent) { travelling = true; followMenuLink(event, hide); }
  beforeNavigate(() => { if (dialog?.open) dialog.close(); });
  onMount(() => () => release());
</script>

<header class="d2-bar" data-d2-bar>
  <div class="d2-bar-inner" data-arm>
    <a href="#top" class="d2-identity" data-identity-home aria-label={hero.homeLabel}>
      <span class="d2-name">Miguel Almeida</span>
      <span class="d2-city" >{hero.city}</span>
    </a>
    <nav aria-label="Main navigation" class="d2-nav">
      {#each labNavigation as link}
        <a href={link.href} class="d2-focus" >{link.label}<span class="d2-marks" aria-hidden="true"></span></a>
      {/each}

    </nav>
    <button bind:this={trigger} type="button" class="d2-menu d2-focus" aria-haspopup="dialog" aria-expanded={open}
      aria-controls="d2-menu" onclick={show}>Menu<span class="d2-marks" aria-hidden="true"></span></button>
  </div>
</header>

<dialog bind:this={dialog} id="d2-menu" class="d2-sheet" aria-label="Site menu" onclose={closed}>
  <div class="d2-sheet-inner">
    <div class="d2-sheet-top">
      <span class="d2-name">Miguel Almeida</span>
      <button type="button" class="d2-focus d2-close" onclick={hide}>Close<span class="d2-marks" aria-hidden="true"></span></button>
    </div>
    <ul>
      {#each labNavigation as link}
        <li data-credit>
          <a href={link.href} data-mobile-route-link onclick={travel}>
            <span class="d2-credit-role">{link.description}</span>
            <span class="d2-credit-name">{link.label}</span>
          </a>
        </li>
      {/each}
      <li data-credit>

      </li>
    </ul>
  </div>
</dialog>

<style>
  .d2-bar { position: fixed; inset: 0 0 auto; z-index: 50; height: var(--d2-bar-h, 72px); background: var(--d2-black, #070d0b); color: var(--d2-text, #f1eee3); }
  .d2-bar-inner { height: 100%; width: calc(100% - 2 * var(--page-x)); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .d2-identity { display: inline-flex; align-items: baseline; gap: 14px; min-height: 44px; padding-top: 12px; color: inherit; text-decoration: none; }
  .d2-name { font: 400 26px/1 'Lab Newsreader', Georgia, serif; letter-spacing: -.01em; }
  .d2-city { font: 400 14px/1 'Lab Mono', ui-monospace, monospace; color: var(--d2-muted, #a9b7ae); }
  .d2-nav { display: flex; align-items: center; gap: 12px; }
  /* Viewfinder focus marks: two corner brackets close in on the target. */
  .d2-focus { position: relative; display: inline-flex; align-items: center; min-height: 44px; padding: 0 14px; color: inherit; background: none; border: 0; text-decoration: none; cursor: pointer; font: 400 15px/1 'Lab Mono', ui-monospace, monospace; letter-spacing: .02em; transition: color .3s; }
  .d2-marks, .d2-marks::before, .d2-marks::after { pointer-events: none; }
  .d2-marks { position: absolute; inset: 6px 2px; }
  .d2-marks::before, .d2-marks::after { content: ''; position: absolute; width: 9px; height: 9px; border-color: var(--d2-accent, #e4edbf); border-style: solid; opacity: 0; transition: transform .45s cubic-bezier(.76,0,.24,1), opacity .25s; }
  .d2-marks::before { left: 0; top: 0; border-width: 1.5px 0 0 1.5px; transform: translate(-7px, -5px); }
  .d2-marks::after { right: 0; bottom: 0; border-width: 0 1.5px 1.5px 0; transform: translate(7px, 5px); }
  .d2-focus:is(:hover, :focus-visible) { color: var(--d2-accent, #e4edbf); outline: none; }
  .d2-focus:is(:hover, :focus-visible, [aria-expanded='true']) .d2-marks::before,
  .d2-focus:is(:hover, :focus-visible, [aria-expanded='true']) .d2-marks::after { opacity: 1; transform: none; }
  .d2-focus:focus-visible .d2-marks::before, .d2-focus:focus-visible .d2-marks::after { width: 12px; height: 12px; border-width: 2.5px 0 0 2.5px; }
  .d2-focus:focus-visible .d2-marks::after { border-width: 0 2.5px 2.5px 0; }
  .d2-menu { display: none; }
  @media (max-width: 1023px) {
    .d2-bar { --d2-bar-h: 60px; }
    .d2-bar-inner { width: calc(100% - 32px); }
    .d2-nav { display: none; }
    .d2-menu { display: inline-flex; margin-right: -14px; }
    .d2-name { font-size: 22px; }
    .d2-city { font-size: 12px; }
  }
  .d2-sheet { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: var(--d2-black, #070d0b); color: var(--d2-text, #f1eee3); }
  .d2-sheet::backdrop { background: #070d0b; }
  .d2-sheet-inner { height: 100%; display: flex; flex-direction: column; padding: 8px 16px max(24px, env(safe-area-inset-bottom)); }
  .d2-sheet-top { display: flex; align-items: center; justify-content: space-between; min-height: 52px; }
  .d2-close { margin-right: -14px; }
  ul { list-style: none; margin: auto 0 0; padding: 0; display: grid; gap: 4px; }
  li a { display: grid; gap: 6px; width: 100%; padding: 14px 4px; color: inherit; text-decoration: none; text-align: left; background: none; border: 0; border-top: 1px solid rgb(241 238 227 / .16); cursor: pointer; font: inherit; }
  .d2-credit-role { font: 400 12px/1 'Lab Mono', ui-monospace, monospace; letter-spacing: .12em; color: var(--d2-muted, #a9b7ae); }
  .d2-credit-name { font: 400 44px/1 'Lab Newsreader', Georgia, serif; letter-spacing: -.02em; }
  li a:focus-visible { outline: 2px solid var(--d2-accent, #e4edbf); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .d2-marks::before, .d2-marks::after, .d2-focus { transition: none; } }
</style>
