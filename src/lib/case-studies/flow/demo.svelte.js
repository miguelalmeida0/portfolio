import { flushSync } from 'svelte';
import { lifecycle } from '../shared/lifecycle';
import { inlineContent } from '../shared/content';
import { SEED, SCENARIOS, cloneDoc, byId, DAYS, VIEW_START, VIEW_END, fmt, span, esc, resolve, transform, validate, describe, prettyOp } from './engine';
export const topPct = m => ((m - VIEW_START) / (VIEW_END - VIEW_START) * 100);
export function newCtx(active){ return {bindings:{}, extra:[], approved:[], leaveOut:[], dayOverride:undefined, activeDay:active}; }
export function createDemo() {
 const life = lifecycle(), reduce = life.reduce;
 const wait = ms => new Promise(r => life.later(r, reduce.matches ? 0 : ms));
 let root; const query = selector => root?.querySelector(selector); let serial = 0;
 const S = $state({doc: cloneDoc(SEED), activeDay:0, history:[], future:[], pending:null, busy:false, turn:null, pid:0});
 const ui = $state({messages:[], replies:[], selected:null, failSecond:false, empty:'Each command runs through the pipeline before anything on the calendar changes.', stages:Object.fromEntries(['1','2','3','4','5','6','gate','7','8'].map(k=>[k,{state:'idle',output:''}])), events:cloneDoc(SEED), trails:[], candidates:[], lines:[], rewinding:false, flash:false});
 function setStage(k, state, output){ ui.stages[k].state=state; if(output!==undefined)ui.stages[k].output=output; }
 function resetStages(){Object.keys(ui.stages).forEach(k=>setStage(k,'idle',''));}
 function say(who, content){ const message={id:++serial,who,content,nodes:inlineContent(content),stale:false}; ui.messages.push(message); flushSync(); const log=query('#log'); if(log)log.scrollTop=log.scrollHeight; return message; }
 function setReplies(items){ui.replies=items;}
 function setBusy(value){S.busy=value;}
 function drawGhosts(){}
 function renderCal(opts={}){
   const old=ui.events;
   if(opts.trails&&!reduce.matches) for(const e of S.doc){const before=old.find(x=>x.id===e.id); if(before&&Math.abs(Number((topPct(before.start)/100).toFixed(5))-topPct(e.start)/100)>1e-4){const id=++serial;ui.trails.push({id,day:e.day,start:Number((topPct(before.start)/100).toFixed(5))*100,height:Number(((before.end-before.start)/(VIEW_END-VIEW_START)).toFixed(5))*100});life.later(()=>ui.trails=ui.trails.filter(t=>t.id!==id),700);}}
   const removed=old.filter(e=>!S.doc.some(x=>x.id===e.id)).map(e=>({...e,gone:true}));
   ui.events=S.doc.map(e=>({...e,new:!old.some(x=>x.id===e.id)})).concat(removed);
   life.frame(()=>life.frame(()=>ui.events.forEach(e=>e.new=false)));
   if(removed.length)life.later(()=>ui.events=ui.events.filter(e=>!e.gone),reduce.matches?0:380);
 }
 let lineTargets=null;
 function drawLines(){
   ui.lines=[]; flushSync(); if(!lineTargets||!root)return;
   const box=query('#demo').getBoundingClientRect(),mark=lineTargets.mark.getBoundingClientRect(); if(!mark.width)return;
   const bub=lineTargets.mark.closest('li')||lineTargets.mark;
   const x1=Math.max(mark.right,bub.getBoundingClientRect().right)-box.left,y1=mark.top+mark.height/2-box.top;
   lineTargets.ids.forEach(id=>{const el=query('.ev[data-id="'+id+'"]');if(!el||!el.offsetParent)return;const r=el.getBoundingClientRect(),x2=r.left-box.left,y2=r.top+r.height/2-box.top;
     ui.lines.push(x2<x1+20 ? `M${mark.left-box.left+mark.width/2},${mark.bottom-box.top} C${mark.left-box.left+mark.width/2},${(y1+y2)/2} ${r.left-box.left+20},${(y1+y2)/2} ${r.left-box.left+20},${r.top-box.top}` : `M${x1+4},${y1} C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2-2},${y2}`);
   });
   flushSync();
 }
 function setLines(mark,ids){lineTargets=mark?{mark,ids}:null;ui.candidates=ids??[];flushSync();drawLines();}
function userLine(sc){
  if (sc.phrase){ return esc(sc.say).replace(esc(sc.phrase), `<mark>${esc(sc.phrase)}</mark>`); }
  return esc(sc.say);
}
function startScenario(sc){
  if (S.busy) return;
  if (S.pending){ say('sys', `<span class="stale"><span class="pid">P${S.pending.pid}</span> dropped</span> A new request replaced it.`); S.pending = null; drawGhosts(); }
  setLines(null);
  ui.selected = sc.key;
  S.turn = {sc, ctx:newCtx(S.activeDay), youEl:null};
  S.turn.youEl = say('you', userLine(sc));
  setReplies([]);
  run(1);
}
async function run(from){
  const T = S.turn, sc = T.sc;
  setBusy(true);
  if (from <= 1){
    resetStages();
    setStage(1, 'active'); await wait(240); setStage(1, 'done', sc.norm);
    setStage(2, 'active'); await wait(240); setStage(2, 'done', sc.intent);
    setStage(3, 'active'); await wait(260); setStage(3, 'done', sc.ops.map(prettyOp).join('\n'));
  } else {
    ['4','5','6','gate','7','8'].forEach(k => { if (k >= from || k === 'gate') setStage(k, 'idle', ''); });
  }
  T.ctx.activeDay = S.activeDay;
  setStage(4, 'active'); await wait(320);
  const r = resolve(S.doc, sc.ops, T.ctx);
  if (r.status === 'none'){
    setStage(4, 'blocked', `“${r.phrase}” → no match`);
    say('flow', `I can't find anything matching “${esc(r.phrase)}”. Nothing changed.`);
    return setBusy(false);
  }
  if (r.status === 'clarify'){
    setStage(4, 'blocked', `“${r.phrase}” → ${r.candidates.length} candidates\nwaiting for you`);
    say('flow', `Which ${esc(r.phrase.replace(/^the /, ''))}? I found ${r.candidates.length} on ${DAYS[r.candidates[0].day].toLowerCase()}.`);
    const bubble = query('[data-message="' + T.youEl.id + '"]'); const mark = bubble.querySelector('mark') || bubble;
    setLines(mark, r.candidates.map(c => c.id));
    setReplies(r.candidates.map(c => ({label:`${c.title}, ${fmt(c.start)}`, run:() => {
      T.ctx.bindings[r.index] = c.id;
      say('you', `The ${esc(c.title)}.`);
      setLines(null); setReplies([]);
      run(4);
    }})).concat([{label:'Never mind', run:() => { setLines(null); say('you','Never mind.'); say('flow','Okay. Nothing changed.'); setReplies([]); setStage(4,'failed','cancelled by you'); }}]));
    return setBusy(false);
  }
  setStage(4, 'done', r.notes.join('\n'));
  setStage(5, 'active'); await wait(320);
  let tr;
  const failOn = ui.failSecond;
  try { tr = transform(S.doc, r.ops, failOn); }
  catch (err){
    setStage(5, 'failed', err.message + '\ndraft discarded, 0 changes applied');
    say('flow', `That didn't go through. ${esc(err.message)}, so the whole request was rejected. Your calendar is exactly as it was.`);
    flashAll();
    return setBusy(false);
  }
  const failNote = failOn && tr.mutations < 2 ? '\n(only one operation, nothing to fail)' : '';
  setStage(5, 'done', tr.changes.length ? tr.changes.map(describe).join('\n') + failNote : 'no changes');
  setStage(6, 'active'); await wait(320);
  const v = validate(S.doc, tr.draft, tr.changes, r.ops, T.ctx);
  if (v.status === 'reject'){ setStage(6, 'failed', v.msg); say('flow', esc(v.msg) + ' Nothing changed.'); return setBusy(false); }
  if (v.status === 'conflict'){
    const {change:c, clash} = v;
    setStage(6, 'blocked', `${c.title} ${span(c.after)} overlaps\n${clash.title} ${span(clash)}`);
    say('flow', `${esc(c.title)} at ${span(c.after)} would overlap <b>${esc(clash.title)}</b> (${span(clash)}).`);
    const opts = [];
    if (clash.start > c.after.start && clash.start - c.after.start >= 15){
      const end = clash.start;
      opts.push({label:`Shorten to ${fmt(c.after.start)}-${fmt(end)}`, cls:'primary', run:() => {
        say('you', `Shorten it to end at ${fmt(end)}.`); setReplies([]);
        T.ctx.extra.push({kind:'resize', id:c.id, end}); run(4);
      }});
    }
    opts.push({label:'Leave it', run:() => { say('you','Leave it.'); say('flow','Okay. Nothing changed.'); setReplies([]); setStage(6,'failed','cancelled by you'); }});
    setReplies(opts);
    return setBusy(false);
  }
  if (v.status === 'protected'){
    const names = v.items.map(i => i.title).join(', ');
    setStage(6, 'blocked', `protected: ${names}\nneeds explicit approval`);
    const verb = v.items.some(i => !i.after) ? 'Deleting' : 'Changing';
    say('flow', `<b>${esc(names)}</b> is protected. ${verb} it needs your explicit approval${tr.changes.length > v.items.length ? `. The rest of the request can go ahead without it` : ''}.`);
    const opts = [{label:`Approve ${verb.toLowerCase()} ${names}`, cls:'danger', run:() => {
      say('you', `Yes, ${verb.toLowerCase()} ${esc(names)} is intended.`); setReplies([]);
      v.items.forEach(i => T.ctx.approved.push(i.id)); run(4);
    }}];
    if (tr.changes.length > v.items.length){
      opts.unshift({label:`Leave ${names} in place`, cls:'primary', run:() => {
        say('you', `Leave ${esc(names)} where it is.`); setReplies([]);
        v.items.forEach(i => T.ctx.leaveOut.push(i.id)); run(4);
      }});
    } else opts.push({label:'Cancel', run:() => { say('you','Cancel.'); say('flow','Cancelled. Nothing changed.'); setReplies([]); setStage(6,'failed','cancelled by you'); }});
    setReplies(opts);
    return setBusy(false);
  }
  setStage(6, 'done', v.checks.join('\n'));
  S.pid += 1;
  S.pending = {pid:S.pid, changes:tr.changes, draft:tr.draft, label:sc.say};
  setStage('gate', 'blocked', `P${S.pid} · ${tr.changes.length} change${tr.changes.length === 1 ? '' : 's'}\nawaiting confirmation`);
  drawGhosts();
  say('flow', `<span class="pid">P${S.pid}</span> ${tr.changes.map(c => esc(describe(c))).join('; ')}. Go ahead?`);
  const opts = [
    {label:'Yes', cls:'primary', run:() => confirm(S.pending.pid)},
    {label:'Cancel', run:() => cancel()}
  ];
  if (sc.correction && T.ctx.dayOverride === undefined){
    const other = S.activeDay === 0 ? 1 : 0;
    opts.splice(1, 0, {label:`No, I meant ${DAYS[other].toLowerCase()}`, run:() => correct(other)});
  }
  setReplies(opts);
  setBusy(false);
}
function flashAll(){ if (life.reduce.matches) return; ui.flash = true; life.later(() => ui.flash = false, 600); }
function correct(day){
  const old = S.pending;
  say('you', `No, I meant ${DAYS[day].toLowerCase()}.`);
  ui.messages.forEach(m => { if (m.who === 'flow' && m.content.includes(`>P${old.pid}<`)) m.stale = true; });
  say('sys', `<span class="pid">P${old.pid}</span> superseded. A “yes” now binds to the next proposal only`);
  S.pending = null; drawGhosts(); setReplies([]);
  S.turn.ctx.dayOverride = day;
  setStage(3, 'done', S.turn.sc.ops.map(prettyOp).join('\n') + `\n+ date:${DAYS[day].toLowerCase()} (correction)`);
  run(4);
}
async function confirm(pid){
  if (!S.pending || S.pending.pid !== pid){ say('flow', 'That approval belonged to a proposal that no longer exists. Nothing changed.'); return; }
  const P = S.pending;
  say('you', 'Yes.'); setReplies([]); setBusy(true);
  setStage('gate', 'done', `P${pid} confirmed`);
  setStage(7, 'active'); await wait(300);
  const before = S.doc;
  S.doc = P.draft; S.pending = null;
  S.history.push({pid, before, after:S.doc, changes:P.changes, label:P.label}); S.future = [];
  setStage(7, 'done', `P${pid}: ${P.changes.length} change${P.changes.length === 1 ? '' : 's'} in one write`);
  renderCal();
  setStage(8, 'active'); await wait(420);
  const ok = P.changes.every(c => c.after ? (byId(S.doc, c.id) && byId(S.doc, c.id).start === c.after.start && byId(S.doc, c.id).end === c.after.end) : !byId(S.doc, c.id));
  setStage(8, ok ? 'done' : 'failed', `revision ${S.history.length} · ${ok ? 'verified against proposal' : 'mismatch'}\nundo available`);
  say('flow', `Done. ${P.changes.length === 1 ? 'One change' : P.changes.length + ' changes'} applied together.`);
  setBusy(false);
}
function cancel(){
  say('you', 'Actually, cancel that.');
  if (S.pending) setStage('gate', 'failed', `P${S.pending.pid} cancelled`);
  S.pending = null; drawGhosts(); setReplies([]);
  say('flow', 'Cancelled. Nothing changed.');
}
function undo(){
  if (!S.history.length || S.busy) return;
  if (S.pending){ S.pending = null; setReplies([]); }
  const h = S.history.pop(); S.future.push(h); S.doc = h.before;
  rewind();
  say('flow', `Undid <span class="pid">P${h.pid}</span> as one step: ${h.changes.map(c => esc(c.title)).join(', ')} restored.`);
  setBusy(false);
}
function redo(){
  if (!S.future.length || S.busy) return;
  const h = S.future.pop(); S.history.push(h); S.doc = h.after;
  rewind();
  say('flow', `Redid <span class="pid">P${h.pid}</span>.`);
  setBusy(false);
}
function rewind(){
  ui.rewinding = true;
  renderCal({trails:true});
  life.later(() => ui.rewinding = false, 650);
}
function whatChanged(){
  if (!S.history.length) return;
  say('you', 'What changed?');
  const items = S.history.slice(-3).reverse().map(h => `<span class="pid">P${h.pid}</span> ${h.changes.map(c => esc(describe(c))).join('; ')}`);
  say('flow', items.join('<br>'));
}
function resetDay(){
  if (S.busy) return;
  S.doc = cloneDoc(SEED); S.history = []; S.future = []; S.pending = null; S.pid = 0; S.turn = null;
  setLines(null); setReplies([]); resetStages();
  ui.messages = []; ui.empty = 'Day reset. Pick a command.';
  ui.selected = null;
  renderCal(); setBusy(false);
}
function setActive(d){ S.activeDay = d; life.frame(drawLines); }


 return {S,ui,startScenario,undo,redo,whatChanged,resetDay,setActive,launch(key){if(S.busy)return;life.later(()=>{if(!S.busy)startScenario(SCENARIOS.find(s=>s.key===key));},life.reduce.matches?0:500);},mount(element){root=element;life.observe(new ResizeObserver(drawLines),[query('#demo')]);life.listen(window,'resize',drawLines);life.listen(window,'keydown',e=>{if(!(e.metaKey||e.ctrlKey)||e.key.toLowerCase()!=='z'||!query('#demo').contains(document.activeElement))return;e.preventDefault();e.shiftKey?redo():undo();});return life.destroy;}};
}
