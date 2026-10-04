<script>
import {onMount,flushSync} from 'svelte';import {FOUND,SVF,RXF,ESTAGES} from './data';let root,reduce;let stage=$state(0),seen=$state([0]);const animations=new Set();onMount(()=>{reduce=matchMedia('(prefers-reduced-motion: reduce)');return()=>{animations.forEach(a=>a.cancel());root.querySelectorAll('.chip.f').forEach(c=>root.querySelector('#svFound').appendChild(c));};});function setStage(i,focus=false){const n=Math.max(0,Math.min(2,i));if(n===stage){if(focus)root.querySelector('#et'+n).focus();return;}const chips=[...root.querySelectorAll('#evo .chip')],before=new Map(chips.map(c=>[c,c.getBoundingClientRect()]));stage=n;for(let k=0;k<=n;k++)if(!seen.includes(k))seen.push(k);flushSync();const dest=root.querySelector(n===0?'#svFound':'#fdFound');root.querySelectorAll('.chip.f').forEach(c=>dest.appendChild(c));if(focus)root.querySelector('#et'+n).focus();root.querySelectorAll('#evoTitle,#evoText').forEach(el=>{el.style.animation='none';void el.offsetWidth;el.style.animation='';});if(reduce.matches)return;chips.forEach(c=>{const a=before.get(c),b=c.getBoundingClientRect();if(!a.width||!b.width)return;const dx=a.left-b.left,dy=a.top-b.top;if(Math.abs(dx)<1&&Math.abs(dy)<1)return;const animation=c.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:800,easing:'cubic-bezier(.22,1,.36,1)'});animations.add(animation);animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));});}function tabKey(e,i){const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();setStage(i+d,true);}}
</script>
    <div class="frame lesson" id="evolve" bind:this={root} style="margin-top:clamp(28px,4vw,48px)"><div class="window">
      <div class="lesson-head">
        <p class="lesson-n">Lesson 2</p>
        <h3>Share the foundation. Keep shipping.</h3>
        <p>Rewriting everything at once would have stopped the product. Instead, the parts every screen needs moved into one shared foundation, and new work joins it.</p>
      </div>
      <div class="sit-tabs evo-tabs" role="tablist" aria-label="Migration steps" id="evoTabs">{#each ESTAGES as x,i}<button type="button" class="stab" class:seen={seen.includes(i)} role="tab" id={'et'+i} aria-controls="evoPanel" aria-selected={stage===i} tabindex={stage===i?0:-1} onclick={()=>setStage(i)} onkeydown={e=>tabKey(e,i)}><span class="sn">Step {i+1}</span><b>{x.tab}</b></button>{/each}</div>
      <div class="evo-body">
        <div class="evo" id="evo" data-stage={stage+1}>
          <div class="box sv"><h4>Svelte app <small id="svNote">{ESTAGES[stage].note}</small></h4><div class="chips" id="svFeat">{#each SVF as f}<span class="chip">{f}</span>{/each}</div><p class="sub-h">Parts every screen needs</p><div class="chips" id="svFound">{#each FOUND as f (f)}<span class="chip f">{f}</span>{/each}</div><p class="uses">Built on the shared foundation</p></div>
          <div class="box fd"><h4>Shared foundation <small>one owner</small></h4><div class="chips" id="fdFound"></div></div>
          <div class="box rx"><h4>React features <small>new work</small></h4><div class="chips" id="rxFeat">{#each RXF as f}<span class="chip">{f}</span>{/each}</div><p class="uses">Built on the same foundation</p></div>
        </div>
        <div class="evo-text" role="tabpanel" id="evoPanel" aria-labelledby={'et'+stage} tabindex="0">
          <p class="sit-k" id="evoK">{ESTAGES[stage].k}</p>
          <h4 id="evoTitle">{ESTAGES[stage].t}</h4>
          <p class="evo-p" id="evoText">{ESTAGES[stage].p}</p>
          <div class="sit-arrows"><button type="button" class="arrow" id="evoPrev" disabled={stage===0} onclick={()=>setStage(stage-1)} aria-label="Previous step"><span aria-hidden="true"></span></button><button type="button" class="arrow fwd" id="evoNext" disabled={stage===2} onclick={()=>setStage(stage+1)} aria-label="Next step"><span aria-hidden="true"></span></button></div>
        </div>
      </div>
    </div></div>
