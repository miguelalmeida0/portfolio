<svelte:options preserveWhitespace={true}/>
<script>let version=$state('v37');function key(e,v){const keys=['early','v36','v37'];let n;if(e.key==='ArrowRight')n=(keys.indexOf(v)+1)%3;if(e.key==='ArrowLeft')n=(keys.indexOf(v)+2)%3;if(e.key==='Home')n=0;if(e.key==='End')n=2;if(n===undefined)return;e.preventDefault();version=keys[n];e.currentTarget.parentElement.children[n].focus();}</script>
<section class="chapter" aria-labelledby="who-h">
    <div class="head">
      <h2 id="who-h">Change who is allowed to decide.</h2>
      <p>V36's sealed evaluation ended the assumption that more matching rules would become reasoning. V37 kept the judge and changed what fed it: structured model observations, checked before they can influence learning credit.</p>
    </div>
    <div class="frame">
      <div class="tabs" role="tablist" aria-label="Architecture versions">
        <button class="tab" role="tab" id="t-early" aria-controls="p-early" aria-selected={String(version==='early')} tabindex={version==='early'?0:-1} onclick={()=>version='early'} onkeydown={e=>key(e,'early')}>Early<small>Heuristics</small></button>
        <button class="tab" role="tab" id="t-v36" aria-controls="p-v36" aria-selected={String(version==='v36')} tabindex={version==='v36'?0:-1} onclick={()=>version='v36'} onkeydown={e=>key(e,'v36')}>V36<small>Vectors</small></button>
        <button class="tab" role="tab" id="t-v37" aria-controls="p-v37" aria-selected={String(version==='v37')} tabindex={version==='v37'?0:-1} onclick={()=>version='v37'} onkeydown={e=>key(e,'v37')}>V37<small>Structured read</small></button>
      </div>
      <div class="vpanel" role="tabpanel" id="p-early" aria-labelledby="t-early" hidden={version!=='early'}>
        <div>
          <ol class="flowline" aria-label="Early pipeline"><li>PDF text</li><li class="auth">Heuristics<small>holds the authority</small></li><li>Question</li></ol>
          <p>Raw extraction and local context carried too much authority. A question that references the source is not automatically a useful learning question.</p>
          <p class="pull">Grounded and still bad: it tests whether you remember the sentence, not whether you understand it.</p>
        </div>
        <div class="case">
          <p class="who">Generated from ¶2, example</p>
          <p class="said">“When a hemisphere leans toward the Sun, sunlight arrives at a steeper ________.”</p>
          <p class="outcome mid">Answerable from wording alone</p>
          <p class="small" style="margin-top:16px">This pushed generation towards structured knowledge and a deterministic learning intent, with language generation last.</p>
        </div>
      </div>
      <div class="vpanel" role="tabpanel" id="p-v36" aria-labelledby="t-v36" hidden={version!=='v36'}>
        <div>
          <ol class="flowline" aria-label="V36 pipeline"><li>PDF</li><li class="auth">Semantic / vector logic<small>sets correctness</small></li><li>Judge</li></ol>
          <p class="big">52% → 51%</p>
          <p>V35 to V36 coarse accuracy on the same sealed 160-case set. Fewer harmful writes, but weak-reasoning detection stayed at 0/16 in both versions. This result ended the vector-only direction.</p>
        </div>
        <div class="case">
          <p class="who">Example learner answer to ¶2</p>
          <p class="said">“It's warmer in July because Earth is closer to the Sun then.”</p>
          <p>It sits close to the passage in meaning, so similarity treats it as right. The reason contradicts ¶3: Earth is closest to the Sun in January.</p>
          <p class="outcome bad">Credited. False mastery written.</p>
        </div>
      </div>
      <div class="vpanel" role="tabpanel" id="p-v37" aria-labelledby="t-v37" hidden={version!=='v37'}>
        <div>
          <ol class="flowline" aria-label="V37 pipeline"><li>Canonical source</li><li>Structured read<small>proposes</small></li><li class="gate">Deterministic checks<small>can only downgrade</small></li><li class="auth">Judge<small>decides</small></li><li>Learner model</li></ol>
          <p>Interpretation is a proposal. The judge still owns the state decision.</p>
          <div class="nums">
            <div><b>75%</b><span>Coarse accuracy</span></div>
            <div><b>91.4%</b><span>Commit accuracy</span></div>
            <div><b>2/58</b><span>False mastery</span></div>
            <div><b>3/80</b><span>Harmful writes</span></div>
          </div>
          <p class="small">V37 dev14, three fresh Mac runs, 80 development answers.</p>
        </div>
        <div class="case">
          <p class="who">The same example answer, read in parts</p>
          <dl class="judge">
            <dt>Conclusion</dt><dd>the north is warmer in July</dd>
            <dt>Reason</dt><dd>Earth is closer to the Sun</dd>
            <dt>Checks</dt><dd><ul><li class="p">Conclusion supported by ¶2</li><li class="f">Reason contradicts ¶3: closest in January</li></ul></dd>
            <dt>Judge</dt><dd class="verdict ask">Ask a follow-up. No mastery.</dd>
          </dl>
          <p class="pull">The model reads. Code checks. The judge decides. Checks may downgrade, ask or reject; they cannot manufacture mastery.</p>
        </div>
      </div>
    </div>
  </section>
