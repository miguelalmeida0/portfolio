import { browser } from '$app/environment';
import { readable, type Readable } from 'svelte/store';

/**
 * Capability and preference policy for every decorative animation on the site.
 *
 * Rules that must not drift:
 * - The operating system's reduced-motion setting always wins. A manual choice can
 *   only ever reduce motion further, never force full motion over an OS preference.
 * - Save-Data means no automatic media fetches and no decorative motion.
 * - Nothing here may run during server rendering.
 */

export type MotionSetting = 'system' | 'reduced';

export type MotionState = {
  /** Decorative motion must be suppressed. */
  reduced: boolean;
  /** The operating system asked for reduced motion. */
  systemReduced: boolean;
  /** The visitor's stored choice. */
  setting: MotionSetting;
  /** A precise pointer that can hover — pointer-depth effects are allowed. */
  finePointer: boolean;
  /** The visitor asked the browser to save data. */
  saveData: boolean;
};

const STORAGE_KEY = 'miguel-motion-preference';

const fallbackState: MotionState = {
  reduced: true,
  systemReduced: false,
  setting: 'system',
  finePointer: false,
  saveData: false
};

let current: MotionState = fallbackState;
const subscribers = new Set<(value: MotionState) => void>();

let reducedQuery: MediaQueryList | undefined;
let pointerQuery: MediaQueryList | undefined;
let initialised = false;

function readStoredSetting(): MotionSetting {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'reduced' ? 'reduced' : 'system';
  } catch {
    // A blocked storage API is not a reason to change the visitor's experience.
    return 'system';
  }
}

function readSaveData(): boolean {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  return Boolean(connection?.saveData);
}

function publish(next: MotionState) {
  current = next;

  document.documentElement.dataset.motion = next.reduced ? 'reduced' : 'full';
  document.documentElement.dataset.pointer = next.finePointer ? 'fine' : 'coarse';

  for (const notify of subscribers) notify(next);
}

function recompute(setting = current.setting) {
  const systemReduced = Boolean(reducedQuery?.matches);
  const saveData = readSaveData();

  publish({
    setting,
    systemReduced,
    saveData,
    finePointer: Boolean(pointerQuery?.matches),
    reduced: systemReduced || setting === 'reduced' || saveData
  });
}

/**
 * Starts the policy listeners. Safe to call repeatedly; only the first call binds.
 * Returns a teardown for the root layout that owns it.
 *
 * Components mount before their parent layout's `onMount`, so any read below also
 * triggers this. That keeps the very first reveal from seeing a stale default.
 */
export function initMotionPolicy(): () => void {
  if (!browser || initialised) return () => undefined;
  initialised = true;

  reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  pointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');

  const sync = () => recompute();

  reducedQuery.addEventListener('change', sync);
  pointerQuery.addEventListener('change', sync);

  const connection = (
    navigator as Navigator & { connection?: EventTarget }
  ).connection;
  connection?.addEventListener?.('change', sync);

  recompute(readStoredSetting());

  return () => {
    reducedQuery?.removeEventListener('change', sync);
    pointerQuery?.removeEventListener('change', sync);
    connection?.removeEventListener?.('change', sync);
    initialised = false;
  };
}

/** The visitor's explicit Full/Reduced choice. Only ever stores the preference. */
export function setMotionSetting(setting: MotionSetting) {
  if (!browser) return;

  try {
    localStorage.setItem(STORAGE_KEY, setting);
  } catch {
    // The choice still applies for this page view.
  }

  recompute(setting);
}

/** Synchronous read for code paths that cannot subscribe. */
export function motionSnapshot(): MotionState {
  if (browser && !initialised) initMotionPolicy();
  return current;
}

export const motionState: Readable<MotionState> = readable(current, (set) => {
  if (browser && !initialised) initMotionPolicy();
  set(current);
  subscribers.add(set);
  return () => subscribers.delete(set);
});

/** True when decorative motion must not run. */
export function prefersReducedMotion(): boolean {
  return motionSnapshot().reduced;
}
