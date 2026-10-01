import { areaPlan } from './plan';
import { rendered } from './registry';

export function proximity(onNear: (near: boolean) => void) {
  const media = matchMedia('(min-width: 768px) and (pointer: fine)');
  let frame = 0, x = -999, y = -999;
  let boxes: { el: HTMLElement; rect: DOMRect }[] = [];
  const chip = document.querySelector<HTMLElement>('.ask-chip')!;
  const halo = document.querySelector<HTMLElement>('.ask-halo')!;
  const measure = () => { boxes = [...document.querySelectorAll<HTMLElement>('[data-ask-id]')].filter(rendered).map(el => ({ el, rect: el.getBoundingClientRect() })); };
  function reset() {
    boxes.forEach(({ el }) => el.style.removeProperty('--p'));
    chip.classList.remove('is-on'); halo.classList.remove('is-on'); onNear(false);
  }
  function update() {
    frame = 0;
    if (!media.matches || x < 0) { reset(); return; }
    let distance = Infinity, nearest: HTMLElement | undefined;
    for (const { el, rect: r } of boxes) {
      const d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
      const t = Math.max(0, Math.min(1, 1 - d / 200));
      el.style.setProperty('--p', String(t * t * (3 - 2 * t)));
      if (d < distance) { distance = d; nearest = el; }
    }
    const near = !!nearest && distance <= 42;
    onNear(near);
    halo.style.left = `${x}px`; halo.style.top = `${y}px`; halo.classList.add('is-on');
    chip.classList.toggle('is-on', near);
    if (near) {
      chip.querySelector('[data-chip-question]')!.textContent = areaPlan(nearest!.dataset.askId!)!.question;
      chip.style.left = `${Math.min(x, innerWidth - chip.offsetWidth - 24)}px`;
      chip.style.top = `${Math.min(y, innerHeight - chip.offsetHeight - 24)}px`;
    }
  }
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  const move = (e: PointerEvent) => { if (!media.matches || e.pointerType === 'touch') return; x = e.clientX; y = e.clientY; queue(); };
  const leave = () => { x = y = -999; queue(); };
  const refresh = () => { measure(); queue(); };
  measure();
  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', leave);
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('resize', refresh);
  media.addEventListener('change', refresh);
  return () => { cancelAnimationFrame(frame); reset(); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); window.removeEventListener('scroll', refresh); window.removeEventListener('resize', refresh); media.removeEventListener('change', refresh); };
}
