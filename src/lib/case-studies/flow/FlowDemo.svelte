<svelte:options preserveWhitespace={true} />
<script>
import {onMount} from 'svelte';import Conversation from './Conversation.svelte';import CalendarBoard from './CalendarBoard.svelte';import PipelineRail from './PipelineRail.svelte';let {demo}=$props();let element;onMount(()=>demo.mount(element));
</script>
<section class="chapter" id="try" bind:this={element} aria-labelledby="try-h">
    <div class="head">
      <h2 id="try-h">Nothing changes until you say yes.</h2>
      <p>Pick a command and watch it move through the action pipeline. Click Today or Tomorrow to change the context the same words resolve against.</p>
    </div>
    <div class="frame" id="demoStage"><div class="window">
      <div class="demo" id="demo">
        <Conversation {demo}/>
        <CalendarBoard {demo}/>
        <PipelineRail {demo}/>
        <svg class="lines" id="lines" aria-hidden="true">{#each demo.ui.lines as d}<path {d}/>{/each}</svg>
      </div>
    </div></div>
  </section>
