<script>
import CircleFill from '$lib/components/experience/CircleFill.svelte';
import {flushSync} from 'svelte';import {ORIGINAL,REWRITES} from './content';import {diff} from './diff';import DiffText from './DiffText.svelte';let shared=$state(false),confirm=$state(false),root;function focus(id){flushSync();root.querySelector('#'+id).focus();}
</script>
  <section class="chapter" id="privacy" bind:this={root} aria-labelledby="priv-h">
    <div class="head">
      <h2 id="priv-h">Private until you share it.</h2>
      <p>Rewrites stay private unless the writer chooses to share them. This example shows the confirmation step.</p>
    </div>
    <div class="priv">
      <article class="share-card" aria-labelledby="share-l">
        <p class="cap">Interactive sharing example. Nothing is published.</p>
        <div class="share-head"><p class="label" id="share-l">Your rewrite</p><span class={'pill vis '+(shared?'plum':'dark')} id="visPill">{shared?'Public':'Private'}</span></div>
        <p class="mv small" data-mode="rewrite" id="shareText"><DiffText mode="rewrite" ops={diff(ORIGINAL,REWRITES.lyrical.strong)}/></p>
        <div class="share-actions" id="shareActions">{#if shared}<button class="btn sm quiet" type="button" id="unshare" onclick={()=>{shared=false;focus('share');}} data-flow-action><CircleFill label={`Make private again`} /></button>{:else}<button class="btn sm" type="button" id="share" onclick={()=>{confirm=true;focus('doShare');}} data-flow-action><CircleFill label={`Share this rewrite`} /></button>{/if}</div>
        <div class="confirm" id="confirm" hidden={!confirm}>
          <p>Preview how sharing this rewrite would work? This example does not publish text or change an account.</p>
          <div class="row" style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn sm" type="button" id="doShare" onclick={()=>{shared=true;confirm=false;focus('unshare');}} data-flow-action><CircleFill label={`Simulate public link`} /></button><button class="btn sm quiet" type="button" id="cancelShare" onclick={()=>{confirm=false;focus('share');}} data-flow-action><CircleFill label={`Cancel`} /></button></div>
        </div>
        <p class="linkline" id="linkline" hidden={!shared}>Example public-link state <span class="mono">/r/7f3a9c</span></p>
      </article>
      <div>
        <ul class="kept-apart" aria-label="Kept apart in the data model">
          <li>Private writing<small>the default for everything</small></li>
          <li>Explicitly public results<small>only after Share</small></li>
          <li>Generated results<small>owned, not published</small></li>
          <li>Feedback and evaluation<small>separate from content</small></li>
          <li>User identity<small>separate from shares</small></li>
          <li>Telemetry<small>operational only</small></li>
        </ul>
        <div class="incident"><p><b>The blocker.</b> An earlier migration could have treated historical content as public. It was caught before release and treated as a deployment blocker, and visibility became an explicit, first-class state.</p></div>
      </div>
    </div>
    <div class="observe">
      <div class="yes"><h3>What debugging can see</h3><ul><li>Request id</li><li>Provider and model</li><li>Latency</li><li>Schema fallback state</li><li>Feedback</li><li>Rewrite hash</li></ul><p>Enough to trace a bad rewrite to its request.</p></div>
      <div class="no"><h3>What it avoids collecting</h3><ul><li>Raw drafts</li><li>Raw rewrites</li></ul><p>Hashes stand in for text wherever that is enough. Logs should not include the writer’s original text.</p></div>
    </div>
  </section>
