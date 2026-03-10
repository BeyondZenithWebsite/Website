import { env } from '../config/env';
import { MockStoryProvider, StoryProvider } from './storyProvider';
import { MockTTSProvider, TTSProvider } from './ttsProvider';
import { OpenAIStoryProvider } from './openaiStoryProvider';
import { OpenAITTSProvider } from './openaiTTSProvider';

export function getStoryProvider(): StoryProvider {
  if (env.storyProvider === 'openai') return new OpenAIStoryProvider(env.openaiApiKey);
  return new MockStoryProvider();
}

export function getTTSProvider(): TTSProvider {
  if (env.ttsProvider === 'openai') return new OpenAITTSProvider(env.openaiApiKey);
  return new MockTTSProvider();
}
