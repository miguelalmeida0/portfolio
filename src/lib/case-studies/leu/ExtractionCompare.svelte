<svelte:options preserveWhitespace={true}/>
<script>import {XV} from './data';let view=$state('page');function key(e,v){if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const keys=['page','raw','canon'];view=keys[(keys.indexOf(v)+(e.key==='ArrowRight'?1:2))%3];e.currentTarget.parentElement.querySelector('[data-v='+view+']').focus();}</script>
<section class="chapter" id="source" aria-labelledby="pdf-h">
    <div class="head">
      <h2 id="pdf-h">A readable PDF is not readable text.</h2>
      <p>On screen the page looked fine. Extraction dropped characters from titles, split letter-spaced labels and pulled running headers into the text, and every question, explanation and provenance link consumed that damaged text.</p>
    </div>
    <div class="unframed">
      <div class="segwrap"><div class="seg" role="radiogroup" aria-label="Representation">
        <button type="button" role="radio" aria-checked={String(view==='page')} tabindex={view==='page'?0:-1} data-v="page" onclick={()=>view='page'} onkeydown={e=>key(e,'page')}>What you see</button>
        <button type="button" role="radio" aria-checked={String(view==='raw')} tabindex={view==='raw'?0:-1} data-v="raw" onclick={()=>view='raw'} onkeydown={e=>key(e,'raw')}>What extraction returned</button>
        <button type="button" role="radio" aria-checked={String(view==='canon')} tabindex={view==='canon'?0:-1} data-v="canon" onclick={()=>view='canon'} onkeydown={e=>key(e,'canon')}>Canonical source</button>
      </div></div>
      <div class="extract">
        <div class="view" id="xview" aria-live="polite">{#if view==='page'}<div class="mini"><p class="lbl">EARTH SCIENCE</p><div class="rh"><span>Earth Science Notes</span><span>p. 12</span></div><h4 aria-level="3">Why seasons happen</h4>
      <div class="cols"><p>Earth's axis is tilted about 23.4° relative to its orbit and keeps pointing the same way in space all year.</p><p>Earth's distance from the Sun changes only slightly, and Earth is closest to the Sun in early January.</p></div></div>{:else if view==='raw'}<pre class="raw">E A R T H   S C I E N C E<sup>1</sup>
<mark>Earth Scienc Note</mark> p. 12<sup>2</sup><sup>3</sup>
<mark>Why season happe</mark><sup>2</sup>
Earth's axis is tilted about 23.4° rel  Earth's distance from the Sun<sup>4</sup>
ative to its orbit and keeps pointing   changes only slightly, and Earth is
the same way in space all year.         closest to the Sun in early January.</pre>{:else}<ul class="blocks">
      <li><code>p12·label</code><span class="x">EARTH SCIENCE<small>decoration, excluded</small></span></li>
      <li><code>p12·header</code><span class="x">Earth Science Notes, p. 12<small>running header, excluded</small></span></li>
      <li><code>p12·h1</code><span>Why seasons happen<small>heading</small></span></li>
      <li><code>p12·¶1</code><span>Earth's axis is tilted about 23.4° relative to its orbit and keeps pointing the same way in space all year.</span></li>
      <li><code>p12·¶3</code><span>Earth's distance from the Sun changes only slightly, and Earth is closest to the Sun in early January.</span></li></ul>{/if}</div>
        <ul class="notes" id="xnotes">{#each XV[view].notes as [a,b]}<li>{#if view==='raw'}<span class="tagn">{a}</span>{b}{:else}<b>{a}</b> {b}{/if}</li>{/each}</ul>
      </div>
    </div>
  </section>
