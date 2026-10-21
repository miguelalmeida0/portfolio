import story from './story.json' with { type: 'json' };

// Preserve the authored introduction exactly; the last chapter owns any later sentences.
const sentences = story.editorial.intro.split(/(?<=[.!?])\s+/);
export const introSteps = story.shortVersion.chapters.map((chapter, index) => ({
  ...chapter,
  area: `story-intro-${index}` as const,
  copy: index === 2 ? sentences.slice(index).join(' ') : sentences[index]
}));
