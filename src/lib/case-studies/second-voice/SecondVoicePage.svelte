<script>
import NextProject from '../shared/NextProject.svelte';
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
import CaseOverview from '../shared/CaseOverview.svelte';
import CaseRole from '../shared/CaseRole.svelte';
import '../shared/case-artifact.css';
import { chapterTitles } from "$lib/motion/actions/chapterTitles";
import './second-voice.css';import ProductNav from '../shared/ProductNav.svelte';import {createWorkspace} from './workspace.svelte.js';
import Workspace from './Workspace.svelte';
import StateTruths from './StateTruths.svelte';
import VoiceRows from './VoiceRows.svelte';
import Gates from './Gates.svelte';
import ShareCard from './ShareCard.svelte';
import ReleaseLog from './ReleaseLog.svelte';
import SvSpecs from './SvSpecs.svelte';
const workspace=createWorkspace();
</script>
<div use:chapterTitles class="cs-sv"><ProductNav name="Second Voice" slug="second-voice-ai" links={[["overview","Overview"],["state","State"],["voices","Voices"],["gates","Behind submit"],["privacy","Privacy"],["release","Release"]]}/><main class="wrap" id="main">  <section class="hero" id="overview" aria-labelledby="hero-h"><div class="case-pitch">
    <p class="kicker">Second Voice, design and engineering, independent product, 2026</p>
    <h1 id="hero-h">Choose a literary voice. See exactly what changes.</h1>
    <p class="sub" data-ask-id="project-second-voice-ai">Compare the original with the rewrite to see which words changed. Your draft and last result stay available if a request fails.</p>
    <CaseRole slug="second-voice-ai" /><div class="ctas"><a class="btn" data-circle-fill href="#try"><CircleFill label="Try the case demo" /></a><a class="tlink" href="#gates">How it's built</a></div>
  </div><CaseOverview slug="second-voice-ai"/></section>

<Workspace {workspace}/><StateTruths {workspace}/><VoiceRows/><Gates/><ShareCard/><ReleaseLog/><SvSpecs/><NextProject slug="second-voice"/></main></div>
