<script>
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
<div use:chapterTitles class="cs-sv"><ProductNav name="Second Voice" links={[["overview","Overview"],["state","State"],["voices","Voices"],["gates","Behind submit"],["privacy","Privacy"],["release","Release"]]}/><main class="wrap" id="main">  <section class="hero" id="overview" aria-labelledby="hero-h">
    <p class="kicker">Second Voice, design and engineering, independent product, 2026</p>
    <h1 id="hero-h">Choose a literary voice. See exactly what changes.</h1>
    <p class="sub">Generating a rewrite is easy. Trusting one is not. The original stays close, and every edit stays inspectable.</p>
    <div class="ctas"><a class="btn" href="#try">Try it</a><a class="tlink" href="#gates">How it's built</a></div>
  </section>

<Workspace {workspace}/><StateTruths {workspace}/><VoiceRows/><Gates/><ShareCard/><ReleaseLog/><SvSpecs/><nav class="next" aria-label="Next project"><span class="lbl">Next project</span><a href="/work/f24">F24</a></nav></main></div>
