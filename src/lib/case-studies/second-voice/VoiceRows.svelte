<script>
import {ORIGINAL,VOICES,STRENGTHS,REWRITES,label,same} from './content';import {diff,stats} from './diff';import DiffText from './DiffText.svelte';import RadioGroup from '../shared/RadioGroup.svelte';let strength=$state('strong');
</script>
  <section class="chapter" id="voices" aria-labelledby="voices-h">
    <div class="head">
      <h2 id="voices-h">Same source, different transformation.</h2>
      <p>Comparison only means something when the source is fixed. Each voice rewrites the same two sentences, and the diff shows how far it travelled.</p>
    </div>
    <div class="vsource"><span class="seg" role="radiogroup" aria-label="Strength" id="vStr"><RadioGroup items={STRENGTHS} value={strength} onchange={v=>strength=v}/></span><q id="vSrc">{ORIGINAL}</q></div>
    <div class="vrows" id="vrows">{#each VOICES as v}{@const ops=diff(ORIGINAL,REWRITES[v.id][strength])}{@const st=stats(ops)}{@const keptPct=Math.round(st.kept/st.words*100)}<article class="vrow"><div><h3>{v.name}</h3><p class="vd">{v.desc}</p></div><p class="mv small" data-mode="marked"><DiffText {ops}/></p><div><p class="vs"><b>{keptPct}%</b>of the original's words kept</p><div class="meter" aria-hidden="true"><i class="mk" style:width={keptPct+'%'}></i><i class="mc" style:width={100-keptPct+'%'}></i></div><p class="vs">{st.rep} replaced, {st.add} added, {st.rem} removed</p></div></article>{/each}</div>
  </section>
