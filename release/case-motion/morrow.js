import {timeline} from './timeline.js';

export function morrow(stage) {
  stage.innerHTML = `<div class="cm-survey">
    <div class="cm-intent"><span class="cm-label">Intent</span><h4>Understand what makes onboarding feel difficult.</h4><p>A clear aim. Room to refine.</p></div>
    <div class="cm-assembly"><span class="cm-label">Structure</span><div class="cm-question-mask"><div class="cm-questions">
      <div><small>First impression</small><p>What felt clear from the start?</p></div>
      <div><small>Friction</small><p>Where did you get stuck?</p></div>
      <div><small>Next step</small><p>What would have helped?</p></div>
    </div></div></div>
    <div class="cm-respondent-mask"><div class="cm-respondent"><span class="cm-label">Respondent preview</span><div class="cm-survey-progress"></div><h4>Where did you<br>get stuck?</h4><div class="cm-answer">Your answer</div><span class="cm-demo-button">Next</span></div></div>
  </div>`;
  const motion = timeline(stage, 6500);
  motion.add('.cm-questions', [{transform:'translateY(105%)'}, {transform:'translateY(0)'}], 650, 1250);
  motion.add('.cm-respondent', [{clipPath:'inset(0 100% 0 0)'}, {clipPath:'inset(0 0% 0 0)'}], 2050, 1050);
  motion.add('.cm-survey-progress', [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], 3100, 650);
  return {motion, actions:[{label:'Show respondent preview', run:() => motion.seek(6500)}]};
}
