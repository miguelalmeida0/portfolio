<svelte:options preserveWhitespace={true}/>
<script>import {PASSAGES} from './data';import ConceptGraph from './ConceptGraph.svelte';let {learner}=$props();const vals=$derived(Object.values(learner.passageResult));const count=s=>vals.filter(v=>v===s).length;</script>
<section class="chapter" aria-labelledby="close-h">
    <div class="close">
      <div class="paper" aria-hidden="true" id="closePaper"><div class="run"><span>Earth Science Notes</span><span>p. 12</span></div><h3>Why seasons happen</h3>{#each PASSAGES as p}<p class={'psg-static '+(learner.passageResult[p.id]||'')}>{p.text}</p>{/each}</div>
      <div>
        <div class="head" style="text-align:left;margin:0 0 18px"><h2 id="close-h" style="font-size:clamp(32px,3.4vw,48px)">The source did not change. What is known about it did.</h2></div>
        <p class="summary" id="summary">{vals.length?'You answered on '+vals.length+' of 3 passages: '+count('evidence')+' credited, '+count('weak')+' with weak reasoning, '+count('missed')+' not credited. Leu would route the next study session from this, and every entry still points at its passage.':'Nothing has been recorded yet. Select a passage at the top of the page and answer it, and this graph will change while the page stays the same.'}</p>
        <ConceptGraph {learner} graphId="g2" id="closeGraph" label="Concept graph coloured by learner state"/>
        <ul class="legend"><li class="evidence">Credited</li><li class="weak">Weak reasoning</li><li class="missed">Not credited</li><li>Not studied</li></ul>
      </div>
    </div>
  </section>
