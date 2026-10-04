<svelte:options preserveWhitespace={true}/>
<script>import {PASSAGES} from './data';import Trace from './Trace.svelte';let {learner}=$props();</script>
<section class="frame" id="try" aria-label="Interactive reading loop">
    <div class="reader" id="reader">
      <article class="paper" aria-labelledby="doc-h">
        <div class="run" aria-hidden="true"><span>Earth Science Notes</span><span>p. 12</span></div>
        <h3 aria-level="2" id="doc-h">Why seasons happen</h3>
        <div id="passages">{#each PASSAGES as p}<button type="button" class="psg" class:flash={learner.flash===p.id} id={'psg-'+p.id} data-p={p.id} aria-pressed={String(learner.current?.id===p.id)} onclick={()=>learner.select(p.id)}><span class="pid">{p.n}</span>{p.text}</button>{/each}</div>
        <table class="dtable"><caption>Earth to Sun distance</caption><tbody><tr><td>Early January</td><td>147.1 million km</td></tr><tr><td>Early July</td><td>152.1 million km</td></tr></tbody></table>
      </article>
      <div class="sheet">
        <div class="trace-h"><h3 aria-level="2" id="trace-h" tabindex="-1">What Leu builds from it</h3><button type="button" id="clearTrace" hidden={!learner.current} onclick={learner.clear}>Clear</button></div>
        <Trace {learner}/>
        <p class="trace-note" id="traceNote">{learner.note}</p>
      </div>
    </div>
  </section>
