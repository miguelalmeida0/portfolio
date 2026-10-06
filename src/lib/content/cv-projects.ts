// Transcribed from Miguel_Almeida_CV_OPEN.pdf, supplied 6 October 2026.
export const cvProjects = [
  {
    slug: 'needle', name: 'Needle', href: '/work/needle', live: 'https://needle.miguelalmeida.xyz/',
    description: 'Semantic visual search engine',
    stack: 'React 19 · TypeScript · Vite · XState · Web Workers',
    bullets: [
      'Built semantic search over 10,000 Met artworks using hybrid HNSW/exact retrieval and field-weighted visual metadata.',
      'Virtualized and lazy-loaded dense results with responsive images for fast exploration.',
      'Owned search model, interaction design, performance and deployment end to end.'
    ]
  },
  {
    slug: 'second-voice-ai', name: 'Second Voice', href: '/work/second-voice', live: 'https://secondvoice-ai.vercel.app/second-voice',
    description: 'AI rewriting product',
    stack: 'Next.js · React · TypeScript · Supabase · Playwright',
    bullets: [
      'Built original-vs-rewrite comparison, explicit request state, recovery and controlled sharing.',
      'Implemented schema-validated provider/model routing and request-scoped telemetry without logging users’ text.',
      'Rebuilt the Duet desktop/mobile interface while preserving end-to-end behavior.'
    ]
  },
  {
    slug: 'leu', name: 'Leu', href: '/work/leu', live: 'https://leu-desktop.vercel.app/',
    description: 'Native iPhone PDF study app',
    stack: 'Swift · SwiftUI · PDFKit · local-first architecture',
    bullets: [
      'Built a native reader that keeps the learning loop inside the PDF: read, understand, recall and revisit.',
      'Designed source-grounded explanations, active recall, blind-spot detection and reconstruction around the exact passage.',
      'Kept the product local-first with native interaction, explicit provenance and separate logic/UI verification gates.'
    ]
  }
];
