<svelte:options preserveWhitespace={true} />
<script>
import NextProject from '../shared/NextProject.svelte';
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
import CaseOverview from '../shared/CaseOverview.svelte';
import CaseRole from '../shared/CaseRole.svelte';
import '../shared/case-artifact.css';
import { chapterTitles } from "$lib/motion/actions/chapterTitles";
import ProductNav from '../shared/ProductNav.svelte';import CommandHero from './CommandHero.svelte';import CapabilityBento from './CapabilityBento.svelte';import FlowDemo from './FlowDemo.svelte';import LatencyCompare from './LatencyCompare.svelte';import InvestigationStory from './InvestigationStory.svelte';import FlowSpecs from './FlowSpecs.svelte';import {createDemo} from './demo.svelte';import './flow.css';const demo=createDemo();
</script>
<div use:chapterTitles class="cs-flow"><ProductNav name="Flow" slug="flow" links={[['overview','Overview'],['latency','Latency'],['engineering','Engineering'],['specs','Specs']]}/><main class="wrap" id="main"><section class="hero" id="overview" aria-labelledby="hero-h"><div class="case-pitch">
    <p class="kicker">Flow, a voice-first personal interface</p>
    <h1 id="hero-h">Change your schedule by voice.</h1>
    <p class="sub">Ask Flow to move a meeting, review the proposed change, then confirm it. You can edit the result or undo it afterward.</p>
    <CaseRole slug="flow" /><div class="ctas"><a class="btn primary" data-circle-fill href="#try"><CircleFill label="Try the case demo" /></a><a class="tlink" href="#engineering">How it's built</a></div>
  </div><CaseOverview slug="flow"/></section><CommandHero/><CapabilityBento {demo}/><FlowDemo {demo}/><LatencyCompare/><InvestigationStory/><FlowSpecs/><NextProject slug="flow"/></main></div>
