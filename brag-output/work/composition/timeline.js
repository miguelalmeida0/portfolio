/*
 * Portfolio film timeline.
 *
 * Every visible value is a pure function of `t` (seconds). `window.__render(t)`
 * applies one frame and resolves once every image it needs has decoded, so the
 * renderer can capture frames in any order with identical results.
 *
 * Timing: 96 BPM, one bar = 2.5 s, cuts land on bar lines (see brag-plan.md).
 */
(() => {
  'use strict';

  const W = 1920;
  const H = 1080;
  const DURATION = 25;

  const T = {
    hookEnd: 2.5,
    click: 5.9375,
    scrollStart: 6.25,
    scrollEnd: 7.0,
    sv: 7.5,
    mirror: 10,
    camera: 12.5,
    vigia: 15,
    f24: 17.5,
    thesis: 20,
    end: 22.5
  };

  /* ------------------------------------------------------------------ math */

  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const mix = (a, b, p) => a + (b - a) * p;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const round = (v, d = 3) => Math.round(v * 10 ** d) / 10 ** d;

  /** CSS cubic-bezier as a function of progress (Newton with bisection fallback). */
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    const sampleX = (s) => ((ax * s + bx) * s + cx) * s;
    const sampleY = (s) => ((ay * s + by) * s + cy) * s;
    const slopeX = (s) => (3 * ax * s + 2 * bx) * s + cx;
    const solve = (x) => {
      let s = x;
      for (let i = 0; i < 8; i += 1) {
        const err = sampleX(s) - x;
        if (Math.abs(err) < 1e-6) return s;
        const d = slopeX(s);
        if (Math.abs(d) < 1e-6) break;
        s -= err / d;
      }
      let lo = 0;
      let hi = 1;
      s = x;
      for (let i = 0; i < 40; i += 1) {
        const v = sampleX(s);
        if (Math.abs(v - x) < 1e-6) break;
        if (x > v) lo = s;
        else hi = s;
        s = (lo + hi) / 2;
      }
      return s;
    };
    return (p) => (p <= 0 ? 0 : p >= 1 ? 1 : sampleY(solve(p)));
  }

  const ease = {
    // The site's own curves (src/lib/motion/tokens.ts).
    settle: bezier(0.22, 1, 0.36, 1),
    feedback: bezier(0.2, 0.8, 0.2, 1),
    // Emphasised motion for large moves.
    emph: bezier(0.2, 0, 0, 1),
    emphDecel: bezier(0.05, 0.7, 0.1, 1),
    emphAccel: bezier(0.3, 0, 0.8, 0.15),
    inOut: bezier(0.65, 0, 0.35, 1),
    inOutSoft: bezier(0.45, 0, 0.55, 1),
    outCubic: (p) => 1 - (1 - p) ** 3,
    inCubic: (p) => p ** 3,
    linear: (p) => p
  };

  const backOut = (p, s = 1.6) => {
    const q = p - 1;
    return 1 + (s + 1) * q ** 3 + s * q ** 2;
  };

  /** Eased progress of `t` through [a, b]. */
  const tw = (t, a, b, e = ease.settle) => e(prog(t, a, b));

  const lerpRect = (r1, r2, p) => ({
    x: mix(r1.x, r2.x, p),
    y: mix(r1.y, r2.y, p),
    w: mix(r1.w, r2.w, p),
    h: mix(r1.h, r2.h, p)
  });

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mixColor = (a, b, p) => {
    const ca = hex(a);
    const cb = hex(b);
    return `rgb(${ca.map((v, i) => Math.round(mix(v, cb[i], p))).join(' ')})`;
  };

  function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ------------------------------------------------------------ DOM helpers */

  const $ = (id) => document.getElementById(id);
  const cache = new WeakMap();

  function set(node, prop, value) {
    let c = cache.get(node);
    if (!c) {
      c = {};
      cache.set(node, c);
    }
    if (c[prop] === value) return;
    c[prop] = value;
    if (prop.startsWith('--')) node.style.setProperty(prop, value);
    else node.style[prop] = value;
  }

  /** Scene-level toggle: `display`, so nothing inside a hidden group can leak through. */
  const show = (node, on) => set(node, 'display', on ? '' : 'none');
  /** In-flow toggle that keeps layout (grid and flex children). */
  const vis = (node, on) => set(node, 'visibility', on ? 'visible' : 'hidden');
  const opacity = (node, v) => set(node, 'opacity', String(round(clamp(v), 4)));
  const transform = (node, v) => set(node, 'transform', v);

  /** Opacity plus a vertical settle, the site's `hero-settle` gesture. */
  function settleIn(node, t, a, { dist = 30, dur = 0.56, out = null } = {}) {
    let o = tw(t, a, a + dur * 0.75, ease.settle);
    let y = dist * (1 - tw(t, a, a + dur, ease.settle));
    if (out) {
      const q = tw(t, out[0], out[1], ease.emphAccel);
      o *= 1 - q;
      y -= (out[2] ?? 16) * q;
    }
    opacity(node, o);
    transform(node, `translate3d(0, ${round(y, 2)}px, 0)`);
    return o;
  }

  let pending = [];

  function setSrc(img, src) {
    if (img.dataset.src === src) {
      if (!img.complete) pending.push(img.decode().catch(() => {}));
      return;
    }
    img.dataset.src = src;
    img.src = src;
    pending.push(img.decode().catch(() => {}));
  }

  /* ---------------------------------------------------------- media camera */

  /**
   * Places an image inside a frame like a camera: `zoom` 1 is cover-fit, and the
   * focus point (image pixels) is held at the frame centre while the image still
   * covers the frame. `crop` limits the usable part of the image.
   */
  function placeImage(img, nat, frame, view) {
    const crop = view.crop ?? { x: 0, y: 0, w: nat.w, h: nat.h };
    const cover = Math.max(frame.w / crop.w, frame.h / crop.h);
    const s = cover * (view.zoom ?? 1);
    const fx = view.fx ?? crop.x + crop.w / 2;
    const fy = view.fy ?? crop.y + crop.h / 2;
    let tx = frame.w / 2 - fx * s;
    let ty = frame.h / 2 - fy * s;
    tx = clamp(tx, frame.w - (crop.x + crop.w) * s, -crop.x * s);
    ty = clamp(ty, frame.h - (crop.y + crop.h) * s, -crop.y * s);
    set(img, 'width', `${nat.w}px`);
    set(img, 'height', `${nat.h}px`);
    transform(img, `translate3d(${round(tx, 2)}px, ${round(ty, 2)}px, 0) scale(${round(s, 5)})`);
  }

  const FILMS = {
    sv: { dir: 'secondvoice', fps: 25, count: 235, nat: { w: 1440, h: 900 } },
    mirror: { dir: 'mirror', fps: 30, count: 294, nat: { w: 1440, h: 900 } }
  };

  function filmFrame(img, film, time) {
    const index = clamp(Math.floor(time * film.fps + 1e-6), 0, film.count - 1);
    setSrc(img, `/brag-output/work/frames/${film.dir}/f${String(index).padStart(4, '0')}.jpg`);
  }

  /* -------------------------------------------------------------- elements */

  const el = {
    page: $('page'),
    hero: $('hero'),
    portraitWrap: $('portraitWrap'),
    heroText: $('heroText'),
    lines: [...document.querySelectorAll('#headline .line')],
    focus: $('focus'),
    heroRule: $('heroRule'),
    actions: $('heroActions'),
    btn: $('btnExplore'),
    work: $('work'),
    workTitle: $('workTitle'),
    workLede: $('workLede'),
    workRule: $('workRule'),
    workHeader: $('workHeader'),
    tiles: [...document.querySelectorAll('.tile')],
    nav: $('siteNav'),
    slit: $('slit'),
    hookChrome: $('hookChrome'),
    camOn: $('chCameraOn'),
    status: $('chStatus'),
    live: $('chLive'),
    liveDot: document.querySelector('#chLive i'),
    labels: $('labels'),
    projects: $('projects'),
    frame: $('pFrame'),
    pm: {
      sv: $('pm-sv'),
      svclose: $('pm-svclose'),
      mirror: $('pm-mirror'),
      camera: $('pm-camera'),
      vigia: $('pm-vigia'),
      f24: $('pm-f24')
    },
    svFilm: $('svFilm'),
    svPanel: document.querySelector('.sv-panel'),
    svDiff: $('svDiff'),
    mirrorFilm: $('mirrorFilm'),
    cameraShot: $('cameraShot'),
    vigiaA: $('vigiaA'),
    vigiaB: $('vigiaB'),
    f24Photo: $('f24Photo'),
    iris: $('irisRing'),
    chCard: $('chCard'),
    chSentence: $('chSentence'),
    ptext: {
      sv: $('pt-sv'),
      mirror: $('pt-mirror'),
      camera: $('pt-camera'),
      vigia: $('pt-vigia')
    },
    f24: $('f24'),
    f24Scrim: $('f24Scrim'),
    f24Eyebrow: document.querySelector('#f24Text .eyebrow'),
    f24Lines: [...document.querySelectorAll('#f24Text .line')],
    f24Caption: $('f24Caption'),
    thesis: $('thesis'),
    thesisLine: $('thesisLine'),
    recap: [...document.querySelectorAll('.rtile')],
    endcard: $('endcard'),
    endGlow: $('endGlow'),
    endName: $('endName'),
    endPortrait: $('endPortrait'),
    endRole: $('endRole'),
    endUrl: $('endUrl'),
    endArrow: document.querySelector('#endUrl .arrow-icon'),
    cursor: $('cursor')
  };

  /* ------------------------------------------------------ built structures */

  // Slit: two hairlines that open into the aperture.
  const edgeTop = document.createElement('div');
  const edgeBottom = document.createElement('div');
  edgeTop.className = 'edge';
  edgeBottom.className = 'edge';
  el.slit.append(edgeTop, edgeBottom);

  // Recognition labels, anchored to points on the portrait (image pixels).
  const LABELS = [
    { node: $('L1'), anchor: [770, 196], appear: 0.3125, resolve: 0.625, from: '#544cc0' },
    { node: $('L2'), anchor: [706, 548], appear: 0.78125, resolve: 1.09375, from: '#3d3842' },
    { node: $('L3'), anchor: [520, 772], appear: 1.25, resolve: 1.5625, from: '#544cc0' }
  ].map((label) => {
    const chip = label.node.querySelector('.chip');
    const ping = document.createElement('i');
    ping.className = 'ping';
    Object.assign(ping.style, {
      position: 'absolute',
      left: '-6px',
      top: '-6px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.85)'
    });
    label.node.prepend(ping);
    return {
      ...label,
      chip,
      ping,
      anchorDot: label.node.querySelector('.anchor'),
      fromText: chip.querySelector('.from'),
      toText: chip.querySelector('.to')
    };
  });

  // Second Voice diff: the real first sentence of the recorded rewrite.
  const DIFF = [
    ['del', 'Every', 0], ['ins', 'Each', 0], ['keep', ' winter'], ['del', ',', 1], ['keep', ' the '],
    ['ins', 'iron ', 2], ['keep', 'lamps '], ['del', 'along', 3], ['ins', 'that lined', 3],
    ['keep', ' the harbor '], ['del', 'went', 4], ['ins', 'guttered', 4], ['keep', ' '],
    ['del', 'dark', 5], ['ins', 'out,', 5], ['keep', ' one '], ['del', 'by', 6], ['ins', 'after', 6],
    ['keep', ' '], ['del', 'one.', 7], ['ins', 'another, until only darkness lay upon the water’s edge.', 7]
  ];
  const DIFF_T0 = 8.75;
  const DIFF_STEP = 0.078125;
  const diffTokens = [];
  for (const [kind, text, step] of DIFF) {
    if (kind === 'keep') {
      el.svDiff.append(document.createTextNode(text));
      continue;
    }
    if (kind === 'del') {
      const span = document.createElement('span');
      span.className = 'del';
      span.textContent = text;
      el.svDiff.append(span);
      diffTokens.push({ kind, span, at: DIFF_T0 + step * DIFF_STEP });
      continue;
    }
    // Insertions arrive word by word so long ones can wrap.
    text.trimEnd().split(' ').forEach((word, i, words) => {
      if (i > 0) {
        const space = document.createElement('span');
        space.className = 'ins';
        space.textContent = ' ';
        el.svDiff.append(space);
        diffTokens.push({ kind, span: space, at: DIFF_T0 + step * DIFF_STEP + i * 0.03 });
      }
      const span = document.createElement('span');
      span.className = 'ins';
      span.textContent = i === words.length - 1 && text.endsWith(' ') ? `${word} ` : word;
      el.svDiff.append(span);
      diffTokens.push({ kind, span, at: DIFF_T0 + step * DIFF_STEP + i * 0.03 });
    });
  }

  // Camera Harness sentence, word by word.
  const sentence = 'You raised your left hand and made a peace sign.';
  const chWords = sentence.split(' ').map((word, i, all) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = i < all.length - 1 ? `${word} ` : word;
    el.chSentence.append(span);
    return span;
  });

  // Thesis line.
  const thesisWords = 'I build the systems around AI.'.split(' ').map((word, i, all) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = word;
    el.thesisLine.append(span);
    if (i < all.length - 1) el.thesisLine.append(document.createTextNode(' '));
    return span;
  });

  // End card name, letter by letter.
  const nameLetters = [...'Miguel Almeida'].map((ch) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch;
    el.endName.append(span);
    return span;
  });

  // The end card's red glow, drawn once with triangular dither so the dark gradient
  // never bands, here or after a platform re-encodes the film.
  {
    const w = 1500;
    const h = 1100;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(w, h);
    const rand = mulberry32(22);
    const radius = Math.min(w, h) / 2;
    const color = [160, 18, 18];
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const d = Math.hypot(x - w / 2, y - h / 2) / radius;
        const a = d < 0.55 ? mix(0.26, 0.08, d / 0.55) : d < 1 ? mix(0.08, 0, (d - 0.55) / 0.45) : 0;
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c += 1) {
          image.data[i + c] = Math.max(0, Math.round(color[c] * a + (rand() - rand()) * 1.2));
        }
        image.data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    el.endGlow.append(canvas);
  }

  /* ----------------------------------------------------------- measurement */

  const M = {};

  function measure() {
    const r = (node) => node.getBoundingClientRect();
    const btn = r(el.btn);
    M.btn = { x: btn.left + btn.width * 0.42, y: btn.top + btn.height * 0.56 };
    const sv = r(el.tiles[0].querySelector('.surface'));
    M.svTile = { x: sv.left, y: sv.top - H, w: sv.width, h: sv.height };
    const f24 = r(el.recap[4]);
    M.recapF24 = { x: f24.left, y: f24.top, w: f24.width, h: f24.height };
    M.statusW = r(el.status).width;

    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '700 23px Roboto';
    for (const label of LABELS) {
      label.wFrom = ctx.measureText(label.fromText.textContent).width + 50;
      label.wTo = ctx.measureText(label.toText.textContent).width + 50;
    }
    for (const token of diffTokens) {
      if (token.kind === 'ins') token.w = token.span.getBoundingClientRect().width;
    }
  }

  /* ---------------------------------------------------------------- layout */

  const PORTRAIT = { w: 1451, h: 1086 };
  const PROJ = { x: 776, y: 212, w: 1048, h: 655 };
  const FULL = { x: 0, y: 0, w: W, h: H };

  function portraitPose(t) {
    const hookS = mix(1.13, 1.05, tw(t, 0, T.hookEnd, ease.outCubic));
    const hook = { s: hookS, x: 960 - 745 * hookS, y: 400 - 330 * hookS };
    const heroS = 0.95;
    const hero = { s: heroS, x: 1400 - 725 * heroS, y: -4 };
    const p = tw(t, T.hookEnd, T.hookEnd + 0.72, ease.emph);
    return { s: mix(hook.s, hero.s, p), x: mix(hook.x, hero.x, p), y: mix(hook.y, hero.y, p) };
  }

  function cursorState(t) {
    const a = 4.62;
    const b = 5.78;
    const p = tw(t, a, b, ease.inOut);
    const P0 = [1760, 1160];
    const P1 = [1180, 820];
    const P2 = [M.btn.x, M.btn.y];
    const q = 1 - p;
    const x = q * q * P0[0] + 2 * q * p * P1[0] + p * p * P2[0];
    const y = q * q * P0[1] + 2 * q * p * P1[1] + p * p * P2[1];
    const press = tw(t, T.click - 0.02, T.click + 0.06, ease.feedback) * (1 - tw(t, T.click + 0.1, T.click + 0.22, ease.feedback));
    const visible = t >= a && t < 6.8;
    const o = tw(t, a, a + 0.18) * (1 - tw(t, 6.5, 6.74, ease.inCubic));
    return { x, y, press, visible, o };
  }

  /* ----------------------------------------------------------------- scenes */

  function renderNav(t) {
    const on = t >= T.hookEnd && t < 7.6;
    show(el.nav, on);
    if (!on) return;
    opacity(el.nav, tw(t, 2.66, 3.06) * (1 - tw(t, 7.4, 7.6, ease.emphAccel)));
    transform(el.nav, `translate3d(-50%, ${round(-14 * (1 - tw(t, 2.66, 3.22, ease.settle)), 2)}px, 0)`);
  }

  function renderHome(t) {
    const on = t < 7.8;
    show(el.page, on);
    if (!on) return;

    // Scroll to Selected work after the click.
    const scroll = -H * tw(t, T.scrollStart, T.scrollEnd, ease.inOut);
    transform(el.page, `translate3d(0, ${round(scroll, 2)}px, 0)`);

    // Aperture that opens from the slit (opening only).
    if (t < 0.9) {
      const open = tw(t, 0.14, 0.82, ease.emph);
      const h = (H / 2) * open;
      set(el.hero, 'clipPath', `inset(${round(H / 2 - h - 1, 2)}px 0 ${round(H / 2 - h - 1, 2)}px 0)`);
    } else set(el.hero, 'clipPath', 'none');

    // Portrait, with the pointer-depth response once the cursor is in.
    const pose = portraitPose(t);
    const cur = cursorState(t);
    let dx = 0;
    let dy = 0;
    let rot = 0;
    if (cur.visible) {
      const k = cur.o;
      dx = ((cur.x - 960) / 960) * 6 * k;
      dy = ((cur.y - 540) / 540) * 6 * k;
      rot = ((cur.x - 960) / 960) * 1 * k;
    }
    transform(
      el.portraitWrap,
      `translate3d(${round(pose.x + dx, 2)}px, ${round(pose.y + dy, 2)}px, 0) rotate(${round(rot, 3)}deg) scale(${round(pose.s, 5)})`
    );

    // Hero copy settles line by line (the site's hero sequence, at film pace).
    const heroOn = t >= T.hookEnd;
    show(el.heroText, heroOn);
    if (heroOn) {
      el.lines.forEach((line, i) => settleIn(line, t, 2.62 + i * 0.085, { dist: 30, dur: 0.6 }));
      settleIn(el.focus, t, 2.92, { dist: 22 });
      opacity(el.heroRule, tw(t, 3.0, 3.2));
      transform(el.heroRule, `scaleX(${round(tw(t, 3.0, 3.62, ease.settle), 4)})`);
      settleIn(el.actions, t, 3.06, { dist: 22 });

      const hover = tw(t, 5.66, 5.82, ease.feedback);
      set(el.btn, 'background', mixColor('#f4eadc', '#e3d6c3', hover));
      set(el.btn, 'borderColor', mixColor('#f4eadc', '#e3d6c3', hover));
      transform(el.btn, `scale(${round(1 - 0.025 * cur.press, 4)})`);
    }

    // Selected work.
    const workOn = t >= T.scrollStart;
    show(el.work, workOn);
    if (workOn) {
      const exit = tw(t, 7.4, 7.6, ease.emphAccel);
      settleIn(el.workTitle, t, 6.5, { dist: 26 });
      settleIn(el.workLede, t, 6.58, { dist: 20 });
      opacity(el.workHeader, 1 - exit);
      transform(el.workRule, `scaleX(${round(tw(t, 6.7, 7.32, ease.settle), 4)})`);
      el.tiles.forEach((tile, i) => {
        const a = 6.62 + i * 0.06;
        const p = tw(t, a, a + 0.62, ease.settle);
        const surface = tile.querySelector('.surface');
        set(surface, 'clipPath', `inset(${round(4 * (1 - p), 3)}% ${round(8 * (1 - p), 3)}%)`);
        transform(surface, `scale(${round(1.012 - 0.012 * p, 5)})`);
        const copy = tw(t, a + 0.08, a + 0.5);
        const copyExit = i === 0 ? tw(t, 7.34, 7.5, ease.emphAccel) : exit;
        tile.querySelectorAll('.meta, h3').forEach((n) => opacity(n, copy * (1 - copyExit)));
        if (i === 0) {
          vis(surface, t < T.sv);
        } else {
          opacity(surface, 1 - exit);
        }
        transform(tile, `scale(${round(1 - 0.02 * exit, 4)})`);
      });
    }
  }

  function renderHook(t) {
    const slitOn = t < 0.9;
    show(el.slit, slitOn);
    if (slitOn) {
      const draw = tw(t, 0.0, 0.26, ease.emphDecel);
      const open = tw(t, 0.14, 0.82, ease.emph);
      const h = (H / 2) * open;
      const o = draw * (1 - tw(t, 0.3, 0.84, ease.inCubic));
      [
        [edgeTop, H / 2 - h],
        [edgeBottom, H / 2 + h]
      ].forEach(([edge, y]) => {
        set(edge, 'top', `${round(y, 2)}px`);
        transform(edge, `scaleX(${round(draw, 4)})`);
        opacity(edge, o);
      });
    }

    const on = t < 2.64;
    show(el.hookChrome, on);
    show(el.labels, on);
    if (!on) return;

    const out = 1 - tw(t, 2.42, 2.6, ease.inCubic);
    const inX = (a) => 1 - tw(t, a, a + 0.5, ease.settle);
    opacity(el.camOn, tw(t, 0.26, 0.56) * out);
    transform(el.camOn, `translate3d(${round(-18 * inX(0.26), 2)}px, 0, 0)`);
    opacity(el.live, tw(t, 0.3, 0.6) * out);
    transform(el.live, `translate3d(${round(18 * inX(0.3), 2)}px, 0, 0)`);
    opacity(el.status, tw(t, 0.4, 0.7) * out);
    set(el.status, 'left', `${round(960 - M.statusW / 2, 2)}px`);
    transform(el.status, `translate3d(0, ${round(-12 * inX(0.4), 2)}px, 0)`);
    opacity(el.liveDot, 0.45 + 0.55 * (0.5 + 0.5 * Math.cos(2 * Math.PI * 1.4 * t)));

    const pose = portraitPose(t);
    for (const label of LABELS) {
      const [ax, ay] = label.anchor;
      const x = pose.x + ax * pose.s;
      const y = pose.y + ay * pose.s;
      transform(label.node, `translate3d(${round(x, 2)}px, ${round(y, 2)}px, 0)`);

      const dot = tw(t, label.appear - 0.06, label.appear + 0.22, (p) => backOut(p, 2));
      transform(label.anchorDot, `scale(${round(dot, 4)})`);
      opacity(label.anchorDot, tw(t, label.appear - 0.06, label.appear + 0.04) * out);

      const pp = prog(t, label.appear - 0.04, label.appear + 0.5);
      opacity(label.ping, (1 - pp) * 0.8 * (pp > 0 ? 1 : 0) * out);
      transform(label.ping, `scale(${round(1 + pp * 3.2, 3)})`);

      const appear = prog(t, label.appear, label.appear + 0.34);
      const r = tw(t, label.resolve, label.resolve + 0.3, ease.emph);
      const pop = Math.sin(Math.PI * prog(t, label.resolve, label.resolve + 0.32)) * 0.08;
      const w = mix(label.wFrom, label.wTo, r);
      const s = mix(0.55, 1, backOut(appear, 1.9)) + pop;
      set(label.chip, 'width', `${round(w, 2)}px`);
      set(label.chip, 'background', mixColor(label.from, '#2c6854', tw(t, label.resolve, label.resolve + 0.18, ease.feedback)));
      set(label.chip, '--dash', String(round(1 - tw(t, label.resolve, label.resolve + 0.16), 3)));
      transform(label.chip, `translate3d(${round(-w / 2, 2)}px, 0, 0) scale(${round(s, 4)})`);
      opacity(label.chip, tw(t, label.appear, label.appear + 0.14) * out);
      opacity(label.fromText, 1 - tw(t, label.resolve, label.resolve + 0.12));
      opacity(label.toText, tw(t, label.resolve + 0.05, label.resolve + 0.2));
    }
  }

  function textChapter(node, t, a, out) {
    const [idx, eyebrow, title, rule, claim] = node.children;
    const exit = out ? [out - 0.15, out + 0.01, 14] : null;
    settleIn(idx, t, a + 0.02, { dist: 22, dur: 0.5, out: exit });
    settleIn(eyebrow, t, a + 0.05, { dist: 24, dur: 0.5, out: exit });
    settleIn(title, t, a + 0.08, { dist: 34, dur: 0.58, out: exit });
    settleIn(claim, t, a + 0.13, { dist: 26, dur: 0.52, out: exit });
    const ruleIn = tw(t, a + 0.24, a + 0.74, ease.settle);
    const ruleOut = out ? tw(t, out - 0.15, out + 0.01, ease.emphAccel) : 0;
    transform(rule, `scaleX(${round(ruleIn * (1 - ruleOut), 4)})`);
  }

  function renderProjects(t) {
    const on = t >= T.sv && t < 20.7;
    show(el.projects, on);
    if (!on) return;

    // Text column, one chapter per bar.
    const chapters = [
      ['sv', T.sv + 0.08, T.mirror],
      ['mirror', T.mirror + 0.02, T.camera],
      ['camera', T.camera + 0.02, T.vigia],
      ['vigia', T.vigia + 0.06, T.f24]
    ];
    for (const [key, a, out] of chapters) {
      const node = el.ptext[key];
      const on = t >= a - 0.02 && t < out + 0.03;
      show(node, on);
      if (on) textChapter(node, t, a, out);
    }

    // The shared frame: tile → chapter frame → full bleed → recap tile.
    let rect = null;
    let radius = 8;
    if (t < 8.1) {
      const p = tw(t, T.sv, 8.1, ease.emph);
      rect = lerpRect(M.svTile, PROJ, p);
      radius = 8 * p;
    } else if (t < T.f24) rect = PROJ;
    else if (t < 18.2) {
      const p = tw(t, T.f24, 18.2, ease.emph);
      rect = lerpRect(PROJ, FULL, p);
      radius = 8 * (1 - p);
    } else if (t < T.thesis) {
      rect = FULL;
      radius = 0;
    } else if (t < 20.62) {
      rect = lerpRect(FULL, M.recapF24, tw(t, T.thesis, 20.62, ease.emph));
      radius = 0;
    }
    show(el.frame, Boolean(rect));
    if (!rect) return;
    set(el.frame, 'left', `${round(rect.x, 2)}px`);
    set(el.frame, 'top', `${round(rect.y, 2)}px`);
    set(el.frame, 'width', `${round(rect.w, 2)}px`);
    set(el.frame, 'height', `${round(rect.h, 2)}px`);
    set(el.frame, 'borderRadius', `${round(radius, 2)}px`);
    const frame = { w: rect.w, h: rect.h };

    // 01 Second Voice AI: the real film, then the live rewrite re-set at video size.
    const svOn = t < 8.8;
    show(el.pm.sv, svOn);
    if (svOn) {
      filmFrame(el.svFilm, FILMS.sv, 2.245 + (t - T.sv));
      const push = tw(t, 8.02, 8.62, ease.inOutSoft);
      placeImage(el.svFilm, FILMS.sv.nat, frame, {
        zoom: 1 + 0.7 * push,
        fx: mix(720, 1010, push),
        fy: mix(450, 330, push)
      });
      set(el.pm.sv, 'filter', `brightness(${round(1 - 0.92 * tw(t, 8.3, 8.5, ease.inCubic), 3)})`);
    }
    const closeOn = t >= 8.44 && t < 10.7;
    show(el.pm.svclose, closeOn);
    if (closeOn) {
      const inP = tw(t, 8.44, 8.7, ease.outCubic);
      const push = tw(t, T.mirror, T.mirror + 0.62, ease.emph);
      opacity(el.pm.svclose, inP * (1 - 0.55 * push));
      transform(
        el.pm.svclose,
        `translate3d(${round(-0.3 * frame.w * push, 2)}px, 0, 0) scale(${round(mix(1.06, 1, tw(t, 8.44, 9.0, ease.settle)) - 0.04 * push, 4)})`
      );
      for (const token of diffTokens) {
        if (token.kind === 'del') {
          const p = tw(t, token.at, token.at + 0.12, ease.feedback);
          set(token.span, '--strike', String(round(p, 3)));
          set(token.span, 'color', mixColor('#efe9df', '#8b867e', p));
        } else {
          const p = tw(t, token.at, token.at + 0.16, ease.settle);
          set(token.span, 'maxWidth', `${round(token.w * p + 0.01, 2)}px`);
          opacity(token.span, tw(t, token.at + 0.02, token.at + 0.14));
        }
      }
    }

    // 02 Mirror AI: the recorded film, pushed in over the previous chapter.
    const mirrorOn = t >= T.mirror && t < 13.1;
    show(el.pm.mirror, mirrorOn);
    if (mirrorOn) {
      filmFrame(el.mirrorFilm, FILMS.mirror, 1.025 + (t - T.mirror));
      const push = tw(t, T.mirror, T.mirror + 0.62, ease.emph);
      transform(el.pm.mirror, `translate3d(${round(frame.w * (1 - push), 2)}px, 0, 0)`);
      set(el.pm.mirror, 'boxShadow', push < 1 ? '-40px 0 80px rgba(0,0,0,0.7)' : 'none');
      const drift = tw(t, T.mirror, 12.9, ease.inOutSoft);
      placeImage(el.mirrorFilm, FILMS.mirror.nat, frame, {
        crop: { x: 40, y: 76, w: 1360, h: 784 },
        zoom: mix(1.0, 1.08, drift),
        fx: mix(700, 610, drift),
        fy: mix(470, 450, drift)
      });
      set(el.pm.mirror, 'filter', `brightness(${round(1 - 0.6 * tw(t, T.camera, T.camera + 0.4, ease.inCubic), 3)})`);
    }

    // 03 Camera Harness: an iris opens on the camera, then the result panel builds.
    const camOn = t >= T.camera && t < 15.6;
    show(el.pm.camera, camOn);
    show(el.iris, t >= T.camera && t < 13.3);
    set(el.iris, 'borderWidth', `${round(mix(5, 1.5, tw(t, T.camera, 13.2, ease.outCubic)), 2)}px`);
    if (camOn) {
      const crop = { x: 26, y: 54, w: 986, h: 612 };
      const drift = tw(t, T.camera, 15.2, ease.inOutSoft);
      placeImage(el.cameraShot, { w: 1600, h: 684 }, frame, {
        crop,
        zoom: mix(1.0, 1.05, drift),
        fx: 560,
        fy: 340
      });
      const irisP = tw(t, T.camera, T.camera + 0.78, ease.emph);
      const cx = 430;
      const cy = 250;
      const R = 1100 * irisP;
      set(el.pm.camera, 'clipPath', irisP < 1 ? `circle(${round(R, 2)}px at ${round(cx, 2)}px ${round(cy, 2)}px)` : 'none');
      const vOut = tw(t, T.vigia - 0.08, T.vigia + 0.1, ease.inCubic);
      opacity(el.pm.camera, 1 - vOut);
      if (t < 13.3) {
        set(el.iris, 'width', `${round(2 * R, 2)}px`);
        set(el.iris, 'height', `${round(2 * R, 2)}px`);
        transform(el.iris, `translate3d(${round(cx - R, 2)}px, ${round(cy - R, 2)}px, 0)`);
        opacity(el.iris, 0.95 * (1 - tw(t, 12.86, 13.26, ease.inCubic)) * tw(t, T.camera, T.camera + 0.05));
      }
    }
    const cardOn = t >= 12.8 && t < 15.3;
    show(el.chCard, cardOn);
    if (cardOn) {
      const inP = tw(t, 12.8125, 13.4, ease.settle);
      const outP = tw(t, T.vigia - 0.16, T.vigia + 0.01, ease.emphAccel);
      opacity(el.chCard, tw(t, 12.8125, 13.08) * (1 - outP));
      transform(el.chCard, `translate3d(0, ${round(46 * (1 - inP) - 24 * outP, 2)}px, 0) scale(${round(0.96 + 0.04 * inP, 4)})`);
      chWords.forEach((word, i) => settleIn(word, t, 12.94 + i * 0.03, { dist: 12, dur: 0.34 }));
    }

    // 04 VIGIA: settle in from a zoomed blur, then cut to the event response on beat 3.
    const vigiaOn = t >= T.vigia + 0.06 && t < 17.7;
    show(el.pm.vigia, vigiaOn);
    if (vigiaOn) {
      const inP = tw(t, T.vigia + 0.06, T.vigia + 0.68, ease.emph);
      opacity(el.pm.vigia, tw(t, T.vigia + 0.06, T.vigia + 0.34) * (1 - tw(t, T.f24 - 0.06, T.f24 + 0.1, ease.inCubic)));
      transform(el.pm.vigia, `scale(${round(mix(1.16, 1, inP), 4)})`);
      set(el.pm.vigia, 'filter', `blur(${round(10 * (1 - inP), 2)}px)`);
      const nat = { w: 1440, h: 900 };
      const d1 = tw(t, T.vigia, 16.4, ease.inOutSoft);
      placeImage(el.vigiaA, nat, frame, { zoom: mix(1.0, 1.42, d1), fx: mix(720, 742, d1), fy: mix(450, 470, d1) });
      const cut = t >= 16.25;
      vis(el.vigiaA, !cut);
      vis(el.vigiaB, cut);
      const punch = 0.025 * (1 - tw(t, 16.25, 16.6, ease.settle));
      const d2 = tw(t, 16.25, 17.9, ease.inOutSoft);
      placeImage(el.vigiaB, nat, frame, { crop: { x: 152, y: 0, w: 1288, h: 900 }, zoom: mix(1.02, 1.1, d2) + punch, fx: 830, fy: 500 });
    }

    // 05 F24: the frame opens to full bleed, then folds into the recap strip.
    const f24On = t >= T.f24 && t < 20.62;
    show(el.pm.f24, f24On);
    if (f24On) {
      opacity(el.pm.f24, tw(t, T.f24 + 0.04, T.f24 + 0.3));
      const fold = tw(t, T.thesis, 20.62, ease.emph);
      const drift = tw(t, T.f24, T.thesis, ease.inOutSoft);
      placeImage(el.f24Photo, { w: 1854, h: 1240 }, frame, {
        zoom: mix(mix(1.03, 1.1, drift), 1, fold),
        fx: mix(1000, 927, fold),
        fy: mix(560, 620, fold)
      });
      set(el.pm.f24, 'filter', `brightness(${round(mix(0.74, 1, fold), 3)})`);
    }
  }

  function renderF24(t) {
    const on = t >= T.f24 && t < 20.4;
    show(el.f24, on);
    if (!on) return;
    const exit = [T.thesis - 0.17, T.thesis + 0.01, 18];
    opacity(el.f24Scrim, tw(t, T.f24 + 0.05, T.f24 + 0.5) * (1 - tw(t, T.thesis, T.thesis + 0.3)));
    settleIn(el.f24Eyebrow, t, 17.52, { dist: 22, out: exit });
    el.f24Lines.forEach((line, i) => settleIn(line, t, 17.56 + i * 0.07, { dist: 40, dur: 0.58, out: exit }));
    settleIn(el.f24Caption, t, 17.96, { dist: 14, out: exit });
  }

  function renderThesis(t) {
    const on = t >= T.thesis && t < 22.5;
    show(el.thesis, on);
    if (!on) return;
    const out = tw(t, 22.32, 22.49, ease.emphAccel);
    opacity(el.thesis, 1 - out);
    transform(el.thesis, `scale(${round(1 - 0.02 * out, 4)})`);
    thesisWords.forEach((word, i) => {
      const a = 20.06 + i * 0.05;
      settleIn(word, t, a, { dist: 30, dur: 0.6 });
      set(word, 'color', mixColor('#9cc3ec', '#f4eadc', tw(t, a + 0.24, a + 0.7, ease.inOutSoft)));
    });
    el.recap.forEach((tile, i) => {
      if (i === 4) {
        vis(tile, t >= 20.62);
        return;
      }
      const a = 20.4 + i * 0.07;
      const p = tw(t, a, a + 0.62, ease.settle);
      vis(tile, t >= a);
      set(tile, 'clipPath', `inset(${round(4 * (1 - p), 3)}% ${round(8 * (1 - p), 3)}%)`);
      transform(tile, `scale(${round(1.02 - 0.02 * p, 5)})`);
      opacity(tile, tw(t, a, a + 0.2));
    });
  }

  function renderEnd(t) {
    const on = t >= T.end;
    show(el.endcard, on);
    if (!on) return;
    opacity(el.endGlow, tw(t, T.end, T.end + 0.9, ease.inOutSoft));

    const rise = tw(t, T.end, T.end + 1.0, ease.settle);
    const s = 1.12;
    const x = 960 - 725 * s - 58;
    const y = mix(172, 128, rise);
    opacity(el.endPortrait, tw(t, T.end, T.end + 0.5, ease.outCubic));
    transform(el.endPortrait, `translate3d(${round(x, 2)}px, ${round(y, 2)}px, 0) scale(${round(s + 0.02 * (1 - rise), 5)})`);

    nameLetters.forEach((letter, i) => {
      const a = T.end + 0.14 + i * 0.03;
      opacity(letter, tw(t, a, a + 0.34));
      transform(letter, `translate3d(0, ${round(70 * (1 - tw(t, a, a + 0.8, ease.settle)), 2)}px, 0)`);
    });

    settleIn(el.endRole, t, 23.02, { dist: 18 });
    settleIn(el.endUrl, t, 23.14, { dist: 22 });
    const step = tw(t, 23.62, 23.8, ease.feedback) * (1 - tw(t, 23.86, 24.1, ease.feedback));
    transform(el.endArrow, `translate3d(${round(3 * step, 2)}px, ${round(-3 * step, 2)}px, 0)`);
  }

  function renderCursor(t) {
    const cur = cursorState(t);
    show(el.cursor, cur.visible);
    if (!cur.visible) return;
    opacity(el.cursor, cur.o);
    transform(el.cursor, `translate3d(${round(cur.x - 2, 2)}px, ${round(cur.y - 2, 2)}px, 0) scale(${round(1.35 * (1 - 0.1 * cur.press), 4)})`);
  }

  function render(t) {
    pending = [];
    renderHome(t);
    renderNav(t);
    renderHook(t);
    renderProjects(t);
    renderF24(t);
    renderThesis(t);
    renderEnd(t);
    renderCursor(t);
    return Promise.all(pending);
  }

  /* ------------------------------------------------------------------ boot */

  async function boot() {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) => (img.src ? img.decode().catch(() => {}) : Promise.resolve()))
    );
    measure();
    await render(0);
  }

  const ready = boot();
  window.__duration = DURATION;
  window.__ready = () => ready;
  /** Images the frame actually paints; Chrome may drop their decoded data while hidden. */
  const paintedImages = () => [...document.images].filter((img) => img.getClientRects().length > 0);

  window.__render = async (t) => {
    await ready;
    await render(t);
    await Promise.all(paintedImages().map((img) => img.decode().catch(() => {})));
    // Let layout and paint settle before the capture.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  };
})();
