<svelte:options preserveWhitespace={true} />
<script>
import { onMount } from 'svelte';
import { lifecycle } from '../shared/lifecycle';
import { H, SEED, COMPOUND_OPS, resolve, transform, span, VIEW_START, VIEW_END } from './engine';
import { newCtx } from './demo.svelte';
const changes=transform(SEED,resolve(SEED,COMPOUND_OPS,newCtx(0)).ops,false).changes;
const result=id=>{const c=changes.find(c=>c.id===id);return span(c.before)+' → '+span(c.after)};
const pct=m=>((m-VIEW_START)/(VIEW_END-VIEW_START)*100)+'%';
const width=(a,b)=>((b-a)/(VIEW_END-VIEW_START)*100)+'%';
const life=lifecycle();let timers=[],element;let step=$state(undefined);
function playHero(){timers.forEach(life.cancel);timers=[];if(life.reduce.matches){step='4';return;}step=undefined;void element.offsetWidth;[1,2,3,4].forEach((s,i)=>timers.push(life.later(()=>step=String(s),350+i*750)));}
onMount(()=>{playHero();life.listen(life.reduce,'change',()=>{if(life.reduce.matches)step='4'});return life.destroy;});
</script>
<section class="frame" id="cmd" bind:this={element} data-step={step} aria-labelledby="cmd-h">
    <div class="window">
      <div class="cmd-top"><span class="tag" id="cmd-h">One sentence becomes three typed operations</span><button class="replay" id="replay" onclick={playHero} type="button">Replay</button></div>
      <p role="group" class="sentence" aria-label="Move the design review after lunch, push planning by 30 minutes, and keep the gym fixed.">
        <span aria-hidden="true">Move <span class="tok t">the design review</span> <span class="tok a">after lunch</span>, push <span class="tok t">planning</span> <span class="tok a">by 30 minutes</span>, and keep <span class="tok k">the gym</span> fixed.</span>
      </p>
      <div class="ops">
        <div class="op t"><span class="verb">move</span><p class="what">Design review</p><p class="how">Relative anchor: after Lunch</p><p class="res" data-res="review">{result('review')}</p></div>
        <div class="op t"><span class="verb">shift</span><p class="what">Q3 planning</p><p class="how">Relative duration: +30 min</p><p class="res" data-res="planning">{result('planning')}</p></div>
        <div class="op k"><span class="verb">keep</span><p class="what">Gym</p><p class="how">A constraint, not an action</p><p class="res">Identical after commit</p></div>
      </div>
      <ul class="checks" aria-label="Validation"><li>No overlaps</li><li>Gym unchanged</li><li>Two changes, one commit</li></ul>
      <div class="tl" id="tl" aria-hidden="true">{#each [8,10,12,14,16,18,20] as h}<div class="hr" style:left={pct(H(h))}><span>{String(h).padStart(2,'0')}:00</span></div>{/each}{#each SEED.filter(e=>e.day===0) as e}<div class={'bar'+(e.protected?' prot':'')+(changes.some(c=>c.id===e.id)?' from':'')} style:left={pct(e.start)} style:width={width(e.start,e.end)} title={e.title}>{e.title}</div>{/each}{#each changes as c}<div class="bar ghost" style:left={pct(c.after.start)} style:width={width(c.after.start,c.after.end)}>{c.title}</div>{/each}</div>
      <ul class="tl-list" id="tlList">{#each changes as c}<li><b>{c.title}</b> {span(c.before)} → {span(c.after)}</li>{/each}<li><b>Gym</b> 18:00-19:00, unchanged</li></ul>
    </div>
  </section>
