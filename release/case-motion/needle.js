import {timeline, ease} from './timeline.js';

export function needle(stage) {
  stage.innerHTML = `<div class="cm-collection"><div class="cm-search"><span class="cm-label">Find an artwork</span><h4>Queen Louise</h4><i class="cm-search-line"></i></div>
    <div class="cm-art-field">
      <div class="cm-art cm-art-one"><img src="/projects/needle/examples/921212.webp" alt="" loading="lazy" width="400" height="400"></div>
      <div class="cm-art cm-art-two"><img src="/projects/needle/examples/195480.webp" alt="" loading="lazy" width="400" height="400"></div>
      <div class="cm-art cm-art-three"><img src="/projects/needle/examples/551385.webp" alt="" loading="lazy" width="400" height="400"></div>
      <div class="cm-art cm-art-four"><img src="/projects/needle/examples/464373.webp" alt="" loading="lazy" width="400" height="400"></div>
      <div class="cm-art-detail"><span class="cm-label">A closer look</span><h4>Queen Louise</h4><p>Elizabeth S. Tucker<br>ca. 1895 · Color lithography</p><span class="cm-art-credit">The Metropolitan Museum of Art</span></div>
    </div></div>`;
  const motion = timeline(stage, 7000);
  motion.add('.cm-search-line', [{transform:'scaleX(0)'},{transform:'scaleX(1)'}], 250, 850);
  for (const [name, position] of [['two','32%'],['three','64%'],['four','80%']]) {
    motion.add('.cm-art-' + name, [
      {offset:0,easing:ease,left:position,top:'20%',opacity:0,clipPath:'inset(100% 0 0 0)'},
      {offset:.16,left:position,top:'20%',opacity:1,clipPath:'inset(0 0 0 0)'},
      {offset:.45,easing:ease,left:position,top:'20%',opacity:1,clipPath:'inset(0 0 0 0)'},
      {offset:.7,left:position,top:'54%',opacity:0,clipPath:'inset(0 0 100% 0)'},
      {offset:1,left:position,top:'54%',opacity:0,clipPath:'inset(0 0 100% 0)'}
    ],650,4700,'linear');
  }
  motion.add('.cm-art-one', [
    {offset:0,easing:ease,left:'0%',top:'20%',width:'25%',height:'58%',clipPath:'inset(100% 0 0 0)'},
    {offset:.18,left:'0%',top:'20%',width:'25%',height:'58%',clipPath:'inset(0 0 0 0)'},
    {offset:.48,easing:ease,left:'0%',top:'20%',width:'25%',height:'58%',clipPath:'inset(0 0 0 0)'},
    {offset:1,left:'0%',top:'0%',width:'43%',height:'100%',clipPath:'inset(0 0 0 0)'}
  ],650,3600,'linear');
  motion.add('.cm-art-detail',[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],3850,1000);
  return {motion, actions:[{label:'Inspect Queen Louise',run:() => motion.seek(7000)}]};
}
