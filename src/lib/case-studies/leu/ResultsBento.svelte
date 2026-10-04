<svelte:options preserveWhitespace={true}/>
<script>import {onMount} from 'svelte';import {lifecycle} from '../shared/lifecycle';let filled=$state(false),element;onMount(()=>{const life=lifecycle();if(life.reduce.matches)filled=true;else life.observe(new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){filled=true;o.disconnect()}}),{threshold:.35}),[element]);return life.destroy;});</script>
<section class="chapter" id="results" aria-labelledby="res-h">
    <div class="head">
      <h2 id="res-h">Persist the work, then stop redoing it.</h2>
      <p>Both speed gains came from one move: separating incremental work from persisted work, so reopening a document reads what was already established instead of rebuilding it.</p>
    </div>
    <div class="bento" id="perf" class:on={filled} bind:this={element}>
      <article class="tile indigo w3">
        <p class="hn">25.90 s → 2.03 s</p><h3>Intelligence generation</h3>
        <div class="pbars">
          <div class="pb before"><span>Before</span><div class="track"><div class="fill" data-w="100" style:--p={filled?'100':undefined}></div><div class="val in" data-l="100" style:--p={filled?'100':undefined}>25.90 s</div></div></div>
          <div class="pb after"><span>After</span><div class="track"><div class="fill" data-w="7.84" style:--p={filled?'7.84':undefined}></div><div class="val" data-l="7.84" style:--p={filled?'7.84':undefined}>2.03 s</div></div></div>
        </div>
        <p class="small">Recorded V28.1 measurement after separating incremental and persisted work.</p>
      </article>
      <article class="tile peach w3">
        <p class="hn">10.34 s → 64 ms</p><h3>Reopen, p50</h3>
        <div class="pbars">
          <div class="pb before"><span>Before</span><div class="track"><div class="fill" data-w="100" style:--p={filled?'100':undefined}></div><div class="val in" data-l="100" style:--p={filled?'100':undefined}>10.34 s</div></div></div>
          <div class="pb after"><span>After</span><div class="track"><div class="fill" data-w="0.62" style:--p={filled?'0.62':undefined}></div><div class="val" data-l="0.62" style:--p={filled?'0.62':undefined}>64 ms</div></div></div>
        </div>
        <p>Previously processed material. This measures reuse, not a cold model request.</p>
      </article>
      <article class="tile plain w4"><p class="hn">2/58</p><h3>False mastery in V37 dev14</h3><p>Answers that should not have earned mastery and still did, out of the 58 that should not.</p></article>
      <article class="tile plain w2"><p class="hn">0/16</p><h3>Weak reasoning caught by V35 and V36</h3><p>The number that ended the vector-only direction.</p></article>
    </div>
  </section>
