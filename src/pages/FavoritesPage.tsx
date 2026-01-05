import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '../store/favorites';
import { MangaCard } from '../components/ui/MangaCard';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Heart className="h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          No favorites yet
        </h2>
        <p className="text-gray-500 dark:text-gray-500">
          Start adding manga to your favorites by clicking the heart icon
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-3xl font-bold">Favorites</h1>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {favorites.map((manga) => (
          <MangaCard key={manga.source_id} manga={manga} />
        ))}
      </div>
    </div>
  );
};