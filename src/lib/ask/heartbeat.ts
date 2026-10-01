import { groups } from './plan';
import { sourceElement } from './registry';
import { timers } from './timers';

export function heartbeat(near: () => boolean, reduced: () => boolean) {
  const schedule = timers(), gestures = timers();
  let quietUntil = 0, group = 0;
  const quiet = () => performance.now() < quietUntil || near() || document.hidden || reduced();
  const cancelSways = () => {
    gestures.clear(); document.querySelectorAll('.is-swaying').forEach(el => el.classList.remove('is-swaying'));
  };
  function silence(ms: number) { quietUntil = Math.max(quietUntil, performance.now() + ms); cancelSways(); }
  const key = () => silence(3000);
  const click = (event: MouseEvent) => { if ((event.target as Element).closest('[data-ask-id], [data-ask-try]')) silence(4500); };
  const visible = (el: HTMLElement) => { const r = el.getBoundingClientRect(); const sheet = document.querySelector('[data-ask-panel]')?.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < (innerWidth < 768 && sheet ? sheet.top : innerHeight); };
  function tick() {
    if (!quiet()) {
      const members = groups[group++ % groups.length].map(sourceElement).filter((el): el is HTMLElement => !!el && visible(el));
      members.forEach((el, i) => gestures.after(i * 140, () => {
        if (quiet() || !el.isConnected || !visible(el)) return;
        el.classList.add('is-swaying');
        gestures.after(1250, () => el.classList.remove('is-swaying'));
      }));
    }
    schedule.after(2900 + Math.random() * 300, tick);
  }
  const hidden = () => { if (document.hidden) cancelSways(); };
  document.addEventListener('click', click, true);
  document.addEventListener('keydown', key, true);
  document.addEventListener('visibilitychange', hidden);
  if (!reduced()) schedule.after(2900, tick);
  return { silence, cancelSways, stop() { schedule.clear(); cancelSways(); document.removeEventListener('click', click, true); document.removeEventListener('keydown', key, true); document.removeEventListener('visibilitychange', hidden); } };
}
