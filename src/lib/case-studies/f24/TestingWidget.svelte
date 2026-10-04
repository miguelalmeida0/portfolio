<script>
import {onMount,flushSync} from 'svelte';import RadioGroup from '../shared/RadioGroup.svelte';import {NETS,ASSERTS} from './data';import {lifecycle} from '../shared/lifecycle';let life,saveButton,server;let name=$state('Weekend practice'),net=$state('normal'),reqs=$state(0),pending=$state(false),result=$state(''),error=$state(false),bump=$state(false),assertions=$state({}),revealed=$state([]);onMount(()=>{life=lifecycle();return life.destroy;});async function save(times){if(pending)return;const before=reqs,snapshot=name,res={};for(let i=0;i<times;i++){if(pending)continue;pending=true;reqs++;flushSync();res.disabled=saveButton.disabled?'pass':'idle';}bump=true;life.later(()=>bump=false,700);error=false;result='Saving…';const sentBody={name:snapshot};await new Promise(r=>life.later(r,life.reduce.matches?0:net==='slow'?1600:600));if(net==='offline'){error=true;result="Couldn't save. You're offline. The name you typed is kept.";res.error=name===snapshot?'pass':'idle';res.persist='skip';}else{server={...sentBody};result=`Saved “${server.name}”.`;res.persist=server.name===name?'pass':'idle';res.error='skip';}pending=false;flushSync();saveButton.focus();res.once=reqs-before===1?'pass':'idle';res.sent=sentBody.name===snapshot?'pass':'idle';res.focus=document.activeElement===saveButton?'pass':'idle';if(times>1&&res.once==='pass')result='Two clicks, one request. '+result;assertions={};revealed=[];ASSERTS.forEach(([k],i)=>life.later(()=>{assertions[k]=res[k]||'idle';revealed.push(i);},life.reduce.matches?0:140*(i+1)));}
</script>
  <section class="chapter" aria-labelledby="test-h">
    <div class="head">
      <h2 id="test-h">Test consequences, not components.</h2>
      <p>A save button that looks right can still fire twice, send the wrong data or lose focus. Click Save, try a double click, or take the network away. The checks on the right run against this widget's own behaviour.</p>
    </div>
    <div class="frame" id="testing"><div class="window">
      <div class="tform">
        <div><label class="label" for="cfgName">Name</label><input id="cfgName" bind:value={name} autocomplete="off"></div>
        <div class="row"><span class="label" id="net-l" style="margin:0">Network</span><div class="seg" role="radiogroup" aria-labelledby="net-l" id="net"><RadioGroup items={NETS} value={net} onchange={v=>net=v}/></div></div>
        <div class="row"><button class="btn" type="button" id="tSave" bind:this={saveButton} disabled={pending} onclick={()=>save(1)}>Save</button><button class="tlink" type="button" id="tDouble" onclick={()=>save(2)}>Double-click Save</button></div>
        <p class="reqs">Requests sent: <b id="tReqs" class:bump>{reqs}</b></p>
        <p class="res" class:err={error} id="tRes" role="status" aria-live="polite">{result}</p>
      </div>
      <ol class="asserts" id="asserts" aria-label="What the test proves">{#each ASSERTS as [k,t,s],i}<li data-s={assertions[k]||'idle'} class:show={revealed.includes(i)}><span>{t}</span><small>{s}</small></li>{/each}</ol>
    </div></div>
  </section>
