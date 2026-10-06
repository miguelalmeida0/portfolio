import { SECOND_VOICE_URL } from './voice-bridge';
import { leuMedia } from '../content/leu-media';

export type Project = {
  slug: string; name: string; category: string; type: string; number: string;
  summary: string; role: string; ownership: string; period: string; stack: string[];
  image: string; alt: string; caption: string; video?: string;
  live?: { href: string; label: string }; source?: string;
  problem: string; contribution: string; outcome: string; limitation: string;
  decisions: { title: string; detail: string; tradeoff: string }[];
};

export const projects: Project[] = [
  {
    slug: 'needle', name: 'Needle', category: 'Search & performance engineering', type: 'Personal project', number: '01',
    summary: 'Search 10,000 artworks. A semantic search engine.',
    role: 'Product design & performance engineering', period: 'Independent product · 2026',
    ownership: 'Designed and engineered the search interface, worker retrieval, prepared index and image delivery pipeline.',
    stack: ['React', 'TypeScript', 'Web Workers', 'HNSW', 'Node.js', 'Sharp', 'Docker'],
    image: '/projects/needle/wall-monolith.webp', alt: 'Needle’s collection wall with the Monolith mark, forest-green selection and Hercules and the Hydra ranked first.',
    caption: 'Live Needle, captured with Playwright at revision 2546fb1. The collection wall shows real Met artworks with Hercules and the Hydra ranked first.',
    live: { href: 'https://needle.miguelalmeida.xyz', label: 'Open Needle' }, source: 'https://github.com/miguelalmeida0/needle-portfolio-release',
    problem: 'A visual search product coordinates retrieval, image transfer and rendering. A ranked ID is not useful while the artwork remains invisible.',
    contribution: 'Prepared the search graph ahead of a visit, moved retrieval into a worker and built bounded image derivatives with explicit source identity, HTTP validation and viewport-aware rendering.',
    outcome: 'A public deployable release with 10,000 Met catalog records, 120 local opening images, a corpus-bound graph and a windowed collection wall. The case study connects the shipped mechanisms to their source.',
    limitation: 'Historical before/after reports are not included in the public release, so timing improvements are not certified here. Remote imagery and cold corpus transfer remain separate costs. Experimental neural retrieval is not enabled on public hosts.',
    decisions: []
  },
  {
    slug: 'second-voice-ai', name: 'Second Voice', category: 'Product design & frontend', type: 'Personal project', number: '02',
    summary: 'Choose a literary voice. See exactly what changes.',
    role: 'Design & engineering', period: 'Independent product · 2026',
    ownership: 'I designed and built the writing interface, edit comparison and request recovery.',
    stack: ['React', 'TypeScript', 'AI integration', 'Playwright'],
    image: '/projects/ghostwriter/ghostwriter-demo-poster.webp', alt: 'The Second Voice writing interface, with author controls and a rewrite workspace.',
    caption: 'The standalone Second Voice writing experience. Recorded product interaction.', video: '/projects/ghostwriter/ghostwriter-demo.mp4',
    live: { href: SECOND_VOICE_URL, label: 'Open Second Voice' }, source: 'https://github.com/miguelalmeida0/second-voice',
    problem: 'A rewrite is easy to generate and surprisingly hard to trust. The writer needs to understand what changed, keep their original draft, and remain in control when a request is slow or fails.',
    contribution: 'I designed and engineered the writing flow: author and mood controls, draft and result states, edit playback, and the server safeguards around each generation. The interface gives a creative action a clear beginning, result and recovery path.',
    outcome: 'An implemented writing experience with explicit request state, draft preservation and inspectable edits. The portfolio offers authored examples and a word-level comparison in a smaller editorial workspace.',
    limitation: 'Deployment is not the same as production readiness. The public app opened on 29 September 2026, but a sample rewrite returned “Request blocked.” Live generation remains unverified. The portfolio’s labelled sample is a written example; it does not generate arbitrary text.',
    decisions: [
      { title: 'Keep the original close.', detail: 'The draft and rewrite sit side by side on wider screens. On phones, they stack in reading order so the source and result remain visible without a hidden tab.', tradeoff: 'The stacked phone layout is longer, but the relationship between source and rewrite stays visible and inspectable.' },
      { title: 'Make the change the reward.', detail: 'The portfolio compares the submitted draft and result word by word. Added or replaced text is highlighted, and the original remains inspectable. Each prepared example identifies its voice and strength.', tradeoff: 'Animation describes a completed result; it never pretends to show model reasoning.' },
      { title: 'Keep a failed request recoverable.', detail: 'Capture the draft and settings at submission. If a request fails, keep the input and the last successful rewrite available, show the error, and let the writer retry. Provider reads are bounded and cancellable.', tradeoff: 'The interface must track selected settings, submitted settings and the previous result separately. A newly selected voice cannot relabel an older rewrite.' }
    ]
  },
{
    slug: 'f24', name: 'F24', category: 'Production frontend', type: 'Professional work', number: '03',
    summary: 'Built a product used by hundreds of companies.',
    role: 'Frontend architecture & product delivery', period: 'F24 · 2022–now',
    ownership: 'Built Connectivity Hub’s original frontend alongside product, design, backend and QA. Modular architecture, reusable components, service integrations and performance, with continued delivery as the product evolves from Svelte toward React.',
    stack: ['Svelte', 'React', 'TypeScript', 'Playwright'],
    image: '/projects/f24/hackathon.webp', alt: 'Colleagues gathered for a presentation at an F24 hackathon.',
    caption: 'F24 hackathon. A team working session.',
    problem: 'The first challenge was turning product mockups into a dependable Svelte application that could support real production workflows and keep evolving with the product.',
    contribution: 'Built Connectivity Hub’s original frontend within F24’s product team. Designed modular, reusable architecture, connected backend services to product workflows and improved application performance, collaborating with product, design, backend and QA through delivery.',
    outcome: 'A product used by hundreds of companies, delivered together. Frontend contributions span the original Svelte application and continued React feature delivery.',
    limitation: 'Internal product screens and customer data stay private. Adoption reflects the wider team’s work; this case study focuses on the frontend contribution and collaboration model.',
    decisions: []
  },
{
  "slug": "flow",
  "name": "Flow",
  "category": "Voice-first personal computing",
  "type": "Personal project",
  "number": "04",
  "summary": "Move a meeting. Inspect the change. Undo it.",
  "role": "Product design & frontend engineering",
  "ownership": "I designed and built the React interface and action model that turn spoken requests into editable calendar events, plans and commitments.",
  "period": "Independent product · 2026",
  "source": "https://github.com/miguelalmeida0/flow",
  "stack": [
    "React",
    "TypeScript",
    "Motion",
    "Zod",
    "Playwright"
  ],
  "image": "/projects/flow/flow-loop-poster-final.jpg",
  "video": "/projects/flow/flow-loop-web-final.mp4",
  "alt": "Flow turning conversation into a changed schedule, a structured plan and a commitment connected to a person.",
  "caption": "Recorded Flow UI with controlled speech input: the real action engine changes the schedule. Microphone recognition is not demonstrated.",
  "problem": "Life changes in sentences, while software asks us to update separate screens. A delayed day, a new intention and a promise to someone should remain connected without making the user translate everything into forms.",
  "contribution": "I designed and engineered conversation as an input to shared life state. Flow resolves intent, asks for clarification or confirmation when needed, and executes a deterministic action. Calendar, Journal, Friends and Memories provide concrete places to inspect and edit the result.",
  "outcome": "Conversation can create persistent objects and change their relationships: an intention becomes a plan, a plan step becomes scheduled time, and a commitment remains connected to a person. The visible result stays editable through ordinary controls.",
  "limitation": "The film uses the existing deterministic recognition adapter to exercise production actions. It demonstrates product behavior, not microphone accuracy, speech latency or a general intelligence benchmark. Current release and motion acceptance remain separate checks.",
  "decisions": [
    {
      "title": "Let conversation change the product.",
      "detail": "Intent resolves to a structured action and the result appears in its working surface. Calendar, Journal, Friends and Memories share the same life model.",
      "tradeoff": "Natural language needs explicit interpretation and ambiguity handling before it can safely change persistent state."
    },
    {
      "title": "Keep consequences editable.",
      "detail": "A voice-created object uses the same state and controls as an object created through the interface. Clarification, confirmation and correction are part of the interaction.",
      "tradeoff": "The action engine and the interface must agree on identity, ownership and valid state across every surface."
    },
    {
      "title": "Make interruption part of the system.",
      "detail": "New commands can interrupt presentation. Undo and redo operate on action history, so motion does not become the owner of product truth.",
      "tradeoff": "Animation cleanup and history restoration require their own tests alongside the visible journey."
    }
  ]
},
{
    slug: 'leu', name: 'Leu', category: 'Native AI learning', type: 'Personal project', number: '05',
    summary: 'Read a passage. Find the gap. Return to the exact source.',
    role: 'Product design & native engineering', period: 'Independent product · 2026',
    ownership: 'Designed and built the native learning experience, from reader interaction and source-linked learning to on-device neural narration.',
    stack: ['SwiftUI', 'PDFKit', 'iOS', 'ONNX Runtime'],
    source: 'https://github.com/miguelalmeida0/leu',
    live: { href: 'https://leu-desktop.vercel.app/', label: 'Open Leu desktop' },
    image: leuMedia.poster, alt: leuMedia.label,
    caption: leuMedia.caption, video: leuMedia.src,
    problem: 'Reading a PDF is not the same as understanding it. Generic AI explanations can drift away from the source, while quiz flows often test recall without helping the learner repair the exact gap.',
    contribution: 'I designed and engineered the native learning loop around source ownership: select a passage, answer a grounded diagnostic question, receive specific feedback, clarify or go harder, return to the exact source, then Teach It Back. The iOS app also includes an in-process neural narration system with source-following highlights and explicit playback state.',
    outcome: 'A native SwiftUI/PDFKit learning product with source-linked sessions, exact source return, persistent learning state and on-device neural narration. The current Kokoro build completed more than 2.8 minutes of continuous native playback in iOS Simulator, and its generated clips were listening-reviewed before this case study was published.',
    limitation: 'Physical-iPhone performance, peak memory and energy use, a full VoiceOver/Reduce Motion pass, production-PDF validation on the new Simulator, and TestFlight signing remain release work.',
    decisions: [
      { title: 'Never detach the answer from the source.', detail: 'Selections preserve document identity and exact text ranges through questioning, feedback and source return. The learner can always get back to the passage that triggered the session.', tradeoff: 'The product carries more source-state than a conventional chat or quiz flow, but that state is what makes the learning trace inspectable.' },
      { title: 'Diagnose, repair, then ask for explanation.', detail: 'A session can move from a diagnostic answer into specific feedback, clarification, a harder follow-up and Teach It Back instead of ending at correct or incorrect.', tradeoff: 'The state machine is more involved than a card carousel, but each transition has a distinct learning job.' },
      { title: 'Keep neural voice inside the app.', detail: 'Kokoro-82M runs through native ONNX Runtime and AVAudioEngine. Narration follows the active source, pause softens the mark, Stop clears it, and stale generation cannot begin playing after replacement or cancellation.', tradeoff: 'Bundled model assets and runtime memory are meaningful costs, so physical-device performance still needs release validation.' }
    ]
  },
];

export function findProject(slug: string) { return projects.find(project => project.slug === slug); }
