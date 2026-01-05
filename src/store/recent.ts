import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecentlyViewed } from '../types/manga';

interface RecentState {
  recentlyViewed: RecentlyViewed[];
  addRecentlyViewed: (manga: {
    id: string;
    title: string;
    coverImage: string;
    lastChapter?: string;
  }) => void;
  clearRecentlyViewed: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      recentlyViewed: [],
      addRecentlyViewed: (manga) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((m) => m.id !== manga.id);
          return {
            recentlyViewed: [
              {
                ...manga,
                lastViewed: Date.now(),
              },
              ...filtered,
            ].slice(0, 10), // Keep only last 10 items
          };
        });
      },
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    {
      name: 'recent-storage',
    }
  )
);