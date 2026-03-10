import { create } from 'zustand';

type State = {
  roaming: boolean;
  paused: boolean;
  recentPoiIds: string[];
  currentCandidate?: any;
  setRoaming: (v: boolean) => void;
  setPaused: (v: boolean) => void;
  pushRecent: (id: string) => void;
  setCandidate: (c?: any) => void;
};

export const useAppStore = create<State>((set, get) => ({
  roaming: false,
  paused: false,
  recentPoiIds: [],
  setRoaming: (v) => set({ roaming: v }),
  setPaused: (v) => set({ paused: v }),
  pushRecent: (id) => set({ recentPoiIds: [...get().recentPoiIds.slice(-8), id] }),
  setCandidate: (c) => set({ currentCandidate: c })
}));
