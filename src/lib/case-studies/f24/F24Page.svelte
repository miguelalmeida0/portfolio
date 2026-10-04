<script>
import './f24.css';import ProductNav from '../shared/ProductNav.svelte';
import LegalBar from './LegalBar.svelte';
import SituationStory from './SituationStory.svelte';
import StatesExplorer from './StatesExplorer.svelte';
import LessonCompare from './LessonCompare.svelte';
import LessonFoundation from './LessonFoundation.svelte';
import Decisions from './Decisions.svelte';
import TestingWidget from './TestingWidget.svelte';
import TeamSection from './TeamSection.svelte';
import F24Specs from './F24Specs.svelte';
import NoticeFull from './NoticeFull.svelte';
</script>
<div class="cs-f24"><LegalBar/><ProductNav name="F24 Connectivity Hub" links={[["overview","Overview"],["states","States"],["migration","Migration"],["decisions","Decisions"],["testing","Testing"]]}/><main class="wrap" id="main">  <section class="hero" id="overview" aria-labelledby="hero-h">
    <p class="kicker">F24, frontend architecture and product delivery, 2022-now</p>
    <h1 id="hero-h">From mockup to production system.</h1>
    <p class="sub">Built Connectivity Hub's original Svelte frontend within the product team, and continued shipping as React joined the architecture.</p>
    <div class="ctas"><a class="btn" href="#try">Try it</a><a class="tlink" href="#decisions">Architecture decisions</a></div>
  </section>

<SituationStory/><StatesExplorer/>  <section class="chapter" id="migration" aria-labelledby="mig-h">
    <div class="head">
      <h2 id="mig-h">Changing the engine while the product keeps running.</h2>
      <p>Connectivity Hub kept shipping while its frontend grew from Svelte into React. Two lessons from that move, in plain terms.</p>
    </div>

<LessonCompare/><LessonFoundation/></section><Decisions/><TestingWidget/><TeamSection/><F24Specs/><NoticeFull/><nav class="next" aria-label="Next project"><span class="lbl">Next project</span><a href="/work/second-voice">Second Voice</a></nav></main></div>
