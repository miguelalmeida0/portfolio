import { projects } from '$lib/experience/projects';
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
  linkedin: 'https://www.linkedin.com/in/miguelalmeida1/',
  github: 'https://github.com/miguelalmeida0',
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
  subtitle: 'MID-LEVEL FRONTEND ENGINEER',
  intro: 'Mid-level Frontend Engineer',
  primaryCta: {
    label: 'Try Second Voice AI',
    href: '/work/second-voice-ai'
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
    value: 'F24',
    label: 'production frontend since 2022'
  },
  {
    value: 'Product UI',
    label: 'design systems and dependable workflows'
  },
  {
    value: 'Mid-level',
    label: 'frontend/product UI engineer'
  }
];

export const selectedWork: SelectedWorkItem[] = projects.map(project => ({
  title: project.name, tagline: project.summary, meta: project.period, href: `/work/${project.slug}`
}));

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
    years: '2020–2021',
    role: 'UX Design Institute · UX diploma',
    company: '',
    responsibility: '',
    proof: []
  },
  {
    years: '2021–2022',
    role: 'Frontend development · independent client delivery',
    company: '',
    responsibility: '',
    proof: []
  },
  {
    years: '2022–now',
    role: 'Software engineering · Svelte production frontend + ongoing React delivery',
    company: '',
    responsibility: '',
    proof: []
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
      'Mid-level frontend engineer in Berlin working across product UI, design systems, browser architecture, and clear AI interfaces.',
    meta: 'TL;DR · for hiring teams',
    ctas: [
      {
        label: 'Write directly',
        href: 'mailto:miguelalmeida1592@gmail.com?subject=Role%20opportunity',
        tone: 'primary'
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
  'Frontend engineer in Berlin with a background in UX design. At F24, I work across frontend architecture, business logic, resilience and release quality, collaborating with product, design, backend and QA. My independent products bring that same care to search, writing, learning and voice interfaces.';

export const professionalRecommendation = {
  name: 'Richard Nespithal',
  role: 'Previous team lead',
  quote: 'Miguel takes full ownership of his tickets from start to finish and completes tasks without supervision. He manages his workload independently and reliably.',
  additionalQuote: 'Miguel is highly motivated and delivers quality work consistently. He feels the frustration when work is not properly planned or blocked, which is a sign that he cares about doing good work and making progress.'
};

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
  }
];

export const cvHighlights = [
  { value: '5,500+', label: 'F24 customer reach', detail: 'company-wide, worldwide' },
  { value: '75%', label: 'Workflow gain', detail: 'fewer requests in one workflow' },
  { value: '10x', label: 'Regression tests', detail: 'test files: 3 to 30' },
  { value: '7,000+', label: 'Automated tests', detail: 'frontend suite, 954 files' }
];

export const cvSignals = [
  { title: 'Product engineering', detail: 'UI + business logic' },
  { title: 'Frontend architecture', detail: 'boundaries + contracts' },
  { title: 'Security + resilience', detail: 'high-stakes workflows' },
  { title: 'Design systems', detail: 'tokens + reusable UI' },
  { title: 'AI interfaces', detail: 'validated workflows' }
];

export const cvExperience: CvExperienceEntry[] = [
  {
    years: 'Aug 2022 – Present',
    role: 'Software Engineer | Frontend & Product Systems',
    company: 'F24',
    location: 'Berlin',
    bullets: [
      'Improved enterprise alerting and operational tooling, cutting request volume by 75% in a key alerting workflow, expanding regression test files 10x from 3 to 30, and shipping message assistance across 13 languages.',
      'Built core alerting workflows from product mockups to production, owning frontend architecture, business rules and interaction/state logic in Svelte and TypeScript.',
      'Migrated major workflows into React while delivery continued; defined shared UI patterns and typed contracts with Product, Design, Backend and QA.',
      'Authored 2,000+ automated checks inside a frontend suite with 7,000+ passing tests across 954 files, covering end-to-end flows, accessibility, regression and resilience.'
    ]
  },
  {
    years: '2021 — 2022',
    role: 'Freelance Frontend Developer',
    company: 'Independent',
    location: 'Berlin',
    bullets: [
      'Delivered responsive client products end to end, translating UX decisions into maintainable frontend systems from problem definition through implementation.'
    ]
  }
];

export const cvStack = [
  'JavaScript',
  'TypeScript',
  'Svelte',
  'React',
  'Figma',
  'Design systems',
  'Accessibility',
  'Tailwind CSS'
];

export const cvSkills = ['React', 'TypeScript', 'JavaScript', 'Svelte', 'Next.js', 'Tailwind', 'Playwright', 'Vite', 'Docker', 'GitLab CI', 'Figma', 'Supabase'];

export const cvEducation: CvEducationEntry[] = [
  {
    year: 'Aug 2021',
    title: 'Professional Diploma in UX Design',
    place: 'UX Design Institute'
  },
  {
    year: '2021',
    title: 'Full-Stack Web Development',
    place: 'CareerFoundry'
  }
];

export const cvLanguages = [
  'Portuguese · Native',
  'English · Fluent',
  'Spanish · Fluent'
];

export const cvCta =
  'Frontend engineer for hard products where product judgment, reliability, and interface craft matter.';

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
    title: 'Production work made reliability a daily frontend concern.',
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
      'Moving into a mid-level role reflected work that had already been happening: helping define shared UI, keeping patterns coherent, and making harder calls with more confidence.',
      'It also sharpened what I want next: product teams that care about craft, reliability, and the long-term quality of the interface.'
    ]
  }
];
