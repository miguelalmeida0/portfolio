<svelte:options preserveWhitespace={true} />
<script>
import { H,span,VIEW_START,VIEW_END } from './engine';import {topPct} from './demo.svelte';let {demo}=$props();const S=$derived(demo.S),ui=$derived(demo.ui);const hours=Array.from({length:14},(_,i)=>8+i);
</script>
<section class="cal" class:rewinding={ui.rewinding} aria-labelledby="cal-h">
          <h3 class="colhead" id="cal-h">Calendar</h3>
          <p class="colsub">The active day is the default context</p>
          <div class="days" id="days" data-active={String(S.activeDay)}>
            <div aria-hidden="true"></div>
            <div class="dayheads">
              <button class="dayhead" data-day="0" type="button" aria-pressed={String(S.activeDay===0)} onclick={()=>demo.setActive(0)}>Today<small>{S.activeDay===0?'Active context':' '}</small></button>
              <button class="dayhead" data-day="1" type="button" aria-pressed={String(S.activeDay===1)} onclick={()=>demo.setActive(1)}>Tomorrow<small>{S.activeDay===1?'Active context':' '}</small></button>
            </div>
            <div class="hours" id="hours" aria-hidden="true">{#each hours as h}<span style:top={topPct(H(h))+'%'}>{String(h).padStart(2,'0')}</span>{/each}</div>
            <div class="track" data-day="0" id="track0" role="list" aria-label="Today">{@render track(0)}</div>
            <div class="track" data-day="1" id="track1" role="list" aria-label="Tomorrow">{@render track(1)}</div>
          </div>
        </section>
{#snippet track(day)}{#each hours as h}<div class="line" style:top={topPct(H(h))+'%'}></div>{/each}<div class="ghosts">{#each S.pending?.changes??[] as c}{#if c.day===day&&c.after}<div class="ghost" style:top={topPct(c.after.start)+'%'} style:height={'calc('+((c.after.end-c.after.start)/(VIEW_END-VIEW_START)*100)+'% - 2px)'}>P{S.pending.pid} · {c.title}</div>{/if}{/each}</div>{#if day===0}<div class="now" style:top={topPct(H(9,10))+'%'} title="Now 09:10"></div>{/if}{#each ui.events.filter(e=>e.day===day) as e (e.id)}{@const change=S.pending?.changes.find(c=>c.id===e.id)}<div class="ev" class:new={e.new} class:gone={e.gone} class:short={e.end-e.start<=30} class:prot={!!e.protected} class:pending={!!change?.after} class:pending-del={!!change&&!change.after} class:cand={ui.candidates.includes(e.id)} class:flash={ui.flash} data-id={e.id} role="listitem" style:--t={(topPct(e.start)/100).toFixed(5)} style:--h={((e.end-e.start)/(VIEW_END-VIEW_START)).toFixed(5)} aria-label={e.title+', '+span(e)+(e.protected?', protected':'')}><span class="t" data-pid={change&&!change.after?'P'+S.pending.pid:undefined}>{e.title}</span><span class="tm">{span(e)}</span></div>{/each}{#each ui.trails.filter(t=>t.day===day) as t (t.id)}<div class="trail" style:top={t.start+'%'} style:height={'calc('+t.height+'% - 2px)'}></div>{/each}{/snippet}
