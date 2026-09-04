export const lifeContextKnowledge = [
  {
    id: 'life-context-homebody',
    title: 'Homebody and interests',
    source: 'Miguel personality ingestion / Miguel-approved notes',
    tags: ['life context', 'homebody', 'movies', 'tv shows', 'films', 'personal', 'casual'],
    content:
      'Miguel is a simple homebody. Outside the work frame, approved public context is that he enjoys watching TV shows and movies and can talk about films for a long time.'
  },
  {
    id: 'life-context-technology-curiosity',
    title: 'Curiosity and learning',
    source: 'Miguel personality ingestion / Miguel-approved notes',
    tags: ['life context', 'curiosity', 'learning', 'technology', 'motivation', 'personal'],
    content:
      'Miguel is motivated by curiosity and learning. He likes new things, especially when they connect to coding, design, animations, frontend craft, and AI workflows.'
  },
  {
    id: 'life-context-aviation-needs-input',
    title: 'Aviation topic status',
    source: 'Miguel personality ingestion / Needs Miguel input',
    tags: ['life context', 'aviation', 'needs miguel input', 'boundary'],
    content:
      'The aviation question was not answered in this ingestion batch. If aviation remains visible in portfolio copy, MiguelLLM may mention only existing portfolio-level facts, but it must not invent specific lessons from aviation unless Miguel provides an approved answer later. Needs Miguel input.'
  },
  {
    id: 'life-context-design-os-removed',
    title: 'Design OS topic status',
    source: 'Miguel personality ingestion / Miguel-approved exclusion',
    tags: ['life context', 'design os', 'removed topic', 'boundary'],
    content:
      'The Design OS question is not relevant for this ingestion pass. Do not make Design OS a core public MiguelLLM topic unless Miguel later approves it.'
  }
] as const;
