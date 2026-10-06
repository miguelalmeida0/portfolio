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
        eventBus.on('annotationlayerrendered', () => {
          if (disposed) return;
          // PDF links have no text children. Name them for assistive technology
          // without the native URL tooltip obscuring adjacent content.
          for (const link of pages.querySelectorAll<HTMLAnchorElement>('.linkAnnotation > a[href]')) {
            const url = new URL(link.href);
            const names: Record<string, string> = {
              'www.linkedin.com': 'LinkedIn',
              'github.com': 'GitHub',
              'miguelalmeida.is-a.dev': 'Portfolio',
              'needle.miguelalmeida.xyz': 'Needle',
              'secondvoice-ai.vercel.app': 'Second Voice',
              'leu-desktop.vercel.app': 'Leu'
            };
            const email = url.protocol === 'mailto:';
            link.setAttribute('aria-label', email
              ? `Email ${url.pathname} — opens your email app`
              : `${names[url.hostname] || url.hostname} — opens in a new tab`);
            link.removeAttribute('title');
            // The four contact cards are 128 × 39 PDF points, radius 8.
            const section = link.parentElement!;
            const contact = ['www.linkedin.com', 'github.com'].includes(url.hostname)
              || email || (url.hostname === 'miguelalmeida.is-a.dev' && url.pathname === '/');
            section.classList.toggle('contact-link', contact);
          }
        });
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
    <div class="reader-title"><h1>Miguel Almeida · CV</h1><p><a class="web-cv" href="/cv">Read web CV</a> · Links open in new tabs.</p></div>
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
  .web-cv { display:inline-flex; align-items:center; min-height:44px; color:#12372d; text-decoration:underline; text-underline-offset:4px; }
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
  /* PDF.js measures the page content, excluding its 9px border. Tailwind's
     border-box reset otherwise shrinks only the canvas by 18px, leaving both
     annotations and selectable text displaced from the printed artwork. */
  .cv-reader :global(.pdfViewer .page) { box-sizing: content-box; }
  .cv-reader :global(.annotationLayer .linkAnnotation > a) {
    border-radius: 3px;
    background: transparent;
    opacity: 1;
    cursor: pointer;
  }
  .cv-reader :global(.annotationLayer .contact-link > a) {
    border-radius: calc(8px * var(--total-scale-factor));
  }
  .cv-reader :global(.pdfViewer .annotationLayer .linkAnnotation > a:hover) {
    opacity: 1;
    background: transparent;
    box-shadow: inset 0 0 0 2px #12372d, inset 0 0 0 4px #fffdf8;
  }
  .cv-reader :global(.pdfViewer .annotationLayer .linkAnnotation > a:focus-visible) {
    opacity: 1;
    background: transparent;
    outline: 3px solid #12372d;
    outline-offset: 0;
    box-shadow: inset 0 0 0 3px #fffdf8;
  }
  @media (forced-colors: active) {
    .cv-reader :global(.annotationLayer .linkAnnotation:has(> a:focus-visible)) {
      outline: 3px solid Highlight;
      outline-offset: 2px;
    }
  }
  @media (max-width: 600px) { .reader-toolbar { padding: 12px; } .reader-actions { gap: 12px; } }
  @media (prefers-reduced-motion: reduce) { .download { transition: none; } }
</style>
