const H = (h, m = 0) => h * 60 + m;
const fmt = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
const span = o => fmt(o.start) + '-' + fmt(o.end);
const DAYS = ['Today', 'Tomorrow'];
const VIEW_START = H(8), VIEW_END = H(21), DAY_MIN = H(7), DAY_MAX = H(22);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const SEED = [
  {id:'standup', title:'Standup', day:0, start:H(9,30), end:H(9,45), kind:'meeting'},
  {id:'review', title:'Design review', day:0, start:H(10), end:H(11), kind:'meeting'},
  {id:'sarah', title:'1:1 with Sarah', day:0, start:H(11,15), end:H(11,45), kind:'meeting'},
  {id:'lunch0', title:'Lunch', day:0, start:H(12,30), end:H(13,15), kind:'meal'},
  {id:'planning', title:'Q3 planning', day:0, start:H(14,30), end:H(15,30), kind:'meeting'},
  {id:'dentist', title:'Dentist', day:0, start:H(16,30), end:H(17,15), kind:'appointment'},
  {id:'gym', title:'Gym', day:0, start:H(18), end:H(19), kind:'personal', protected:true},
  {id:'flight', title:'Flight BER → LIS', day:1, start:H(8,10), end:H(10,40), kind:'travel', protected:true},
  {id:'lunch1', title:'Lunch', day:1, start:H(13), end:H(13,45), kind:'meal'},
  {id:'dinner', title:'Dinner with Ana', day:1, start:H(19,30), end:H(21), kind:'personal'}
];
const cloneDoc = d => d.map(e => ({...e}));
const byId = (d, id) => d.find(e => e.id === id);

/* ---------- scenarios: interpretation output is scripted, everything after it is computed ---------- */
const COMPOUND_OPS = [
  {kind:'move', target:{title:'design review'}, to:{after:{title:'lunch'}}},
  {kind:'shift', target:{title:'planning'}, by:30},
  {kind:'keep', target:{title:'gym'}}
];
const SCENARIOS = [
  {key:'compound', label:'Compound', say:'Move the design review after lunch, push planning by 30 minutes, and keep the gym fixed.', norm:'move [design review] after [lunch]\nshift [planning] +30m\nkeep [gym]', intent:'2 operations, 1 constraint', ops:COMPOUND_OPS},
  {key:'clean', label:'Clean', say:'Move design review to 1:30pm.', norm:'move [design review] to 13:30', intent:'1 operation', ops:[{kind:'move', target:{title:'design review'}, to:{at:H(13,30)}}]},
  {key:'ambiguous', label:'Ambiguous', say:'Move the meeting 30 minutes later.', phrase:'the meeting', norm:'shift [the meeting] +30m', intent:'1 operation, unresolved reference', ops:[{kind:'shift', target:{kind:'meeting', phrase:'the meeting'}, by:30}]},
  {key:'conflict', label:'Conflict', say:'Move lunch to 2pm.', norm:'move [lunch] to 14:00', intent:'1 operation', ops:[{kind:'move', target:{title:'lunch'}, to:{at:H(14)}}]},
  {key:'protected', label:'Protected', say:'Delete my flight.', norm:'delete [flight]', intent:'1 destructive operation', ops:[{kind:'delete', target:{title:'flight'}}]},
  {key:'except', label:'Exclusion', say:'Push everything after lunch by an hour except the dentist.', norm:'shift [all after lunch] +60m\nexcept [dentist]', intent:'batch operation, 1 exclusion', ops:[{kind:'shiftAfter', after:{title:'lunch'}, by:60, except:[{title:'dentist'}]}]},
  {key:'correction', label:'Correction', say:'Move lunch to 1:30pm.', norm:'move [lunch] to 13:30', intent:'1 operation', ops:[{kind:'move', target:{title:'lunch'}, to:{at:H(13,30)}}], correction:true}
];


