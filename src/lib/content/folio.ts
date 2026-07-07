import type {
  ApproachItem,
  ConversationFlow,
  CvEducationEntry,
  CvExperienceEntry,
  ExperienceTeaserItem,
  HeroContent,
  MetaLink,
  SelectedWorkItem,
  StoryChapter
} from '$lib/types/folio';

export const site = {
  name: 'Miguel Almeida',
  location: 'Berlin',
  email: 'miguelalmeida1592@gmail.com',
  phone: '+351 918 500 305',
  linkedin: 'https://www.linkedin.com/in/miguelalmeida1/',
  cal: 'https://cal.com/miguel-almeida',
  temperatureC: 12,
  tagline: 'Made by hand, in Berlin.'
};

export const navigation: MetaLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'Story', href: '/story' },
  { label: 'CV', href: '/cv' },
  { label: 'Contact', href: '#contact' }
];

export const hero: HeroContent = {
  subtitle: 'SOFTWARE ENGINEER · FRONTEND · BERLIN',
  intro:
    'Aviation, then UX, then code. I build calm interfaces for products people actually depend on — currently at F24, where I have helped grow a frontend surface from empty files into something teams can trust.',
  primaryCta: {
    label: 'See selected work',
    href: '#work'
  },
  secondaryCta: {
    label: 'Read the resume',
    href: '/cv'
  }
};

export const marqueeValues = [
  'Calm interfaces',
  'Boring reliability',
  'Design as engineering',
  'Ship with care',
  'Berlin-built'
];

export const heroStats = [
  {
    value: '0 → 1000s',
    label: 'users on a product built from scratch'
  },
  {
    value: '4 yrs',
    label: 'shipping production frontend at F24'
  },
  {
    value: 'Mid-level',
    label: 'frontend/product UI engineer'
  }
];

export const selectedWork: SelectedWorkItem[] = [
  {
    title: 'Resilience Platform',
    tagline: 'Mission-critical product UI for teams coordinating under pressure.',
    meta: '2024 — F24 · Frontend lead',
    href: '/story#building-from-zero'
  },
  {
    title: 'Design System Layer',
    tagline: 'A calmer component foundation for product teams shipping every week.',
    meta: '2026 — F24 · Mid-level frontend',
    href: '/cv'
  },
  {
    title: 'Editorial Portfolio',
    tagline: 'A portfolio that treats interface details like page composition.',
    meta: '2026 — Independent · Built by hand',
    href: '#contact'
  }
];

export const approach: ApproachItem[] = [
  {
    title: 'Calm',
    body: 'I try to remove noise before I add flair. The best interfaces usually feel slower, clearer, and more deliberate than the product requirements first suggest.'
  },
  {
    title: 'Reliable',
    body: 'I like boring systems in the best sense: predictable states, stable components, good naming, and enough care that edge cases stop feeling like surprises.'
  },
  {
    title: 'Crafted',
    body: 'Design is part of the engineering work. I care about the small seams — spacing, focus, motion, hierarchy — because that is where trust accumulates.'
  }
];

export const experienceTeaser: ExperienceTeaserItem[] = [
  {
    years: '2026 — now',
    role: 'Software Engineer (Mid-level)',
    company: 'F24'
  },
  {
    years: '2023 — 2025',
    role: 'Frontend Engineer · Product Lead Frontend',
    company: 'F24'
  },
  {
    years: '2022 — 2023',
    role: 'Frontend Engineer',
    company: 'F24'
  },
  {
    years: '2021 — 2022',
    role: 'Freelance Frontend Developer',
    company: 'Independent'
  }
];

export const manifestoQuote =
  'The calmest products are rarely the simplest. They are the ones where someone cared enough to make hard things feel obvious.';

