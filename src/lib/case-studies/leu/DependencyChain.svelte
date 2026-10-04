<svelte:options preserveWhitespace={true}/>
<script>import {onMount} from 'svelte';import {lifecycle} from '../shared/lifecycle';import {STAGES} from './data';import ConceptGraph from './ConceptGraph.svelte';let {learner}=$props();let active=$state(0),steps;onMount(()=>{const life=lifecycle();life.observe(new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)active=Number(e.target.dataset.i)}),{rootMargin:'-45% 0px -45% 0px'}),[...steps.children]);return life.destroy;});</script>
<section class="chapter" id="architecture" aria-labelledby="chain-h">
    <div class="head">
      <h2 id="chain-h">One source, seven places to lose trust.</h2>
      <p>Corruption did not stay in the extractor. Every later stage could look consistent while reasoning about the wrong text.</p>
    </div>
    <div class="strip" aria-hidden="true"><p id="stripLabel">{STAGES[active].nm}</p><div class="bars" id="stripBars">{#each STAGES as s,i}<i class:on={i<=active}></i>{/each}</div></div>
    <div class="chain">
      <div class="steps" id="steps" bind:this={steps}>{#each STAGES as s,i}<div class="step" data-i={i}><h3>{s.nm}</h3><p>{s.ds}</p>{#each s.p as t}<p>{t}</p>{/each}{#if s.warn}<p class="warn">{s.warn}</p>{/if}{#if s.graph}<ConceptGraph {learner} graphId="g0" className="inline-graph" label="Concept graph for the sample page"/>{/if}</div>{/each}</div>
      <div class="diagram" aria-hidden="true"><ol class="dstages" id="dstages" style:--prog={(active/(STAGES.length-1)).toFixed(3)}>{#each STAGES as s,i}<li class="dst" class:on={i<=active} class:cur={i===active} data-i={i}><span class="n">{i+1}</span><div class="body"><div class="nm">{s.nm}</div><div class="ds">{s.ds}</div><div class="out"><span>{s.out}</span></div>{#if s.graph}<div class="dgraph"><div><ConceptGraph {learner} graphId="g1" id="chainGraph" manual={true} drawn={active>=2} label="Concept graph"/></div></div>{/if}</div></li>{/each}</ol></div>
    </div>
  </section>
