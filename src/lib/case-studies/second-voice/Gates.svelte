<script>
import {onMount} from 'svelte';import {lifecycle} from '../shared/lifecycle';const GATES = ['Submit', 'Session', 'Allowance', 'Idempotency key', 'Validate input', 'Provider, 30 s deadline', 'Output schema', 'Persist result and usage', 'Result'];
const SCEN = [
  {k:'new', t:'Send a new request', s:'A fresh idempotency key.'},
  {k:'replay', t:'Replay the last request', s:'Refresh, network retry or double submit.'},
  {k:'timeout', t:'Provider times out', s:'No answer inside the deadline.'},
  {k:'schema', t:'Output fails the schema', s:'Text came back, product state did not.'},
  {k:'reset', t:'Reset', s:'Clear the operations.'}
];
let life;onMount(()=>{life=lifecycle();return life.destroy;});const wait=ms=>new Promise(r=>life.later(r,life.reduce.matches?0:ms));const G=$state({calls:0,day:3,ops:[],last:null,busy:false});let selected=$state(null),rail=$state(GATES.map(()=>({state:'idle',out:''}))),bumps=$state({day:false,calls:false});function resetRail(){rail=GATES.map(()=>({state:'idle',out:''}));}function setGate(i,state,out=''){rail[i]={state,out};}function bump(key){bumps[key]=true;life.later(()=>bumps[key]=false,life.reduce.matches?0:900);}async function runGate(k){
  if (G.busy) return;
  selected=k==='reset'?null:k;
  if (k === 'reset'){ G.calls = 0; G.day = 3; G.ops = []; G.last = null; resetRail();  return; }
  G.busy = true; resetRail();
  const step = async (i, s, out, ms = 240) => { setGate(i, 'active'); await wait(ms); setGate(i, s, out); };
  await step(0, 'done', k === 'replay' ? `Same key ${G.last.key} sent again` : 'Snapshot of draft, voice and strength');
  await step(1, 'done', 'GitHub session valid');
  if (k === 'replay'){
    await step(2, 'done', 'Not charged again');
    await step(3, 'reuse', `Key seen: ${G.last.key} is ${G.last.state}. No new model call.`);
    for (const i of [4, 5, 6, 7]) setGate(i, 'skipped', i === 5 ? 'Skipped' : '');
    await step(8, 'done', G.last.state === 'completed' ? 'Existing result returned' : 'Existing operation state returned');
    G.busy = false;  return;
  }
  if (G.day <= 0){
    await step(2, 'blocked', 'Daily allowance used: 3 per rolling day. Nothing sent to the provider.');
    for (const i of [3, 4, 5, 6, 7, 8]) setGate(i, 'skipped');
    G.busy = false;  return;
  }
  G.day -= 1; bump('day');
  await step(2, 'done', `${G.day} of 3 left today, 1 per rolling minute respected`);
  const key = `op-${101 + G.ops.length}`;
  G.ops.unshift({key,state:'reserved'}); const op=G.ops[0]; G.last=op;
  await step(3, 'done', `New key, ${key} reserved`);
  await step(4, 'done', 'Body matches the request schema');
  G.calls += 1; bump('calls');
  if (k === 'timeout'){
    await step(5, 'failed', 'No answer within 30 s. Request cancelled.', 420);
    setGate(6, 'skipped');
    op.state = 'ambiguous';
    await step(7, 'blocked', 'Kept reserved as ambiguous. It may have run.');
    await step(8, 'blocked', 'Not retried automatically. Previous rewrite kept.');
    G.busy = false;  return;
  }
  await step(5, 'done', '1 model call, answered inside the deadline', 420);
  if (k === 'schema'){
    await step(6, 'failed', 'Rejected. Generative output is untrusted input.');
    setGate(7, 'skipped', 'Nothing stored as a result');
    op.state = 'rejected';
    await step(8, 'failed', 'Error returned. Previous rewrite kept.');
    G.busy = false;  return;
  }
  await step(6, 'done', 'Structured output valid');
  op.state = 'completed';
  await step(7, 'done', 'Result and usage stored');
  await step(8, 'done', 'Rewrite returned to the workspace');
  G.busy = false;
}
</script>
  <section class="chapter" aria-labelledby="gates-h">
    <div class="head">
      <h2 id="gates-h">Behind Rewrite, the request has to earn a model call.</h2>
      <p>Generation costs real resources, so the server, not the button, decides. Run a request, then replay it: an operation that already exists never reaches the model twice.</p>
    </div>
    <div class="frame" id="gates"><div class="window">
      <div>
        <p class="label" id="scen-l">Send</p>
        <div class="scen" role="group" aria-labelledby="scen-l" id="scen">{#each SCEN as x}<button type="button" data-k={x.k} aria-pressed={selected===x.k} disabled={G.busy||(x.k==='replay'&&!G.last)} onclick={()=>runGate(x.k)}>{x.t}<small>{x.s}</small></button>{/each}</div>
        <p class="gate-note">Illustrative model of the release rules.</p>
      </div>
      <ol class="rail" id="gateRail" aria-live="polite">{#each GATES as gate,i}<li data-n={i+1} data-s={rail[i].state}><div class="nm">{gate}</div><p class="out">{rail[i].out}</p></li>{/each}</ol>
      <div class="gate-side">
        <div class="meters">
          <div class="meter-card" id="mCalls" class:bump={bumps.calls}><b>{G.calls}</b><span>Model calls</span></div>
          <div class="meter-card" id="mDay" class:bump={bumps.day}><b>{G.day}</b><span>Requests left today, per account</span></div>
          <div><p class="label" style="margin-top:6px">Operations</p><ul class="ops" id="ops">{#if G.ops.length}{#each G.ops as op}<li><span class="mono">{op.key}</span><span>{op.state}</span></li>{/each}{:else}<li><span>None yet</span></li>{/if}</ul></div>
        </div>
      </div>
    </div></div>
  </section>
