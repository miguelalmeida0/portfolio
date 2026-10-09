import { introSilhouette } from './intro-silhouette';
import './story-identity-transition.css';

const SVG_NS = 'http://www.w3.org/2000/svg';
const PORTRAIT_RATIO = 1086 / 1448;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const COVER_MS = 360;
const REVEAL_MS = 590;

type Rect = { x: number; y: number; width: number; height: number };
type Scene = {
  source?: HTMLImageElement;
  destination?: HTMLImageElement;
  sourceVisibility?: string;
  destinationVisibility?: string;
  animations: Set<Animation>;
  finish(): void;
};

function centerRect(): Rect {
  const height = Math.min(280, Math.max(175, innerHeight * 0.28));
  const width = height * PORTRAIT_RATIO;
  return { x: (innerWidth - width) / 2, y: (innerHeight - height) / 2, width, height };
}

/** Measure the actual picture inside object-fit: contain, not its padded img box. */
function portraitRect(image: HTMLImageElement): Rect | undefined {
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
  const box = image.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  return { x: box.x + (box.width - width) / 2, y: box.bottom - height, width, height };
}

function portrait(pathname: string): HTMLImageElement | undefined {
  const selector = pathname === '/'
    ? '[data-portrait-card] img.portrait'
    : pathname === '/story' ? '.story-intro-photo img' : null;
  return selector ? document.querySelector<HTMLImageElement>(selector) ?? undefined : undefined;
}

function visiblePortrait(pathname: string) {
  const image = portrait(pathname);
  const box = image && portraitRect(image);
  if (!image || !box) return;
  const width = Math.max(0, Math.min(innerWidth, box.x + box.width) - Math.max(0, box.x));
  const height = Math.max(0, Math.min(innerHeight, box.y + box.height) - Math.max(0, box.y));
  if (width < box.width * 0.45 || height < box.height * 0.45) return;
  return { image, box };
}

function svgElement<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(SVG_NS, tag);
}

/** Exact lettering and silhouette path from the approved homepage intro. */
function nameSilhouette(): SVGSVGElement {
  const svg = svgElement('svg');
  svg.dataset.storyIdentityType = '';
  svg.setAttribute('viewBox', '0 0 1086 1448');
  svg.setAttribute('aria-hidden', 'true');
  const defs = svgElement('defs');
  const clip = svgElement('clipPath');
  clip.id = 'story-route-identity-outline';
  const path = svgElement('path');
  path.setAttribute('d', introSilhouette);
  clip.append(path);
  defs.append(clip);
  svg.append(defs);
  const type = svgElement('g');
  type.setAttribute('clip-path', 'url(#story-route-identity-outline)');
  for (let index = 0; index < 63; index++) {
    const row = svgElement('text');
    row.setAttribute('x', String(index % 2 ? -64 : -12));
    row.setAttribute('y', String(index * 23 + 18));
    row.textContent = 'MIGUEL ALMEIDA · '.repeat(9);
    type.append(row);
  }
  svg.append(type);
  return svg;
}

function between(from: Rect, to: Rect): string {
  return 'translate(' + (from.x - to.x) + 'px,' + (from.y - to.y) +
    'px) scale(' + (from.width / to.width) + ',' + (from.height / to.height) + ')';
}

