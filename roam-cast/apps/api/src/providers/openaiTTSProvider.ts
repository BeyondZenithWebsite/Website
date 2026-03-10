import { TTSProvider } from './ttsProvider';

export class OpenAITTSProvider implements TTSProvider {
  constructor(private apiKey: string, private publicBaseUrl = '') {}

  async synthesize(input: { text: string; voice?: string; poiId: string }): Promise<{ audioUrl: string }> {
    if (!this.apiKey) throw new Error('OPENAI_API_KEY missing');

    const resp = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: input.voice || 'alloy',
        input: input.text
      })
    });

    if (!resp.ok) throw new Error(`OpenAI TTS failed: ${resp.status}`);
    // MVP: we don't persist binary in this pass; keep predictable URL contract.
    return { audioUrl: `${this.publicBaseUrl}/audio/generated-${input.poiId}.mp3` };
  }
}
