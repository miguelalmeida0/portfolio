import { curves, type LabSetup } from '$lib/hero-lab/runtime';

/** Eye line of the cutout, as a share of the subject box (measured on the asset). */
const EYES = { x: 52, y: 14.5 };

/**
 * Direction 02 — the title in camera depth.
 * Open: the lens opens as a slit on the eyes and dollies out; behind him the
 * title resolves glyph by glyph like a focus pull; the lower third sweeps in
 * across his torso.
 * Pointer: a camera move. Three planes parallax at different depths and focus
 * racks to the plane the pointer is nearest (the other softens).
 * Scroll: the lower third flies past the camera, the title recedes, the shot
 * contracts to a push-in on the face and closes to the slit it opened with,
 * then Selected Work slides up over that last frame.
 *
 * Ownership: glyphs/front-text/aperture → intro; back-line/front-line/camera →
 * pointer; back/front/lens/backdrop/portrait → scroll.
 */
export const cinematicMotion: LabSetup = (root, { desktop, fine }, { gsap }) => {
  const q = gsap.utils.selector(root);
  const stage = q('[data-d2-stage]')[0] as HTMLElement;
  const lens = q('[data-lens]')[0] as HTMLElement;
  const aperture = q('[data-aperture]')[0] as HTMLElement;
  const camera = q('[data-camera]');
  const subjectBox = q('[data-subject]')[0] as HTMLElement;
  const backLine = q('[data-back-line]')[0] as HTMLElement;
  const frontLine = q('[data-front-line]')[0] as HTMLElement;
  // Slit positions derived from where the eyes actually sit inside the lens.
  const eyeLine = () => {
    const top = (lens.clientHeight - subjectBox.offsetHeight) / lens.clientHeight * 100;
    return top + subjectBox.offsetHeight / lens.clientHeight * EYES.y;
  };
  const eye = eyeLine();

  // lazy: false writes start states synchronously, before the browser can paint.
  const intro = gsap.timeline({ defaults: { ease: curves.settle, lazy: false } });
  intro
    .from(q('[data-d2-bar]'), { yPercent: -100, duration: .7, ease: curves.shutter }, 0)
    .from(q('[data-lower]'), { clipPath: 'inset(100% 0% 0% 0%)', duration: .7, ease: curves.shutter }, .05)
    .fromTo(aperture, { clipPath: `inset(${eye - 1.2}% 0% ${100 - eye - 1.2}% 0%)` },
      { clipPath: `inset(${eye - 7}% 0% ${100 - eye - 7}% 0%)`, duration: .45, ease: curves.shutter }, 0)
    .to(aperture, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: curves.dolly }, .5)
    .fromTo(camera, { scale: 2.5, transformOrigin: `${EYES.x}% ${EYES.y}%` }, { scale: 1, duration: 1.2, ease: curves.dolly }, .38)
    .from(q('[data-backdrop]'), { opacity: 0, duration: .9, ease: 'power1.out' }, .3)
    // Focus pull: glyphs resolve from soft and loose, outward from his head.
    .from(q('[data-g]'), { opacity: 0, yPercent: 26, filter: 'blur(14px)', duration: 1.1, stagger: { each: .035, from: 'center' } }, .12)
    .from(backLine, { letterSpacing: '.16em', duration: 1.5, ease: curves.dolly }, .12)
    // The lower third sweeps across his torso.
    .from(frontLine, { clipPath: 'inset(0% 100% 0% 0%)', duration: .9, ease: curves.shutter }, .7)
    .from(q('[data-front-text]'), { xPercent: -14, duration: 1.1 }, .7)
    .from(q('[data-hello]'), { opacity: 0, x: -14, duration: .6 }, .05)
    .from(q('[data-credit]'), { opacity: 0, y: 16, duration: .7, stagger: .07 }, .3)
    .from(q('[data-actions]'), { opacity: 0, y: 12, duration: .6 }, .35);

  const cleanups: Array<() => void> = [];
  if (fine && desktop) {
    const to = (target: Element | Element[], prop: string, duration: number) => gsap.quickTo(target, prop, { duration, ease: 'power3.out' });
    const back = { x: to(backLine, 'x', 1.4), y: to(backLine, 'y', 1.4) };
    const cam = { x: to(camera, 'x', 1.1), y: to(camera, 'y', 1.1) };
    const front = { x: to(frontLine, 'x', .9), y: to(frontLine, 'y', .9) };
    // Rack focus: 0 = focus on the title behind him, 1 = on the lower third.
    const focus = { v: .5 };
    const apply = () => {
      const f = focus.v;
      backLine.style.filter = f > .55 ? `blur(${((f - .55) * 9).toFixed(2)}px)` : '';
      frontLine.style.filter = f < .45 ? `blur(${((.45 - f) * 9).toFixed(2)}px)` : '';
    };
    const move = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - .5;
      const ny = (event.clientY - rect.top) / rect.height - .5;
      back.x(nx * -30); back.y(ny * -12);
      cam.x(nx * -12); cam.y(ny * -6);
      front.x(nx * 44); front.y(ny * 18);
      gsap.to(focus, { v: gsap.utils.clamp(0, 1, ny + .5), duration: .7, ease: 'power2.out', overwrite: true, onUpdate: apply });
    };
    const leave = () => {
      back.x(0); back.y(0); cam.x(0); cam.y(0); front.x(0); front.y(0);
      gsap.to(focus, { v: .5, duration: .8, ease: 'power2.out', overwrite: true, onUpdate: apply });
    };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave);
      gsap.killTweensOf(focus); backLine.style.filter = ''; frontLine.style.filter = '';
    });
  }

  const hold = { immediateRender: false };
  if (desktop) {
    const toCentre = () => stage.clientWidth / 2 - subjectBox.offsetLeft;
    const shot = [lens, q('[data-backdrop]')[0]];
    const square = () => `inset(${eyeLine() - 13}% 38% ${100 - eyeLine() - 27}% 38%)`;
    const slit = () => `inset(${eyeLine() - 2.2}% 34% ${100 - eyeLine() - 2.2}% 34%)`;
    gsap.timeline({
      defaults: { ease: 'none' },
      // The iris completes in the first stretch; Selected Work then slides up over the held slit.
      scrollTrigger: { trigger: q('[data-d2-scene]')[0], start: 'top top', end: () => `+=${stage.clientHeight * .6}`, scrub: .8, invalidateOnRefresh: true }
    })
      // The lower third passes the camera; the title recedes into the dark.
      .fromTo(q('[data-front]'), { scale: 1, opacity: 1, x: 0 }, { scale: 2.8, opacity: 0, x: () => stage.clientWidth * .08, transformOrigin: '40% 50%', duration: .3, ease: 'power2.in', ...hold }, 0)
      .fromTo(q('[data-back]'), { scale: 1, y: 0, opacity: 1 }, { scale: 1.14, y: () => -stage.clientHeight * .06, opacity: 0, transformOrigin: '60% 40%', duration: .36, ...hold }, .02)
      .fromTo(q('[data-roll]'), { y: 0 }, { y: () => -stage.clientHeight * .9, duration: .32, stagger: .04, ease: 'power2.in', ...hold }, 0)
      .fromTo(shot, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: square, duration: .5, ease: curves.dolly, ...hold }, .14)
      .fromTo(q('[data-subject] .lab-portrait'), { x: 0, scale: 1 }, { x: toCentre, scale: 1.55, transformOrigin: '52% 14.5%', duration: .5, ease: curves.dolly, ...hold }, .14)
      .fromTo(q('[data-backdrop]'), { opacity: 1 }, { opacity: .6, duration: .4, ...hold }, .14)
      .fromTo(shot, { clipPath: square }, { clipPath: slit, duration: .24, ease: curves.shutter, ...hold }, .68)
      .fromTo(stage, { backgroundColor: '#0d1915' }, { backgroundColor: '#1c362d', duration: .3, ...hold }, .66)
      .fromTo(q('[data-lower]'), { yPercent: 0 }, { yPercent: 100, duration: .25, ...hold }, .55);
  } else {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: lens, start: 'top 60%', end: 'bottom top', scrub: .5 } })
      .fromTo(q('[data-subject] .lab-portrait'), { yPercent: -4 }, { yPercent: 10, ...hold }, 0)
      .fromTo(q('[data-back]'), { x: 0 }, { x: () => -stage.clientWidth * .12, ...hold }, 0)
      .fromTo(q('[data-front]'), { x: 0 }, { x: () => stage.clientWidth * .1, ...hold }, 0);
  }

  return () => cleanups.forEach(fn => fn());
};
