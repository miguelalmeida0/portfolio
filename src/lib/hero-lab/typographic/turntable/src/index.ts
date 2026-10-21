import { gsap } from 'gsap';
import { DEFAULT_CONTENT, GEOMETRY, MOTION } from './config';
import { computeLayout } from './layout';
import { RoleClock } from './clock';
import { SplitWord } from './split-word';
import { endSweep, runSweep, type SweepItem } from './sweep';
import { renderHeader, renderRoleControls } from './template';
import { TurnRenderer } from './turn-renderer';
import { prepareCopyWipe } from './copy-wipe';
import type { HeaderContent, HeaderInstance, HeaderOptions, Role } from './types';

export type { HeaderContent, HeaderInstance, HeaderOptions, Role, EngineerTheme, HeaderAssets, HeaderCta } from './types';
export { DEFAULT_CONTENT, MOTION, GEOMETRY } from './config';

const other = (r: Role): Role => (r === 'engineer' ? 'designer' : 'engineer');
const wait = (ms: number, signal: AbortSignal) => new Promise<void>((resolve) => {
  if (signal.aborted) { resolve(); return; }
  const finish = () => { clearTimeout(timer); signal.removeEventListener('abort', finish); resolve(); };
  const timer = setTimeout(finish, ms);
  signal.addEventListener('abort', finish, { once: true });
});

/**
 * Mount the Turntable header into `container` (its contents are replaced).
 * The header is self-contained: it owns its tokens, layout, animation clock and WebGL context.
 */
