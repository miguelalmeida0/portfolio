<script>
import CaseOverview from '../shared/CaseOverview.svelte';
import '../shared/case-artifact.css';
import { chapterTitles } from "$lib/motion/actions/chapterTitles";
  import ProductNav from '../shared/ProductNav.svelte';
  import SearchDemo from './SearchDemo.svelte';
  import SearchPipeline from './SearchPipeline.svelte';
  import ImageCompare from './ImageCompare.svelte';
  import CacheModel from './CacheModel.svelte';
  import WindowModel from './WindowModel.svelte';
  import ProductCapture from '$lib/components/experience/needle/ProductCapture.svelte';
  import { needleMedia, needleCachePolicies } from '$lib/content/needle-investigation';
  import './needle.css';
  const captures = [
    { label: 'Collection wall', src: needleMedia.wall, alt: 'The live Needle collection wall with the Monolith mark, green selection and Hercules and the Hydra ranked first beside the artwork inspector.', width: 1440, height: 1000 },
    { label: 'Search view', src: needleMedia.search, alt: 'The live Needle semantic map with the Monolith mark and Hercules and the Hydra framed by the lighter forest-green best-match border.', width: 1440, height: 1000 },
    { label: 'Mobile', src: needleMedia.mobile, alt: 'The live Needle collection wall with the Monolith mark and green selection in a 390-pixel mobile viewport.', width: 390, height: 844 }
  ];
  let capture = $state(0);
</script>


