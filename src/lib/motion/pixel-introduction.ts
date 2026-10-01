import { introScrollGate } from './intro-scroll-gate';
import { resetScrollMotion } from './smooth-scroll';
import { motionState, prefersReducedMotion } from './policy';

type Rect = { x: number; y: number; width: number; height: number };
const rect = (element: Element): Rect => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x, y, width, height };
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const blend = (a: Rect, b: Rect, t: number): Rect => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t),
  width: mix(a.width, b.width, t), height: mix(a.height, b.height, t)
});
// Zero acceleration at each end keeps approach, travel and arrival continuous.
const ease = (t: number) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Type and photograph share one measured person transform, inside the live card's clip. */
export function pixelIntroduction(node: HTMLElement) {
  const root = document.documentElement;
  const site = document.getElementById('portfolio-content');
  if (root.dataset.presentation !== 'pending') return {};
  const restoreScroll = () => {
    if (root.dataset.introRestoration) {
      history.scrollRestoration = root.dataset.introRestoration as ScrollRestoration;
      delete root.dataset.introRestoration;
    }
  };
  const target = site?.querySelector<HTMLElement>('[data-landing-target]');
  const livePhoto = target?.querySelector<HTMLImageElement>('img');
  if (!site || !target || !livePhoto || prefersReducedMotion()) {
    root.dataset.presentation = 'complete';
    restoreScroll();
    return {};
  }
  const frame = node.querySelector<HTMLElement>('[data-intro-card]')!;
  const person = node.querySelector<HTMLElement>('[data-intro-person]')!;
  const type = node.querySelector<SVGElement>('[data-intro-body]')!;
  const backdrop = node.querySelector<HTMLElement>('[data-intro-backdrop]')!;
  const from = rect(person);
  const originalVisibility = livePhoto.style.visibility;
  const hadInert = site.inert;
  // Preserve <picture> source selection and density metadata as well as currentSrc.
  // A bare Image(currentSrc) can rasterize differently from a responsive <picture>.
  const picture = livePhoto.parentElement!.cloneNode(true) as HTMLPictureElement;
  const photo = picture.querySelector('img')!;
  photo.alt = '';
  photo.dataset.introPhoto = '';
  // Same decoded image, with the content rectangle derived from the actual object fit.
  photo.style.cssText = 'position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:auto;height:100%;max-width:100%;object-fit:contain;object-position:bottom;display:block;opacity:0;pointer-events:none;';
  person.append(picture);

  root.dataset.introHydrated = 'true';
  window.scrollTo({ top: 0, behavior: 'instant' });
  resetScrollMotion();
  let done = false;
  let gestureOwned = false;
  let releaseScroll = () => {};
  let unsubscribe = () => {};
  let clock: Animation | undefined;
  let request = 0;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  let observer: ResizeObserver | undefined;
  let card: Rect;
  let destination: Rect;
  let viewport = { width: innerWidth, height: innerHeight };
  let current = from;
  let correction: { delta: Rect; at: number } | undefined;
  let sourceVersion = 0;

  const finish = () => {
    if (done) return;
    done = true;
    // Restore the real image and remove its duplicate in the same rendering turn.
    livePhoto.style.visibility = originalVisibility;
    root.dataset.presentation = 'complete';
    delete root.dataset.introHydrated;
    clock?.cancel();
    site.inert = hadInert;
    cancelAnimationFrame(request);
    clearTimeout(deadline);
    observer?.disconnect();
    restoreScroll();
    if (!gestureOwned || prefersReducedMotion()) releaseScroll();
    window.removeEventListener('keydown', keydown, true);
    window.removeEventListener('pointerdown', finish, true);
    window.removeEventListener('touchstart', finish, true);
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', scroll);
    window.removeEventListener('popstate', finish, true);
    window.removeEventListener('pagehide', finish, true);
    livePhoto.removeEventListener('load', sourceChanged);
    document.removeEventListener('visibilitychange', visibility);
    unsubscribe();
  };
  const keydown = () => finish();
  const visibility = () => { if (document.hidden) finish(); };
  const scroll = () => { if (scrollY > 4) finish(); };
  const time = () => Number(clock?.currentTime || 0);

  function pose(t: number): Rect {
    const approach = 1 + 2.05 * ease((t - 550) / 1800);
    const height = Math.max(140, Math.min(viewport.height * .2, 200)) * approach;
    const width = height * from.width / from.height;
    const centered = { x: (viewport.width - width) / 2, y: (viewport.height - height) / 2, width, height };
    return blend(centered, destination, ease((t - 2150) / 1300));
  }

  function measure() {
    const nextCard = rect(target!);
    const box = rect(livePhoto!);
    const style = getComputedStyle(livePhoto!);
    if (!photo.naturalWidth || !box.width || !box.height) throw new Error('Portrait has no rendered geometry');
    // Carry the actual image box separately from the card. The cloned picture
    // retains contain/bottom framing, including browser subpixel rounding.
    if (style.objectFit !== 'contain' || style.objectPosition !== '50% 100%') {
      throw new Error('Unrecognised hero portrait framing');
    }
    const nextPerson = box;
    if (card && JSON.stringify([card, destination, viewport]) === JSON.stringify([nextCard, nextPerson, { width: innerWidth, height: innerHeight }])) return;
    const previous = current;
    card = nextCard;
    destination = nextPerson;
    viewport = { width: innerWidth, height: innerHeight };
    frame.style.cssText = 'position:absolute;overflow:hidden;transform-origin:0 0;left:' + card.x + 'px;top:' + card.y + 'px;width:' + card.width + 'px;height:' + card.height + 'px;border-radius:' + getComputedStyle(target!).borderRadius + ';';
    // Keep the picture's containing block identical to the real card, so its
    // percentage centering and rasterization also match at the final frame.
    person.style.cssText = 'position:absolute;left:0;top:0;width:' + card.width + 'px;height:' + card.height + 'px;transform-origin:0 0;';
    photo.style.height = box.height + 'px';
    type.style.position = 'absolute';
    type.style.left = (box.x - card.x) + 'px';
    type.style.top = (box.y - card.y) + 'px';
    type.style.width = box.width + 'px';
    type.style.height = box.height + 'px';
    if (clock && time() < 3450) {
      const next = pose(time());
      correction = { delta: { x: previous.x - next.x, y: previous.y - next.y, width: previous.width - next.width, height: previous.height - next.height }, at: time() };
    }
  }

  function render(t: number) {
    let body = pose(t);
    if (correction) {
      const weight = 1 - ease((t - correction.at) / Math.max(1, 3450 - correction.at));
      const d = correction.delta;
      body = { x: body.x + d.x * weight, y: body.y + d.y * weight, width: body.width + d.width * weight, height: body.height + d.height * weight };
    }
    current = body;
    const bounds = blend({ x: 0, y: 0, width: viewport.width, height: viewport.height }, card, ease((t - 2900) / 550));
    const sx = bounds.width / card.width, sy = bounds.height / card.height;
    frame.style.transform = 'translate(' + (bounds.x - card.x) + 'px,' + (bounds.y - card.y) + 'px) scale(' + sx + ',' + sy + ')';
    // Inverse of the frame transform preserves one world-space body trajectory.
    const bx = body.width / destination.width, by = body.height / destination.height;
    person.style.transform = 'translate(' + ((body.x - bounds.x - (destination.x - card.x) * bx) / sx) + 'px,' + ((body.y - bounds.y - (destination.y - card.y) * by) / sy) + 'px) scale(' + (bx / sx) + ',' + (by / sy) + ')';
    if (t >= 3450) { frame.style.transform = 'none'; person.style.transform = 'none'; }
    const material = ease((t - 2700) / 750);
    type.style.opacity = String(1 - material);
    photo.style.opacity = t >= 3450 ? '' : String(material);
    node.dataset.stage = t >= 2850 ? 'transfer' : 'approach';
  }

  const resize = () => {
    if (done || !clock) return;
    try { measure(); render(time()); void syncSource().catch(finish); } catch { finish(); }
  };
  async function syncSource() {
    const version = ++sourceVersion;
    const src = livePhoto!.currentSrc || livePhoto!.src;
    await photo.decode();
    if (done || version !== sourceVersion) return;
    if (photo.currentSrc !== src) throw new Error('Portrait source selection differs');
    type.style.maskImage = 'url("' + src + '")';
    node.querySelector('[data-intro-type]')?.removeAttribute('clip-path');
  }
  const sourceChanged = () => { void syncSource().then(resize).catch(finish); };

  releaseScroll = introScrollGate(() => { gestureOwned = true; finish(); });
  window.addEventListener('keydown', keydown, true);
  window.addEventListener('pointerdown', finish, { capture: true, passive: true });
  window.addEventListener('touchstart', finish, { capture: true, passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('popstate', finish, { capture: true, passive: true });
  window.addEventListener('pagehide', finish, { capture: true, passive: true });
  livePhoto.addEventListener('load', sourceChanged);
  document.addEventListener('visibilitychange', visibility);
  unsubscribe = motionState.subscribe(({ reduced }) => { if (reduced) finish(); });
  deadline = setTimeout(finish, 6500);

  async function start() {
    try {
      await livePhoto!.decode();
      await syncSource();
      if (done) return;
      measure();
      livePhoto!.style.visibility = 'hidden';
      site!.inert = true;
      render(0);
      root.dataset.presentation = 'running';
      clock = backdrop.animate([
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 2850 / 3600 },
        { opacity: 0, offset: 3450 / 3600 },
        { opacity: 0, offset: 1 }
      ], { duration: 3600, fill: 'forwards' });
      clock.onfinish = finish;
      const advance = () => {
        if (done) return;
        render(time());
        request = requestAnimationFrame(advance);
      };
      request = requestAnimationFrame(advance);
      observer = new ResizeObserver(resize);
      observer.observe(target!);
      observer.observe(livePhoto!);
      clearTimeout(deadline);
      deadline = setTimeout(finish, 6000); // Failure bound only; the animation owns completion.
    } catch (error) {
      if (import.meta.env.DEV) console.warn('Introduction settled without animation:', error);
      finish();
    }
  }
  void start();
  return { destroy: finish };
}
