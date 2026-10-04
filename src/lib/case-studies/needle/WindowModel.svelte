<script lang="ts">
  import { wallWindow } from './wall-window';
  let top = $state(0);
  let viewport: HTMLDivElement;
  const columns = 4, rowHeight = 72, height = 288, total = 10000;
  const midpoint = Math.floor(total / columns / 2) * rowHeight;
  const window = $derived(wallWindow(total, columns, rowHeight, height, top));
  const records = $derived(Array.from({ length: window.end - window.start }, (_, i) => window.start + i));
  function jump(value: number) { viewport.scrollTop = value; top = value; }
</script>
<div class="window-model frame">
  <div class="window-description"><p class="eyebrow">Scroll the collection model</p><h3>Keep the records.<br />Mount the window.</h3><p>The same row calculation used in Needle selects visible records, plus one extra row on either side.</p><div class="window-count"><b>{window.end - window.start}</b><span>mounted elements<br />out of 10,000 records</span></div><div class="chips"><button type="button" class="chip" onclick={() => jump(0)}>Start</button><button type="button" class="chip" onclick={() => jump(midpoint)}>Jump to middle</button></div><p class="cap">A four-column model. Cells represent records, not artwork previews.</p></div>
  <div><div class="viewport-label"><span>Visible window + overscan</span><span>Rows {window.startRow + 1}–{window.endRow}</span></div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (The virtual scroll region is keyboard operable.) -->
    <div class="virtual-viewport" bind:this={viewport} onscroll={() => top = viewport.scrollTop} tabindex="0" role="region" aria-label="Scrollable collection window" data-window-model>
      <div class="virtual-space" style:height={`${Math.ceil(total / columns) * rowHeight}px`}>
        {#each records as record (record)}<div class="virtual-record" style:top={`${Math.floor(record / columns) * rowHeight}px`} style:left={`${record % columns * 25}%`} data-record={record}><span>{String(record + 1).padStart(5, '0')}</span></div>{/each}
      </div>
    </div><p class="cap">Use the mouse wheel, arrow keys, or the jump control.</p>
  </div>
</div>