export function createTurntableHeader(container: HTMLElement, options: HeaderOptions): HeaderInstance {
  const content: HeaderContent = {
    ...DEFAULT_CONTENT,
    ...options.content,
    words: { ...DEFAULT_CONTENT.words, ...options.content?.words },
    roleLabels: { ...DEFAULT_CONTENT.roleLabels, ...options.content?.roleLabels },
  };
  if ([...content.words.engineer].length !== [...content.words.designer].length)
    throw new Error('[turntable-header] both words must have the same number of letters');

  let role: Role = options.initialRole ?? 'engineer';
  const theme = options.engineerTheme ?? 'lime';
  container.innerHTML = renderHeader(content, options.assets, role, theme, !options.controlsContainer);
  if (options.controlsContainer) options.controlsContainer.innerHTML = renderRoleControls(content, role, true);

  const root = container.querySelector<HTMLElement>('.mah')!;
  const q = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const room = q<HTMLElement>('.mah-room');
  const roomImg = q<HTMLImageElement>('.mah-room-img');
  const fog = q<HTMLElement>('.mah-fog');
  const photo = q<HTMLElement>('.mah-photo');
  const front = q<HTMLImageElement>('.mah-photo-front');
  const back = q<HTMLImageElement>('.mah-photo-back');
  const tabs = (options.controlsContainer ?? root).querySelector<HTMLElement>('[data-mah-tabs]')!;
  const pauseBtn = tabs.querySelector<HTMLButtonElement>('[data-mah-pause]')!;
  const probeE = q<HTMLElement>('.mah-probe.mah-m-e');
  const probeD = q<HTMLElement>('.mah-probe.mah-m-d');
  const word = new SplitWord(q<HTMLElement>('.mah-word'), q<HTMLElement>('.mah-measure'));

  const reduce = options.motion ? null : window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = options.motion?.reduced ?? reduce!.matches;
  let booted = false;
  let finishBoot!: () => void;
  const bootReady = new Promise<void>(resolve => { finishBoot = resolve; });
  let rendererOwner: AbortController | null = null;
  const autoplay = options.autoplay !== false;
  let renderer: TurnRenderer | null = null;
  let rendererState: HeaderInstance['renderer'] = 'pending';
  let busy = false, destroyed = false, resizeQueued = false;
  const lifetime = new AbortController();
  let activeTurn: AbortController | null = null;
  let desired = role;
  let processing: Promise<void> | null = null;
  const tweens = new Set<gsap.core.Animation>();
  function own<T extends gsap.core.Animation>(animation: T): T {
    tweens.add(animation);
    for (const event of ['onComplete', 'onInterrupt'] as const) {
      const previous = animation.eventCallback(event);
      animation.eventCallback(event, () => { tweens.delete(animation); previous?.(); });
    }
    return animation;
  }
  let copyWipe: ReturnType<typeof prepareCopyWipe> | null = null;

  /* ---------- layout ---------- */
  function relayout(): void {
    if (destroyed) return;
    if (busy) resizeQueued = true;
    const width = root.clientWidth;
    const gutter = options.presentation === 'editorial' ? Math.max(20, width * .039) : Math.min(56, Math.max(16, width * 0.034));
    root.style.setProperty('--mah-gutter', `${gutter}px`);
    const per = Math.max(word.per(content.words.engineer), word.per(content.words.designer));
    // Select the CSS layout before measuring: a resize across the breakpoint
    // must not reuse the previous layout's height or copy arrangement.
    root.dataset.layout = width >= GEOMETRY.wideMin ? 'wide' : 'narrow';
    const availableHeight = window.innerHeight - (root.getBoundingClientRect().top + window.scrollY);
    const height = root.dataset.layout === 'wide' ? Math.max(640, availableHeight) : availableHeight;
    const L = computeLayout(width, height, window.innerHeight, per, word.capRatio, gutter, q<HTMLElement>('.mah-copy').offsetHeight, options.presentation);
    root.dataset.layout = L.wide ? 'wide' : 'narrow';
    root.style.setProperty('--mah-stage-h', `${L.stageHeight}px`);
    root.style.setProperty('--mah-word-top', `${L.wordTop}px`);
    root.style.setProperty('--mah-ph', `${Math.max(120, L.photoHeight)}px`);
    root.style.setProperty('--mah-photo-bottom', `${L.photoBottom ?? 0}px`);
    root.style.setProperty('--mah-colw', `${L.columnWidth}px`);
    if (busy) word.resizeDuringTurn(L.fontSize, L.stageWidth ?? width);
    else word.fit(content.words[role], L.fontSize, L.stageWidth ?? width);
    renderer?.resize();
  }

  /* ---------- tokens and parts ---------- */
  const token = (el: HTMLElement, name: string) => getComputedStyle(el).getPropertyValue(name).trim();
  const setLocal = (el: Element, r: Role) => { el.classList.toggle('mah-m-e', r === 'engineer'); el.classList.toggle('mah-m-d', r === 'designer'); };
  const parts = () => Array.from(root.querySelectorAll<HTMLElement>('[data-mah-part]'));
  function syncTabs(next: Role): void {
    tabs.dataset.on = next;
    tabs.querySelectorAll<HTMLElement>('[data-mah-role]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mahRole === next)));
  }

  function commitPart(el: HTMLElement, next: Role, animate: boolean): void {
    setLocal(el, next);
    if (el.hasAttribute('data-mah-tabs')) {
      syncTabs(next);
    }
    if (el.hasAttribute('data-mah-line')) {
      if (!animate) {
        // Both masks may be open when a restrictive policy interrupts a turn.
        // Resolve every child, even when the first visible child is the target.
        const lines = el.querySelectorAll<HTMLElement>('[data-for]');
        lines.forEach(line => line.classList.toggle('is-off', line.dataset.for !== next));
        gsap.set(lines, { clearProps: 'clipPath' });
        return;
      }
      const out = el.querySelector<HTMLElement>('[data-for]:not(.is-off)');
      const inn = el.querySelector<HTMLElement>(`[data-for="${next}"]`);
      if (!out || !inn || out === inn) return;
      const M = MOTION.line;
      // Complementary masks replace the line at full contrast. Both grid
      // children share one box, so their visible regions never overlap.
      const duration = M.overlap + M.in;
      own(gsap.timeline())
        .fromTo(out, { clipPath: 'inset(0% 0 0% 0)' }, { clipPath: 'inset(0% 0 100% 0)', duration, ease: M.inEase, onComplete: () => { out.classList.add('is-off'); gsap.set(out, { clearProps: 'clipPath' }); } }, 0)
        .fromTo(inn, { clipPath: 'inset(100% 0 0% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration, ease: M.inEase, onStart: () => inn.classList.remove('is-off'), clearProps: 'clipPath' }, 0);
    }
  }

  function cleanupLocal(): void {
    root.querySelectorAll('.mah-m-e,.mah-m-d').forEach((el) => { if (!el.classList.contains('mah-probe')) el.classList.remove('mah-m-e', 'mah-m-d'); });
  }

  function instant(next: Role): void {
    if (next === 'designer') loadDesignerImages();
    role = next;
    root.dataset.role = next;
    syncTabs(next);
    parts().forEach((p) => commitPart(p, next, false));
    cleanupLocal();
    word.build(content.words[next]);
    relayout();
    renderer?.set(next);
    options.onRoleChange?.(next);
  }

  /* ---------- the change ---------- */
  function change(next: Role): Promise<void> {
    if (destroyed) return Promise.resolve();
    desired = next;
    // Keep only the latest destination. Assign the owner before draining so
    // synchronous requests also share the same completion.
    processing ??= bootReady.then(async () => {
      try { while (!destroyed && desired !== role) await transitionTo(desired); }
      finally { processing = null; }
    });
    return processing;
  }

  async function transitionTo(next: Role): Promise<void> {
    if (reduced) { instant(next); return; }
    busy = true;
    const turnOwner = activeTurn = new AbortController();
    if (options.controlsContainer) syncTabs(next);
    const prev = role, from = [...content.words[prev]], to = [...content.words[next]];
    const pe = prev === 'engineer' ? probeE : probeD, ne = next === 'engineer' ? probeE : probeD;
    const oldField = token(pe, '--mah-field'), newField = token(ne, '--mah-field');
    const oldWord = token(pe, '--mah-word'), newWord = token(ne, '--mah-word');
    const left = root.getBoundingClientRect().left;
    const centre = (el: Element) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2 - left; };
    const items: SweepItem[] = [
      ...word.cells.map((cell, i) => ({ x: centre(cell), run: () => { setLocal(cell, next); word.swap(cell, from[i], to[i], oldWord, newWord); } })),
      ...parts().map((p) => ({ x: p.getClientRects().length ? centre(p) : -1, run: () => commitPart(p, next, true) })),
    ];
    if (next === 'designer') own(gsap.fromTo(roomImg, { '--mah-rz': MOTION.room.zoomFrom }, { '--mah-rz': 1, duration: MOTION.room.duration, ease: MOTION.room.ease }));
    const turn = renderer ? renderer.turnTo(next) : Promise.resolve();
    copyWipe = prepareCopyWipe(root, pe, ne);
    await runSweep({ root, room, oldField, newField, toDesigner: next === 'designer', items, paintCopy: edge => copyWipe?.paint(edge), signal: turnOwner.signal });
    if (destroyed || turnOwner.signal.aborted) return;
    role = next;
    root.dataset.role = next;
    // The field is complete now. Release its pixel coordinates before waiting
    // for the final letters, so a resize during settling cannot expose old ink.
    endSweep(root, room);
    copyWipe.destroy();
    copyWipe = null;
    // The final letters may still be opening after the wipe reaches the edge.
    // Never let an old width tween overwrite a freshly resized word.
    await Promise.all([turn, wait(MOTION.settleMs, turnOwner.signal), word.settled()]);
    if (destroyed || turnOwner.signal.aborted) return;
    activeTurn = null;
    cleanupLocal();
    busy = false;
    if (resizeQueued) { resizeQueued = false; relayout(); }
    options.onRoleChange?.(next);
  }

  /* ---------- clock and controls ---------- */
  const clock = new RoleClock(options.holdSeconds ?? MOTION.holdSeconds, (v) => tabs.style.setProperty('--mah-p', v.toFixed(4)), () => change(other(role)));
  function setUserPaused(p: boolean): void {
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.setAttribute('aria-label', p ? 'Play the role animation' : 'Pause the role animation');
    if (p) clock.hold('user'); else clock.release('user');
  }
  const onPause = () => setUserPaused(!clock.isHeld('user'));
  pauseBtn.addEventListener('click', onPause);
  const roleButtons = Array.from(tabs.querySelectorAll<HTMLButtonElement>('[data-mah-role]'));
  const onSelect = (event: Event) => { setUserPaused(true); void change((event.currentTarget as HTMLButtonElement).dataset.mahRole as Role); };
  roleButtons.forEach(b => b.addEventListener('click', onSelect));

  const io = new IntersectionObserver(([e]) => { if (e.intersectionRatio < 0.35) clock.hold('offscreen'); else clock.release('offscreen'); }, { threshold: [0, 0.35, 1] });
  io.observe(root);
  const onVisibility = () => { if (document.hidden) clock.hold('hidden'); else clock.release('hidden'); };
  document.addEventListener('visibilitychange', onVisibility);
  function loadDesignerImages(): void {
    for (const image of [back, roomImg]) if (image.dataset.src) {
      image.src = image.dataset.src; delete image.dataset.src;
    }
  }
  function startRenderer(): void {
    loadDesignerImages();
    rendererOwner?.abort();
    const owner = rendererOwner = new AbortController();
    (options.renderer === 'fallback' ? Promise.resolve(null) : TurnRenderer.create(photo, front, back, role, owner.signal)).then(async r => {
      // A turn that began without GL owns the photographic fallback until it
      // settles. Attach decoded GL only after the latest role is coherent.
      if (busy) await processing;
      if (destroyed || reduced || owner.signal.aborted) { r?.destroy(); return; }
      r?.set(role);
      renderer = r;
      rendererState = r ? 'webgl' : 'fallback';
      root.dataset.renderer = rendererState;
      root.classList.toggle('has-gl', !!r);
    });
  }
  async function refreshPortraitTexture(): Promise<void> {
    if (!booted || reduced || destroyed) return;
    const source = front.currentSrc;
    // A responsive <picture> can change sources during a turn. Finish that turn
    // before rebuilding its textures, so the canvas and resting image agree.
    if (processing) await processing;
    if (destroyed || reduced || front.currentSrc !== source) return;
    rendererOwner?.abort();
    renderer?.destroy(); renderer = null;
    root.classList.remove('has-gl');
    startRenderer();
  }
  front.addEventListener('load', refreshPortraitTexture);
  function startFog(): void {
    own(gsap.to(fog, { xPercent: MOTION.fog.xPercent, yPercent: MOTION.fog.yPercent, duration: MOTION.fog.duration, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  }
  function applyMotion(next: boolean): void {
    const changed = reduced !== next;
    reduced = next;
    tabs.classList.toggle('is-reduced', reduced);
    root.classList.toggle('is-reduced', reduced);
    if (reduced) {
      clock.hold('reduced-motion'); clock.stop();
      rendererOwner?.abort(); activeTurn?.abort(); activeTurn = null;
      tweens.forEach(t => t.kill()); tweens.clear();
      word.destroy();
      copyWipe?.destroy(); copyWipe = null;
      renderer?.destroy(); renderer = null;
      rendererState = 'fallback'; root.dataset.renderer = 'fallback'; root.classList.remove('has-gl');
      endSweep(root, room);
      busy = false;
      if (booted) {
        // Remove only properties owned by decorative tweens before rebuilding
        // a coherent photographic state at the latest requested destination.
        gsap.set(root.querySelectorAll('.mah-col'), { clearProps: 'transform,opacity' });
        gsap.set(fog, { clearProps: 'transform' });
        roomImg.style.setProperty('--mah-rz', '1');
        instant(desired);
      }
    } else {
      clock.release('reduced-motion');
      if (booted && changed) { startRenderer(); startFog(); if (autoplay) clock.start(); }
    }
  }
  const onReduce = () => applyMotion(reduce!.matches);
  const stopMotion = options.motion ? options.motion.subscribe(applyMotion) : (() => {
    reduce!.addEventListener('change', onReduce); applyMotion(reduced);
    return () => reduce!.removeEventListener('change', onReduce);
  })();
  let raf = 0;
  const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(relayout); });
  const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(relayout); };
  window.addEventListener('resize', onResize);

  /* ---------- boot ---------- */
  (async () => {
    const display = token(root, '--mah-display') || "'Big Shoulders Display'";
    const textFace = token(root, '--mah-text') || "'Schibsted Grotesk'";
    await Promise.race([
      Promise.all([document.fonts.load(`900 100px ${display}`), document.fonts.load(`400 16px ${textFace}`), document.fonts.load(`600 16px ${textFace}`)]),
      wait(2500, lifetime.signal),
    ]).catch(() => undefined);
    if (destroyed) return;
    word.measureFont(display);
    word.build(content.words[role]);
    relayout();
    // Reveal once in the measured frame. The portrait has no arrival tween;
    // WebGL exclusively owns the subsequent front/back role turns.
    root.dataset.portraitReady = '';
    ro.observe(root);
    booted = true;
    applyMotion(reduced);
    if (!reduced) {
      startRenderer();
      startFog();
      const I = MOTION.intro;
      const intro = gsap.timeline({ onComplete: () => { if (autoplay && !destroyed) clock.start(); } })
        .from(root.querySelectorAll('.mah-word .mah-g'), { yPercent: 104, duration: I.letters, ease: 'power4.out', stagger: I.letterStagger })
        .from(root.querySelectorAll('.mah-col'), { y: 16, opacity: 0, duration: I.copy, ease: 'power3.out', stagger: I.copyStagger }, I.copyAt);
      own(intro);
    }
    finishBoot();
  })();

  return {
    get role() { return role; },
    get renderer() { return rendererState; },
    setRole: (r: Role) => change(r),
    play: () => setUserPaused(false),
    pause: () => setUserPaused(true),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      finishBoot();
      lifetime.abort(); rendererOwner?.abort(); activeTurn?.abort();
      clock.hold('destroyed'); clock.stop();
      tweens.forEach((t) => t.kill());
      tweens.clear();
      pauseBtn.removeEventListener('click', onPause);
      roleButtons.forEach(b => b.removeEventListener('click', onSelect));
      word.destroy();
      copyWipe?.destroy();
      copyWipe = null;
      gsap.killTweensOf(root.querySelectorAll('*'));
      io.disconnect(); ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      stopMotion();
      front.removeEventListener('load', refreshPortraitTexture);
      renderer?.destroy();
      if (options.controlsContainer) options.controlsContainer.innerHTML = '';
      container.innerHTML = '';
    },
  };
}
