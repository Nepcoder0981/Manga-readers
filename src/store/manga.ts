import { create } from 'zustand';
import { api } from '../lib/api';
import type { MangaResult, Chapter, MangaPage } from '../types/manga';

interface ChapterMap {
  [sourceId: string]: Chapter[];
}

interface MangaState {
  recentManga: MangaResult[];
  hotSeries: MangaResult[];
  searchResults: MangaResult[];
  chapterMap: ChapterMap;
  currentPages: MangaPage[];
  currentChapters: Chapter[];
  isLoading: boolean;
  error: string | null;
  fetchRecentManga: () => Promise<void>;
  fetchHotSeries: () => Promise<void>;
  searchManga: (query: string) => Promise<void>;
  fetchChapters: (sourceId: string) => Promise<void>;
  fetchPages: (chapterId: string) => Promise<void>;
  getChaptersForManga: (sourceId: string) => Chapter[];
}

export const useMangaStore = create<MangaState>()((set, get) => ({
  recentManga: [],
  hotSeries: [],
  searchResults: [],
  chapterMap: {},
  currentPages: [],
  currentChapters: [],
  isLoading: false,
  error: null,
  fetchRecentManga: async () => {
    try {
      const data = await api.getRecentlyAdded();
      set({ recentManga: data.results });
    } catch (error) {
      set({ error: 'Failed to fetch recent manga' });
    }
  },
  fetchHotSeries: async () => {
    try {
      const data = await api.getHotSeries();
      set({ hotSeries: data.results });
    } catch (error) {
      set({ error: 'Failed to fetch hot series' });
    }
  },
  searchManga: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const data = await api.searchManga(query);
      set({ searchResults: data.results });
    } catch (error) {
      set({ error: 'Failed to search manga' });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchChapters: async (sourceId: string) => {
    try {
      const chapters = await api.getChapters(sourceId);
      set((state) => ({
        chapterMap: {
          ...state.chapterMap,
          [sourceId]: chapters
        },
        currentChapters: chapters
      }));
    } catch (error) {
      console.error(`Failed to fetch chapters for ${sourceId}:`, error);
    }
  },
  fetchPages: async (chapterId: string) => {
    set({ isLoading: true, error: null });
    try {
      const pages = await api.getPages(chapterId);
      set({ currentPages: pages });
    } catch (error) {
      set({ error: 'Failed to fetch pages' });
    } finally {
      set({ isLoading: false });
    }
  },
  getChaptersForManga: (sourceId: string) => {
    return get().chapterMap[sourceId] || [];
  }
}));