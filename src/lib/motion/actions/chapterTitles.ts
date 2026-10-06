import { motionOwner, refreshMotion } from '../runtime';
import { motion } from '../tokens';

/** Chapter punctuation only. Reading copy and already-read headings stay untouched. */
export function chapterTitles(node: HTMLElement, selector = '.chapter > .head h2') {
  return motionOwner(node, 'chapter-titles', (runtime, context, { desktop }) => {
    let alive = true;
    const splits: import('gsap/SplitText').SplitText[] = [];
    void Promise.all([import('gsap/SplitText'), document.fonts.ready]).then(([{ SplitText }]) => {
      if (!alive) return;
      runtime.gsap.registerPlugin(SplitText);
      context.add(() => {
        for (const heading of node.querySelectorAll<HTMLElement>(selector)) {
          // Restored scroll/history and in-view reading must never be hidden again.
          if (heading.getBoundingClientRect().top < innerHeight * .5) continue;
          let entered = false;
          splits.push(SplitText.create(heading, {
            type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
            onSplit(self) {
              if (entered || !alive) return;
              return runtime.gsap.fromTo(self.lines, { yPercent: 105 }, {
                yPercent: 0, duration: desktop ? motion.chapter : motion.standard,
                stagger: desktop ? motion.stagger : motion.mobileStagger,
                ease: motion.primary,
                scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
                onComplete: () => { entered = true; }
              });
            }
          }));
        }
        refreshMotion(runtime);
      });
    });
    return () => { alive = false; splits.forEach(split => split.revert()); };
  });
}
