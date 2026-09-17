import { onNavigate } from '$app/navigation';
import { motionSnapshot } from './policy';

/**
 * Progressive-enhancement route continuity built on the native View Transitions API.
 *
 * Deliberate limits, all of them checked against the real content:
 * - The two case studies whose hero is a single 16/10 media frame take part. The
 *   camera-harness study opens a gallery and the F24 tile points at `/story`, so
 *   neither is given a transition name: a frame that has no counterpart would either
 *   sit out or flicker, and an ordinary navigation is the better answer.
 * - The tile and the case-study hero do not use the same asset, so this carries the
 *   *frame*, not a claim of identical media. Contents cross-fade inside the box.
 * - Exactly one element may hold `--vt-project-media` per document. The case study
 *   assigns it statically (one hero per page); the grid assigns it to the tile being
 *   opened and clears it afterwards.
 * - The navigation is never held open waiting for an animation, and hashes, external
 *   links, downloads and unsupported browsers fall through untouched.
 */

export const SHARED_MEDIA_SLUGS = ['ghostwriter', 'mirror-ai'] as const;

export const PROJECT_MEDIA_TRANSITION_NAME = 'project-media';

type StartViewTransition = (callback: () => Promise<void> | void) => {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

function viewTransitionsSupported(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

/** True when this href ends on a case study whose hero can accept the shared frame. */
export function hasSharedMediaTarget(href: string): boolean {
  const match = /^\/work\/([^/?#]+)/.exec(href);
  return Boolean(match && (SHARED_MEDIA_SLUGS as readonly string[]).includes(match[1]));
}

/** Marks the frame that should carry into the next view, for this navigation only. */
export function claimProjectMediaFrame(frame: HTMLElement | null | undefined, href: string) {
  if (!frame) return;
  if (!viewTransitionsSupported() || motionSnapshot().reduced) return;
  if (!hasSharedMediaTarget(href)) return;

  releaseClaimedFrames();
  frame.style.viewTransitionName = PROJECT_MEDIA_TRANSITION_NAME;
  frame.dataset.vtClaimed = 'true';
}

function releaseClaimedFrames() {
  if (typeof document === 'undefined') return;
  for (const element of document.querySelectorAll<HTMLElement>('[data-vt-claimed="true"]')) {
    element.style.viewTransitionName = '';
    delete element.dataset.vtClaimed;
  }
}

/**
 * Installs the navigation hook. Call once, from the root layout's component body.
 */
export function installRouteTransitions() {
  onNavigate((navigation) => {
    if (!viewTransitionsSupported()) {
      releaseClaimedFrames();
      return;
    }

    if (motionSnapshot().reduced) {
      releaseClaimedFrames();
      return;
    }

    const from = navigation.from?.url;
    const to = navigation.to?.url;

    // A pure hash change on the same page is a scroll, not a route change.
    if (!to || (from && from.pathname === to.pathname)) {
      releaseClaimedFrames();
      return;
    }

    const startViewTransition = (
      document as Document & { startViewTransition?: StartViewTransition }
    ).startViewTransition;

    if (!startViewTransition) {
      releaseClaimedFrames();
      return;
    }

    document.documentElement.dataset.routeTransition = 'active';

    return new Promise<void>((resolve) => {
      const transition = startViewTransition.call(document, async () => {
        // Resolving first is what keeps SvelteKit's navigation from waiting on the
        // animation: the DOM swap happens inside the callback, nothing blocks it.
        resolve();
        await navigation.complete;
      });

      const cleanup = () => {
        delete document.documentElement.dataset.routeTransition;
        releaseClaimedFrames();
      };

      transition.finished.then(cleanup, cleanup);
    });
  });
}
