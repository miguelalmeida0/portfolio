import { curves, type LabSetup } from '$lib/hero-lab/runtime';

/**
 * Direction 03 — from who I am to what I build, in moving type.
 * Open: the wall's letters drop onto their lines and settle, the person
 * arrives, the sticker line is slapped on letter by letter, and the four real
 * products are dealt out from behind him.
 * Pointer: every letter is a magnet-repelled object (displacement, tilt and
 * scale fall off with distance); a press sends a ripple through the wall.
 * Scroll: the letters are flung off the wall, the sticker peels away, and the
 * products pass in front of him into one strip in Selected Work order.
 *
 * Ownership per glyph: outer `[data-g]` → scroll, `[data-gm]` → pointer,
 * `[data-gi]` → opening and ripple. Plates: slot → scroll, plate → opening,
 * float → pointer.
 */
export const kineticMotion: LabSetup = (root, { desktop, fine }, { gsap }) => {
  const q = gsap.utils.selector(root);
  const stage = q('[data-d3-stage]')[0] as HTMLElement;
  const figure = q('[data-figure]')[0] as HTMLElement;
  const slots = q('.d3-slot') as HTMLElement[];
  const media = slots.map(slot => slot.querySelector('.d3-media') as HTMLElement);
  const wallGlyphs = q('[data-wall] [data-g]') as HTMLElement[];
  const stickerGlyphs = q('[data-sticker] [data-g]') as HTMLElement[];
  const inner = (list: HTMLElement[]) => list.map(g => g.querySelector('[data-gi]') as HTMLElement);
  const cleanups: Array<() => void> = [];
  // Deterministic scatter: every visit flings the letters the same way.
  const rand = (i: number, salt: number) => { const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453; return v - Math.floor(v); };
  // Layout boxes relative to the stage from the offset chain (transform-free).
  const within = (el: HTMLElement) => {
    let x = 0, y = 0, node: HTMLElement | null = el;
    while (node && node !== stage) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent as HTMLElement | null; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const centre = (el: HTMLElement) => { const r = within(el); return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; };

  // lazy: false writes start states synchronously, before the browser can paint.
  const intro = gsap.timeline({ defaults: { ease: curves.settle, lazy: false } });
  intro
    .from(q('.d3-identity [data-arm]'), { opacity: 0, y: -10, duration: .6, stagger: .05 }, 0)
    // Letters drop onto the wall and settle with a little give.
    .from(inner(wallGlyphs), {
      yPercent: (i: number) => -140 - rand(i, 1) * 80, rotation: (i: number) => (rand(i, 2) - .5) * 50, opacity: 0,
      duration: .9, ease: 'back.out(1.7)', stagger: .035
    }, .05)
    .from(q('[data-figure-in]'), { opacity: 0, y: 36, duration: 1 }, .15)
    // The sticker line is slapped on, one letter at a time.
    .from(inner(stickerGlyphs), {
      scale: 0, rotation: (i: number) => (rand(i, 3) - .5) * 70, duration: .55, ease: 'back.out(2.4)', stagger: .028
    }, .75)
    .from(q('.d3-copy [data-arm]'), { opacity: 0, y: 16, duration: .65, stagger: .05 }, .1)
    .from(q('[data-dock]'), { yPercent: 160, duration: .8, ease: curves.snap }, .5);

  // Products dealt from his chest: each plate starts where the portrait hides it.
  const chest = () => { const f = within(figure); return { x: f.x + f.w / 2, y: f.y + f.h * .42 }; };
  slots.forEach((slot, index) => {
    intro.from(slot.querySelector('.d3-plate'), {
      x: () => chest().x - centre(slot).x,
      y: () => chest().y - centre(slot).y,
      scale: .5, opacity: 0, duration: 1, ease: curves.snap
    }, .45 + index * .09);
  });

  if (desktop && fine) {
    // Magnetic field over every letter of both type planes.
    const letters = [...wallGlyphs, ...stickerGlyphs].map(glyph => {
      const target = glyph.querySelector('[data-gm]') as HTMLElement;
      return {
        glyph,
        x: gsap.quickTo(target, 'x', { duration: .7, ease: 'power3.out' }),
        y: gsap.quickTo(target, 'y', { duration: .7, ease: 'power3.out' }),
        r: gsap.quickTo(target, 'rotation', { duration: .8, ease: 'power3.out' }),
        s: gsap.quickTo(target, 'scale', { duration: .6, ease: 'power3.out' }),
        cx: 0, cy: 0
      };
    });
    // Rest positions in viewport space, re-read only when the page has moved.
    let measuredAt = NaN;
    const measure = () => {
      letters.forEach(l => { const r = l.glyph.getBoundingClientRect(); l.cx = r.left + r.width / 2; l.cy = r.top + r.height / 2; });
      measuredAt = scrollY;
    };
    const move = (event: PointerEvent) => {
      if (scrollY !== measuredAt) measure();
      const R = Math.max(180, innerWidth * .14);
      for (const l of letters) {
        const dx = l.cx - event.clientX, dy = l.cy - event.clientY;
        const d = Math.hypot(dx, dy) || 1;
        const k = d < R ? (1 - d / R) ** 2 : 0;
        l.x((dx / d) * 70 * k); l.y((dy / d) * 70 * k); l.r((dx / d) * 22 * k); l.s(1 + .14 * k);
      }
    };
    const release = () => letters.forEach(l => { l.x(0); l.y(0); l.r(0); l.s(1); });
    // A press sends a ripple through the letters, outward from the press point.
    const press = (event: PointerEvent) => {
      if ((event.target as Element).closest('a, button')) return;
      measure();
      for (const l of letters) {
        const d = Math.hypot(l.cx - event.clientX, l.cy - event.clientY);
        gsap.to(l.glyph.querySelector('[data-gi]'), {
          keyframes: { yPercent: [0, -24, 0] }, duration: .6, delay: d / 2200, ease: 'sine.inOut', overwrite: 'auto'
        });
      }
    };
    const invalidate = () => { measuredAt = NaN; };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerleave', release);
    stage.addEventListener('pointerdown', press);
    window.addEventListener('resize', invalidate);
    cleanups.push(() => {
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', release);
      stage.removeEventListener('pointerdown', press); window.removeEventListener('resize', invalidate);
    });

    const floats = slots.map((slot, index) => {
      const target = slot.querySelector('[data-float]');
      const depth = [.9, 1.4, .7, 1.1][index] ?? 1;
      return { x: gsap.quickTo(target, 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(target, 'y', { duration: 1, ease: 'power3.out' }), depth };
    });
    const drift = (event: PointerEvent) => {
      const nx = event.clientX / innerWidth - .5, ny = event.clientY / innerHeight - .5;
      floats.forEach(f => { f.x(nx * 22 * f.depth); f.y(ny * 14 * f.depth); });
    };
    const settle = () => floats.forEach(f => { f.x(0); f.y(0); });
    stage.addEventListener('pointermove', drift);
    stage.addEventListener('pointerleave', settle);
    cleanups.push(() => { stage.removeEventListener('pointermove', drift); stage.removeEventListener('pointerleave', settle); });
  }

  // Hand-off: one strip in Selected Work order. Every image shares one height,
  // so the portrait-format F24 photo and the landscape products keep their ratio.
  const copy = q('[data-copy]')[0] as HTMLElement;
  const strip = (index: number) => {
    const inset = desktop ? (parseFloat(getComputedStyle(stage).getPropertyValue('--page-x')) || 108) : 20;
    const from = desktop ? within(copy).x + copy.offsetWidth + stage.clientWidth * .04 : inset;
    const to = stage.clientWidth - inset;
    const gap = stage.clientWidth * (desktop ? .015 : .025);
    const ratios = media.map(m => m.offsetWidth / m.offsetHeight);
    const maxHeight = desktop ? stage.clientHeight * .26 : figure.offsetHeight * .3;
    const height = Math.min((to - from - gap * 3) / ratios.reduce((a, b) => a + b, 0), maxHeight);
    const widths = ratios.map(r => r * height);
    const total = widths.reduce((a, b) => a + b, 0) + gap * 3;
    const left = to - total + widths.slice(0, index).reduce((a, b) => a + b, 0) + gap * index;
    const f = within(figure);
    const y = desktop ? stage.clientHeight * .74 : f.y + f.h * .78;
    return { x: left + widths[index] / 2, y, scale: widths[index] / media[index].offsetWidth };
  };
  const hold = { immediateRender: false };
  const exit = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: desktop ? stage : figure, start: 'top top', end: desktop ? 'bottom 72%' : 'bottom 30%',
      scrub: .7, invalidateOnRefresh: true,
      onUpdate: self => { if (self.progress > .02) root.dataset.resolving = ''; else delete root.dataset.resolving; }
    }
  });
  // Letters are flung off the wall; the sticker peels away downward.
  exit.fromTo(wallGlyphs, { x: 0, y: 0, rotation: 0, opacity: 1 }, {
    x: (i: number) => (rand(i, 4) - .5) * stage.clientWidth * .5,
    y: (i: number) => -stage.clientHeight * (.3 + rand(i, 5) * .4),
    rotation: (i: number) => (rand(i, 6) - .5) * 160,
    opacity: 0, duration: .55, stagger: .012, ease: 'power2.in', ...hold
  }, 0);
  exit.fromTo(stickerGlyphs, { y: 0, rotation: 0, opacity: 1 }, {
    y: (i: number) => stage.clientHeight * (.15 + rand(i, 7) * .2), rotation: (i: number) => (rand(i, 8) - .5) * 90,
    opacity: 0, duration: .45, stagger: .01, ease: 'power2.in', ...hold
  }, .05);
  exit.fromTo(q('[data-figure-in]'), { y: 0 }, { y: () => figure.offsetHeight * .1, duration: 1, ...hold }, 0);
  slots.forEach((slot, index) => {
    exit.fromTo(slot, { x: 0, y: 0, scale: 1, '--tilt': (_: number, el: HTMLElement) => getComputedStyle(el).getPropertyValue('--tilt') },
      {
        x: () => strip(index).x - centre(slot).x,
        y: () => strip(index).y - centre(slot).y,
        scale: () => strip(index).scale,
        '--tilt': '0deg', duration: .8, ease: curves.dolly, ...hold
      }, .1 + index * .05);
  });

  return () => { cleanups.forEach(fn => fn()); delete root.dataset.resolving; };
};
