import {onMount, flushSync} from 'svelte';
import {lifecycle} from '../shared/lifecycle';
export function createWorkspace(){
  let life,root;
  const S=$state({controls:{voice:'lyrical',strength:'strong'},submitted:{voice:'lyrical',strength:'strong'},result:{settings:{voice:'lyrical',strength:'strong'},run:1},pending:null,failed:null,runs:1,view:'marked',fail:false,reveal:false,done:false});
  let revealTimer;
  onMount(()=>{life=lifecycle();return life.destroy;});
  async function submit(settings){
    if(S.pending)return;
    const snap={...settings};S.submitted={...snap};S.failed=null;S.runs++;S.pending={settings:snap,run:S.runs};
    await new Promise(r=>life.later(r,life.reduce.matches?0:900));
    if(S.fail){S.failed={settings:snap};S.pending=null;flushSync();root?.querySelector('#retry')?.focus({preventScroll:true});return;}
    const changed=S.result.settings.voice!==snap.voice||S.result.settings.strength!==snap.strength;
    S.result={settings:snap,run:S.pending.run};S.pending=null;
    if(changed&&!life.reduce.matches){S.reveal=false;flushSync();void root?.querySelector('#mv')?.offsetWidth;S.reveal=true;life.cancel(revealTimer);revealTimer=life.later(()=>S.reveal=false,2400);}
    S.done=false;flushSync();void root?.querySelector('#mvWrap')?.offsetWidth;S.done=true;
  }
  return {S,submit,mount:el=>root=el};
}
