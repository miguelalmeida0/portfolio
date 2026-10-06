<script lang="ts">
  import { onMount } from 'svelte';
  import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
  import 'pdfjs-dist/web/pdf_viewer.css';
  import type { PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs';
  import CvZoom from '$lib/components/CvZoom.svelte';

  let container: HTMLDivElement;
  let pages: HTMLDivElement;
  let viewer: PDFViewer | undefined;
  let ready = false;
  let failed = false;
  let scale = 'auto';
  let percent = 100;

  function changeScale(value: string) {
    if (!viewer || !ready) return;
    scale = value;
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) {
      // Defer expensive canvas redraws while the ruler moves; PDF.js keeps the
      // existing page visible and retains the reader's position meanwhile.
      viewer.updateScale({ scaleFactor: numeric / viewer.currentScale, drawingDelay: 120 });
    } else {
      resize();
    }
  }

  function resize() {
    if (viewer && ready) viewer.currentScaleValue = scale;
  }

  onMount(() => {
    let disposed = false;
    let loadingTask: import('pdfjs-dist').PDFDocumentLoadingTask | undefined;
    let observer: ResizeObserver | undefined;
    const lifecycle = new AbortController();

    async function openPdf() {
      try {
        // The viewer module reads the core module's pdfjsLib global.
        const pdfjs = await import('pdfjs-dist');
        if (disposed) return;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const { PDFViewer, PDFLinkService, EventBus, LinkTarget } = await import('pdfjs-dist/web/pdf_viewer.mjs');
        if (disposed) return;
        const eventBus = new EventBus();
        const links = new PDFLinkService({
          eventBus,
          externalLinkTarget: LinkTarget.BLANK,
          externalLinkRel: 'noopener noreferrer'
        });
        const options = { container, viewer: pages, eventBus, linkService: links, abortSignal: lifecycle.signal };
        viewer = new PDFViewer(options);
        links.setViewer(viewer);
        eventBus.on('pagesinit', () => {
          if (disposed) return;
          ready = true;
          resize();
        });
        eventBus.on('scalechanging', ({ scale: actualScale, presetValue }: { scale: number; presetValue?: string }) => {
          if (disposed) return;
          percent = Math.round(actualScale * 100);
          scale = presetValue || String(actualScale);
        });
        eventBus.on('pagerendered', ({ error }: { error?: unknown }) => {
          if (error && !disposed) failed = true;
        });
        loadingTask = pdfjs.getDocument({ url: '/files/miguel-almeida-cv.pdf' });
        const pdf = await loadingTask.promise;
        if (disposed) return;
        links.setDocument(pdf);
        viewer.setDocument(pdf);
        observer = new ResizeObserver(resize);
        observer.observe(container);
      } catch {
        if (!disposed) failed = true;
      }
    }
    void openPdf();
    return () => {
      disposed = true;
      observer?.disconnect();
      viewer?.setDocument(null);
      lifecycle.abort();
      void loadingTask?.destroy();
      viewer = undefined;
    };
  });
</script>

<svelte:head>
  <title>CV PDF — Miguel Almeida</title>
  <meta name="description" content="Read Miguel Almeida’s CV. Project links open in separate tabs so the CV stays open." />
</svelte:head>

<main class="cv-reader" aria-label="Miguel Almeida CV PDF">
  <header class="reader-toolbar">
    <div class="reader-title"><h1>Miguel Almeida · CV</h1><p>Links open in new tabs.</p></div>
    <div class="reader-actions">
      <CvZoom ready={ready && !failed} {percent} mode={scale} onscale={changeScale} />
      <a class="download" href="/files/miguel-almeida-cv.pdf" download="Miguel-Almeida-CV.pdf">Download PDF</a>
    </div>
  </header>
  <div class="reader-body">
    {#if failed}
      <div class="reader-message" role="alert">
        <p>The PDF preview couldn’t load.</p>
        <a href="/files/miguel-almeida-cv.pdf" download="Miguel-Almeida-CV.pdf">Download the PDF</a>
        <a href="/cv" target="_blank" rel="noopener noreferrer">Read the web CV</a>
      </div>
    {:else if !ready}
      <p class="reader-message" role="status">Loading CV…</p>
    {/if}
    <noscript><p class="reader-message">Enable JavaScript to preview the PDF, or use Download PDF.</p></noscript>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (This scroll region needs keyboard focus for arrow and Page Down scrolling.) -->
    <div class="reader-scroll" bind:this={container} role="region" aria-label="CV pages" tabindex="0">
      <div class="pdfViewer" bind:this={pages}></div>
    </div>
  </div>
</main>

<style>
  .cv-reader { height: 100dvh; display: flex; flex-direction: column; color: #12372d; background: #e8ecdf; font-family: Figtree, Arial, sans-serif; }
  .reader-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; padding: 12px 24px; background: #f5f6ed; border-bottom: 1px solid #c5ccba; }
  h1 { margin: 0; font-size: 17px; font-weight: 600; line-height: 1.4; }
  .reader-title p { margin: 3px 0 0; font-size: 13px; color: #506353; }
  .reader-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
  .download { min-height: 44px; border: 1px solid #12372d; border-radius: 12px; padding: 10px 16px; font: inherit; transition: background 160ms, transform 160ms; }
  .download { display: inline-flex; align-items: center; background: #12372d; color: white; text-decoration: none; font-size: 14px; }
  .download:hover { background: #244f3d; }
  .download:active { transform: translateY(1px); }
  .reader-body { position: relative; flex: 1; min-height: 0; }
  .reader-scroll { position: absolute; inset: 0; overflow: auto; overscroll-behavior: contain; }
  .reader-message { position: relative; z-index: 1; margin: 24px; padding: 20px; background: #f5f6ed; }
  .reader-message a { display: inline-block; margin: 12px 20px 0 0; text-decoration: underline; }
  .cv-reader :global(a:focus-visible) { outline: 3px solid #610d3d; outline-offset: 3px; }
  .cv-reader :global(.annotationLayer .linkAnnotation > a:hover) { background: rgb(97 13 61 / 10%); }
  @media (max-width: 600px) { .reader-toolbar { padding: 12px; } .reader-actions { gap: 12px; } }
  @media (prefers-reduced-motion: reduce) { .download { transition: none; } }
</style>
