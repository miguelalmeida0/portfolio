import type { PortfolioContent } from '$lib/types/portfolio';

export const portfolio: PortfolioContent = {
  meta: {
    title: 'Miguel Almeida - Frontend Journal',
    description:
      'A vintage editorial portfolio for a Berlin-based frontend engineer building calm, considered interfaces.'
  },
  navigation: [
    { label: 'Work', href: '#work' },
    { label: 'Approach', href: '#index' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ],
  site: {
    name: 'Miguel Almeida',
    role: 'Frontend Engineer',
    eyebrow: 'Frontend systems for mission-critical products',
    headlineLead: 'Frontend with care.',
    headlineAccent: 'Built to feel clear.',
    summary:
      'I build reliable product UI, shape reusable systems, and work closely with design to make complex tools feel calmer.',
    location: 'Berlin, Germany',
    availability: '2022 to Present',
    journalMark: "est. 2026",
    portraitSrc: '/miguel-almeida-neon.jpg',
    portraitAlt: 'Portrait of Miguel Almeida standing beneath red neon lights.',
    linkedinHref: 'https://www.linkedin.com/in/miguelalmeida1/',
    primaryCta: {
      label: 'View the work',
      href: '#work'
    },
    secondaryCta: {
      label: 'Write to me',
      href: '#contact'
    },
    downloadCta: {
      label: 'Download PDF',
      href: '/portfolio.pdf'
    },
    stats: [
      {
        value: '3+',
        label: 'Years building',
        note: 'Shipping product UI'
      },
      {
        value: '2',
        label: 'Core areas',
        note: 'Product and systems'
      },
      {
        value: '1000s',
        label: 'Users',
        note: 'Enterprise workflows'
      }
    ],
    marquee: [
      'Component systems',
      'Svelte',
      'TypeScript',
      'Reusable UI',
      'Calm interfaces',
      'Product mindset',
      'Design collaboration',
      'Enterprise scale'
    ]
  },
  manifesto: {
    eyebrow: 'Manifesto',
    fragments: [
      { text: 'I build' },
      { text: 'frontends', italic: true },
      { text: 'that feel' },
      { text: 'calm,', italic: true },
      { text: 'considered' },
      { text: 'and' },
      { text: 'made by hand.', italic: true }
    ],
    quote:
      'The web feels more human when nothing screams and everything simply works.',
    note: '',
    figure: 'In practice'
  },
  featuredProjects: [
    {
      number: '',
      period: '2022 - 2026',
      title: 'Platform',
      titleItalic: 'Foundations',
      summary:
        'Built core product UI from early wireframes to production and shipped scalable interfaces used across enterprise workflows.',
      tags: ['Svelte', 'Architecture', 'Wireframes to production'],
      href: '#experience'
    },
    {
      number: '',
      period: '2026 - Present',
      title: 'Frontend',
      titleItalic: 'Systems',
      summary:
        'Improving consistency and component architecture across the app with cleaner patterns, better reuse, and more confident shipping.',
      tags: ['Component systems', 'Design collaboration', 'UI consistency'],
      href: '#experience'
    }
  ],
  indexEntries: [
    {
      numeral: '1',
      title: 'Build',
      body: 'Turning product and design into clean, production-ready UI with a steady hand.',
      chips: ['Svelte', 'TypeScript', 'Responsive UI'],
      tone: 'cream'
    },
    {
      numeral: '2',
      title: 'Scale',
      body: 'Improving consistency through reusable patterns and clearer architectural structure.',
      chips: ['Component systems', 'UI consistency', 'Patterns'],
      tone: 'cream'
    },
    {
      numeral: '3',
      title: 'Collaborate',
      body: 'Pairing with product and design to ship calmer, sharper, more humane experiences.',
      chips: ['Design systems', 'Pairing', 'Code review'],
      tone: 'clay'
    }
  ],
  experience: [
    {
      year: '2026 ->',
      title: 'Frontend Engineer',
      company: 'F24',
      place: 'Berlin - Remote',
      body: 'Scaling frontend systems, improving consistency, and shipping new features.'
    },
    {
      year: '2022 - 26',
      title: 'Junior Software Engineer',
      company: 'F24',
      place: 'Munich, Germany',
      body: 'Built the platform from early designs to production and developed reusable UI.'
    }
  ],
  contact: {
    eyebrow: 'Postcard',
    title: "Let's make something",
    titleItalic: 'good.',
    summary:
      'Frontend/product UI work, product collaborations, and quiet conversations about craft, systems, and the small details that add up.',
    note: 'Replies are handled through direct email.',
    location: 'Berlin - CET',
    downloadLabel: 'Portfolio PDF',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Approach', href: '#index' },
      { label: 'Experience', href: '#experience' }
    ]
  },
  footerNote: ''
};
