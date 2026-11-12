import {timeline} from './timeline.js';

export function f24(stage) {
  stage.innerHTML = `<div class="cm-system">
    <div class="cm-system-row"><span class="cm-label">Form values</span><div class="cm-state-box"><label for="cm-incident-title">Incident title</label><input id="cm-incident-title" aria-label="Demo incident title" value="Service interruption" maxlength="70" autocomplete="off"><i class="cm-preserved"></i></div><span class="cm-state-note">Your edits stay here.</span></div>
    <div class="cm-system-row"><span class="cm-label">Request state</span><div class="cm-state-box"><small>Save changes</small><div class="cm-status-stack" aria-hidden="true"><span class="cm-status-initial">Sending request</span><span class="cm-status-failed">Failed · draft preserved</span><span class="cm-status-retry">Retrying request</span><span class="cm-status-saved">Saved</span></div></div><div class="cm-request-rail"><i class="cm-request-packet"></i></div></div>
    <div class="cm-system-row"><span class="cm-label">View state</span><div class="cm-state-box"><small>Incident form</small><strong>Ready to continue</strong></div><div class="cm-result-stack" aria-hidden="true"><p class="cm-failure">Save failed.<br>Your edits are safe.</p><p class="cm-success">Changes saved.</p></div></div>
  </div>`;
  const motion = timeline(stage, 8000);
  motion.add('.cm-preserved', [{transform:'scaleX(0)'}, {transform:'scaleX(1)'}], 450, 650);
  motion.add('.cm-request-packet', [
    {offset:0,left:'0%',background:'#243d31'},
    {offset:.0875,left:'0%',background:'#243d31'},
    {offset:.225,left:'calc(100% - 14px)',background:'#243d31'},
    {offset:.2625,left:'calc(100% - 14px)',background:'#bb4030'},
    {offset:.35625,left:'calc(100% - 14px)',background:'#bb4030'},
    {offset:.45,left:'0%',background:'#bb4030'},
    {offset:.55,left:'0%',background:'#bb4030'},
    {offset:.6625,left:'calc(100% - 14px)',background:'#243d31'},
    {offset:1,left:'calc(100% - 14px)',background:'#243d31'}
  ],0,8000,'linear');
  const show = (selector, start, end = 8001) => {
    const frames = [{offset:0,opacity:0},{offset:start/8000,opacity:0},{offset:(start+1)/8000,opacity:1}];
    if (end < 8000) frames.push({offset:end/8000,opacity:1},{offset:(end+1)/8000,opacity:0});
    frames.push({offset:1,opacity:end < 8000 ? 0 : 1});
    motion.add(selector, frames, 0, 8000, 'linear');
  };
  motion.add('.cm-status-initial', [{opacity:1},{opacity:0}], 2100, 1);
  show('.cm-status-failed',2100,4400);show('.cm-status-retry',4400,5400);show('.cm-status-saved',5400);
  show('.cm-failure',2100,4400);show('.cm-success',5400);
  return {motion, describe: time => time < 2101 ? 'Sending request. Your edits are preserved.' : time < 4401 ? 'Save failed. Your edits are safe.' : time < 5401 ? 'Retrying request. Your edits are preserved.' : 'Changes saved. Your edits are preserved.', actions:[{label:'Replay failed save', run:() => motion.seek(2101)}, {label:'Retry save', run:() => motion.seek(4401)}]};
}
