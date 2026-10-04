import { flushSync } from 'svelte';
import { lifecycle } from '../shared/lifecycle';
import { CONCEPTS, PASSAGES, VERDICT } from './data';
export function createLearner() {
  const life = lifecycle(); let timers = [];
  const learner = $state({model:Object.fromEntries(Object.keys(CONCEPTS).map(k=>[k,'unseen'])),passageResult:{},current:null,answerIndex:null,before:{},opened:Array(7).fill(false),flash:null,note:'Every step keeps a link to the passage it came from.'});
  function sequence(indices,delay=0){timers.forEach(life.cancel);timers=[];indices.forEach((i,k)=>{if(life.reduce.matches)learner.opened[i]=true;else timers.push(life.later(()=>learner.opened[i]=true,delay+k*170));});}
  learner.select=id=>{learner.current=PASSAGES.find(p=>p.id===id);learner.answerIndex=null;learner.opened=Array(7).fill(false);sequence([0,1,2,3,4]);learner.note='Pick an answer to see how it is judged.';flushSync();if(matchMedia('(max-width:960px)').matches)document.getElementById('trace-h').scrollIntoView({behavior:life.reduce.matches?'auto':'smooth',block:'start'});};
  learner.answer=k=>{const p=learner.current;if(!p)return;learner.answerIndex=k;learner.before={...learner.model};const state=VERDICT[p.answers[k].v].state;p.concepts.forEach(c=>learner.model[c]=state);learner.passageResult[p.id]=state;sequence([5,6],60);learner.note='Use “Show source” on any step to return to the exact passage.';};
  learner.clear=()=>{timers.forEach(life.cancel);learner.current=null;learner.answerIndex=null;learner.opened=Array(7).fill(false);learner.note='Every step keeps a link to the passage it came from.';};
  learner.source=()=>{if(!learner.current)return;const el=document.getElementById('psg-'+learner.current.id);learner.flash=null;flushSync();void el.offsetWidth;learner.flash=learner.current.id;el.scrollIntoView({behavior:life.reduce.matches?'auto':'smooth',block:'center'});el.focus({preventScroll:true});};
  learner.destroy=life.destroy;
  return learner;
}
