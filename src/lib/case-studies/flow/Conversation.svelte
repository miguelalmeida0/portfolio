<svelte:options preserveWhitespace={true} />
<script>
import { SCENARIOS } from './engine';import InlineContent from '../shared/InlineContent.svelte';let {demo}=$props();const S=$derived(demo.S),ui=$derived(demo.ui);
</script>
<section class="talk" aria-labelledby="talk-h">
          <h3 class="colhead" id="talk-h">Conversation</h3>
          <p class="colsub">Sample commands</p>
          <div class="chips" id="chips" role="group" aria-label="Commands">{#each SCENARIOS as sc}<button type="button" class="chip" data-key={sc.key} aria-pressed={String(ui.selected===sc.key)} title={sc.say} aria-label={sc.label+': '+sc.say} disabled={S.busy} onclick={()=>demo.startScenario(sc)}>{sc.label}</button>{/each}</div>
          <label class="fail"><input type="checkbox" id="failToggle" bind:checked={ui.failSecond}> Make the second operation fail</label>
          <ol class="log" id="log" aria-live="polite" aria-relevant="additions">{#if !ui.messages.length}<li class="empty" id="emptyLog">{ui.empty}</li>{:else}{#each ui.messages as m (m.id)}<li class={m.who+(m.stale?' stale':'')} data-message={m.id}><InlineContent nodes={m.nodes}/></li>{/each}{/if}</ol>
          <div class="replies" id="replies">{#each ui.replies as item}<button type="button" class={'reply'+(item.cls?' '+item.cls:'')} onclick={()=>{if(!S.busy)item.run()}}>{item.label}</button>{/each}</div>
          <div class="tools">
            <button class="tool" id="undo" type="button" disabled={S.busy||!S.history.length} onclick={demo.undo}>Undo</button>
            <button class="tool" id="redo" type="button" disabled={S.busy||!S.future.length} onclick={demo.redo}>Redo</button>
            <button class="tool" id="what" type="button" disabled={S.busy||!S.history.length} onclick={demo.whatChanged}>What changed?</button>
            <button class="tool" id="reset" onclick={demo.resetDay} type="button">Reset day</button>
          </div>
        </section>
