<svelte:options preserveWhitespace={true} />
<script>
let {demo}=$props();
</script>
<section class="rail" aria-labelledby="rail-h">
          <h3 class="colhead" id="rail-h">Action pipeline</h3>
          <p class="colsub">What each stage produced</p>
          <!-- svelte-ignore a11y_no_noninteractive_tabindex (The overflowing pipeline must be keyboard-scrollable.) -->
          <ol class="stages" id="stages" tabindex="0" aria-label="Processing stages">
            <li class="stage" data-k="1" data-n="1" data-s={demo.ui.stages['1'].state}><div class="nm">Normalize</div><pre>{demo.ui.stages['1'].output}</pre></li>
            <li class="stage" data-k="2" data-n="2" data-s={demo.ui.stages['2'].state}><div class="nm">Interpret</div><pre>{demo.ui.stages['2'].output}</pre></li>
            <li class="stage" data-k="3" data-n="3" data-s={demo.ui.stages['3'].state}><div class="nm">Actions, selectors, constraints</div><pre>{demo.ui.stages['3'].output}</pre></li>
            <li class="stage" data-k="4" data-n="4" data-s={demo.ui.stages['4'].state}><div class="nm">Resolve references</div><pre>{demo.ui.stages['4'].output}</pre></li>
            <li class="stage" data-k="5" data-n="5" data-s={demo.ui.stages['5'].state}><div class="nm">Transform draft</div><pre>{demo.ui.stages['5'].output}</pre></li>
            <li class="stage" data-k="6" data-n="6" data-s={demo.ui.stages['6'].state}><div class="nm">Validate invariants</div><pre>{demo.ui.stages['6'].output}</pre></li>
            <li class="stage gate" data-k="gate" data-n="" data-s={demo.ui.stages['gate'].state}><div class="nm">Proposal and confirmation</div><pre>{demo.ui.stages['gate'].output}</pre></li>
            <li class="stage" data-k="7" data-n="7" data-s={demo.ui.stages['7'].state}><div class="nm">Atomic commit</div><pre>{demo.ui.stages['7'].output}</pre></li>
            <li class="stage" data-k="8" data-n="8" data-s={demo.ui.stages['8'].state}><div class="nm">Render, persist, verify</div><pre>{demo.ui.stages['8'].output}</pre></li>
          </ol>
          <p class="rail-note">Illustrative model of Flow's pipeline.</p>
        </section>
