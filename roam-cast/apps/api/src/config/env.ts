import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  storyProvider: process.env.STORY_PROVIDER || 'mock',
  ttsProvider: process.env.TTS_PROVIDER || 'mock',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:3000'
};
