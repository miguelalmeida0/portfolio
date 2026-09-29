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
    slug: 'second-voice-ai', name: 'Second Voice', category: 'Product design & frontend', type: 'Personal project', number: '01',
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
    slug: 'leu', name: 'Leu', category: 'Native AI learning', type: 'Personal project', number: '03',
    summary: 'Read a passage. Find the gap. Return to the exact source.',
    role: 'Product design, native iOS engineering & learning systems', period: 'Independent product · 2026',
    stack: ['SwiftUI', 'PDFKit', 'Swift', 'ONNX Runtime', 'Kokoro-82M'],
    image: '/projects/leu/leu-loop-poster.jpg', alt: 'Leu native iOS product loop showing the Library, source selection, diagnosis, feedback, Teach It Back and exact source return.',
    caption: '28-second native iOS product loop: Library → passage → diagnosis → feedback → Teach It Back → exact source return.', video: '/projects/leu/leu-loop-web.mp4',
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
{
    slug: 'flow', name: 'Flow', category: 'Voice-first personal computing', type: 'Personal project', number: '04',
    summary: 'Tell it what changed. The product changes with you.',
    role: 'Product design, React frontend, voice runtime & deterministic action systems', period: 'Independent product · 2026',
    stack: ['React 19', 'TypeScript 5.9', 'Vite 7', 'Tailwind CSS', 'Motion', 'Zod', 'Web Speech API', 'Playwright'],
    image: '/projects/flow/flow-loop-poster-final.jpg',
    video: '/projects/flow/flow-loop-web-final.mp4',
    alt: 'Flow turning conversation into a changed schedule, a structured plan and a commitment connected to a person.',
    caption: 'Recorded Flow UI. Deterministic speech input passes through the production action engine.',
    live: { href: 'https://miguelalmeida0.github.io/flow/', label: 'Open Flow' },
    source: 'https://github.com/miguelalmeida0/flow',
    problem: 'The hard part is not turning speech into text. It is letting a sentence change real state without making the product unpredictable. If a target is ambiguous, Flow has to ask. If dinner is protected, it has to stay put. If the result is wrong, undo has to restore the whole transaction.',
    contribution: 'I built the path from conversation to typed product action: contextual intent resolution, clarification and confirmation, a shared LifeDocument, transaction validation, undo/redo, and the React surfaces that keep every result directly editable. Calendar, Journal, Friends and Memories all operate on that same model.',
    outcome: 'Flow treats voice as another way to operate the product, not as a separate assistant mode. An intention can become a plan, one step can become scheduled time, a promise can stay attached to the right person, and the user can keep editing everything with ordinary controls.',
    limitation: 'The portfolio film drives the real action pipeline with deterministic recognition. That proves the application path, not microphone accuracy or Chrome speech-service quality. The repository keeps physical microphone acceptance as a separate release gate.',
    decisions: [
      {
        title: 'Speech never writes directly to state.',
        detail: 'A transcript is resolved against the current route, selected entity, recent references and time scope. The command controller turns the result into typed actions; only the transaction layer is allowed to commit them.',
        tradeoff: 'There is more machinery than a direct voice-to-handler shortcut, but interpretation mistakes cannot silently become arbitrary state mutations.'
      },
      {
        title: 'Ambiguity is a product state, not a parser failure.',
        detail: 'If Flow cannot identify the right event or the action is consequential, it can stop at clarification or confirmation before anything changes. Constraints such as protected time stay part of the transaction.',
        tradeoff: 'Some requests take one extra turn. That is preferable to a confident-looking interface that changed the wrong thing.'
      },
      {
        title: 'Undo restores the transaction, not the animation.',
        detail: 'Voice and direct manipulation operate on the same shared document. Undo and redo restore domain history while presentation remains disposable, so motion never becomes a second source of truth.',
        tradeoff: 'History, interruption and stale presentation need their own tests, but recovery stays reliable across surfaces.'
      }
    ]
  },
{
    slug: 'mirror-ai', name: 'Mirror AI', category: 'Visual selection', type: 'Personal project', number: '05',
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
