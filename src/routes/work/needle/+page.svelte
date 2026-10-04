<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { needleChapters, needleSources, needleMedia, needleCachePolicies, needleImageSample as sample } from '$lib/content/needle-investigation';
  import LinkButton from '$lib/components/experience/LinkButton.svelte';
  import ProductCapture from '$lib/components/experience/needle/ProductCapture.svelte';
  import CacheJourney from '$lib/components/experience/needle/CacheJourney.svelte';
  import SourceLink from '$lib/components/experience/needle/SourceLink.svelte';
  const heading = 'mt-3 max-w-[26ch] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.08] font-semibold tracking-[-.04em]';
  const paragraph = 'mt-5 max-w-[72ch] text-base leading-[1.75] sm:text-lg';
  const section = 'border-b border-[var(--color-rule)] py-12 lg:py-20';
</script>

<svelte:head>
  <title>Needle — Engineering a 10,000-artwork visual search | Miguel Almeida</title>
  <meta name="description" content="Inside Needle: corpus-bound HNSW, worker retrieval, image derivatives, cache identity and windowed rendering across 10,000 Met artworks." />
</svelte:head>

<article class="shell portfolio-study pb-16" data-needle-study>
  <a href="/#work" {...destinationLink('/#work')} class="study-back mt-6 inline-flex min-h-11 items-center text-sm underline underline-offset-4">All work</a>
  <header class="grid gap-8 pt-8 pb-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:pt-12 lg:pb-16">
    <div>
      <h1 data-ask-id="project-needle" class="text-2xl font-semibold tracking-tight">Needle</h1>
      <p class="mt-6 text-[clamp(2.75rem,5.7vw,6rem)] leading-[.98] font-semibold tracking-[-.055em]">10,000 artworks.<br /><span class="text-[var(--color-muted)]">Every image<br />has a cost.</span></p>
    </div>
    <div class="self-end">
      <p class="max-w-[42ch] text-xl leading-relaxed sm:text-2xl">I built a visual search engine, then worked through everything between a query and a visible artwork.</p>
      <p class={paragraph}>Prepared indexing. Worker retrieval. Image delivery. Cache identity. Rendering budgets. The difficult part was making those systems agree.</p>
      <dl class="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm leading-relaxed"><dt class="text-[var(--color-muted)]">Role</dt><dd>Product design & performance engineering</dd><dt class="text-[var(--color-muted)]">Built with</dt><dd>React · TypeScript · HNSW · Web Workers<br />Node.js · Sharp · Docker</dd></dl>
      <div class="mt-7 flex flex-wrap gap-4"><LinkButton href="https://needle.miguelalmeida.xyz" label="Open Needle" external /><LinkButton href="https://github.com/miguelalmeida0/needle-portfolio-release" label="View release source" external secondary /></div>
    </div>
  </header>

  <figure><ProductCapture src={needleMedia.wall} alt="Needle's real collection wall, with Queen Louise ranked first and an artwork inspector alongside the results." eager /><figcaption class="mt-3 max-w-[90ch] text-xs leading-relaxed text-[var(--color-muted)]">{needleMedia.caption}</figcaption></figure>

  <div class="mt-12 grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-16">
    <nav aria-label="Needle case study chapters" class="self-start lg:sticky lg:top-24">
      <ol class="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">{#each needleChapters as [id, label], i}<li><a href={'#' + id} class="flex min-h-11 items-start gap-3 py-2 text-sm leading-relaxed"><span class="text-[var(--color-muted)]">0{i + 1}</span><span class="underline decoration-[var(--color-rule)] underline-offset-4">{label}</span></a></li>{/each}</ol>
    </nav>
    <div class="min-w-0">
      <section id="failure" class={section} aria-labelledby="failure-title">
        <p class="text-sm text-[var(--color-muted)]">01 · The performance problem</p>
        <h2 id="failure-title" class={heading}>A ranked ID is not<br />a visible result.</h2>
        <p class={paragraph}>A rich artwork interface can finish its search while the user is still looking at empty image boxes. Index construction, corpus transfer, image decoding and rendering each contribute to the same wait. Fixing only retrieval leaves most of the product untouched.</p>
        <div class="mt-8 grid gap-8 sm:grid-cols-2">
          <div class="border-t-2 border-[var(--color-ink)] pt-5"><h3 class="text-xl font-semibold">Find the work</h3><ol class="mt-4 space-y-3 text-base"><li>Corpus transfer & parsing</li><li>Prepared graph validation</li><li>Worker retrieval</li><li>Ranked artwork IDs</li></ol></div>
          <div class="border-t-2 border-[var(--color-ink)] pt-5"><h3 class="text-xl font-semibold">Make it visible</h3><ol class="mt-4 space-y-3 text-base"><li>Viewport scheduling</li><li>Derivative lookup or generation</li><li>HTTP response & validation</li><li>Browser decoding & paint</li></ol></div>
        </div>
        <p class={paragraph}>I treated the image path as part of search performance. The release makes these costs explicit, with separate identities and limits at each layer.</p>
      </section>

      <section id="search" class={section} aria-labelledby="search-title">
        <p class="text-sm text-[var(--color-muted)]">02 · Search initialization</p>
        <h2 id="search-title" class={heading}>Load the graph.<br />Check that it belongs.</h2>
        <p class={paragraph}>The corpus is known before anyone visits. Its HNSW graph can be prepared ahead of time. The worker fetches the corpus and graph in parallel, hashes the actual corpus bytes and checks the encoder version before accepting the snapshot.</p>
        <div class="mt-8 bg-[var(--color-ink)] p-6 text-[var(--color-ivory)] sm:p-8">
          <h3 class="text-lg font-semibold">The compatibility decision</h3>
          <p class="mt-4 text-xl leading-relaxed sm:text-2xl">Corpus checksum matches<br />+ encoder version matches</p>
          <div class="mt-6 grid gap-6 border-t border-[var(--color-rule)] pt-6 sm:grid-cols-2"><p><strong class="block">Compatible</strong><span class="mt-2 block text-sm leading-relaxed">Load the prepared snapshot.</span></p><p><strong class="block">Missing or rejected</strong><span class="mt-2 block text-sm leading-relaxed">Build a new graph in the worker.</span></p></div>
        </div>
        <dl class="mt-8 space-y-5"><div><dt class="text-sm font-semibold">Worker ownership</dt><dd class="mt-2 leading-relaxed">Parsing, metadata encoding and retrieval run outside the UI path. Results carry request IDs. The application checks an active search sequence before committing a response, so an older query cannot replace the latest one.</dd></div><div><dt class="text-sm font-semibold">Tradeoff</dt><dd class="mt-2 leading-relaxed">A prepared graph removes construction on a compatible visit. Transfer, hashing, encoding and worker-to-UI data movement still cost time and memory.</dd></div></dl>
        <SourceLink href={needleSources.worker} label="Inspect worker initialization" /> <SourceLink href={needleSources.requests} label="Inspect stale-result handling" />
      </section>

      <section id="images" class={section} aria-labelledby="images-title">
        <p class="text-sm text-[var(--color-muted)]">03 · Image delivery</p>
        <h2 id="images-title" class={heading}>The museum image<br />is not the thumbnail.</h2>
        <p class={paragraph}>A tile and an inspector have different jobs. Needle requests derivatives at 160, 320, 640 or 1280 pixels. The component tries AVIF, WebP and JPEG, with asynchronous decoding, responsive sizing and an explicit unavailable state.</p>
        <figure class="mt-8">
          <div class="grid items-end gap-8 bg-[var(--color-ivory)] p-6 sm:grid-cols-[1fr_2fr] sm:p-8">
            <div><img src={sample.tile} alt="Queen Louise at tile resolution." width="160" height="294" loading="lazy" class="mx-auto h-auto max-h-64 w-auto max-w-full" /><p class="mt-5 text-lg font-semibold">160 px · 4.1 kB</p><p class="mt-1 text-sm">Artwork tile · AVIF</p></div>
            <div><img src={sample.detail} alt="Queen Louise at inspector resolution." width="339" height="623" loading="lazy" class="mx-auto h-auto max-h-96 w-auto max-w-full" /><p class="mt-5 text-lg font-semibold">339 px · 14.4 kB</p><p class="mt-1 text-sm">Artwork detail · AVIF · 640 px request</p></div>
          </div>
          <figcaption class="mt-4 text-sm leading-relaxed"><strong>{sample.title}</strong> · {sample.artist} · Met object {sample.objectId}. The bundled JPEG is 88.3 kB at 339 × 623 px. The detail request asks for 640 px; the pipeline preserves the source width instead of enlarging it. {sample.conditions}</figcaption>
        </figure>
        <p class={paragraph}>The container build prepares 120 local opening previews through the same image pipeline used at runtime. Other museum images are fetched as needed. The server coalesces identical work and shares source bytes briefly across overlapping formats and sizes.</p>
        <dl class="mt-7 grid gap-6 sm:grid-cols-2"><div><dt class="font-semibold">Bound the work</dt><dd class="mt-2 leading-relaxed">Three simultaneous transforms, a limit on pending derivatives, remote timeouts and a source-size budget keep an image burst from becoming unlimited work.</dd></div><div><dt class="font-semibold">Keep the failure visible</dt><dd class="mt-2 leading-relaxed">A source can fail independently of search. Format fallback and source backoff limit retries; neither can guarantee museum availability.</dd></div></dl>
        <SourceLink href={needleSources.image} label="Inspect derivative generation" /> <SourceLink href={needleSources.prepare} label="Inspect build-time previews" />
      </section>

      <section id="cache" class={section} aria-labelledby="cache-title">
        <p class="text-sm text-[var(--color-muted)]">04 · Cache identity</p>
        <h2 id="cache-title" class={heading}>Reuse is a decision.<br />A cache folder is not enough.</h2>
        <p class={paragraph}>The graph belongs to a corpus. A derivative belongs to a source, size, format and pipeline version. Local source identity uses size and modification time; remote identity uses a daily bucket. The derivative key becomes its ETag.</p>
        <CacheJourney />
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard access to the table on narrow screens.) -->
        <div class="mt-8 overflow-x-auto" tabindex="0" role="region" aria-label="Cache policies, horizontally scrollable"><table class="w-full min-w-[560px] border-collapse text-left text-sm leading-relaxed"><caption class="pb-4 text-left font-semibold">The release's actual cache policies</caption><thead><tr>{#each ['Resource', 'Identity', 'HTTP behavior'] as label}<th scope="col" class="border-b border-[var(--color-rule)] py-3 pr-5">{label}</th>{/each}</tr></thead><tbody>{#each needleCachePolicies as [resource, identity, policy]}<tr><th scope="row" class="border-b border-[var(--color-rule)] py-4 pr-5 font-medium">{resource}</th><td class="border-b border-[var(--color-rule)] py-4 pr-5">{identity}</td><td class="border-b border-[var(--color-rule)] py-4">{policy}</td></tr>{/each}</tbody></table></div>
        <p class={paragraph}>A matching conditional request returns 304. A fresh immutable response can avoid the request entirely. Those are different outcomes. Changing an image behind the same immutable URL is unsafe: its new server fingerprint cannot invalidate the copy already fresh in a browser.</p>
        <p class="mt-6 border-l-2 border-[var(--color-ink)] pl-5 text-lg leading-relaxed">Pack versions must change with their assets. Runtime disk caching also needs a persistent mount to survive container replacement; the Dockerfile alone does not promise that persistence.</p>
        <SourceLink href={needleSources.http} label="Inspect HTTP caching and ETags" />
      </section>

      <section id="rendering" class={section} aria-labelledby="rendering-title">
        <p class="text-sm text-[var(--color-muted)]">05 · Rendering budget</p>
        <h2 id="rendering-title" class={heading}>10,000 records.<br />A window of artwork.</h2>
        <p class={paragraph}>The collection wall calculates visible rows from scroll position, viewport height and column count, then adds one row of overscan on either side. The model keeps the catalog; the DOM mounts the window.</p>
        <div class="mt-8 grid grid-cols-6 gap-2" role="img" aria-label="Illustration: visible rows and one overscan row either side are mounted; rows outside that window remain unmounted.">{#each Array(36) as _, i}<span class="aspect-[4/3] rounded-sm border border-[var(--color-rule)] {i >= 6 && i < 30 ? 'bg-[var(--color-ink)]' : 'bg-transparent'}"></span>{/each}</div>
        <p class="mt-3 text-xs text-[var(--color-muted)]">Windowing illustration · dark cells are mounted · diagram, not a product screenshot</p>
        <p class={paragraph}>The spatial view uses a separate viewport-dependent preview budget. Detail images can display a retained preview during loading, and the decoded-source map is capped at 96 entries. Rendering, image requests and retained memory each have their own limit.</p>
        <SourceLink href={needleSources.window} label="Inspect row windowing" /> <SourceLink href={needleSources.component} label="Inspect image state and preview retention" />
      </section>

      <section id="mobile" class={section} aria-labelledby="mobile-title">
        <p class="text-sm text-[var(--color-muted)]">06 · Mobile</p>
        <h2 id="mobile-title" class={heading}>A phone needs<br />its own budget.</h2>
        <div class="mt-8 grid items-start gap-8 sm:grid-cols-[1fr_210px]"><div><p class="text-lg leading-[1.75]">The spatial preview budget adapts to the available view: 28, 44 or 64 previews at the inspected breakpoints. The collection wall recalculates columns and its visible window; the image component chooses resources through responsive sizing.</p><p class={paragraph}>These mechanisms reduce unnecessary work. They do not certify mobile speed. A phone's decoding, memory, network and interaction costs need measurements separate from desktop.</p><SourceLink href={needleSources.spatial} label="Inspect viewport preview limits" /></div><figure class="mx-auto w-full max-w-[230px]"><ProductCapture src={needleMedia.mobile} alt="Actual Needle collection wall in a 390-pixel mobile viewport." width={390} height={844} /><figcaption class="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">Same release and query · 390 × 844 local capture</figcaption></figure></div>
      </section>

      <section id="network" class={section} aria-labelledby="network-title">
        <p class="text-sm text-[var(--color-muted)]">07 · The remaining cost</p>
        <h2 id="network-title" class={heading}>The graph still<br />has to arrive.</h2>
        <p class={paragraph}>Precomputation moves work earlier. Workers move it away from the interface. Neither removes the bytes a cold visitor must download. The server compresses text resources, but the corpus and graph remain part of the startup dependency chain.</p>
        <p class="mt-8 border-l-2 border-[var(--color-ink)] pl-5 text-xl leading-relaxed">After removing a layer of waste, measure again. The next bottleneck can be the network rather than the algorithm.</p>
        <h3 class="mt-10 text-xl font-semibold">Hosting is another clock.</h3><p class={paragraph}>Waiting for a host to launch a process happens before browser initialization. It must be recorded separately. The checked-in Dockerfile establishes the container's runtime and build-time previews; it does not establish public-host uptime, reverse-proxy behavior or persistent-cache configuration.</p>
        <SourceLink href={needleSources.docker} label="Inspect the deployment package" />
      </section>

      <section id="boundaries" class={section} aria-labelledby="boundaries-title">
        <p class="text-sm text-[var(--color-muted)]">08 · Verification boundaries</p>
        <h2 id="boundaries-title" class={heading}>Claims you can<br />trace back to code.</h2>
        <dl class="mt-8 space-y-7"><div><dt class="text-lg font-semibold">Release scale and mechanisms</dt><dd class="mt-2 leading-relaxed">10,000 catalog records and 120 opening images are declared in the manifest and checked against the corpus. The graph checksum matches the corpus. Worker ownership, stale-result guards, derivative policies and row windowing were inspected at the pinned release.</dd></div><div><dt class="text-lg font-semibold">The image sample</dt><dd class="mt-2 leading-relaxed">The two derivatives above were generated from the same bundled artwork using the release's width, format and quality settings. Their file sizes are directly reproducible. One sample does not establish a whole-page transfer reduction.</dd></div><div><dt class="text-lg font-semibold">Historical performance</dt><dd class="mt-2 leading-relaxed">The original before/after benchmark artifacts are absent from this public package. Startup, LCP, heap, scroll and slow-network improvements are therefore not quantified here. Cache conditions, device and test method must accompany any later published measurements.</dd></div><div><dt class="text-lg font-semibold">Retrieval and production</dt><dd class="mt-2 leading-relaxed">This release uses field-weighted museum metadata. It does not claim the experimental neural retrieval system. Successful rendering does not establish relevance quality, and a local capture does not establish public-host latency.</dd></div></dl>
        <SourceLink href={needleSources.pack} label="Inspect the frozen pack manifest" />
      </section>
      <footer class="pt-8"><p class="max-w-[75ch] text-lg leading-relaxed">The engineering work is in the coordination: a graph with the right identity, a worker with the right request, and an image sized for the place it will appear.</p><a href="/work/second-voice-ai" {...destinationLink('/work/second-voice-ai')} class="mt-7 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">Next project: Second Voice</a></footer>
    </div>
  </div>
</article>
