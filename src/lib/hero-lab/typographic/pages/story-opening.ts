import story from '$lib/story/story.json';

/** First-person editorial framing; the supporting biography remains sourced. */
export const storyOpening = {
  greeting: "Hi, I’m Miguel.",
  lines: ['Curious by nature.', 'A builder by choice.'],
  introduction: 'Computers have been an interest of mine since I was a kid. My path took me through aviation and UX before frontend gave me a way to design an idea and build it myself.',
  chapters: [
    {
      title: 'Aviation', period: 'Where I started', area: 'story-intro-0' as const,
      heading: 'An interest that never left.',
      paragraphs: [story.questions[0].answer, 'That curiosity is still there. I like understanding how things work behind the screen, and turning those explanations into interactive demos.'],
      sourceIds: ['hi', 'love']
    },
    {
      title: 'UX design', period: 'Learning to listen', area: 'story-intro-1' as const,
      heading: 'Start with the person.',
      paragraphs: [story.questions[1].answer, 'I enjoyed UX, but I wanted to work on the implementation too. I wanted to build my own designs.'],
      sourceIds: ['ux', 'build']
    },
    {
      title: 'Frontend', period: 'What I love building', area: 'story-intro-2' as const,
      heading: 'From an idea to something you can use.',
      paragraphs: [story.questions[2].answer, 'These days I’m based in Berlin, working at F24 and building my own projects outside work. I enjoy being able to design and build the whole thing myself.'],
      sourceIds: ['build', 'own']
    }
  ]
};
