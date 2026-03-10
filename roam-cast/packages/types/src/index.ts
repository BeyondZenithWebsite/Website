export type Category =
  | 'history'
  | 'architecture'
  | 'culture'
  | 'crime'
  | 'famous_people'
  | 'art'
  | 'hidden_gems'
  | 'food'
  | 'pop_culture';

export type InteractionAction =
  | 'prompted'
  | 'accepted'
  | 'dismissed'
  | 'played'
  | 'completed'
  | 'skipped'
  | 'expanded'
  | 'favourited';

export interface RoamingCheckInput {
  lat: number;
  lng: number;
  radius?: number;
  recentPoiIds?: string[];
  sessionId?: string;
}

export interface RoamingCandidate {
  poiId: string;
  name: string;
  category: Category;
  shortSummary: string;
  distanceMeters: number;
  score: number;
}