function matches(e, ref){
  if (ref.title && !e.title.toLowerCase().includes(ref.title)) return false;
  if (ref.kind && e.kind !== ref.kind) return false;
  return true;
}
function lookup(doc, ref, ctx, sameDay){
  if (ref.id){ const e = byId(doc, ref.id); return {list: e ? [e] : [], via:'chosen by you'}; }
  if (sameDay !== undefined) return {list: doc.filter(e => e.day === sameDay && matches(e, ref)), via:'same day as target'};
  if (ctx.dayOverride !== undefined) return {list: doc.filter(e => e.day === ctx.dayOverride && matches(e, ref)), via: DAYS[ctx.dayOverride] + ', from correction'};
  const local = doc.filter(e => e.day === ctx.activeDay && matches(e, ref));
  if (local.length) return {list: local, via: DAYS[ctx.activeDay] + ', active day'};
  return {list: doc.filter(e => matches(e, ref)), via:'not on active day, searched all days'};
}
const refName = r => r.phrase || r.title || r.kind;
function resolve(doc, ops, ctx){
  const out = [], notes = [];
  for (let i = 0; i < ops.length; i++){
    const op = ops[i];
    if (op.kind === 'shiftAfter'){
      const a = lookup(doc, op.after, ctx);
      if (a.list.length !== 1) return {status:'none', phrase: refName(op.after)};
      const anchor = a.list[0];
      notes.push(`“after ${refName(op.after)}” → ends ${fmt(anchor.end)}, ${DAYS[anchor.day]}`);
      const exc = [...ctx.leaveOut];
      (op.except || []).forEach(x => {
        const r = lookup(doc, x, ctx, anchor.day);
        r.list.forEach(e => exc.push(e.id));
        notes.push(`except “${refName(x)}” → ${r.list.map(e => e.title).join(', ') || 'nothing'}`);
      });
      const targets = doc.filter(e => e.day === anchor.day && e.start >= anchor.end && !exc.includes(e.id));
      targets.forEach(t => out.push({kind:'shift', id:t.id, by:op.by}));
      notes.push(`selected → ${targets.map(t => t.title).join(', ') || 'nothing'}`);
      continue;
    }
    const ref = ctx.bindings[i] ? {id: ctx.bindings[i]} : op.target;
    const r = lookup(doc, ref, ctx);
    if (r.list.length === 0) return {status:'none', phrase: refName(op.target)};
    if (r.list.length > 1) return {status:'clarify', index:i, phrase: refName(op.target), candidates: r.list};
    const t = r.list[0];
    notes.push(`“${refName(op.target)}” → ${t.title} ${span(t)}, ${r.via}`);
    if (op.kind === 'move'){
      let start;
      if (op.to.at !== undefined) start = op.to.at;
      else {
        const a = lookup(doc, op.to.after, ctx, t.day);
        if (a.list.length !== 1) return {status:'none', phrase: refName(op.to.after)};
        start = a.list[0].end;
        notes.push(`“after ${refName(op.to.after)}” → ${fmt(start)}, ${a.via}`);
      }
      out.push({kind:'move', id:t.id, start});
    } else if (op.kind === 'shift') out.push({kind:'shift', id:t.id, by:op.by});
    else if (op.kind === 'delete') out.push({kind:'delete', id:t.id});
    else if (op.kind === 'keep') out.push({kind:'keep', id:t.id});
  }
  ctx.extra.forEach(x => out.push(x));
  return {status:'resolved', ops:out, notes};
}
function transform(doc, rops, failSecond){
  const draft = cloneDoc(doc), changes = [];
  let m = 0;
  rops.forEach(op => {
    if (op.kind === 'keep') return;
    m++;
    if (failSecond && m === 2) throw new Error('Operation 2 (' + op.kind + ' ' + byId(draft, op.id).title + ') failed');
    const e = byId(draft, op.id);
    const before = {start:e.start, end:e.end};
    if (op.kind === 'move'){ const d = e.end - e.start; e.start = op.start; e.end = op.start + d; }
    if (op.kind === 'shift'){ e.start += op.by; e.end += op.by; }
    if (op.kind === 'resize'){ e.end = op.end; }
    if (op.kind === 'delete'){ e.deleted = true; }
    const ex = changes.find(c => c.id === op.id);
    const after = e.deleted ? null : {start:e.start, end:e.end};
    if (ex) ex.after = after; else changes.push({id:op.id, title:e.title, day:e.day, before, after});
  });
  return {draft: draft.filter(e => !e.deleted), changes, mutations:m};
}
function validate(doc, draft, changes, rops, ctx){
  const keep = rops.filter(o => o.kind === 'keep').map(o => o.id);
  for (const c of changes) if (keep.includes(c.id)) return {status:'reject', msg:`${c.title} is marked fixed in this command.`};
  const prot = changes.filter(c => byId(doc, c.id).protected && !ctx.approved.includes(c.id));
  if (prot.length) return {status:'protected', items:prot};
  for (const c of changes){
    if (!c.after) continue;
    if (c.after.start < DAY_MIN || c.after.end > DAY_MAX) return {status:'reject', msg:`${c.title} would end outside the day.`};
    const clash = draft.find(e => e.id !== c.id && e.day === c.day && e.start < c.after.end && c.after.start < e.end);
    if (clash) return {status:'conflict', change:c, clash};
  }
  const checks = ['no overlaps'];
  keep.forEach(id => checks.push(byId(doc, id).title + ' unchanged'));
  changes.forEach(c => { if (byId(doc, c.id).protected) checks.push(c.title + ' approved'); });
  return {status:'ok', checks};
}
const describe = c => c.after ? `${c.title} ${span(c.before)} → ${span(c.after)}` : `delete ${c.title} (${span(c.before)})`;
function prettyOp(op){
  switch (op.kind){
    case 'move': return `move   target:"${refName(op.target)}"\n       to:${op.to.at !== undefined ? fmt(op.to.at) : 'after("' + refName(op.to.after) + '")'}`;
    case 'shift': return `shift  target:"${refName(op.target)}" by:+${op.by}m`;
    case 'shiftAfter': return `shift  select:after("${refName(op.after)}") by:+${op.by}m\n       except:[${op.except.map(x => '"' + refName(x) + '"').join(', ')}]`;
    case 'delete': return `delete target:"${refName(op.target)}"`;
    case 'keep': return `keep   target:"${refName(op.target)}"  (constraint)`;
  }
}


export { H, fmt, span, DAYS, VIEW_START, VIEW_END, DAY_MIN, DAY_MAX, SEED, cloneDoc, byId, COMPOUND_OPS, SCENARIOS, matches, lookup, refName, resolve, transform, validate, describe, prettyOp, esc };
