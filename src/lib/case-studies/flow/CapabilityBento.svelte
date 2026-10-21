<svelte:options preserveWhitespace={true} />
<script>
import CircleFill from '$lib/components/experience/CircleFill.svelte';
let { demo }=$props();function launch(key){document.getElementById('try').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});demo.launch(key);}
</script>
<section class="chapter" aria-labelledby="cap-h">
    <div class="head">
      <h2 id="cap-h">Handling unclear or conflicting requests</h2>
      <p>Flow understands, proposes and validates, then waits for you.</p>
    </div>
    <div class="bento">
      <article class="tile blue w4"><h3>It asks which one.</h3><p>“Move the meeting” has four candidates. Flow asks instead of guessing, and your answer becomes part of the same operation.</p>
        <button class="btn primary sm go" data-run="ambiguous" onclick={() => launch('ambiguous')} data-flow-action><CircleFill label={`Try “Move the meeting”`} /></button></article>
      <article class="tile warn w2"><h3>Protected stays protected.</h3><p>Deleting your flight needs explicit approval, separate from a plain “yes”.</p><button class="btn primary sm go" data-run="protected" onclick={() => launch('protected')} data-flow-action><CircleFill label={`Try “Delete my flight”`} /></button></article>
      <article class="tile blush w2"><h3>It catches conflicts.</h3><p>Moving lunch into planning surfaces the overlap and offers a fix that fits.</p><button class="btn primary sm go" data-run="conflict" onclick={() => launch('conflict')} data-flow-action><CircleFill label={`Try “Move lunch to 2pm”`} /></button></article>
      <article class="tile sage w4"><h3>All or nothing.</h3><p>A compound command commits as one write. If any part fails, nothing changes and the calendar is exactly as before.</p>
        <button class="btn primary sm go" data-run="compound" onclick={() => launch('compound')} data-flow-action><CircleFill label={`Try the compound command`} /></button></article>
      <article class="tile well w6"><h3>Approve the current proposal</h3><p>Correct yourself mid-proposal and approval binds to the new proposal only.</p><button class="btn primary sm go" data-run="correction" onclick={() => launch('correction')} data-flow-action><CircleFill label={`Try a correction`} /></button></article>
    </div>
  </section>
