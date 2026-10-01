import { STOP_AT } from './contact';

export const initialTrain = () => ({ pos: 0, dur: 0, rev: false, at: -1, open: false, hot: -1 });
type Train = ReturnType<typeof initialTrain>;
const ORDER = [0, 1, 2, 3, 2, 1];

/** Event-driven service: no polling or animation frame loop while out of view. */
export function createLineService(root: HTMLElement, line: HTMLElement, publish: (state: Train) => void) {
  let state = initialTrain(), visible = false, over = false, engaged = false, destroyed = false;
  let next = 0, target = -1;
  let arrival: ReturnType<typeof setTimeout> | undefined;
  let departure: ReturnType<typeof setTimeout> | undefined;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const set = (patch: Partial<Train>) => { state = { ...state, ...patch }; publish(state); };
  const allowed = () => !destroyed && !engaged && !over && visible && !document.hidden && !motion.matches;
  const stopDeparture = () => { clearTimeout(departure); departure = undefined; };
  function schedule(ms = 2600) {
    stopDeparture();
    if (allowed() && !arrival) departure = setTimeout(() => { departure = undefined; go(ORDER[next++ % ORDER.length]); }, ms);
  }
  function currentPosition() {
    const vertical = line.offsetHeight > line.offsetWidth;
    const train = line.querySelector<HTMLElement>('[data-train]')!;
    const length = vertical ? line.clientHeight : line.clientWidth;
    const rendered = parseFloat(getComputedStyle(train)[vertical ? 'top' : 'left']);
    return { length, percent: Math.max(0, Math.min(100, rendered / length * 100)) };
  }
  function go(i: number) {
    if (destroyed || (target === i && (arrival || state.at === i))) return;
    stopDeparture(); clearTimeout(arrival); arrival = undefined;
    const from = currentPosition(), to = STOP_AT[i]; target = i;
    const dur = motion.matches ? 0 : Math.min(2200, 700 + Math.abs(to - from.percent) / 100 * from.length * 1.1);
    set({ pos: to, dur, rev: to < from.percent, at: -1, open: false });
    const arrive = () => { arrival = undefined; set({ at: i, open: !motion.matches }); schedule(); };
    if (dur === 0) arrive(); else arrival = setTimeout(arrive, dur);
  }
  function freeze() {
    stopDeparture();
    if (arrival) {
      const { percent } = currentPosition();
      clearTimeout(arrival); arrival = undefined;
      set({ pos: percent, dur: 0, open: false });
      if (!engaged) next = Math.max(0, next - 1);
    }
  }
  function visibilityChanged() {
    if (!visible || document.hidden) freeze();
    else if (!engaged) schedule(900);
    else if (target >= 0 && state.at < 0) go(target);
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .2;
    visibilityChanged();
  }, { threshold: [0, .2] });
  observer.observe(root);
  const motionChanged = () => {
    stopDeparture(); clearTimeout(arrival); arrival = undefined;
    if (motion.matches) set({ pos: target >= 0 ? STOP_AT[target] : 0, dur: 0, at: target, open: false });
    else schedule(900);
  };
  const resized = () => {
    if (arrival && target >= 0) { clearTimeout(arrival); arrival = undefined; set({ pos: STOP_AT[target], dur: 0, at: target, open: !motion.matches }); schedule(); }
  };
  document.addEventListener('visibilitychange', visibilityChanged);
  window.addEventListener('resize', resized);
  motion.addEventListener('change', motionChanged);
  return {
    aim(i: number) { engaged = true; stopDeparture(); set({ hot: i }); go(i); },
    leave() { set({ hot: -1 }); },
    over(value: boolean) { over = value; if (over && !engaged) freeze(); else if (over) stopDeparture(); else schedule(); },
    destroy() {
      destroyed = true; stopDeparture(); clearTimeout(arrival); observer.disconnect();
      document.removeEventListener('visibilitychange', visibilityChanged);
      window.removeEventListener('resize', resized);
      motion.removeEventListener('change', motionChanged);
    }
  };
}
