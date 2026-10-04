<script>
import {onMount,flushSync} from 'svelte'; import {SITS} from './data'; import {lifecycle} from '../shared/lifecycle';
let sit=$state(0),playing=$state(false),inView=$state(false),seen=$state([0]),hint=$state(false);let section,tabsEl,mock,life,timer,hintTimer;const animations=new Set();
function animate(el,frames,opts){const a=el.animate(frames,opts);animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;}
function schedule(){if(!life)return;life.cancel(timer);tabsEl?.classList.remove('playing');if(tabsEl)void tabsEl.offsetWidth;if(playing&&inView){tabsEl?.classList.add('playing');timer=life.later(()=>setSit(sit+1),2400);}}
function setSit(i,{focus=false,user=false}={}){if(user)playing=false;const n=(i+SITS.length)%SITS.length;if(n===sit){if(focus)tabsEl.children[sit].focus({preventScroll:true});schedule();return;}const h0=mock.offsetHeight;sit=n;if(!seen.includes(n))seen.push(n);flushSync();const h1=mock.offsetHeight;if(!life.reduce.matches&&Math.abs(h1-h0)>1){mock.style.overflow='hidden';const a=animate(mock,[{height:h0+'px'},{height:h1+'px'}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'});a.onfinish=a.oncancel=()=>mock.style.overflow='';}const t=tabsEl.children[n],tr=t.getBoundingClientRect(),cr=tabsEl.getBoundingClientRect();if(tr.left<cr.left||tr.right>cr.right)tabsEl.scrollTo({left:tabsEl.scrollLeft+tr.left-cr.left-8,behavior:life.reduce.matches?'auto':'smooth'});if(focus)t.focus({preventScroll:true});section.querySelectorAll('#sitT,.sit-more p').forEach(el=>{el.style.animation='none';void el.offsetWidth;el.style.animation='';});schedule();}
function tabKey(e,i){const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d||['Home','End'].includes(e.key)){e.preventDefault();setSit(e.key==='Home'?0:e.key==='End'?SITS.length-1:i+d,{user:true,focus:true});}}
function togglePlay(){if(playing){playing=false;schedule();return;}playing=true;setSit(sit+1);schedule();}
function showHint(){hint=true;life.cancel(hintTimer);hintTimer=life.later(()=>hint=false,2600);animate(tabsEl,[{opacity:1},{opacity:.55},{opacity:1}],{duration:life.reduce.matches?1:900,easing:'ease-in-out'});}
onMount(()=>{life=lifecycle();life.observe(new IntersectionObserver(([e])=>{inView=e.isIntersecting;schedule();},{threshold:.45}),[section]);playing=!life.reduce.matches;schedule();return()=>{life.destroy();animations.forEach(a=>a.cancel());};});
</script>
  <section class="frame" id="try" bind:this={section} aria-label="A mockup becomes a production screen">
    <div class="window">
      <div class="sit-top">
        <div><h3 id="asm-h" aria-level="2">One screen, eight situations.</h3><p>A mockup shows the first. A real product has to handle all of them.</p></div>
        <button class="playbtn" type="button" id="play" aria-pressed={playing} onclick={togglePlay}><span class="pi" aria-hidden="true"></span><span class="pl">{playing?'Pause':'Play'}</span></button>
      </div>
      <div class="sit-tabs" role="tablist" aria-labelledby="asm-h" id="sits" bind:this={tabsEl} class:playing={playing&&inView} style:--dur="2400ms">{#each SITS as x,i}<button type="button" class="stab" class:seen={seen.includes(i)} role="tab" id={'st'+i} aria-controls="sitPanel" aria-selected={sit===i} tabindex={sit===i?0:-1} onclick={()=>setSit(i,{user:true})} onkeydown={e=>tabKey(e,i)}><span class="sn">{i===0?'Start':i+' of 8'}</span><b>{x.tab}</b><span class="bar" aria-hidden="true"></span></button>{/each}</div>
      <div class="sit-body">
        <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div class="asm-stage" id="asmStage" onclick={showHint}><span class="ex-pill">Example screen</span><span class="hint" id="hint" class:show={hint} role="status" aria-live="polite">{hint?'This is a picture of the screen. Pick a tab above to change it.':''}</span>
        <div class="mock" id="mock" bind:this={mock} data-on={SITS[sit].id} class:hot-all={SITS[sit].hot==='ALL'} aria-hidden="true">
          <div class="m-banner" class:hot={SITS[sit].hot==='.m-banner'}><span>Couldn't save. Your changes are still here.</span><span class="m-btn alt" style="display:inline-flex">Retry</span><span class="tt">error announced</span></div>
          <div class="m-head"><h3>New configuration</h3><span class="m-scope">Workspace North</span></div>
          <div class="m-field" data-f="scen" class:hot={SITS[sit].hot===`[data-f="scen"]`}><span class="m-l">Scenario</span><div class="m-sel"><span class="m-v">Site closure</span><span class="m-ph">Choose a scenario</span><span class="car">▾</span></div><p class="m-err">Choose a scenario before saving.</p><span class="tt">required before save</span></div>
          <div class="m-field" data-f="rec" class:hot={SITS[sit].hot===`[data-f="rec"]`}><span class="m-l">Contact</span><div class="m-sel"><span class="m-v">Team A</span><span class="m-skel"></span><span class="car">▾</span></div><p class="m-loading">Loading contacts</p><p class="m-meta">Showing 20 of 140, <u>load more</u></p><span class="tt">scoped to organisation</span></div>
          <div class="m-test" class:hot={SITS[sit].hot==='.m-test'}>Test run: 3 contacts would be notified. Nothing was sent.</div>
          <p class="m-perm" class:hot={SITS[sit].hot==='.m-perm'}>You can view this configuration. Editing needs editor access.</p>
          <div class="m-actions"><span class="tt">fires once</span><span class="m-btn alt">Test run</span><span class="m-btn save">Save</span></div>
        </div>
      </div>
        <div class="sit-text" role="tabpanel" id="sitPanel" aria-labelledby={'st'+sit} tabindex="0">
          <p class="sit-k" id="sitK">{sit===0?'Where every design starts':`Situation ${sit} of 8`}</p>
          <h4 id="sitT" aria-level="3">{SITS[sit].t}</h4>
          <div class="sit-more"><p><i>What you see</i><span id="sitSee">{SITS[sit].see}</span></p><p><i>What had to be built</i><span id="sitBuilt">{SITS[sit].built}</span></p></div>
          <div class="sit-arrows"><button type="button" class="arrow" id="prev" onclick={()=>setSit(sit-1,{user:true})} aria-label="Previous situation"><span aria-hidden="true"></span></button><button type="button" class="arrow fwd" id="next" onclick={()=>setSit(sit+1,{user:true})} aria-label="Next situation"><span aria-hidden="true"></span></button><span class="sit-hint">Or pick a tab above</span></div>
        </div>
      </div>
    </div>
  </section>
  <p class="cap">Fictional mockup with invented names and data. <a href="#notice" class="caplink">See notice</a>.</p>
