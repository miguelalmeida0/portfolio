<svelte:options preserveWhitespace={true}/>
<script>
import PlatformShowcase from './PlatformShowcase.svelte';
import '../shared/case-artifact.css';
import { chapterTitles } from "$lib/motion/actions/chapterTitles";import {onMount} from 'svelte';import ProductNav from '../shared/ProductNav.svelte';import LeuReader from './LeuReader.svelte';import ExtractionCompare from './ExtractionCompare.svelte';import DependencyChain from './DependencyChain.svelte';import VersionCompare from './VersionCompare.svelte';import ResultsBento from './ResultsBento.svelte';import EngineeringDetail from './EngineeringDetail.svelte';import ClosingState from './ClosingState.svelte';import {createLearner} from './learner.svelte';import './leu.css';const learner=createLearner();onMount(()=>learner.destroy);</script>
<div use:chapterTitles class="cs-leu"><ProductNav name="Leu" slug="leu" links={[['overview','Overview'],['source','Source'],['architecture','Architecture'],['results','Results'],['engineering','Engineering']]}/><main class="wrap" id="main"><PlatformShowcase/><div class="showcase-bridge"><p>The document stays the source of truth. Leu models what you understand, and every judgement points back to its passage.</p><a class="btn primary" href="#try">Explore the learning loop</a></div><LeuReader {learner}/><p class="cap">A web model of Leu's loop with prepared answers.</p><ExtractionCompare/><DependencyChain {learner}/><VersionCompare/><ResultsBento/><EngineeringDetail/><ClosingState {learner}/><nav class="next" aria-label="Next project"><span class="lbl">Next project</span><a href="/work/flow">Flow</a></nav></main></div>

<style>
  .showcase-bridge { display: flex; justify-content: space-between; align-items: center; gap: 28px; margin: 0 0 32px; }
  .showcase-bridge p { max-width: 62ch; color: var(--muted); margin: 0; }
  .showcase-bridge a { flex-shrink: 0; }
  @media (max-width: 700px) { .showcase-bridge { flex-direction: column; align-items: flex-start; gap: 18px; } }
</style>
