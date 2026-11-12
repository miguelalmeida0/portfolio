import {timeline, revealWords} from './timeline.js';

export function leu(stage) {
  stage.innerHTML = `<div class="cm-reading"><div class="cm-source"><span class="cm-label">Reading sample · 22</span><p>Learning is more than collecting facts.</p><div class="cm-passage"><i class="cm-passage-highlight"></i><p>Understanding grows when we connect a new idea to something we already know.</p><i class="cm-source-anchor"></i></div><small>The source stays in place while the question opens beside it.</small></div>
    <div class="cm-question-margin"><span class="cm-label">From your selection</span><p class="cm-citation">“…connect a new idea to something we already know.”</p><h4 class="cm-reading-question"></h4><span class="cm-return-label">Return to page 22</span></div></div><div class="cm-return-trace"></div>`;
  const motion = timeline(stage, 8000);
  motion.add('.cm-passage-highlight', [{clipPath:'inset(0 100% 0 0)'}, {clipPath:'inset(0 0 0 0)'}], 500, 700);
  motion.add('.cm-citation', [{clipPath:'inset(0 100% 0 0)'}, {clipPath:'inset(0 0 0 0)'}], 1450, 850);
  revealWords(stage, '.cm-reading-question', 'What does this idea connect to?', 2500, 1250, motion);
  motion.add('.cm-return-label', [{opacity:0}, {opacity:1}], 3850, 150);
  motion.add('.cm-return-trace', [{clipPath:'inset(0 0 0 100%)'}, {clipPath:'inset(0 0 0 0)'}], 4600, 850);
  motion.add('.cm-return-trace', [{opacity:1}, {opacity:0}], 5700, 250);
  motion.add('.cm-source-anchor', [{transform:'scale(1)'}, {transform:'scale(1.7)'}, {transform:'scale(1)'}], 5500, 700);
  return {motion, actions:[{label:'Return to source passage', run:() => motion.seek(5500)}]};
}
