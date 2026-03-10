import { prisma } from '../config/db';
import { getStoryProvider, getTTSProvider } from '../providers/factory';

const storyProvider = getStoryProvider();
const ttsProvider = getTTSProvider();

export async function generateStoryForPoi(poiId: string) {
  const poi = await prisma.poi.findUnique({ where: { id: poiId } });
  if (!poi) throw new Error('POI not found');

  const story = await storyProvider.generate({
    name: poi.name,
    category: poi.category,
    city: poi.city,
    summary: poi.shortSummary
  });

  const audio = await ttsProvider.synthesize({ text: story.shortStory, poiId });

  return prisma.poi.update({
    where: { id: poiId },
    data: {
      shortStory: story.shortStory,
      longStory: story.longStory,
      transcript: story.transcript,
      audioUrl: audio.audioUrl
    }
  });
}
