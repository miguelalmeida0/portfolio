<svelte:options preserveWhitespace={true}/>
<script>import {INV} from './data';let active=$state(0);function key(e,i){if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key))return;e.preventDefault();active=(i+(['ArrowDown','ArrowRight'].includes(e.key)?1:INV.length-1))%INV.length;e.currentTarget.parentElement.children[active].focus();}</script>
<section class="chapter" id="engineering" aria-labelledby="inv-h">
    <div class="head">
      <h2 id="inv-h">Native problems that shaped the architecture.</h2>
    </div>
    <div class="md" id="invs"><div class="md-list" role="tablist" aria-orientation="vertical" aria-label="Problems">{#each INV as [h],i}<button class="md-tab" role="tab" id={'mt'+i} aria-controls={'mp'+i} aria-selected={String(active===i)} tabindex={active===i?0:-1} onclick={()=>active=i} onkeydown={e=>key(e,i)}>{h}</button>{/each}</div>{#each INV as [h,rows],i}<div class="md-panel" role="tabpanel" id={'mp'+i} aria-labelledby={'mt'+i} hidden={active!==i} tabindex="0"><h3>{h}</h3><dl>{#each rows as [a,b]}<dt>{a}</dt><dd>{b}</dd>{/each}</dl></div>{/each}</div>
  </section>
