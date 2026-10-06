<svelte:options preserveWhitespace={true} />
<script>
import CaseOverview from '../shared/CaseOverview.svelte';
import DesignDecisions from '../shared/DesignDecisions.svelte';
import { chapterTitles } from "$lib/motion/actions/chapterTitles";
import ProductNav from '../shared/ProductNav.svelte';import CommandHero from './CommandHero.svelte';import CapabilityBento from './CapabilityBento.svelte';import FlowDemo from './FlowDemo.svelte';import LatencyCompare from './LatencyCompare.svelte';import InvestigationStory from './InvestigationStory.svelte';import FlowSpecs from './FlowSpecs.svelte';import {createDemo} from './demo.svelte';import './flow.css';const demo=createDemo();
</script>
<div use:chapterTitles class="cs-flow"><ProductNav name="Flow" links={[['overview','Overview'],['design-rationale','Design'],['latency','Latency'],['engineering','Engineering'],['specs','Specs']]}/><main class="wrap" id="main"><section class="hero" id="overview" aria-labelledby="hero-h"><div class="case-pitch">
    <h1 id="hero-h">Change your plans. Keep control.</h1>
    <p class="sub">Move a meeting in your own words. Inspect the proposed change, then confirm or undo it.</p>
    <div class="ctas"><a class="btn primary" href="#try">Explore demo</a><a class="tlink" href="#engineering">How it's built</a></div>
  </div><CaseOverview slug="flow"/></section><CommandHero/><CapabilityBento {demo}/><FlowDemo {demo}/><LatencyCompare/><InvestigationStory/><FlowSpecs/><DesignDecisions slug="flow"/><nav class="next" aria-label="Next project"><span class="lbl">Next project</span><a href="/work/leu">Leu</a></nav></main></div>
