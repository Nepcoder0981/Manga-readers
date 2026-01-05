import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MangaResult } from '../types/manga';

interface FavoritesState {
  favorites: MangaResult[];
  addFavorite: (manga: MangaResult) => void;
  removeFavorite: (sourceId: string) => void;
  isFavorite: (sourceId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (manga) => {
        set((state) => ({
          favorites: [...state.favorites, manga],
        }));
      },
      removeFavorite: (sourceId) => {
        set((state) => ({
          favorites: state.favorites.filter((m) => m.source_id !== sourceId),
        }));
      },
      isFavorite: (sourceId) => {
        return get().favorites.some((m) => m.source_id === sourceId);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);