<div use:chapterTitles class="cs-needle" data-needle-study>
  <ProductNav name="Needle" slug="needle" links={[["overview", "Overview"], ["engineering", "Search"], ["images", "Images"], ["cache", "Cache"], ["rendering", "Rendering"], ["specs", "Specs"]]} />
  <main class="wrap" id="main">
    <section class="hero" id="overview" aria-labelledby="hero-h"><div class="case-pitch">
      <p class="kicker">Needle, a visual search engine for 10,000 artworks</p>
      <h1 id="hero-h" data-ask-id="project-needle">From a query to a visible artwork.</h1>
      <p class="sub">Find a work in the collection. Follow the search, the image and the decisions that make it appear.</p>
      <dl class="hero-stack"><dt>Built with</dt><dd>React, TypeScript, HNSW, Web Workers, Node.js, Sharp and Docker.</dd></dl>
      <div class="ctas"><a class="btn primary" href="#try">Explore demo</a><a class="tlink" href="#engineering">How it’s built</a></div>
    </div><CaseOverview slug="needle"/></section>

    <SearchDemo />

    <section class="chapter" aria-labelledby="decisions-h">
      <div class="head"><h2 id="decisions-h">Finding it is only half the work.</h2><p>A ranked ID still needs an image, a place on screen and the right to replace the previous result.</p></div>
      <div class="bento">
        <article class="tile sage"><span class="tile-number">01 / Search</span><h3>A graph with an identity.</h3><p>The index is prepared ahead of time. The worker checks the corpus checksum and encoder version before using it.</p><a class="tlink" href="#engineering">Change the corpus ↓</a></article>
        <article class="tile blush"><span class="tile-number">02 / Delivery</span><h3>The image that fits.</h3><p>A small tile and an inspector have different jobs. Each asks for the image size it needs.</p><a class="tlink" href="#images">Compare the bytes ↓</a></article>
        <article class="tile ivory"><span class="tile-number">03 / Reuse</span><h3>A cache that knows what changed.</h3><p>Corpus, source, format and size each participate in the decision to reuse work.</p><a class="tlink" href="#cache">Take a second visit ↓</a></article>
        <article class="tile green"><span class="tile-number">04 / Rendering</span><h3>A collection, not 10,000 elements.</h3><p>The catalog stays in the model. Only a window of artwork needs to be mounted.</p><a class="tlink" href="#rendering">Move through the window ↓</a></article>
      </div>
    </section>

    <section class="chapter" id="engineering" aria-labelledby="engineering-h">
      <div class="head"><p class="eyebrow">Search and ownership</p><h2 id="engineering-h">Prepare the graph.<br />Check that it belongs.</h2><p>The corpus and graph load in parallel. Metadata encoding and retrieval run in a worker, while the interface keeps ownership of the current query.</p></div>
      <SearchPipeline />
      <div class="story"><div><h3>Moving work does not remove its cost.</h3><p>Precomputation and workers solve different parts of the wait.</p></div><dl><dt>Decision</dt><dd>Load a compatible snapshot instead of building its graph on every visit. Keep parsing, encoding and retrieval outside the UI path.</dd><dt>Tradeoff</dt><dd>Transfer, hashing, encoding and worker-to-UI data movement still take time and memory.</dd><dt>Boundary</dt><dd>A delayed response can finish successfully and still be stale. Request identity decides whether it can be committed.</dd></dl></div>
    </section>

    <section class="chapter" id="images" aria-labelledby="images-h">
      <div class="head"><p class="eyebrow">Image delivery</p><h2 id="images-h">The museum image<br />is not the thumbnail.</h2><p>One artwork. Three files. Change the size to see what travels over the network.</p></div>
      <ImageCompare />
      <div class="story"><div><h3>Make the image path part of search.</h3><p>A result is not ready while its image is still empty.</p></div><dl><dt>Request</dt><dd>The product requests 160, 320, 640 or 1280 pixels and tries AVIF, WebP and JPEG. Decoding is asynchronous, with responsive sizes and an explicit unavailable state.</dd><dt>Prepare</dt><dd>The container build prepares 120 opening previews through the same pipeline used at runtime. Other museum images arrive as needed.</dd><dt>Bound</dt><dd>Three simultaneous transforms, a pending-work limit, remote timeouts and a source-size budget prevent an image burst from becoming unlimited work.</dd><dt>Recover</dt><dd>Matching requests share work. Format fallback and source backoff bound retries when the museum source fails.</dd></dl></div>
    </section>

    <section class="chapter" id="cache" aria-labelledby="cache-h">
      <div class="head"><p class="eyebrow">Cache identity</p><h2 id="cache-h">Reuse is a decision.</h2><p>A graph belongs to a corpus. A derivative belongs to a source, a size, a format and a pipeline version.</p></div>
      <CacheModel />
      <details class="technical-detail"><summary>The release’s cache policies</summary><div class="table-scroll"><table><thead><tr><th scope="col">Resource</th><th scope="col">Identity</th><th scope="col">HTTP behavior</th></tr></thead><tbody>{#each needleCachePolicies as [resource, identity, policy]}<tr><th scope="row">{resource}</th><td>{identity}</td><td>{policy}</td></tr>{/each}</tbody></table></div></details>
      <div class="story"><div><h3>Fresh, validated and persistent are different.</h3></div><dl><dt>Fresh</dt><dd>A fresh immutable response can avoid a request entirely. Changing its URL is essential when the underlying pack changes.</dd><dt>Validated</dt><dd>A matching conditional request can return 304. It still made a trip to the server.</dd><dt>Persistent</dt><dd>A disk cache needs a persistent mount to survive container replacement. The Dockerfile alone does not establish that configuration.</dd></dl></div>
    </section>

    <section class="chapter" id="rendering" aria-labelledby="rendering-h">
      <div class="head"><p class="eyebrow">Rendering budget</p><h2 id="rendering-h">10,000 records.<br />A window of artwork.</h2><p>Scroll the model. The catalog count stays fixed while mounted elements follow the visible rows.</p></div>
      <WindowModel />
      <div class="story"><div><h3>A phone needs its own budget.</h3><p>Rendering, requests and retained memory each have a separate limit.</p></div><dl><dt>Window</dt><dd>The collection wall calculates rows from scroll position, viewport height and column count, with one row of overscan on either side.</dd><dt>Previews</dt><dd>The spatial view uses 28, 44 or 64 previews at the inspected viewport breakpoints. Detail images can retain a preview during loading.</dd><dt>Memory</dt><dd>The decoded-source map is capped at 96 entries. Reducing mounted elements alone would not bound retained image memory.</dd></dl></div>
    </section>

    <section class="chapter" id="product" aria-labelledby="product-h">
      <div class="head"><p class="eyebrow">The actual product</p><h2 id="product-h">The collection, in context.</h2><p>The walkthrough above opens up individual decisions. These captures show how they come together in Needle.</p></div>
      <div class="chips capture-tabs" role="group" aria-label="Product views">{#each captures as item, i}<button type="button" class="chip" aria-pressed={capture === i} onclick={() => capture = i}>{item.label}</button>{/each}</div>
      <figure class="product-frame" class:mobile-capture={capture === 2}><div class="product-capture">{#key capture}<ProductCapture {...captures[capture]} />{/key}</div><figcaption>{needleMedia.caption}</figcaption></figure>
    </section>

    <section class="chapter" id="specs" aria-labelledby="specs-h">
      <div class="head"><h2 id="specs-h">Stack, limits and verification.</h2></div>
      <div class="specs-grid"><div class="metrics"><div><b>10,000</b><span>Catalog records</span></div><div><b>120</b><span>Opening previews</span></div><div><b>3</b><span>Simultaneous transforms</span></div><div><b>96</b><span>Retained decoded sources</span></div></div><div class="facts"><div><h3>My role</h3><p>Product design and performance engineering: search initialization, image delivery, cache identity and rendering budgets.</p></div><div><h3>Search model</h3><p>Field-weighted museum metadata and hybrid retrieval in this release. The case study does not claim the experimental neural retrieval system.</p></div></div></div>
      <div class="stories"><div class="story"><div><h3>The graph still has to arrive.</h3></div><dl><dt>Cold visit</dt><dd>Precomputation moves work earlier. A worker moves it away from the interface. The corpus and graph still have to cross the network.</dd><dt>Public host</dt><dd>Host startup is a separate clock from browser initialization. Local captures do not establish public-host latency or uptime.</dd></dl></div><div class="story"><div><h3>Evidence with a boundary.</h3></div><dl><dt>Verified source</dt><dd>The manifest declares 10,000 records and 120 opening images. The graph checksum matches the corpus. The mechanisms above are linked to the pinned release.</dd><dt>Image sample</dt><dd>The encoded file sizes are reproducible from one bundled artwork. They do not establish a whole-page transfer reduction.</dd><dt>Historical performance</dt><dd>The original before/after artifacts are absent from the public package. Startup, LCP, heap, scroll and slow-network gains are not quantified here.</dd></dl></div></div>
    </section>
    <nav class="next" aria-label="Next project"><span>Next project</span><a href="/work/second-voice">Second Voice</a></nav>
  </main>
</div>
