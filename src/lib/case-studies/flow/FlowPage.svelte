<svelte:options preserveWhitespace={true} />
<script>
import ProductNav from '../shared/ProductNav.svelte';import CommandHero from './CommandHero.svelte';import CapabilityBento from './CapabilityBento.svelte';import FlowDemo from './FlowDemo.svelte';import LatencyCompare from './LatencyCompare.svelte';import InvestigationStory from './InvestigationStory.svelte';import FlowSpecs from './FlowSpecs.svelte';import {createDemo} from './demo.svelte';import './flow.css';const demo=createDemo();
</script>
<div class="cs-flow"><ProductNav name="Flow" links={[['overview','Overview'],['latency','Latency'],['engineering','Engineering'],['specs','Specs']]}/><main class="wrap" id="main"><section class="hero" id="overview" aria-labelledby="hero-h">
    <p class="kicker">Flow, a voice-first personal interface</p>
    <h1 id="hero-h">From speech to deterministic state.</h1>
    <p class="sub">Conversation controls your calendar and personal life. Every change is proposed, checked and reversible before it happens.</p>
    <div class="ctas"><a class="btn primary" href="#try">Try it</a><a class="tlink" href="#engineering">How it's built</a></div>
  </section><CommandHero/><CapabilityBento {demo}/><FlowDemo {demo}/><LatencyCompare/><InvestigationStory/><FlowSpecs/><nav class="next" aria-label="Next project"><span class="lbl">Next project</span><a href="/work/leu">Leu</a></nav></main></div>
