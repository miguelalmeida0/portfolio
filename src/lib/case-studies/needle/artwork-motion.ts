import { tick } from 'svelte';
import { motionOwner } from '$lib/motion/runtime';
import { motion } from '$lib/motion/tokens';

/** Selection owns the state. This disposable visual layer only carries identity. */
export function artworkMotion(node: HTMLElement) {
  return motionOwner(node, 'artwork-selection', ({ gsap }, context, { desktop, fine }) => {
    let alive = true, version = 0;
    let stop = () => {};
    let flip: typeof import('gsap/Flip').Flip | undefined;
    void import('gsap/Flip').then(({ Flip }) => { if (alive) { gsap.registerPlugin(Flip); flip = Flip; } });
    const select = async (event: MouseEvent) => {
      const card = (event.target as Element).closest<HTMLButtonElement>('.artwork-card');
      if (!card || card.getAttribute('aria-pressed') === 'true') return;
      const source = card.querySelector('img');
      const box = source?.getBoundingClientRect();
      const request = ++version;
      stop();
      await tick();
      if (!alive || request !== version) return;
      const target = node.querySelector<HTMLImageElement>('.inspector-image img');
      if (!target) return;
      const destination = target.getBoundingClientRect();
      if (destination.bottom < 0 || destination.top > innerHeight) return;
      context.add(() => {
        if (!desktop || !fine || !flip || !source || !box || !source.complete || !target.complete) {
          const settle = gsap.fromTo(target, { opacity: .7 }, { opacity: 1, duration: motion.micro, ease: motion.secondary, clearProps: 'opacity' });
          stop = () => settle.revert();
          return;
        }
        const layer = source.cloneNode() as HTMLImageElement;
        layer.alt = ''; layer.setAttribute('aria-hidden', 'true'); layer.dataset.artworkFlight = '';
        layer.style.cssText = `position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;max-width:none;object-fit:contain;pointer-events:none;z-index:70;margin:0;padding:9px;box-sizing:border-box;`;
        document.body.append(layer);
        const originalOpacity = target.style.opacity;
        target.style.opacity = '0';
        let flight: gsap.core.Tween | undefined;
        const finish = () => { layer.remove(); target.style.opacity = originalOpacity; };
        flight = flip.fit(layer, target, { scale: true, duration: motion.cinematic, ease: motion.primary, onComplete: finish, onInterrupt: finish }) as gsap.core.Tween;
        stop = () => { flight?.kill(); finish(); };
      });
    };
    const cancel = () => { version++; stop(); };
    node.addEventListener('click', select);
    window.addEventListener('resize', cancel, { passive: true });
    window.addEventListener('scroll', cancel, { passive: true });
    return () => { alive = false; cancel(); node.removeEventListener('click', select); window.removeEventListener('resize', cancel); window.removeEventListener('scroll', cancel); };
  });
}
