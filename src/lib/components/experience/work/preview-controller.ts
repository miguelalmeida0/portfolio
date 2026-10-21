import type { SelectedProject } from './selected-projects';
import { motionSnapshot, motionState } from '$lib/motion/policy';

type Entry = {
  id: string;
  video: HTMLVideoElement;
  frame: HTMLElement;
  token: number;
  blocked: boolean;
  unavailable: boolean;
  pending: boolean;
  visible: boolean;
  loaded: boolean;
  retries: number;
  retryTimer?: ReturnType<typeof setTimeout>;
  dispose: () => void;
};

/**
 * Keep sources dormant until a visible preview is permitted to play. Native
 * source selection owns codec fallback; this owner reconciles policy, viewport,
 * tab visibility and explicit user playback without starting offscreen loops.
 */
export function createPreviewController(
  section: HTMLElement,
  projects: SelectedProject[],
  onBlocked: (ids: string[]) => void = () => {},
  onPaused: (paused: boolean) => void = () => {}
) {
  const entries: Entry[] = [];
  let alive = true;
  let userPaused = false;
  let explicitPlay = false;
  let policy = motionSnapshot();
  const permitted = () => explicitPlay || (!policy.reduced && !policy.saveData);
  const eligible = (entry: Entry) => alive && !userPaused && permitted() && !document.hidden && entry.visible;
  const report = () => {
    if (!alive) return;
    onBlocked(entries.filter(entry => entry.blocked).map(entry => entry.id));
    onPaused(userPaused || !permitted());
  };
  const status = (entry: Entry, value: 'poster' | 'playing' | 'blocked' | 'unavailable') => {
    entry.frame.dataset.previewStatus = value;
  };
  const clearRetry = (entry: Entry) => {
    if (entry.retryTimer !== undefined) {
      clearTimeout(entry.retryTimer);
      entry.retryTimer = undefined;
    }
  };

  function reconcile(entry: Entry) {
    const video = entry.video;
    if (!eligible(entry) || video.paused || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return false;
    entry.pending = false;
    entry.blocked = false;
    entry.retries = 0;
    clearRetry(entry);
    status(entry, 'playing');
    report();
    return true;
  }

  function retryLater(entry: Entry) {
    if (!eligible(entry) || entry.blocked || entry.unavailable || entry.retryTimer !== undefined) return;
    entry.retryTimer = setTimeout(() => {
      entry.retryTimer = undefined;
      ensurePlayback(entry);
    }, 450);
  }

  function rejected(entry: Entry, token: number, error: unknown) {
    if (!alive || token !== entry.token) return;
    entry.pending = false;
    if (!eligible(entry)) return;
    // Native source selection can briefly abort a play() during codec probing.
    const name = error instanceof Error ? error.name : '';
    if (name !== 'NotAllowedError' && name !== 'SecurityError' && entry.retries++ < 2) {
      retryLater(entry);
      return;
    }
    entry.blocked = true;
    entry.video.autoplay = false;
    entry.video.pause();
    status(entry, 'blocked');
    report();
  }

  function ensurePlayback(entry: Entry) {
    const video = entry.video;
    if (!eligible(entry)) {
      ++entry.token;
      entry.pending = false;
      clearRetry(entry);
      video.pause();
      return;
    }
    if (entry.unavailable || entry.blocked) return;
    if (!entry.loaded) {
      // No src is emitted during SSR, so preload heuristics cannot bypass policy.
      for (const source of video.querySelectorAll<HTMLSourceElement>('source[data-src]')) {
        if (source.dataset.src) source.src = source.dataset.src;
      }
      entry.loaded = true;
      video.load();
    }
    if (video.error) {
      entry.unavailable = true;
      status(entry, 'unavailable');
      return;
    }
    if (reconcile(entry) || entry.pending || !video.paused) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const token = ++entry.token;
    entry.pending = true;
    try {
      void Promise.resolve(video.play()).then(() => {
        if (!eligible(entry)) { video.pause(); return; }
        if (token !== entry.token) return;
        entry.pending = false;
        reconcile(entry);
      }, error => rejected(entry, token, error));
    } catch (error) {
      rejected(entry, token, error);
    }
  }

  function syncAll() {
    entries.forEach(ensurePlayback);
    report();
  }

  const observer = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(changes => {
    if (!alive) return;
    for (const change of changes) {
      const entry = entries.find(item => item.video === change.target);
      if (!entry) continue;
      entry.visible = change.isIntersecting;
      ensurePlayback(entry);
    }
  });
  function measureVisibility() {
    if (!alive) return;
    for (const entry of entries) {
      const rect = entry.video.getBoundingClientRect();
      entry.visible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    }
    syncAll();
  }

  for (const video of section.querySelectorAll<HTMLVideoElement>('video[data-project-preview]')) {
    const id = video.dataset.projectPreview;
    const frame = video.closest<HTMLElement>('[data-preview]');
    if (!id || !frame || !projects.some(project => project.id === id)) continue;
    const entry: Entry = {
      id, video, frame, token: 0, blocked: false, unavailable: false,
      pending: false, visible: false, loaded: false, retries: 0, dispose: () => {}
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const playing = () => { reconcile(entry); };
    const ready = () => {
      if (!reconcile(entry) && eligible(entry) && video.paused && !entry.pending) retryLater(entry);
    };
    const paused = () => {
      if (eligible(entry) && !entry.blocked && !entry.unavailable && !entry.pending) retryLater(entry);
    };
    const error = () => {
      ++entry.token;
      entry.pending = false;
      clearRetry(entry);
      entry.unavailable = true;
      entry.blocked = false;
      status(entry, 'unavailable');
      report();
    };
    // A <source> failure need not bubble to the video. Keep codec fallback alive
    // until every candidate failed, then reveal the existing poster.
    const sources = [...video.querySelectorAll<HTMLSourceElement>('source[data-src]')];
    const failedSources = new Set<HTMLSourceElement>();
    const sourceError = (event: Event) => {
      if (!entry.loaded) return;
      failedSources.add(event.currentTarget as HTMLSourceElement);
      if (failedSources.size === sources.length) error();
    };
    sources.forEach(source => source.addEventListener('error', sourceError));
    video.addEventListener('playing', playing);
    video.addEventListener('loadeddata', ready);
    video.addEventListener('canplay', ready);
    video.addEventListener('pause', paused);
    video.addEventListener('error', error);
    entry.dispose = () => {
      video.removeEventListener('playing', playing);
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('canplay', ready);
      video.removeEventListener('pause', paused);
      video.removeEventListener('error', error);
      sources.forEach(source => source.removeEventListener('error', sourceError));
    };
    entries.push(entry);
    observer?.observe(video);
  }

  document.addEventListener('visibilitychange', syncAll);
  window.addEventListener('pageshow', syncAll);
  if (!observer) {
    window.addEventListener('scroll', measureVisibility, { passive: true });
    window.addEventListener('resize', measureVisibility);
    measureVisibility();
  }
  const unsubscribe = motionState.subscribe(next => {
    // A newly restrictive preference revokes an earlier explicit-play choice.
    if ((next.reduced && !policy.reduced) || (next.saveData && !policy.saveData)) explicitPlay = false;
    policy = next;
    syncAll();
  });

  return {
    setPaused(value: boolean) {
      userPaused = value;
      explicitPlay = !value;
      syncAll();
    },
    retryAll() {
      // A real click is required for user activation; keep each play call
      // in this synchronous gesture handler, never behind a timeout.
      userPaused = false;
      explicitPlay = true;
      for (const entry of entries) {
        if (!entry.blocked) continue;
        entry.blocked = false;
        entry.retries = 0;
        clearRetry(entry);
        status(entry, 'poster');
        ensurePlayback(entry);
      }
      syncAll();
    },
    destroy() {
      alive = false;
      unsubscribe();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncAll);
      window.removeEventListener('pageshow', syncAll);
      window.removeEventListener('scroll', measureVisibility);
      window.removeEventListener('resize', measureVisibility);
      for (const entry of entries) {
        ++entry.token;
        clearRetry(entry);
        entry.dispose();
        entry.video.pause();
      }
    }
  };
}
