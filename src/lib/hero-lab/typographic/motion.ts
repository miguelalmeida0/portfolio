import { type LabSetup } from '$lib/hero-lab/runtime';
import { mastIntro, opening } from './pages/motion';

/** Keep the existing navbar entrance and unpinned hero exit. Turntable owns
 * its letter choreography, intro and portrait turn exclusively. */
export const typographicMotion: LabSetup = (root, { desktop }, { gsap, ScrollTrigger }) => {
  const q = gsap.utils.selector(root);
  const entrance = opening(root, gsap);
  mastIntro(entrance.timeline, q);
  const stage = q('.mah')[0] as HTMLElement;
  const exit = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: desktop ? .45 : .2, invalidateOnRefresh: true }
  });
  exit.fromTo(q('.mah-portrait-drift'), { yPercent: 0 }, { yPercent: desktop ? 4 : 5, duration: 1, immediateRender: false }, 0);
  // Preserve the old two-sided type exit on the new word's cells. The source
  // animates glyph scale and cell width, leaving cell translation to scrolling.
  const spread = { progress: 0 };
  exit.to(spread, {
    progress: 1, duration: 1,
    onUpdate: () => {
      const cells = q('.mah-cell') as HTMLElement[];
      const word = q('.mah-word')[0] as HTMLElement | undefined;
      const distance = (word?.offsetWidth ?? 0) / 2 * (desktop ? .28 : .08) * spread.progress;
      cells.forEach((cell, i) => { cell.style.translate = `${i < cells.length / 2 ? -distance : distance}px 0`; });
    }
  }, 0);
  if (desktop) exit.fromTo(q('.mah-copy'), { y: 0 }, {
    // Desktop motion also runs at 1024–1179px, where the copy sits below the
    // photo. Limit its lift to that clear padding, retaining an 8px reading gap.
    // Re-evaluate on refresh so crossing the hero breakpoint stays safe.
    y: () => stage.dataset.layout === 'wide' ? -90 : -Math.max(0, Math.min(90,
      parseFloat(getComputedStyle(q('.mah-copy')[0]).paddingTop) - 8)),
    duration: .4, immediateRender: false
  }, 0);

  // Source fonts and responsive layout settle asynchronously after mount.
  let frame = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  observer.observe(stage);
  return () => {
    entrance.dispose(); observer.disconnect(); cancelAnimationFrame(frame);
    (q('.mah-cell') as HTMLElement[]).forEach(cell => cell.style.removeProperty('translate'));
  };
};
