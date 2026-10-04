<script>
import {VOICES,label,same} from './content';import RadioGroup from '../shared/RadioGroup.svelte';let {workspace}=$props();let S=$derived(workspace.S);let off=$derived(!same(S.controls,S.result.settings));let rows=$derived([['Selected settings',label(S.controls),off],['Submitted settings',label(S.submitted),false],['Visible draft','Unchanged, never cleared',false],['Last successful rewrite',label(S.result.settings)+', run '+S.result.run,false],['Pending request',S.pending?`Run ${S.pending.run}, ${label(S.pending.settings)}`:'None',false],['Failed request',S.failed?label(S.failed.settings)+', can retry':'None',false],['Result metadata',label(S.result.settings)+', run '+S.result.run,false]]);
</script>
  <section class="chapter" id="state" aria-labelledby="state-h">
    <div class="head">
      <h2 id="state-h">A rewrite remembers how it was made.</h2>
      <p>Change the voice without pressing Rewrite. A naive interface relabels the old rewrite with the new controls. Second Voice keeps a snapshot of what was actually submitted.</p>
    </div>
    <div class="state-grid">
      <div class="labels">
        <article class="lab-card" id="naiveCard" class:wrong={off}><h3>A label read from the controls</h3><p class="big" id="naiveLabel">{label(S.controls)}</p><p class="why" id="naiveWhy">{off?`Wrong. This text was written as ${label(S.result.settings)}.`:'Correct only while nothing has changed.'}</p></article>
        <article class="lab-card right"><h3>A label read from the submission</h3><p class="big" id="snapLabel">{label(S.result.settings)}</p><p class="why" id="snapWhy">Run {S.result.run}, from the snapshot taken at submit.</p></article>
        <div class="mini-ctl"><span class="label" id="mini-l" style="margin:0">Voice</span><div class="seg" role="radiogroup" aria-labelledby="mini-l" id="miniVoice"><RadioGroup items={VOICES} value={S.controls.voice} onchange={v=>S.controls.voice=v}/></div></div>
      </div>
      <aside class="inspect" aria-labelledby="ins-h">
        <h3 id="ins-h">Seven truths the interface keeps apart</h3>
        <p>Live, from the workspace above.</p>
        <dl class="truths" id="truths">{#each rows as [k,v,d]}<dt>{k}</dt><dd class:diff={d}>{v}</dd>{/each}</dl>
      </aside>
    </div>
  </section>
