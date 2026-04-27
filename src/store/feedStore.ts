import { create } from "zustand";

interface FeedStore {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  playingVideoId: string | null;
  setPlayingVideoId: (id: string | null) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  activeCategory: "전체",
  setActiveCategory: (category) => set({ activeCategory: category }),
  playingVideoId: null,
  setPlayingVideoId: (id) => set({ playingVideoId: id }),
}));
