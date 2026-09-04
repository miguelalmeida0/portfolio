import { isBoundaryQuestion } from './guardrails';
import { normalizeQuery, retrieveMiguelContext, sourceLabels } from './retrieve';
import type { MiguelLLMAnswer, MiguelLLMMode } from './types';
import { findMiguelInterviewAnswer } from '../../data/miguel-llm/interview-answers';

const suggestionsByMode: Record<MiguelLLMMode, string[]> = {
  recruiter: [
    'What is Miguel’s strongest technical project?',
    'What reliability work has Miguel done?',
    'What role is Miguel best suited for?',
    'How does Miguel combine design and engineering?'
  ],
  engineer: [
    'What did Miguel build in Camera Harness?',
    'How does Ask choose visual evidence?',
    'Does Camera Harness run fully locally?',
    'What architecture did Miguel build in Atlas?'
  ],
  design: [
    'How does Miguel combine design and engineering?',
    'What does Microscope actually do?',
    'What is Camera Harness’s biggest architectural lesson?',
    'What do you care about in interfaces?'
  ],
  curious: [
    'What is Camera Harness?',
    'Why AI products?',
    'What is Miguel learning now?',
    'Tell me about Miguel.'
  ]
};

const broadAnswersByMode: Record<MiguelLLMMode, string[]> = {
  recruiter: [
    'The most useful thing to know about me is that I am open-minded, I adapt quickly, and I care a lot about the quality of what I build. My best work combines frontend engineering, product thinking, design, and the chance to keep learning.',
    'I am a curious, product-minded frontend engineer who enjoys difficult problems and works comfortably with different people. Give me a meaningful challenge, clear communication, and room to care about the interface, and I will get invested very quickly.'
  ],
  engineer: [
    'My general engineering instinct is to make the problem understandable first, keep state and ownership explicit, and choose the simplest architecture that can still grow safely. I care about readable code, real UI states, and leaving the next change easier than the last one.',
    'I usually approach technical questions from the product behavior inward: understand the user flow, isolate the difficult state, make the tradeoffs visible, and then build the cleanest reusable solution the problem has actually earned.'
  ],
  design: [
    'My design instinct is to remove confusion before adding decoration. I care about hierarchy, responsive behavior, motion, empty states, and all the small details that help an interface feel calm, clear, and made by someone who was paying attention.',
    'I like interfaces that are beautiful without becoming precious about it. The user should understand the flow, the layout should survive every screen size, and the implementation should preserve the taste instead of flattening it.'
  ],
  curious: [
    'I am a Portuguese software engineer living in Berlin, endlessly curious about technology, AI, design, architecture, music, and whatever new problem has caught my attention this week. I am happiest when I am learning or making something work better.',
    'The human version is that I am a curious homebody who likes coding, designing, learning about AI, listening to music, and getting far too emotionally invested in solving difficult interface problems.'
  ]
};

export function suggestedQuestionsForMode(mode: MiguelLLMMode) {
  return suggestionsByMode[mode];
}

