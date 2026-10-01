<script lang="ts">
  let scenario = $state('valid');
  let stage = $state(0);
  const stages = ['Normalize', 'Interpret', 'Resolve', 'Draft', 'Validate', 'Commit'];
  const failed = $derived((scenario === 'ambiguous' && stage === 2) || (scenario === 'invalid' && stage === 4));
  const committed = $derived(stage === 5 && !failed);
  const drafting = $derived(stage >= 3 && !failed);
  const explanations = [
    'Keep the requested relationship and the protection instruction intact.',
    'Two actions: move Lunch after Standup; protect Gym. Titles are selectors, not hard-coded event IDs.',
    'Resolve Lunch, Standup and Gym to existing event identities before changing the document.',
    'Apply both operations to a copy. Lunch moves after Standup; Gym becomes protected. The original is still unchanged.',
    'Check event identity, event preservation and constraints. A plausible arrangement is not sufficient.',
    'Both operations become authoritative together. The accepted document can now feed history, persistence and rendering.'
  ];
  const explanation = $derived(failed
    ? scenario === 'ambiguous'
      ? 'Two events match “Lunch.” Ask which one. No draft is applied and Gym is not partially protected.'
      : 'The example candidate has lost Gym. Reject the whole draft, including the proposed Lunch move. The original remains intact.'
    : scenario === 'invalid' && stage === 3
      ? 'The injected failure drops Gym while moving Lunch in the candidate document. Nothing has reached the authoritative state. Validation must reject this draft.'
      : explanations[stage]);
  function reset() { stage = 0; }
</script>

<section class="walkthrough" aria-labelledby="walkthrough-title">
  <p class="small-label">Explore the transaction boundary</p>
  <h2 id="walkthrough-title">One sentence. One commit.</h2>
  <p class="description">“Move lunch after standup and keep gym fixed.”</p>
  <p class="note">Illustrative state model with sample events, not a live execution of Flow’s engine. Step through a successful command or inject a failure.</p>
  <fieldset>
    <legend>Choose a scenario</legend>
    {#each [['valid', 'Both actions valid'], ['ambiguous', 'Ambiguous lunch'], ['invalid', 'An event disappears']] as [value, label]}
      <label><input type="radio" name="transaction-scenario" {value} bind:group={scenario} onchange={reset} />{label}</label>
    {/each}
  </fieldset>
  <ol class="steps" aria-label="Command pipeline">
    {#each stages as name, i}<li class:reached={i <= stage} aria-current={i === stage ? 'step' : undefined}><span>{i + 1}</span>{name}</li>{/each}
  </ol>
  <div class="state-comparison">
    <div data-authoritative-state><h3>Authoritative state</h3><ul><li>Standup <strong>12:00–12:30</strong></li><li>Lunch <strong>{committed ? '12:30–13:00' : '12:00–12:30'}</strong></li>{#if scenario === 'ambiguous'}<li>Team lunch <strong>13:00–13:30</strong></li>{/if}<li>Gym <strong>18:00–19:00 · {committed ? 'protected' : 'flexible'}</strong></li></ul></div>
    <div data-draft-state><h3>{committed ? 'Commit result' : 'Proposed change'}</h3>
      {#if failed}<p class="outcome">{scenario === 'ambiguous' ? 'Clarification required.' : 'Draft rejected.'}<br />Nothing changed.</p>
      {:else if committed}<p class="outcome">Lunch moved.<br />Gym protected.<br />Both accepted together.</p>
      {:else if drafting}<ul><li>Lunch <strong>12:30–13:00</strong></li><li>Gym <strong>{scenario === 'invalid' ? 'missing from candidate' : '18:00–19:00 · protected'}</strong></li></ul>
      {:else}<p>Pending resolution.<br />The calendar has not changed.</p>{/if}
    </div>
  </div>
  <p class="explanation" role="status" aria-live="polite" aria-atomic="true">{explanation}</p>
  <div class="controls"><button class="action-button" onclick={() => stage += 1} disabled={failed || committed}>Next: {stages[Math.min(stage + 1, 5)]}</button><button class="reset" onclick={reset}>Start again</button><span>{failed ? 'Stopped safely' : committed ? 'Committed' : `${stage + 1} of ${stages.length}`}</span></div>
</section>

<style>
  .walkthrough { margin: 3rem 0 0; padding: clamp(1.2rem, 3vw, 2.75rem); background: var(--color-sage); border-radius: 16px; }
  .small-label, legend { font-size: .85rem; font-weight: 650; color: var(--color-plum); }
  h2 { font-size: clamp(1.75rem, 3vw, 2.6rem); font-weight: 650; letter-spacing: -.035em; margin: .6rem 0 1rem; line-height: 1.1; }
  .description { font-size: clamp(1.15rem, 2vw, 1.55rem); line-height: 1.4; }
  .note { max-width: 70ch; margin: 1rem 0 1.5rem; font-size: .875rem; line-height: 1.6; }
  fieldset { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; border: 0; padding: 0; margin: 0; }
  legend { margin-bottom: .7rem; }
  label { display: flex; align-items: center; gap: .55rem; min-height: 44px; cursor: pointer; }
  input { accent-color: var(--color-plum); width: 17px; height: 17px; }
  .steps { display: grid; grid-template-columns: repeat(6, 1fr); margin: 1.8rem 0; padding: 0; list-style: none; gap: .5rem; }
  .steps li { border-top: 3px solid #a9b49b; padding-top: .75rem; font-size: .9rem; transition: border-color 180ms ease; }
  .steps li.reached { border-color: var(--color-plum); }
  .steps li[aria-current] { font-weight: 700; color: var(--color-plum); }
  .steps span { display: block; font-size: .75rem; margin-bottom: .3rem; }
  .state-comparison { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; border-block: 1px solid #a9b49b; padding: 1.5rem 0; }
  h3 { font-weight: 650; margin-bottom: 1rem; }
  ul { list-style: none; padding: 0; margin: 0; }
  li, .state-comparison p { line-height: 1.6; }
  ul li { display: flex; flex-wrap: wrap; justify-content: space-between; column-gap: .5rem; padding: .25rem 0; font-size: .95rem; }
  strong { font-weight: 550; }
  .outcome { color: var(--color-plum); font-weight: 600; }
  .explanation { min-height: 5.5em; max-width: 80ch; margin: 1.5rem 0; line-height: 1.6; }
  .controls { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
  .controls span { margin-left: auto; font-size: .85rem; }
  button { cursor: pointer; }
  button:disabled { opacity: .55; cursor: default; }
  .reset { text-decoration: underline; text-underline-offset: 4px; min-height: 48px; padding: 0 .5rem; }
  @media (max-width: 600px) { .steps { grid-template-columns: repeat(3, 1fr); row-gap: 1rem; } .state-comparison { grid-template-columns: 1fr; gap: 1.5rem; } .explanation { min-height: 0; } }
  @media (prefers-reduced-motion: reduce) { .steps li, button { transition: none; transform: none; } }
</style>