function play(
  scene: Scene,
  node: HTMLElement | SVGSVGElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Promise<void> {
  try {
    const animation = node.animate(keyframes, { fill: 'both', ...options });
    scene.animations.add(animation);
    return animation.finished.then(() => undefined, () => undefined);
  } catch {
    Object.assign(node.style, keyframes.at(-1));
    return Promise.resolve();
  }
}

/**
 * Short version of the homepage's name-in-silhouette intro.
 * Cover the outgoing document before Kit swaps routes, then resolve the same
 * silhouette into the incoming portrait. No competing root View Transition.
 */
export function createStoryIdentityTransition() {
  let active: Scene | undefined;

  function destroy() {
    active?.finish();
    active = undefined;
  }

  function begin(from: string, to: string, complete: Promise<void>): Promise<void> {
    destroy();
    const candidate = visiblePortrait(from);
    const photo = document.createElement('img');
    photo.alt = '';
    photo.dataset.storyIdentityPhoto = '';
    photo.src = candidate?.image.currentSrc || '/images/wind-full-720.webp';
    // A decoded duplicate must exist before the original can be hidden.
    const source = photo.complete && photo.naturalWidth ? candidate : undefined;
    const center = centerRect();
    const initial = source?.box ?? center;

    const layer = document.createElement('div');
    layer.dataset.storyIdentityBridge = '';
    layer.dataset.phase = 'covering';
    layer.setAttribute('aria-hidden', 'true');
    const backdrop = document.createElement('div');
    backdrop.dataset.storyIdentityBackdrop = '';
    const mark = document.createElement('div');
    mark.dataset.storyIdentityMark = '';
    mark.style.left = center.x + 'px';
    mark.style.top = center.y + 'px';
    mark.style.width = center.width + 'px';
    mark.style.height = center.height + 'px';
    mark.style.transform = between(initial, center);

    const type = nameSilhouette();
    if (source) {
      // The actual portrait alpha, also used by the first-visit introduction.
      type.style.maskImage = 'url("' + source.image.currentSrc + '")';
      type.style.maskSize = '100% 100%';
      type.style.maskRepeat = 'no-repeat';
      type.querySelector('g')?.removeAttribute('clip-path');
    }
    type.style.opacity = '0';
    photo.style.opacity = source ? '1' : '0';
    mark.append(photo, type);
    layer.append(backdrop, mark);

    let finished = false;
    const scene: Scene = {
      source: source?.image,
      sourceVisibility: source?.image.style.visibility,
      animations: new Set(),
      finish() {
        if (finished) return;
        finished = true;
        for (const animation of scene.animations) animation.cancel();
        scene.animations.clear();
        if (scene.source) scene.source.style.visibility = scene.sourceVisibility ?? '';
        if (scene.destination) scene.destination.style.visibility = scene.destinationVisibility ?? '';
        layer.remove();
        document.documentElement.removeAttribute('data-story-identity-transition');
        window.removeEventListener('resize', cancel);
        window.removeEventListener('pagehide', cancel);
        document.removeEventListener('visibilitychange', visibility);
        if (active === scene) active = undefined;
      }
    };
    active = scene;
    const cancel = () => scene.finish();
    const visibility = () => { if (document.hidden) cancel(); };
    window.addEventListener('resize', cancel, { passive: true });
    window.addEventListener('pagehide', cancel, { once: true });
    document.addEventListener('visibilitychange', visibility);
    layer.addEventListener('wheel', event => event.preventDefault(), { passive: false });
    layer.addEventListener('touchmove', event => event.preventDefault(), { passive: false });
    document.body.append(layer);
    if (source) source.image.style.visibility = 'hidden';
    document.documentElement.dataset.storyIdentityTransition = 'covering';

    const covered = Promise.all([
      play(scene, backdrop, [{ opacity: 0 }, { opacity: 1 }],
        { duration: COVER_MS, easing: EASE }),
      play(scene, mark, [{ transform: between(initial, center) }, { transform: 'none' }],
        { duration: COVER_MS, easing: EASE }),
      play(scene, type, [{ opacity: 0 }, { opacity: 1 }],
        { duration: 280, delay: 60, easing: EASE }),
      play(scene, photo, [{ opacity: source ? 1 : 0 }, { opacity: 0 }],
        { duration: 250, easing: EASE })
    ]).then(() => {
      if (active !== scene) return;
      mark.style.transform = 'none';
      type.style.opacity = '1';
      photo.style.opacity = '0';
      backdrop.style.opacity = '1';
      layer.dataset.phase = 'covered';
      document.documentElement.dataset.storyIdentityTransition = 'covered';
    });

    void complete.then(async () => {
      if (active !== scene) return;
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      if (active !== scene) return;
      const target = portrait(to);
      const targetBox = target && portraitRect(target);
      const ready = Boolean(photo.complete && photo.naturalWidth && targetBox);
      if (target && ready) {
        scene.destination = target;
        scene.destinationVisibility = target.style.visibility;
        target.style.visibility = 'hidden';
      }
      layer.dataset.phase = 'revealing';
      document.documentElement.dataset.storyIdentityTransition = 'revealing';
      await Promise.all([
        play(scene, backdrop, [{ opacity: 1 }, { opacity: 0 }],
          { duration: REVEAL_MS - 350, delay: 350, easing: EASE }),
        play(scene, mark,
          [{ transform: 'none' },
           { transform: targetBox && ready ? between(targetBox, center) : 'scale(1.08)' }],
          { duration: REVEAL_MS, easing: EASE }),
        play(scene, type, [{ opacity: 1 }, { opacity: 0 }],
          { duration: 240, delay: 260, easing: EASE }),
        play(scene, photo, [{ opacity: 0 }, { opacity: ready ? 1 : 0 }],
          { duration: 290, delay: 230, easing: EASE })
      ]);
      scene.finish();
    }, () => scene.finish()).catch(() => scene.finish());

    return covered;
  }

  return { begin, destroy, get active() { return Boolean(active); } };
}
