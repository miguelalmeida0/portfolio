<script>
import {onMount,flushSync} from 'svelte';import {QP} from './data';import {lifecycle} from '../shared/lifecycle';let root,life;let qs=$state(QP.map(()=> 'idle')),busy=false,allBusy=$state(false),deps=$state([]),finished=$state(false);const labels={idle:'Not compared',checking:'Comparing',done:'Compared'};onMount(()=>{life=lifecycle();return life.destroy;});const wait=ms=>new Promise(r=>life.later(r,life.reduce.matches?0:ms));async function check(i){qs[i]='checking';deps=QP[i].deps;await wait(750);qs[i]='done';}function finish(){finished=true;flushSync();root.querySelector('#resetCmp').focus();}async function checkOne(i){if(busy||qs[i]==='done')return;busy=true;await check(i);deps=[];busy=false;if(qs.every(x=>x==='done'))finish();root.querySelector('[data-i="'+i+'"]').focus();}async function compareAll(){if(busy)return;busy=true;allBusy=true;for(let i=0;i<QP.length;i++)if(qs[i]!=='done')await check(i);deps=[];busy=false;finish();}function reset(){qs=QP.map(()=> 'idle');deps=[];finished=false;allBusy=false;flushSync();root.querySelector('#compare').focus();}
</script>
    <div class="frame lesson" id="parity" bind:this={root}><div class="window">
      <div class="lesson-head">
        <p class="lesson-n">Lesson 1</p>
        <h3>A copy can look perfect and still be wrong.</h3>
        <p>One screen, rebuilt in React, looked right but showed nothing. Every screen asks the server a question. The copy has to ask exactly the same one.</p>
      </div>
      <div class="par2">
        <article class="scr" aria-label="Original screen, built in Svelte">
          <div class="scr-top"><span class="scr-name">Original<small>Svelte</small></span><span class="pill hl" data-dep="count" class:hit={deps.includes('count')}>24 entries</span></div>
          <div class="scr-sec" data-dep="contacts" class:hit={deps.includes('contacts')}><span class="scr-l">Contacts</span><div class="scr-chips"><span>Team A</span><span>Team B</span><span>Team C</span></div></div>
          <div class="scr-sec" data-dep="list" class:hit={deps.includes('list')}><span class="scr-l">Latest entries</span><ul class="scr-list"><li>Site closure<b>Delivered</b></li><li>Power outage<b>Delivered</b></li><li>Practice drill<b>Delivered</b></li></ul></div>
        </article>
        <div class="qbox">
          <p class="label" id="q-l">The question each screen asks</p>
          <ol class="qparts" id="qparts" aria-labelledby="q-l">{#each QP as q,i}<li><button type="button" class="qrow" data-i={i} data-s={qs[i]} onclick={()=>checkOne(i)}><span class="qn" aria-hidden="true">{qs[i]==='done'?'✓':i+1}</span><span><b>{q.t}</b><small>{q.d}</small></span><span class="qs">{labels[qs[i]]}</span></button></li>{/each}</ol>
          <div class="q-actions"><button class="btn" type="button" id="compare" hidden={finished} disabled={allBusy} onclick={compareAll}>Compare the questions</button><button class="tlink" type="button" id="resetCmp" hidden={!finished} onclick={reset}>Start over</button></div>
        </div>
        <article class="scr" id="scrNew" aria-label="Rebuilt screen, built in React" aria-live="polite">
          <div class="scr-top"><span class="scr-name">Rebuilt<small>React</small></span><span class={finished?'pill hl':'pill plum'} data-dep="count" class:hit={deps.includes('count')} id="newCount">{finished?'24 entries':'Showing nothing'}</span></div>
          <div class="scr-sec" data-dep="contacts" class:hit={deps.includes('contacts')}><span class="scr-l">Contacts</span><div class="scr-chips" id="newChips">{#if finished}{#each ['Team A','Team B','Team C'] as t,i}<span style:--i={i}>{t}</span>{/each}{:else}<span>All contacts</span>{/if}</div></div>
          <div class="scr-sec" data-dep="list" class:hit={deps.includes('list')}><span class="scr-l">Latest entries</span><ul class="scr-list" id="newList">{#if finished}{#each ['Site closure','Power outage','Practice drill'] as t,i}<li style:--i={i+2}>{t}<b>Delivered</b></li>{/each}{:else}<li class="none">Nothing to show</li>{/if}</ul></div>
        </article>
      </div>
      <div class="verdict" id="verdict" role="status" aria-live="polite" hidden={!finished}>{#if finished}<h4>Same question. Same answer.</h4><div><p>Once every part of the question matches, both screens show the same thing. That comparison, not a matching screenshot, is what makes a migration safe to ship.</p><small>An illustration of the method, with invented data.</small></div>{/if}</div>
    </div></div>
