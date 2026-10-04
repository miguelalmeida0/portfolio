<script>
import RadioGroup from '../shared/RadioGroup.svelte';import {LOG,STATES} from './data';let state=$state('success'),q=$state(''),status=$state('all'),newest=$state(true),open=$state(null);const statuses=[{id:'all',name:'All'},{id:'Delivered',name:'Delivered'},{id:'Failed',name:'Failed'}];let rows=$derived.by(()=>{let r=LOG.filter(r=>(status==='all'||r.st===status)&&(r.scen+' '+r.rec).toLowerCase().includes(q.toLowerCase()));if(!newest)r=r.toReversed();return state==='partial'?r.slice(0,5):r;});function clear(){q='';status='all';newest=true;}
</script>
  <section class="chapter" aria-labelledby="st-h">
    <div class="head">
      <h2 id="st-h">Most of a screen is not the happy path.</h2>
      <p>An activity history turns a large backend dataset into something people can inspect. Switch its state, search, filter and sort, and open a row.</p>
    </div>
    <div class="frame" id="states"><div class="window">
      <div class="hist-state"><span class="label" id="hists-l" style="margin:0">State</span><div class="seg" role="radiogroup" aria-labelledby="hists-l" id="histState"><RadioGroup items={STATES} value={state} onchange={v=>state=v}/></div></div>
      <div class="hist-ctl">
        <input type="search" id="histSearch" bind:value={q} placeholder="Search scenario or contact" aria-label="Search activity" autocomplete="off">
        <div class="seg" role="radiogroup" aria-label="Status" id="histStatus"><RadioGroup items={statuses} value={status} onchange={v=>status=v}/></div>
        <button class="btn sm quiet" type="button" id="histSort" onclick={()=>newest=!newest}>{newest?'Newest first':'Oldest first'}</button>
        <button class="tlink" type="button" id="histClear" onclick={clear}>Clear filters</button>
      </div>
      <div class="lb" id="hist" aria-live="polite">{#if state==='loading'}<div class="hist-skel" aria-label="Loading">{#each Array(6) as _}<i></i>{/each}</div>
{:else if state==='error'}<div class="hist-msg"><h3>Couldn't load the activity history.</h3><p>Your search and filters are kept.</p><button class="btn sm" type="button" data-to="success" onclick={()=>state='success'}>Retry</button></div>
{:else if state==='denied'}<div class="hist-msg"><h3>This history is not available to you.</h3><p>Viewing it needs viewer access. Ask an administrator.</p></div>
{:else if state==='empty'||!rows.length}<div class="hist-msg"><h3>No entries match.</h3><p>{state==='empty'?'Nothing arrived in this period.':'Try fewer filters.'}</p><button class="btn sm quiet" type="button" data-clear onclick={()=>{state='success';clear();}}>Clear filters</button></div>
{:else}{#if state==='partial'}<div class="hist-banner"><span>Contact names couldn't load. Showing placeholders.</span><button class="btn sm quiet" type="button" data-to="success" onclick={()=>state='success'}>Retry names</button></div>{/if}
{#if state==='stale'}<div class="hist-banner"><span>The workspace changed. These results are from Workspace North.</span><button class="btn sm quiet" type="button" data-to="success" onclick={()=>state='success'}>Refresh</button></div>{/if}
{#each rows as r,i (r.t+'-'+r.rec)}{@const key=r.t+'-'+r.rec}<button class="hist-row" type="button" aria-expanded={open===key} data-key={key} style:--i={i} onclick={()=>open=open===key?null:key}><span class="t">{r.t}</span><span>{r.scen}</span><span class="c3">{r.iface}</span><span class="c4">{#if state==='partial'}<span class="mono">{r.id}</span>{:else}{r.rec}{/if}</span><span class={'st pill '+(r.st==='Failed'?'fail':'hl')}>{r.st}</span></button>{#if open===key}<dl class="hist-det"><div><dt>Scenario</dt><dd>{r.scen}</dd></div><div><dt>Contact</dt><dd>{state==='partial'?r.id:r.rec}</dd></div><div><dt>Channel</dt><dd>{r.iface}</dd></div><div><dt>{r.st==='Failed'?'Root cause':'Outcome'}</dt><dd>{r.cause||'Delivered'}</dd></div></dl>{/if}{/each}<div class="hist-foot"><span>{rows.length} of 24 entries</span><span>{state==='partial'?'Partial data':'Synthetic data'}</span></div>{/if}</div>
    </div></div>
  </section>
