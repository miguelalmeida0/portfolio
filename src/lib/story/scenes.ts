import { writable } from 'svelte/store';
import data from './story.json';

export type SceneId = 'hi' | 'ux' | 'build' | 'f24' | 'fail' | 'own' | 'love' | 'care';
export type SceneState = { view: number; notes: number; status: number; phase: number; mode: number; late: boolean; request: number; open: boolean; returned: boolean; tab: number; rewritten: boolean; transcript: string; event: boolean; running: boolean; stop: number; bad: boolean; checks: number };
type Step = [number, Partial<SceneState>];
const initial = (): SceneState => ({ view: 0, notes: 0, status: 0, phase: 0, mode: 0, late: false, request: 0, open: false, returned: false, tab: 0, rewritten: false, transcript: '', event: false, running: false, stop: -1, bad: false, checks: 0 });
export const autoplay: Record<SceneId, number[]> = { hi: [1, 0], ux: [0], build: [0, 1, 2, 3], f24: [0], fail: [1], own: [0, 1], love: [0], care: [0] };

// All incident names, people, request timings and scene data are illustrative.
// These are teaching scenes, not a connection to F24 or a production benchmark.
function steps(id: SceneId, action: number): Step[] {
  switch (id) {
    case 'hi': return [[0, { view: action }]];
    case 'ux': return action ? [[0, { notes: 0 }]] : [[0, { notes: 0 }], [0, { notes: 1 }], [500, { notes: 2 }], [500, { notes: 3 }]];
    case 'build': return [[0, { status: [1, 2, 3, 0][action] }]];
    case 'f24': return action ? [[0, { phase: 0 }]] : [[0, { phase: 0 }], [300, { phase: 1 }], [1100, { phase: 2 }], [1200, { phase: 3 }]];
    case 'fail':
      if (action === 0) return [[0, { mode: 0, request: 1, open: false }], [500, { mode: 1, request: 2 }]];
      if (action === 1) return [[0, { mode: 2, late: false, request: 1, open: false }], [600, { request: 2 }], [700, { late: true, request: 3 }]];
      return [[0, { mode: 3, open: false, returned: false, request: 0 }], [400, { open: true }], [900, { open: false, returned: true }]];
    case 'own':
      if (!action) return [[0, { tab: 0, rewritten: false }], [500, { rewritten: true }]];
      return [[0, { tab: 1, transcript: '', event: false }], ...Array.from(data.scenes.own.transcript).map((_, i): Step => [i ? 20 : 500, { transcript: data.scenes.own.transcript.slice(0, i + 1) }]), [800, { event: true }]];
    case 'love':
      if (action) return [0, 1, 2, 3].map((stop, i) => [i ? 1500 : 0, { stop }] as Step);
      return [[0, { running: false, stop: -1 }], [80, { running: true, stop: 0 }], [420, { stop: 1 }], [420, { stop: 2 }], [420, { stop: 3 }], [2140, { running: false }]];
    case 'care': return [[0, { bad: action === 0, checks: 0 }], [action ? 300 : 350, { checks: 1 }], [action ? 300 : 350, { checks: 2 }], [action ? 300 : 350, { checks: 3 }]];
  }
}

/** Each scene owns one cancellable sequence; no interval survives a route change. */
export function createSceneRunner(id: SceneId) {
  const state = writable(initial());
  let generation = 0;
  let pending: { timer: ReturnType<typeof setTimeout>; resolve: (ok: boolean) => void } | undefined;
  function cancel() {
    generation++;
    if (pending) { clearTimeout(pending.timer); pending.resolve(false); pending = undefined; }
    state.update(value => value.running ? { ...value, running: false } : value);
  }
  const wait = (ms: number) => new Promise<boolean>(resolve => { pending = { resolve, timer: setTimeout(() => { pending = undefined; resolve(true); }, ms) }; });
  async function run(actions: number[], reduced = false) {
    cancel(); const token = generation;
    for (let i = 0; i < actions.length; i++) {
      if (i && !reduced && !await wait(900)) return;
      for (const [delay, patch] of steps(id, actions[i])) {
        if (delay && !reduced && !await wait(delay)) return;
        if (token !== generation) return;
        state.update(value => ({ ...value, ...patch }));
      }
    }
  }
  return { state, run, cancel, patch: (patch: Partial<SceneState>) => { cancel(); state.update(value => ({ ...value, ...patch })); } };
}
export type SceneRunner = ReturnType<typeof createSceneRunner>;
