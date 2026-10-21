<script>
import {DEC} from './data';let selected=$state(0);function key(e,i){const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();selected=(i+d+DEC.length)%DEC.length;e.currentTarget.parentElement.children[selected].focus();}
</script>
  <section class="chapter" id="decisions" aria-labelledby="dec-h">
    <div class="head">
      <h2 id="dec-h">The architecture decisions behind it.</h2>
      <p>These decisions shaped how the frontend stays modular as workflows grow and a second stack arrives. Pick one to see which layers it governs. Shown at the level of principles, not internal design.</p>
    </div>
    <div class="layers-d focus" id="layersD" aria-hidden="true">
      <div class="ld wide" data-l="shell" class:on={DEC[selected].l.includes('shell')}><b>Shared app shell</b><small>Auth, session, routing, layout, navigation, providers, tokens, global assets, build and deploy conventions</small></div>
      <div class="ld-row">
        <div class="ld" data-l="route" class:on={DEC[selected].l.includes('route')}><b>Route</b><small>Entry point and context</small></div>
        <div class="ld" data-l="feature" class:on={DEC[selected].l.includes('feature')}><b>Feature</b><small>View, form, async and permission state</small></div>
        <div class="ld" data-l="components" class:on={DEC[selected].l.includes('components')}><b>Reusable components</b><small>Inputs, dropdowns, pagination, labels, feedback states, domain controls</small></div>
        <div class="ld" data-l="api" class:on={DEC[selected].l.includes('api')}><b>API and domain layer</b><small>Contracts and mapping</small></div>
        <div class="ld" data-l="services" class:on={DEC[selected].l.includes('services')}><b>Backend services</b><small>Owned by the backend team</small></div>
      </div>
      <div class="ld wide" data-l="tests" class:on={DEC[selected].l.includes('tests')}><b>Playwright</b><small>Consequences across the whole stack: requests, states, focus, persistence, degraded networks</small></div>
    </div>
    <div class="dec-tabs" role="tablist" aria-label="Decisions" id="decTabs">{#each DEC as x,i}<button type="button" role="tab" id={'dt'+i} aria-controls="decPanel" aria-selected={selected===i} tabindex={selected===i?0:-1} onclick={()=>selected=i} onkeydown={e=>key(e,i)}>{x.t.replace(/\.$/,'')}</button>{/each}</div>
    <div id="decPanel" aria-labelledby={'dt'+selected} role="tabpanel" tabindex="0"><p class="dec-title">{DEC[selected].t}</p><div class="dec"><div><h3>Context</h3><p>{DEC[selected].c}</p></div><div class="mid"><h3>Decision</h3><p>{DEC[selected].d}</p></div><div><h3>Consequence</h3><p>{DEC[selected].r}</p></div></div></div>
  </section>
