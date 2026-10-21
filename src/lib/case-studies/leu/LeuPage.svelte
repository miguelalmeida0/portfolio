<svelte:options preserveWhitespace={true}/>
<script>
import NextProject from '../shared/NextProject.svelte';
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
import PlatformShowcase from './PlatformShowcase.svelte';
import CaseOverview from '../shared/CaseOverview.svelte';
import CaseRole from '../shared/CaseRole.svelte';
import '../shared/case-artifact.css';
import { chapterTitles } from "$lib/motion/actions/chapterTitles";import {onMount} from 'svelte';import ProductNav from '../shared/ProductNav.svelte';import LeuReader from './LeuReader.svelte';import ExtractionCompare from './ExtractionCompare.svelte';import DependencyChain from './DependencyChain.svelte';import VersionCompare from './VersionCompare.svelte';import ResultsBento from './ResultsBento.svelte';import EngineeringDetail from './EngineeringDetail.svelte';import ClosingState from './ClosingState.svelte';import {createLearner} from './learner.svelte';import './leu.css';const learner=createLearner();onMount(()=>learner.destroy);</script>
<div use:chapterTitles class="cs-leu"><ProductNav name="Leu" slug="leu" links={[['overview','Overview'],['source','Source'],['architecture','Architecture'],['results','Results'],['engineering','Engineering']]}/><main class="wrap" id="main"><section class="hero" id="overview" aria-labelledby="hero-h"><div class="case-pitch"><p class="kicker">Leu, a PDF reader for iPhone and the web</p><h1 id="hero-h">Read a passage. Work through a question.</h1><p class="sub" data-ask-id="project-leu">Select text in a PDF, answer a question about it and return to the original passage when you need to check your understanding.</p><CaseRole slug="leu" /><div class="ctas"><a class="btn primary" data-circle-fill href="#platforms"><CircleFill label="See both versions" /></a><a class="tlink" href="#architecture">How it’s built</a></div></div><CaseOverview slug="leu"/></section><PlatformShowcase/><div class="showcase-bridge"><p>Questions and feedback link to the passage they came from, so you can check them against the text.</p><a class="btn primary" data-circle-fill href="#try"><CircleFill label="Try the learning example" /></a></div><LeuReader {learner}/><p class="cap">A web model of Leu's loop with prepared answers.</p><ExtractionCompare/><DependencyChain {learner}/><VersionCompare/><ResultsBento/><EngineeringDetail/><ClosingState {learner}/><NextProject slug="leu"/></main></div>

<style>
  .showcase-bridge { display: flex; justify-content: space-between; align-items: center; gap: 28px; margin: 0 0 32px; }
  .showcase-bridge p { max-width: 62ch; color: var(--muted); margin: 0; }
  .showcase-bridge a { flex-shrink: 0; }
  @media (max-width: 700px) { .showcase-bridge { flex-direction: column; align-items: flex-start; gap: 18px; } }
</style>
