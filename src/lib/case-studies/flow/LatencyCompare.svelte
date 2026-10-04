<svelte:options preserveWhitespace={true} />
<script>
const LAT = [
  {g:'ui', n:'Wake handler to Chromium paint', s:'median, p95 marked', v:42.1, p95:65.7},
  {g:'ui', n:'Earlier wake first-paint', s:'single observation', v:227.1},
  {g:'talk', n:'STT decoder initialisation', s:'approx.', v:841},
  {g:'talk', n:'STT drain', s:'approx.', v:1578},
  {g:'talk', n:'Final transcript to response', s:'approx.', v:223},
  {g:'talk', n:'TTS scheduling', s:'p50', v:1049}
];
let mode=$state('screen');const max=$derived(mode==='screen'?250:1700);const step=$derived(mode==='screen'?50:400);
</script>
<section class="chapter" id="latency" aria-labelledby="lat-h">
    <div class="head">
      <h2 id="lat-h">A fast screen is not a fast assistant.</h2>
      <p>The wake UI paints in tens of milliseconds. The conversation you wait through is dominated by speech infrastructure, which is a different engineering problem.</p>
    </div>
    <div class="stats">
      <div class="stat sage"><p class="n">42.1 ms</p><p class="l">Wake handler to Chromium paint, median</p><p>p95 around 65.7 ms. An earlier wake first-paint observation of 227.1 ms had missed the sub-100 ms target.</p></div>
      <div class="stat blue"><p class="n">1.578 s</p><p class="l">Speech-to-text drain</p><p>Alongside decoder initialisation around 841 ms and TTS scheduling around 1.049 s p50.</p></div>
    </div>
    <div class="frame" style="padding:clamp(14px,2vw,24px)"><div class="window" id="latWin">
      <div class="seg lat-switch" role="group" aria-label="Compare">
        <button type="button" data-mode="screen" aria-pressed={String(mode==='screen')} onclick={()=>mode='screen'}>What the screen does</button>
        <button type="button" data-mode="talk" aria-pressed={String(mode==='talk')} onclick={()=>mode='talk'}>What the conversation does</button>
      </div>
      <div class="lat" id="lat">{#each LAT as r,i}{@const p=Math.min(r.v/max,1)*100}<div class={'lrow '+(r.g==='talk'?'speech':'')} data-g={r.g} data-i={i} hidden={mode==='screen'&&r.g==='talk'}>
  <div class="n">{r.n}<small>{r.s}</small></div>
  <div class="bar-wrap"><div class="lbar" style:--p={p}></div>{#if r.p95}<div class="p95" title="p95 65.7 ms" style:--p={r.p95/max*100}></div>{/if}<div class="lval" class:in={p>70} style:--p={p}>{r.v<1000?r.v+' ms':(r.v/1000).toFixed(3)+' s'}{r.p95?' · p95 '+r.p95+' ms':''}</div><div class="target" hidden={!(r.g==='ui'&&i===0)} style:--p={100/max*100}><span>100 ms target</span></div></div>
</div>{/each}</div>
      <div class="axis"><div></div><div class="ticks" id="ticks">{#each Array.from({length:Math.floor(max/step)+1},(_,i)=>i*step) as v}<span style:left={v/max*100+'%'}>{v} ms</span>{/each}</div></div>
    </div></div>
    <p class="cap">Each row is a separate measurement with its own statistic, so they are not added into an end-to-end total. The speech pipeline also sat around 2.6 GB RSS with peaks near 3.1 GB, so optimisation meant residency, initialisation and release, not only milliseconds.</p>
  </section>
