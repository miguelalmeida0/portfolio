
/** First-person editorial framing; the supporting biography remains sourced. */
export const storyOpening = {
  greeting: "Hi, I’m Miguel.",
  lines: ['Frontend engineer.', 'UX background.'],
  introduction: 'I’m based in Berlin. I work on frontend software at F24 and design and build my own projects outside work.',
  chapters: [
    {
      title: 'Aviation', period: 'Where I started', area: 'story-intro-0' as const,
      heading: 'Before I worked in tech',
      paragraphs: ['My first career was in aviation. I later decided to study UX design.', 'I’d been interested in computers since I was a kid, and wanted to work on software.'],
      sourceIds: ['hi', 'love']
    },
    {
      title: 'UX design', period: '2020–2021', area: 'story-intro-1' as const,
      heading: 'Studying UX design',
      paragraphs: ['I studied at the UX Design Institute. The course taught me to work through a user’s problem before deciding what the interface should look like.', 'I then studied frontend development so I could implement my own designs.'],
      sourceIds: ['ux', 'build']
    },
    {
      title: 'Frontend', period: 'Since 2022', area: 'story-intro-2' as const,
      heading: 'Building production software',
      paragraphs: ['At F24, I built the original Svelte frontend for Connectivity Hub within the product team. I later continued feature development in React.', 'My independent projects let me work on both the design and implementation. You can try examples from them below.'],
      sourceIds: ['build', 'own']
    }
  ]
};
