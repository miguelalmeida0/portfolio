import { motionState } from './policy';
import { motion } from './tokens';

let shared: Promise<MotionRuntime> | undefined;
export type MotionRuntime = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};
export function loadMotion() {
  return shared ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/CustomEase')]).then(([core, scroll, ease]) => {
    core.gsap.registerPlugin(scroll.ScrollTrigger, ease.CustomEase);
    ease.CustomEase.create(motion.primary, '0.22,1,0.36,1');
    ease.CustomEase.create(motion.secondary, '0.2,0.8,0.2,1');
    return { gsap: core.gsap, ScrollTrigger: scroll.ScrollTrigger };
  });
}

let refreshFrame = 0;
export function refreshMotion(runtime: MotionRuntime) {
  if (refreshFrame) return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    runtime.ScrollTrigger.refresh();
    reportMotion(runtime);
  });
}

// Read-only observability for route-lifecycle acceptance, not a UI control.
export function reportMotion({ ScrollTrigger }: MotionRuntime) {
  document.documentElement.dataset.motionTriggers = String(ScrollTrigger.getAll().length);
}

type Setup = (runtime: MotionRuntime, context: gsap.Context, capabilities: { desktop: boolean; fine: boolean }) => void | (() => void);

/** Async imports, preference changes and SPA teardown have one cancellation owner. */
export function motionOwner(node: HTMLElement, name: string, setup: Setup) {
  let disposed = false, generation = 0;
  let media: gsap.MatchMedia | undefined;
  let runtime: MotionRuntime | undefined;
  let previous: boolean | undefined;
  const unsubscribe = motionState.subscribe(({ reduced }) => {
    if (previous === reduced) return;
    previous = reduced;
    const version = ++generation;
    media?.revert();
    media = undefined;
    delete node.dataset.motionOwner;
    if (runtime) reportMotion(runtime);
    if (reduced) return;
    void loadMotion().then(loaded => {
      if (disposed || version !== generation || !node.isConnected) return;
      runtime = loaded;
      media = loaded.gsap.matchMedia(node);
      media.add({ desktop: '(min-width: 1024px)', fine: '(hover: hover) and (pointer: fine)', compact: '(max-width: 1023px)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
        if (context.conditions?.reduce) return;
        node.dataset.motionOwner = name;
        const cleanup = setup(loaded, context, { desktop: Boolean(context.conditions?.desktop), fine: Boolean(context.conditions?.fine) });
        reportMotion(loaded);
        return () => { cleanup?.(); delete node.dataset.motionOwner; };
      });
      // Resize is ScrollTrigger-owned. Fonts/images need only one coalesced refresh.
      void document.fonts.ready.then(() => {
        if (!disposed && version === generation) refreshMotion(loaded);
      });
    }).catch(() => { /* Enhancement failure leaves server-rendered content readable. */ });
  });
  return {
    destroy() {
      disposed = true; generation++;
      unsubscribe(); media?.revert();
      delete node.dataset.motionOwner;
      if (runtime) reportMotion(runtime);
    }
  };
}
