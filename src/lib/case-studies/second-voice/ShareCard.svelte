<script>
import {flushSync} from 'svelte';import {ORIGINAL,REWRITES} from './content';import {diff} from './diff';import DiffText from './DiffText.svelte';let shared=$state(false),confirm=$state(false),root;function focus(id){flushSync();root.querySelector('#'+id).focus();}
</script>
  <section class="chapter" id="privacy" bind:this={root} aria-labelledby="priv-h">
    <div class="head">
      <h2 id="priv-h">Private until you share it.</h2>
      <p>A writing tool holds personal text. A feature called share is also an authorisation problem, so public has to be a deliberate act.</p>
    </div>
    <div class="priv">
      <article class="share-card" aria-labelledby="share-l">
        <div class="share-head"><p class="label" id="share-l">Your rewrite</p><span class={'pill vis '+(shared?'plum':'dark')} id="visPill">{shared?'Public':'Private'}</span></div>
        <p class="mv small" data-mode="rewrite" id="shareText"><DiffText ops={diff(ORIGINAL,REWRITES.lyrical.strong)}/></p>
        <div class="share-actions" id="shareActions">{#if shared}<button class="btn sm quiet" type="button" id="unshare" onclick={()=>{shared=false;focus('share');}}>Make private again</button>{:else}<button class="btn sm" type="button" id="share" onclick={()=>{confirm=true;focus('doShare');}}>Share this rewrite</button>{/if}</div>
        <div class="confirm" id="confirm" hidden={!confirm}>
          <p>Create a public link for this rewrite? Nothing else in your account becomes public.</p>
          <div class="row" style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn sm" type="button" id="doShare" onclick={()=>{shared=true;confirm=false;focus('unshare');}}>Create public link</button><button class="btn sm quiet" type="button" id="cancelShare" onclick={()=>{confirm=false;focus('share');}}>Cancel</button></div>
        </div>
        <p class="linkline" id="linkline" hidden={!shared}>Public link created <span class="mono">/r/7f3a9c</span></p>
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
      <div class="no"><h3>What it avoids collecting</h3><ul><li>Raw drafts</li><li>Raw rewrites</li></ul><p>Hashes stand in for text wherever that is enough. Observability is not a reason to read people's writing.</p></div>
    </div>
  </section>