function makeAnswer(
  question: string,
  mode: MiguelLLMMode,
  answer: Omit<MiguelLLMAnswer, 'runtime' | 'provider' | 'model' | 'questionMode'>,
  fallbackSources: string[] = []
): MiguelLLMAnswer {
  return {
    runtime: 'local-fallback',
    provider: 'local-fallback',
    model: 'deterministic-local-fallback',
    questionMode: mode,
    ...answer,
    sources: answer.sources.length ? answer.sources : fallbackSources,
    suggestedNextQuestions: answer.suggestedNextQuestions.length
      ? answer.suggestedNextQuestions
      : suggestedQuestionsForMode(mode).filter((item) => item !== question).slice(0, 3)
  };
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function chooseFresh(question: string, recentAnswers: string[], options: string[]) {
  const startIndex = Array.from(question).reduce((total, character) => total + character.charCodeAt(0), 0) % options.length;
  const recent = recentAnswers.join(' ').toLowerCase();

  for (let offset = 0; offset < options.length; offset += 1) {
    const candidate = options[(startIndex + offset) % options.length];
    const fingerprint = candidate.toLowerCase().slice(0, 48);
    if (!recent.includes(fingerprint)) return candidate;
  }

  return options[startIndex];
}

export function buildFallbackAnswer(
  question: string,
  mode: MiguelLLMMode,
  recentAnswers: string[] = []
): MiguelLLMAnswer {
  const normalized = normalizeQuery(question);
  const chunks = retrieveMiguelContext(question, mode, 5);
  const sources = sourceLabels(chunks);

  if (isBoundaryQuestion(question)) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I cannot speak for Miguel live or discuss private details, but I can help you understand his work, interests, and the kind of role that seems to fit him best.',
        bullets: [
          'Salary, private details, confidential employer information, and unapproved availability are outside the public notes.',
          'If something is not in the approved context, I will say so instead of filling the silence with nonsense.',
          'For hiring specifics, the best move is still to contact Miguel directly.'
        ],
        sources: ['Miguel personality ingestion / Miguel-approved notes', 'MiguelLLM guardrail'],
        suggestedNextQuestions: ['What role fits you best?', 'How can I contact Miguel?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'strongest technical project',
      'strongest project',
      'inspect first',
      'should i inspect',
      'look at first'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Start with Camera Harness. It is my strongest systems case study because it shows the useful parts and the uncomfortable parts: explicit media lifecycle ownership, bounded asynchronous work, local tracking, stale-result protection, and the missing evidence contract between what the interface shows and what Ask analyzes.',
        bullets: [
          'The current implementation combines Ask, Watch, and Microscope across browser, local-service, and hosted-service boundaries.',
          'Its central lesson is that interface continuity is not evidence continuity.',
          'The proposed immutable evidence record is deliberately labeled as proposed, not shipped.'
        ],
        sources: [
          'Camera Harness overview|/work/camera-harness#what-it-is',
          'Ask provenance|/work/camera-harness#ask-provenance',
          'Current versus proposed|/work/camera-harness#current-vs-proposed'
        ],
        suggestedNextQuestions: [
          'What did Miguel build in Camera Harness?',
          'How does Ask choose visual evidence?',
          'Does Camera Harness run fully locally?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'what is camera harness',
      'what did miguel build in camera',
      'what did you build in camera',
      'camera harness do',
      'camera project'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Camera Harness is an experimental multimodal system for studying how live camera evidence becomes bounded, inspectable interface state. I built around explicit camera lifecycle cleanup, motion gating, generation-owned requests, local object tracking, bounded semantic attempts, and transient image-memory limits.',
        bullets: [
          'Ask captures a short frame window after a final speech transcript.',
          'Microscope runs a local YOLO-World and ByteTrack path with bounded Florence refinement.',
          'It is a research prototype, not a production-ready perception product.'
        ],
        sources: [
          'What Camera Harness is|/work/camera-harness#what-it-is',
          'Runtime architecture|/work/camera-harness#runtime-architecture',
          'Microscope|/work/camera-harness#microscope'
        ],
        suggestedNextQuestions: [
          'What is Camera Harness’s biggest architectural lesson?',
          'How does Ask choose visual evidence?',
          'What does Microscope actually do?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'biggest architectural lesson',
      'biggest lesson',
      'evidence continuity',
      'evidence boundary'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'The biggest lesson is that interface continuity is not evidence continuity. A label can remain visible while Ask captures a later frame window through a separate path, so the interface may look coherent even when the answer and the visible object do not share one immutable evidence record.',
        bullets: [
          'Current generation checks reject stale asynchronous responses, but they do not create shared object provenance.',
          'The proposed fix is a frame broker and immutable evidence record shared by Ask, Watch, and Microscope.'
        ],
        sources: [
          'Why it is difficult|/work/camera-harness#why-it-is-hard',
          'Ask provenance|/work/camera-harness#ask-provenance',
          'Current versus proposed|/work/camera-harness#current-vs-proposed'
        ],
        suggestedNextQuestions: [
          'How does Ask choose visual evidence?',
          'What does the proposed evidence record contain?',
          'What remains unproven?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'fully local',
      'local only',
      'all local',
      'frames leave',
      'privacy boundary',
      'hosted inference'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'No, Camera Harness is not fully local in every mode. Microscope object processing is designed to use local loopback services, while Ask and Watch may send JPEG frames to hosted inference; browser speech-recognition locality also depends on the browser.',
        bullets: [
          'Media tracks, requests, timers, and bounded image buffers are explicitly cleaned up.',
          'No persistence does not mean no transmission.',
          'The portfolio does not claim a broad privacy or security guarantee.'
        ],
        sources: [
          'Trust and privacy boundary|/work/camera-harness#trust-boundary',
          'Runtime architecture|/work/camera-harness#runtime-architecture',
          'Limitations|/work/camera-harness#limitations'
        ],
        suggestedNextQuestions: [
          'How does Camera Harness clean up media?',
          'How does Ask choose visual evidence?',
          'What remains unproven?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'how does ask',
      'ask choose',
      'ask evidence',
      'ask provenance',
      'selected object',
      'selected region',
      'region grounded'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Ask currently captures a fresh, short frame window after the final speech transcript. It does not consume the visible Microscope track ID or best crop, and the user is not shown one immutable frozen frame, so the answer can refer to a different evidence window from the visible label.',
        bullets: [
          'Generation ownership, bounded scheduling, and stale-result rejection are implemented.',
          'Exact frame, crop, and region provenance are not yet shared across Ask and Microscope.'
        ],
        sources: [
          'Ask provenance|/work/camera-harness#ask-provenance',
          'Current versus proposed|/work/camera-harness#current-vs-proposed'
        ],
        suggestedNextQuestions: [
          'What is Camera Harness’s biggest architectural lesson?',
          'What does Microscope actually do?',
          'What would the proposed architecture change?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['microscope', 'microscopic'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Microscope is a local object-label pipeline, not a magnifying glass. It captures a bounded frame, runs YOLO-World and ByteTrack, keeps short-lived object IDs and best crops, and invokes Florence under a strict semantic budget before updating floating labels.',
        bullets: [
          'It uses latest-frame backpressure and motion-adaptive cadence.',
          'Raw image memory, timers, tracks, requests, and labels are bounded and cleared on exit.',
          'Recognition quality, calibrated confidence, and occlusion robustness remain unproven.'
        ],
        sources: [
          'Microscope|/work/camera-harness#microscope',
          'Temporal identity|/work/camera-harness#temporal-identity',
          'Limitations|/work/camera-harness#limitations'
        ],
        suggestedNextQuestions: [
          'Does Camera Harness run fully locally?',
          'How stable are object IDs?',
          'How does Ask choose visual evidence?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'neural field',
      'airscript',
      'spatial lasso',
      'integration drift',
      'historical feature'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Neural Field, AirScript, and Spatial Lasso are historical, not part of the current integrated UI. Their modules, fixtures, screenshots, and reports remained after active wiring and package commands were removed, which exposed a governance problem: evidence can outlive the product graph it once described.',
        bullets: [
          'Commit 4b18fce8 exposed the features in the active UI.',
          'Commit a0f0f5a2 removed active integration during stabilization.',
          'The lesson is to pin readiness evidence to the active commit and mounted product graph.'
        ],
        sources: ['Integration drift|/work/camera-harness#integration-drift'],
        suggestedNextQuestions: [
          'How was Camera Harness tested?',
          'What is current versus proposed?',
          'What remains unproven?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'atlas architecture',
      'what did miguel build in atlas',
      'what did you build in atlas',
      'tell me about atlas',
      'atlas project'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Atlas is a read-only code-intelligence architecture where deterministic analysis produces the underlying risk and model retrieval explains it afterward. The case study focuses on tenant isolation, request-scoped database context, workspace and ingestion-run boundaries, auditability, and the corrections required to keep those boundaries honest.',
        bullets: [
          'The model does not invent the underlying risk.',
          'PostgreSQL row-level security and explicit request context carry the tenant boundary.',
          'Performance and security claims stay qualified rather than implying production adoption.'
        ],
        sources: ['Atlas case study|/work/atlas'],
        suggestedNextQuestions: [
          'Why deterministic risk first?',
          'How does Atlas isolate tenants?',
          'What is Miguel’s strongest technical project?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  const interviewAnswer = findMiguelInterviewAnswer(normalized);

  if (interviewAnswer) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer: interviewAnswer.shortAnswer,
        bullets: [],
        sources: interviewAnswer.sources,
        suggestedNextQuestions: interviewAnswer.suggestedNextQuestions,
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'who are you',
      'who is',
      'tell me about',
      'about miguel',
      'summarize',
      '30 seconds',
      'non-corporate',
      'non corporate',
      'profile'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer: chooseFresh(question, recentAnswers, [
          'I am Miguel, a Portuguese software engineer living in Berlin. I grew up around computers in Lisbon and never really stopped pulling things apart to see how they work.',
          'I am a frontend engineer, a design enthusiast, and the sort of person who may lose sleep over a stubborn UI problem. The sweet spot for me is where product taste, reusable code, and practical AI meet.',
          'The short, non-corporate version: I love building things, learning how systems work, and polishing interfaces until they feel calm instead of exhausting.'
        ]),
        bullets: [
          'The non-corporate version: I am a curious homebody who loves coding, design, better animations, and learning new things.',
          'I care about beautiful interfaces, but not in a decoration-only way. The UX still has to make sense.',
          'The best work for me sits where frontend engineering, product UI, design craft, and practical AI workflows meet.'
        ],
        sources: sources.length
          ? sources
          : ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio hero / Miguel-provided direction'],
        suggestedNextQuestions: [
          'What kind of engineer are you?',
          'What work makes you lose track of time?',
          'What role fits you best?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['where do you live', 'where are you based', 'living', 'based now'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer: chooseFresh(question, recentAnswers, [
          'I live in Berlin now - a beautiful city with just the right amount of creative chaos. I am Portuguese and grew up in Lisbon, so both places are part of my story.',
          'Berlin is home these days, although Lisbon is where I grew up. I like having Portuguese roots and Berlin energy in the same life.',
          'I am a Portuguese guy living in Berlin. Lisbon raised me; Berlin is where I am building the next chapter.'
        ]),
        bullets: [],
        sources: ['Personal biography / Miguel-approved notes', 'Portfolio location'],
        suggestedNextQuestions: ['Where did you grow up?', 'What kind of role are you looking for?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['where did you grow', 'grew up', 'from originally', 'where are you from'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I grew up in Lisbon, surrounded by computers and software from a young age. That curiosity followed me to Berlin and, apparently, never learned how to sit quietly.',
        bullets: [],
        sources: ['Personal biography / Miguel-approved notes'],
        suggestedNextQuestions: ['Why did you get into technology?', 'What are you learning now?'],
        confidence: 'high'
      },
      sources
    );
  }

  const asksCurrentEmployer =
    (/\b(where|company|employer)\b.*\b(work|working)\b/.test(normalized) &&
      /\b(currently|current|now|presently)\b/.test(normalized)) ||
    /\bwork(?:ing)?\s+(?:at|for)\b/.test(normalized) ||
    /\bcurrent employer\b/.test(normalized);

  if (asksCurrentEmployer) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer: chooseFresh(question, recentAnswers, [
          'I currently work at F24 as a mid-level software engineer. The public version is simple: I ship product features and take increasing ownership of shared frontend architecture and the design-system layer.',
          'Right now I am a mid-level software engineer at F24. It is where production constraints turned a lot of frontend theory into much better judgment.',
          'I work at F24 as a mid-level software engineer, building product UI and contributing to the shared frontend and design-system foundations.'
        ]),
        bullets: [],
        sources: ['CV / Experience timeline'],
        suggestedNextQuestions: ['What have you learned at F24?', 'What kind of role fits you next?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'what are you looking for',
      'what do you look for',
      'what do you want',
      'looking for next',
      'looking for in a role',
      'open to',
      'opportunities'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I am open to any projects. I would like to join a team that is currently working with AI, or starting to implement AI in its processes, because that fascinates me a lot!',
        bullets: [],
        sources: ['Personal biography / Miguel-approved notes'],
        suggestedNextQuestions: ['What kind of team would you like to join?', 'Why does AI interest you?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'passion',
      'passionate',
      'personal interests',
      'interests outside',
      'what do you love',
      'what excites you in life'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I am passionate about learning new AI topics and discovering new technologies. I also really enjoy upgrading a project architecture or improving a complicated flow until everything works more cleanly - and outside of tech, listening to music is a big part of my everyday life.',
        bullets: [],
        sources: ['Personal biography / Miguel-approved notes'],
        suggestedNextQuestions: ['What AI topics are you learning?', 'What kind of problems do you enjoy solving?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'kind of team',
      'type of team',
      'team would you',
      'team do you',
      'working environment',
      'work environment',
      'adapt to',
      'different people',
      'team culture'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I am more than used to working with different people, and I can adapt super fast to any environment. I am open-minded about the team itself - what matters most is having an interesting challenge and people who care about building something well.',
        bullets: [],
        sources: ['Personal biography / Miguel-approved notes'],
        suggestedNextQuestions: ['What are you looking for next?', 'What kind of work excites you most?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'what are you working on',
      'working currently',
      'currently working on',
      'current focus',
      'learning now',
      'studying now'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer: chooseFresh(question, recentAnswers, [
          'Lately I have been going deeper into AI and machine learning, especially image-to-text, text-to-speech, agents, and the interfaces people need to use those systems without losing their minds.',
          'My current rabbit hole is the product side of AI: agents, voice, image-to-text, and how a good frontend helps people trust, edit, and recover from model output.',
          'I am sharpening the overlap between frontend craft and AI workflows right now. React, TypeScript, Svelte, design, and a suspicious number of experiments are all involved.'
        ]),
        bullets: [],
        sources: ['Personal biography / Miguel-approved notes', 'Miguel personality ingestion / Miguel-approved notes'],
        suggestedNextQuestions: ['Why are you interested in AI products?', 'What project feels most like you?'],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'kind of engineer',
      'engineer are you',
      'technical skills',
      'skills',
      'technical'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I am a frontend/product UI engineer with a strong design sensibility. Basically: I like clean code, responsive interfaces, and the tiny product details that make a screen feel considered.',
        bullets: [
          'My strongest tools right now are React, Svelte, JavaScript, TypeScript, responsive implementation, frontend architecture, and reusable UI code.',
          'I am careful with third-party libraries. I like good ones, but I do not want a product held together by dependencies that age badly.',
          'I would not pretend to be a deep backend or ML infrastructure person. My sweet spot is the product-facing layer.'
        ],
        sources: sources.length
          ? sources
          : ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio hero / CV stack'],
        suggestedNextQuestions: [
          'How do you think about reusable UI?',
          'What do you care about in interfaces?',
          'What role fits you best?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'lose track',
      'energize',
      'energizes',
      'excites',
      'work makes',
      'drains',
      'avoid'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I lose track of time when I can mix coding, designing, and learning - especially around AI workflows and interfaces that need real taste.',
        bullets: [
          'Recently I have been especially interested in agents, voice chats, image-to-text, and how AI can change frontend/product-building workflows.',
          'What drains me is a purely implementation-only role with no room for UI judgment, product thinking, or design craft.',
          'That said, I am open-minded. If the challenge is interesting, I do not want the door slammed too quickly.'
        ],
        sources: sources.length ? sources : ['Miguel personality ingestion / Miguel-approved notes'],
        suggestedNextQuestions: [
          'Why are you interested in AI products?',
          'What role fits you best?',
          'What are you trying to improve?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'role',
      'fit',
      'company',
      'best for',
      'next role',
      'want to work',
      'wanna work',
      'like to work',
      'looking for',
      'ideal team',
      'kind of team',
      'type of team',
      'team would you',
      'dream job'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer: chooseFresh(question, recentAnswers, [
          'I would love to join a company building serious AI products - or one beginning that transition thoughtfully. The role I want sits where frontend engineering, product thinking, design taste, and AI workflows overlap.',
          'My best fit is a product-minded frontend team where engineering quality and design judgment both count. Add meaningful AI work to that mix and you have my attention very quickly.',
          'I am looking for the kind of frontend role where I can care about the code and the experience, ideally on a team exploring useful AI rather than sprinkling the label onto everything.'
        ]),
        bullets: [
          'I am especially interested in teams building AI products or teams preparing to bring AI into the product in a serious way.',
          'I am open to different frontend challenges, but the role should leave room for UI judgment and design craft.',
          'I should not be positioned as a fake senior. Mid-level frontend/product UI engineer is the honest lane.'
        ],
        sources: sources.length
          ? sources
          : ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio positioning / CV CTA'],
        suggestedNextQuestions: [
          'What work makes you lose track of time?',
          'What should I inspect first?',
          'What do you care about in interfaces?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['interface', 'interfaces', 'ux', 'ui', 'design', 'responsive'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I care about interfaces that are clear, responsive, and visually considered. Pretty is nice; pretty and confusing is still a problem.',
        bullets: [
          'Responsive UI is one of my strongest areas: keeping layouts usable and polished across different screens.',
          'I have very little patience for cliche interfaces that are dull and hard to understand. My instinct is to make the UX clearer and better looking.',
          'Beautiful UI should not come at the expense of usability. The user still needs to know what is happening.'
        ],
        sources: sources.length ? sources : ['Miguel personality ingestion / Miguel-approved notes'],
        suggestedNextQuestions: [
          'How do you think about reusable UI?',
          'What project feels most like you?',
          'What are you trying to improve?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'ai',
      'agents',
      'agent',
      'machine learning',
      'image-to-text',
      'text-to-speech',
      'voice chat',
      'why ai'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'AI has become part of my daily workflow, but I care most about the product and evidence layer: how people ask, inspect, trust, correct, and recover when a model is wrong.',
        bullets: [
          'Camera Harness is the clearest systems signal because it exposes the gap between a model response and the exact visual evidence behind it.',
          'Atlas shows a second pattern: deterministic analysis creates the risk, while a model explains rather than invents it.',
          'I am interested in useful AI workflows, not labels pasted onto ordinary software.'
        ],
        sources: sources.length
          ? sources
          : [
              'Camera Harness overview|/work/camera-harness#what-it-is',
              'Ask provenance|/work/camera-harness#ask-provenance',
              'Atlas case study|/work/atlas'
            ],
        suggestedNextQuestions: [
          'What project feels most like you?',
          'What role fits you best?',
          'What work makes you lose track of time?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['improve', 'growth', 'weakness', 'right now', 'trying to improve'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'I am working on calling things done at the right moment. The funny little danger is that when I enjoy a task, I can keep polishing it longer than planned.',
        bullets: [
          'It comes from care, not from lack of direction. I like things to feel right.',
          'The growth area is knowing when the work is strong enough to ship and when another polish pass is just me having too much fun.',
          'That matters in product teams because momentum is part of quality too.'
        ],
        sources: sources.length ? sources : ['Miguel personality ingestion / Miguel-approved notes'],
        suggestedNextQuestions: [
          'What work makes you lose track of time?',
          'What kind of engineer are you?',
          'What role fits you best?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (
    includesAny(normalized, [
      'favorite project',
      'feels most like you',
      'ghostwriter',
      'ghostwritter',
      'project'
    ])
  ) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Camera Harness is the project that best represents how I think now: visual interface craft on the surface, explicit lifecycle and asynchronous boundaries underneath, and an honest account of where the evidence still breaks.',
        bullets: [
          'Camera Harness is the flagship architecture story.',
          'Atlas is the stronger supporting example for deterministic analysis and tenant boundaries.',
          'Ghostwriter is the concise reliability story: migrations, sessions, CSP, and production hardening.'
        ],
        sources: sources.length
          ? sources
          : [
              'Camera Harness overview|/work/camera-harness#what-it-is',
              'Atlas case study|/work/atlas',
              'Ghostwriter case study|/work/ghostwriter'
            ],
        suggestedNextQuestions: [
          'Why are you interested in AI products?',
          'What should I inspect first?',
          'What do you care about in interfaces?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['reusable', 'design system', 'components', 'libraries', 'library'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Reusable UI matters to me because it is where craft turns into something dependable. A good component should make the next screen easier, not quietly create five new problems.',
        bullets: [
          'I like clean, reusable code and patterns that hold up across real product states.',
          'I am careful about adding too many libraries because maintenance and deprecation debt can sneak up on a team.',
          'I still like well-chosen libraries when they genuinely improve the product. I am not trying to build everything with a rock and a stick.'
        ],
        sources: sources.length ? sources : ['Miguel personality ingestion / Miguel-approved notes'],
        suggestedNextQuestions: [
          'What kind of engineer are you?',
          'What do you care about in interfaces?',
          'What are you trying to improve?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['inspect first', 'should i inspect', 'look at first', 'strongest'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Start with Camera Harness. It is the deepest account of my engineering judgment, including the boundaries that work, the evidence that does not yet line up, and the architecture I would build next.',
        bullets: [
          'Read the runtime architecture for the current hybrid topology.',
          'Read Ask provenance for the central unresolved evidence gap.',
          'Read current versus proposed for the immutable evidence contract.'
        ],
        sources: [
          'Runtime architecture|/work/camera-harness#runtime-architecture',
          'Ask provenance|/work/camera-harness#ask-provenance',
          'Current versus proposed|/work/camera-harness#current-vs-proposed'
        ],
        suggestedNextQuestions: [
          'What project feels most like you?',
          'Why are you interested in AI products?',
          'What kind of role fits you best?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['f24', 'previous work', 'production', 'job', 'work experience'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'My previous work helped me grow a lot as a frontend engineer. F24 gave me real production constraints, daily technical learning, and a better sense of what dependable UI actually requires.',
        bullets: [
          'That experience matters because portfolio projects are one thing; production software with real users and constraints teaches different muscles.',
          'The approved notes point to collaboration, product constraints, reusable UI, and stronger frontend judgment.',
          'I should not invent confidential details or private employer context beyond the public portfolio/CV notes.'
        ],
        sources: sources.length
          ? sources
          : ['Miguel personality ingestion / Miguel-approved notes', 'CV / Experience timeline'],
        suggestedNextQuestions: [
          'What kind of engineer are you?',
          'How do you think about reusable UI?',
          'What should I inspect first?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['aviation'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'Before tech, I worked in aviation. It taught me the value of calm communication, checklists, and systems that behave predictably when people need them most - lessons that still show up in how I approach QA, handoffs, and production UI.',
        bullets: [
          'Procedures and checklists made careful verification feel normal rather than ceremonial.',
          'Clear communication mattered because ambiguity could have real consequences.',
          'That background is one reason I value dependable interfaces and calm failure states.'
        ],
        sources: sources.length
          ? sources
          : ['Portfolio story / Aviation chapter', 'Portfolio content / Career timeline'],
        suggestedNextQuestions: [
          'How does aviation influence your engineering?',
          'How do you ensure quality?',
          'How do you handle pressure?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  if (includesAny(normalized, ['contact', 'email', 'reach', 'linkedin', 'cv', 'phone'])) {
    return makeAnswer(
      question,
      mode,
      {
        shortAnswer:
          'The fastest path is direct email. LinkedIn and the downloadable CV are also available from the portfolio contact section.',
        bullets: [
          'Email: miguelalmeida1592@gmail.com.',
          'LinkedIn: linkedin.com/in/miguelalmeida1.',
          'For anything specific like hiring details, Miguel should answer directly rather than having me improvise.'
        ],
        sources: ['Portfolio contact section'],
        suggestedNextQuestions: [
          'What role fits you best?',
          'What kind of engineer are you?',
          'What should I inspect first?'
        ],
        confidence: 'high'
      },
      sources
    );
  }

  return makeAnswer(
    question,
    mode,
    {
      shortAnswer: chooseFresh(question, recentAnswers, broadAnswersByMode[mode]),
      bullets: [
        'For engineering evidence, start with Camera Harness and its exact section links.',
        'For architecture and tenant boundaries, inspect Atlas.',
        'For ordinary production reliability, inspect Ghostwriter and the F24 timeline.'
      ],
      sources: sources.length ? sources : ['Miguel personality ingestion / Miguel-approved notes', 'Portfolio positioning'],
      suggestedNextQuestions: suggestedQuestionsForMode(mode),
      confidence: chunks.length ? 'medium' : 'low'
    },
    sources
  );
}
