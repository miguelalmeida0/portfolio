<script>
import {onMount} from 'svelte';import {ORIGINAL,VOICES,STRENGTHS,REWRITES,label,same} from './content';import {diff,stats} from './diff';import DiffText from './DiffText.svelte';import RadioGroup from '../shared/RadioGroup.svelte';let {workspace}=$props();let S=$derived(workspace.S);let root;onMount(()=>workspace.mount(root));let ops=$derived(diff(ORIGINAL,REWRITES[S.result.settings.voice][S.result.settings.strength]));let st=$derived(stats(ops));
</script>
  <section class="frame" id="try" bind:this={root} aria-label="Rewrite workspace">
    <div class="window">
      <div class="ws">
        <div class="ws-in">
          <div>
            <p class="label" id="draft-h">Your draft</p>
            <div class="draft" aria-labelledby="draft-h"><p id="draftText">{ORIGINAL}</p></div>
          </div>
          <div class="ctl">
            <p class="label" id="voice-l">Voice</p>
            <div class="seg" role="radiogroup" aria-labelledby="voice-l" id="voiceCtl"><RadioGroup items={VOICES} value={S.controls.voice} onchange={v=>S.controls.voice=v}/></div>
            <p class="voice-desc" id="voiceDesc">{VOICES.find(v=>v.id===S.controls.voice).desc}</p>
          </div>
          <div class="ctl">
            <p class="label" id="str-l">Strength</p>
            <div class="seg" role="radiogroup" aria-labelledby="str-l" id="strCtl"><RadioGroup items={STRENGTHS} value={S.controls.strength} onchange={v=>S.controls.strength=v}/></div>
          </div>
          <div class="actions">
            <button class="btn" id="submit" type="button" disabled={!!S.pending} onclick={()=>workspace.submit(S.controls)}>{S.pending?'Rewriting…':'Rewrite'}</button>
            <label class="switch"><input type="checkbox" id="failSw" bind:checked={S.fail}> Make the next request fail</label>
          </div>
        </div>
        <div class="ws-out">
          <div class="out-head">
            <p class="label" id="result-h">Rewrite</p>
            <span class="pill dark" id="resultTag">{label(S.result.settings)}</span><span class="run" id="runTag">Run {S.result.run}</span>
          </div>
          <div class="seg" role="radiogroup" aria-label="View" id="viewCtl"><RadioGroup items={[{id:'original',name:'Original'},{id:'marked',name:'Changes'},{id:'rewrite',name:'Rewrite'}]} value={S.view} onchange={v=>S.view=v}/></div>
          <div class="mv-wrap" id="mvWrap" class:pending={!!S.pending} class:done={S.done}><div class="progress" aria-hidden="true"></div><p class="mv" id="mv" data-mode={S.view} data-key={label(S.result.settings)} class:reveal={S.reveal} aria-describedby="stats"><DiffText {ops}/></p></div>
          <p class="stats" id="stats"><span><b>{st.kept}</b> of {st.words} words kept</span><span><b>{st.rep}</b> replaced</span><span><b>{st.add}</b> added</span><span><b>{st.rem}</b> removed</span><span class="key"><i class="ki"></i>added</span><span class="key"><i class="kd"></i>removed</span></p>
          <div class={'notice '+(S.failed?'error':'stale')} id="notice" role="status" aria-live="polite" hidden={!S.failed&&!S.pending&&same(S.controls,S.result.settings)}>{#if S.failed}<p><b>The request didn't complete.</b> Nothing you had is lost.</p><ul class="kept"><li>Draft</li><li>Submitted settings: {label(S.failed.settings)}</li><li>Last rewrite: {label(S.result.settings)}, run {S.result.run}</li><li>Retry available</li></ul><div class="row"><button class="btn sm" type="button" id="retry" onclick={()=>workspace.submit(S.failed.settings)}>Retry {label(S.failed.settings)}</button><button class="tlink" type="button" id="dismiss" onclick={()=>S.failed=null}>Dismiss</button></div>{:else if S.pending}<p>Rewriting with {label(S.pending.settings)}. The current rewrite stays until the new one arrives.</p>{:else if !same(S.controls,S.result.settings)}<p>The controls now say <b>{label(S.controls)}</b>. This rewrite is still <b>{label(S.result.settings)}</b>. Press Rewrite to apply the new settings.</p>{/if}</div>
        </div>
      </div>
    </div>
  </section>
  <p class="cap">Prepared examples. This page doesn't call a model; every rewrite is authored and every diff is computed live.</p>