export const conversationFlows: ConversationFlow[] = [
  {
    id: 'recruiter',
    label: 'recruiter',
    teaser: "I'm hiring",
    greeting: 'Welcome. Let me save you scrolling.',
    body:
      '4 yrs frontend · React/TS · design systems · Berlin (EU work auth). Mid-level product UI engineer. Reply window: under 24h.',
    meta: 'TL;DR · for hiring teams',
    ctas: [
      {
        label: 'Write directly',
        href: 'mailto:miguelalmeida1592@gmail.com?subject=Role%20opportunity',
        tone: 'primary'
      },
      {
        label: 'Book 15 min',
        href: 'https://cal.com/miguel-almeida',
        tone: 'ghost'
      },
      {
        label: 'Read the resume',
        href: '/cv',
        tone: 'ghost'
      }
    ]
  },
  {
    id: 'collaborator',
    label: 'collaborator',
    teaser: "Let's build something",
    greeting: "Excellent. Let's get specific.",
    body:
      'Small, considered projects suit me best: design systems, product UI, editorial sites, and teams who care about the boring details.',
    meta: 'TL;DR · for collaborators',
    ctas: [
      {
        label: 'Start a thread',
        href: 'mailto:miguelalmeida1592@gmail.com?subject=Project%20idea',
        tone: 'primary'
      },
      {
        label: 'See selected work',
        href: '#work',
        tone: 'ghost'
      }
    ]
  },
  {
    id: 'wanderer',
    label: 'wanderer',
    teaser: 'Just exploring',
    greeting: 'Welcome, friend.',
    body:
      "No pressure, no funnel. Wander through the work, the story, the manifesto — or just send a 'hi'.",
    meta: 'TL;DR · for wanderers',
    ctas: [
      {
        label: 'Start at the top',
        href: '#top',
        tone: 'primary'
      },
      {
        label: 'Or just say hi',
        href: 'mailto:miguelalmeida1592@gmail.com?subject=Hello',
        tone: 'ghost'
      }
    ]
  }
];

export const cvBio =
  'Frontend engineer building interfaces that feel composed, reliable, and easy to trust. I pair product thinking with design-system care, and I like shipping hard things with a steady hand.';

export const cvContactPills: MetaLink[] = [
  {
    label: 'Mail',
    href: 'mailto:miguelalmeida1592@gmail.com'
  },
  {
    label: 'Berlin · DE',
    href: '#'
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/miguelalmeida1/'
  },
  {
    label: 'EU work auth · open',
    href: '#'
  }
];

export const cvHighlights = [
  {
    value: '1000s',
    label: 'users on a product built from scratch'
  },
  {
    value: '4 yrs',
    label: 'shipping production frontend at F24'
  },
  {
    value: 'Mid-level',
    label: 'frontend/product UI engineer'
  }
];

export const cvExperience: CvExperienceEntry[] = [
  {
    years: '2026 — now',
    role: 'Software Engineer (Mid-level)',
    company: 'F24',
    location: 'Berlin',
    bullets: [
      'Owning more of the design-system layer and shared frontend architecture.',
      'Shipping new product features with a stronger eye on reliability and UI consistency.'
    ]
  },
  {
    years: '2023 — 2025',
    role: 'Frontend Engineer · Product Lead Frontend',
    company: 'F24',
    location: 'Berlin',
    bullets: [
      'Helped lead the frontend of a product from an empty file to active use across global teams.',
      'Worked closely with design and product to turn wireframes into durable product UI.'
    ]
  },
  {
    years: '2022 — 2023',
    role: 'Frontend Engineer',
    company: 'F24',
    location: 'Berlin',
    bullets: [
      'Built and maintained reusable UI in React and TypeScript.',
      'Established steadier patterns for components, forms, and layout behavior.'
    ]
  },
  {
    years: '2021 — 2022',
    role: 'Freelance Frontend Developer',
    company: 'Independent',
    location: 'Berlin',
    bullets: [
      'Delivered small websites and product UI explorations for clients.',
      'Used freelance work to deepen frontend fundamentals and design fluency.'
    ]
  },
  {
    years: 'Before 2020',
    role: 'Aviation',
    company: 'Previous career',
    location: 'Europe',
    bullets: [
      'Learned the value of calm voices, checklists, and boring reliable systems.',
      'That respect for precision still shapes how I build product interfaces now.'
    ]
  }
];

