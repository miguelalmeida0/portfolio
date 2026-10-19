import { beforeNavigate, onNavigate } from '$app/navigation';
import { motionSnapshot } from '$lib/motion/policy';
import { editionPageOf, type EditionPage, type EditionSlug } from './site';

export type PageTransition = {
  /** Covers the outgoing page; resolves once it is fully hidden. */
  cover: (from: EditionPage, to: EditionPage) => Promise<void>;
  /** Reveals the incoming page after SvelteKit has rendered it. */
  reveal: (from: EditionPage, to: EditionPage) => Promise<void> | void;
};

type Claim = { from: EditionPage; to: EditionPage };

/**
 * Page-to-page transitions inside one direction. Call during component
 * initialisation of the direction's `+layout.svelte`, which persists across its
 * Home, Story and CV pages. Hash-only travel, links leaving the direction,
 * history traversal and reduced motion navigate instantly.
 *
 * `beforeNavigate` claims the change first, so the site's native view
 * transition (registered earlier, in the root layout) stands aside.
 */
export function installPageTransition(slug: EditionSlug, transition: PageTransition) {
  const root = () => document.documentElement;
  let claim: Claim | undefined;
  const release = () => { claim = undefined; delete root().dataset.labPageTransition; };

  beforeNavigate(navigation => {
    release();
    const fromPath = navigation.from?.url.pathname;
    const toPath = navigation.to?.url.pathname;
    if (!fromPath || !toPath || fromPath === toPath || navigation.type === 'popstate' || navigation.willUnload) return;
    const from = editionPageOf(slug, fromPath);
    const to = editionPageOf(slug, toPath);
    if (!from || !to || motionSnapshot().reduced) return;
    claim = { from, to };
    root().dataset.labPageTransition = 'active';
  });

  onNavigate(navigation => {
    const current = claim;
    if (!current) return;
    return new Promise<void>(resolve => {
      void transition.cover(current.from, current.to).then(() => {
        resolve();
        void navigation.complete
          .then(() => transition.reveal(current.from, current.to))
          .finally(release);
      });
    });
  });
}
