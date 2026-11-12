import {timeline, revealWords} from './timeline.js';

export function secondVoice(stage) {
  stage.innerHTML = `<div class="cm-writing"><div class="cm-draft"><span class="cm-label">Your words</span><div class="cm-draft-text"><i class="cm-selection"></i><p>I wanted to ask if you might be able to send the file today.</p></div><small>Your draft stays yours.</small></div>
    <div class="cm-rewrite"><span class="cm-label">Another voice</span><h4 class="cm-rewrite-words"></h4><div class="cm-rewrite-line"></div><p class="cm-intent-note">Shorter. Same intent.</p><div class="cm-accept-state"><span>Compare the rewrite</span><span class="cm-accepted">Accepted</span></div></div></div>`;
  const motion = timeline(stage, 7500);
  motion.add('.cm-selection', [{clipPath:'inset(0 100% 0 0)'}, {clipPath:'inset(0 0 0 0)'}], 500, 650);
  revealWords(stage, '.cm-rewrite-words', 'Could you send the file today?', 1750, 1600, motion);
  motion.add('.cm-rewrite-line', [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], 2450, 850);
  motion.add('.cm-intent-note', [{opacity:0}, {opacity:1}], 3450, 180);
  motion.add('.cm-accepted', [{clipPath:'inset(0 100% 0 0)'}, {clipPath:'inset(0 0 0 0)'}], 4900, 400);
  return {motion, actions:[{label:'Accept rewrite', run:() => motion.seek(7500)}]};
}
