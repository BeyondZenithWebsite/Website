export interface StoryResult {
  shortStory: string;
  longStory: string;
  transcript: string;
}

export interface StoryProvider {
  generate(input: { name: string; category: string; city: string; summary: string }): Promise<StoryResult>;
}

export class MockStoryProvider implements StoryProvider {
  async generate(input: { name: string; category: string; city: string; summary: string }): Promise<StoryResult> {
    const shortStory = `${input.name} sits in ${input.city} as a ${input.category.replace('_', ' ')} landmark. ${input.summary} As you walk past, notice how this place captures one chapter of Melbourne's changing city story.`;
    const longStory = `${shortStory} Over the years, locals have layered new uses and meanings onto this site. It reflects how migration, commerce, and design decisions shape daily life. If you stop for a moment, you can trace old planning ideas against today's street rhythm. This is why ${input.name} is worth more than a quick photo: it helps decode the city around you.`;
    return { shortStory, longStory, transcript: shortStory };
  }
}
