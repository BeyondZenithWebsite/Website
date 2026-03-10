import { StoryProvider, StoryResult } from './storyProvider';

export class OpenAIStoryProvider implements StoryProvider {
  constructor(private apiKey: string) {}

  async generate(input: { name: string; category: string; city: string; summary: string }): Promise<StoryResult> {
    if (!this.apiKey) throw new Error('OPENAI_API_KEY missing');

    const prompt = `Write two fact-based city stories about ${input.name} in ${input.city}.\nCategory: ${input.category}\nSummary: ${input.summary}\n\nReturn JSON with keys shortStory (45-60s spoken), longStory (2-4 mins), transcript (clean narration text). Tone: conversational, vivid, no hype.`;

    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: prompt,
        text: { format: { type: 'json_object' } }
      })
    });

    if (!resp.ok) throw new Error(`OpenAI story generation failed: ${resp.status}`);
    const data: any = await resp.json();
    const raw = data.output_text || data.output?.[0]?.content?.[0]?.text || '{}';
    const parsed = JSON.parse(raw);

    return {
      shortStory: parsed.shortStory,
      longStory: parsed.longStory,
      transcript: parsed.transcript || parsed.shortStory
    };
  }
}