export const cvStack = [
  'JavaScript',
  'TypeScript',
  'React',
  'Svelte',
  'Figma',
  'Design systems',
  'Accessibility',
  'Tailwind CSS'
];

export const cvEducation: CvEducationEntry[] = [
  {
    year: '2021',
    title: 'Full-Stack Web Development',
    place: 'CareerFoundry'
  },
  {
    year: '2020',
    title: 'Professional Diploma — UX Design',
    place: 'UX Design Institute'
  }
];

export const cvLanguages = [
  'Portuguese · Native',
  'English · Fluent',
  'German · Working'
];

export const cvCta =
  'Mid-level frontend/product UI engineer for hard products where craft and reliability matter.';

export const storyChapters: StoryChapter[] = [
  {
    id: 'pivot',
    year: '2020',
    kicker: '✦ Story · The pivot',
    title: 'A design education, and a different way of seeing products.',
    body: [
      'The UX Design Institute gave structure to instincts I already had: that hierarchy matters, that the quiet details matter, and that clarity is a form of respect.',
      'It also made me curious about the layer underneath the mockups — the code that actually makes an interface behave.'
    ],
    quote: 'Good design is often just good judgment, repeated carefully.'
  },
  {
    id: 'first-code',
    year: '2021',
    kicker: '✦ Story · Berlin · First code',
    title: 'I opened a real code editor, shipped ugly things, and kept going.',
    body: [
      'The first interfaces were not beautiful. They were clumsy, overbuilt, and full of mistakes. That was useful.',
      'Learning frontend in Berlin meant learning publicly, iteratively, and with enough humility to keep rebuilding things until they started to feel solid.'
    ]
  },
  {
    id: 'joining-f24',
    year: '2022',
    kicker: '✦ Story · Joining F24',
    title: 'The first real frontend role, and the start of shipping with care.',
    body: [
      'Joining F24 made the work real in a new way. Suddenly the interface was not an exercise — it was part of a product people relied on.',
      'That changed how I thought about frontend. It was not just about visual polish. It was about trust, state, clarity, and small decisions that hold up under pressure.'
    ]
  },
  {
    id: 'building-from-zero',
    year: '2023–2025',
    kicker: '✦ Story · Building from zero',
    title: 'A product that grew from an empty file to thousands of users.',
    body: [
      'Those years were about accumulation. Components, flows, bug fixes, rewrites, architecture decisions — the quiet work that slowly makes a product feel dependable.',
      'I spent that time close to design and product, shaping interfaces that had to stay calm even as the surface area grew.'
    ],
    quote: 'Products people depend on should never feel like they were made in a hurry.'
  },
  {
    id: 'mid-level',
    year: '2026',
    kicker: '✦ Story · Mid-level',
    title: 'More ownership, especially where the design system meets the product.',
    body: [
      'The promotion to mid-level felt less like a jump and more like recognition of work that had already been happening: helping define shared UI, keeping patterns coherent, and making harder calls with more confidence.',
      'It also sharpened what I want next: product teams that care about craft, reliability, and the long-term quality of the interface.'
    ]
  },
  {
    id: 'before',
    year: 'Chapter 00',
    kicker: '✦ Story · Before',
    title: 'Aviation, checklists, calm voices.',
    body: [
      'Before tech, there was aviation. A different world, but one with familiar lessons: composure matters, communication matters, and systems should behave predictably when people need them most.',
      'That earlier career still lives under the work. It is probably why I trust boring reliable systems more than flashy ones.'
    ],
    footnote: true
  }
];
