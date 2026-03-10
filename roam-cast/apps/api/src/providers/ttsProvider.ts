export interface TTSProvider {
  synthesize(input: { text: string; voice?: string; poiId: string }): Promise<{ audioUrl: string }>;
}

export class MockTTSProvider implements TTSProvider {
  async synthesize(input: { text: string; poiId: string }): Promise<{ audioUrl: string }> {
    return { audioUrl: `/audio/mock-${input.poiId}.mp3` };
  }
}
