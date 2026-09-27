export type Project = {
  slug: string; name: string; category: string; type: string; number: string;
  summary: string; role: string; period: string; stack: string[];
  image: string; alt: string; caption: string; video?: string;
  live?: { href: string; label: string }; source?: string;
  problem: string; contribution: string; outcome: string; limitation: string;
  decisions: { title: string; detail: string; tradeoff: string }[];
};

export const projects: Project[] = [
  {
    slug: 'second-voice-ai', name: 'Second Voice AI', category: 'Product design & frontend', type: 'Personal project', number: '01',
    summary: 'Choose a literary voice. See exactly what changes.',
    role: 'Product design, frontend & server orchestration', period: 'Independent product · 2026',
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Groq'],
    image: '/projects/ghostwriter/ghostwriter-demo-poster.webp', alt: 'The Second Voice writing interface, with author controls and a rewrite workspace.',
    caption: 'The standalone Second Voice writing experience. Recorded product interaction.', video: '/projects/ghostwriter/ghostwriter-demo.mp4',
    live: { href: 'https://secondvoice-ai.vercel.app/second-voice', label: 'Open Second Voice' }, source: 'https://github.com/miguelalmeida0/second-voice',
    problem: 'A rewrite is easy to generate and surprisingly hard to trust. The writer needs to understand what changed, keep their original draft, and remain in control when a request is slow or fails.',
    contribution: 'I designed and engineered the writing flow: author and mood controls, draft and result states, edit playback, and the server safeguards around each generation. The interface gives a creative action a clear beginning, result and recovery path.',
    outcome: 'An implemented writing experience with a live deployment, explicit request state, and tested spending and privacy boundaries. The portfolio offers authored examples and a word-level comparison in a smaller editorial workspace.',
    limitation: 'Deployment is not the same as production readiness. Live rewriting depends on the service’s access and quota controls. The portfolio’s labelled sample is a written example; it does not generate arbitrary text.',
    decisions: [
      { title: 'Keep the original close.', detail: 'The draft and rewrite sit side by side on wider screens. On phones, they stack in reading order so the source and result remain visible without a hidden tab.', tradeoff: 'The stacked phone layout is longer, but the relationship between source and rewrite stays visible and inspectable.' },
      { title: 'Make the change the reward.', detail: 'The portfolio compares the submitted draft and result word by word. Added or replaced text is highlighted, and the original remains inspectable. Each prepared example identifies its voice and strength.', tradeoff: 'Animation describes a completed result; it never pretends to show model reasoning.' },
      { title: 'Account for a request before it spends.', detail: 'The server reserves budget before dispatch, replays completed operation keys, and retains uncertain reservations when a provider response is interrupted.', tradeoff: 'A timeout cannot automatically trigger another potentially billable generation.' }
    ]
  },
  {
    slug: 'f24', name: 'F24', category: 'Production frontend', type: 'Professional work', number: '02',
    summary: 'Four years of frontend delivery across Svelte and React.',
    role: 'Original Svelte implementation · product UI · React feature delivery', period: 'F24 · 2022–2026',
    stack: ['Svelte', 'React', 'TypeScript', 'Docker', 'GitLab CI'],
    image: '/projects/f24/hackathon.webp', alt: 'Colleagues gathered for a presentation at an F24 hackathon.',
    caption: 'F24 hackathon. A team working session.',
    problem: 'The first challenge was turning product mockups into a dependable Svelte application that could support real production workflows and keep evolving with the product.',
    contribution: 'Built the original Svelte frontend from those mockups into production: reusable UI, interaction states, integrations, tests and release work delivered with product, design, backend and QA.',
    outcome: 'As the product evolved, frontend delivery moved into React: new features, shared UI architecture and migration work while the application continued serving hundreds of companies.',
    limitation: 'Internal product screens and customer data stay private. Adoption reflects the wider team’s work; this case study focuses on the frontend contribution and collaboration model.',
    decisions: []
  },
  {
    slug: 'vigia', name: 'VIGIA', category: 'Crisis intelligence', type: 'Personal project', number: '03',
    summary: 'An operational picture that connects incidents to the decisions around them.',
    role: 'Product strategy, interaction design & frontend systems', period: 'Independent system · Portugal first',
    stack: ['Node.js', 'PostGIS', 'MapLibre', 'OSRM', 'Docker'],
    image: '/projects/vigia/intelligence.webp', alt: 'VIGIA’s operational intelligence workspace with incident context and a Portugal map.',
    caption: 'VIGIA Intelligence. Captured public evaluation interface; the poster is stored with this portfolio.',
    live: { href: 'https://vigia-public-demo.onrender.com', label: 'Explore the public demo' },
    problem: 'A map can show an incident without explaining its consequences. An operator also needs to know which roads and facilities matter, what changed, what support is available, and what remains uncertain.',
    contribution: 'I shaped the interaction model around incidents, facilities, route restrictions, dependencies, resource feasibility and situation history. The interface keeps an incident’s context together instead of scattering it across disconnected dashboards.',
    outcome: 'An explorable operator interface supported by consequence and planning logic. The public portfolio scenario lets visitors inspect the product’s decisions without treating it as an operational emergency system.',
    limitation: 'The public demo is an evaluation surface. Its scenarios do not establish current emergency conditions, safe passage or dispatch authority. Availability depends on its separate deployment.',
    decisions: [
      { title: 'Start with what changed.', detail: 'Incident context, affected services and the next useful inspection stay close to the operational view, so the map supports the task rather than becoming the task.', tradeoff: 'A focused incident view exposes less information at once than an all-layers dashboard.' },
      { title: 'Keep uncertainty visible.', detail: 'Observations carry provenance and freshness. Expired information cannot silently continue to look current.', tradeoff: 'A clear unknown can be less visually satisfying than a definitive answer, but it is the more useful state.' },
      { title: 'Give the public demo a firm boundary.', detail: 'The portfolio experience exposes a controlled evaluation of the console and its decision logic. Unsupported operational actions stay unavailable.', tradeoff: 'The public experience cannot represent every production integration or field condition.' }
    ]
  },
  {
    slug: 'mirror-ai', name: 'Mirror AI', category: 'Visual selection', type: 'Personal project', number: '04',
    summary: 'Point to something. Keep the selected object in context.',
    role: 'Interaction design, frontend & local model integration', period: 'Independent prototype · 2026',
    stack: ['TypeScript', 'Vite', 'Web Workers', 'IndexedDB', 'Ollama'],
    image: '/projects/mirror-ai/active-image-demo-poster.jpg', alt: 'Mirror AI showing an image with a selected object and its contextual information.',
    caption: 'A recorded working interaction from the Mirror AI prototype.', video: '/projects/mirror-ai/active-image-demo.mp4',
    problem: 'An object can be correctly outlined and still wrongly identified. Slow model responses can also make a direct selection feel disconnected from the image that started it.',
    contribution: 'I built the image interaction, local model integration, cache and asynchronous state. User corrections connect to an evaluation workflow so a correction can inform more than the current screen.',
    outcome: 'A working local-first prototype that keeps selected subjects visible while details open, with persistent corrections and inspectable state transitions.',
    limitation: 'The recording demonstrates a working interaction, not general recognition accuracy. It is a prototype; object identity and uncertain output still require human judgment.',
    decisions: [
      { title: 'Keep the subject visible.', detail: 'Selection remains attached to the image while its details open. The user can see exactly which object the information belongs to.', tradeoff: 'The details area must share space with the image, particularly on smaller screens.' },
      { title: 'Separate geometry from identity.', detail: 'Cached scene geometry supports direct interaction while identity is reconciled separately. A valid outline is not treated as proof of a correct label.', tradeoff: 'The interface needs to express partial certainty rather than a single universal success state.' },
      { title: 'Give a correction somewhere to go.', detail: 'Corrections persist and feed an evaluation workflow. Asynchronous responses preserve ownership so older results do not replace a newer selection.', tradeoff: 'Maintaining the correction and request lifecycle adds state-management work behind a simple gesture.' }
    ]
  }
];

export function findProject(slug: string) { return projects.find(project => project.slug === slug); }
