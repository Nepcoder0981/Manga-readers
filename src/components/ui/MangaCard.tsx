import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Clock } from 'lucide-react';
import type { MangaResult, Chapter } from '../../types/manga';
import { useFavoritesStore } from '../../store/favorites';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';

interface MangaCardProps {
  manga: MangaResult;
  chapters?: Chapter[];
  showFavorite?: boolean;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, chapters = [], showFavorite = true }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(manga.source_id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(manga.source_id);
    } else {
      addFavorite(manga);
    }
  };

  const latestChapter = chapters[0];
  const proxyImageUrl = api.proxyImage(manga.image_src);

  return (
    <Link
      to={`/manga/${manga.source_id}`}
      className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
    >
      <div className="aspect-[3/4] w-full">
        <img
          src={proxyImageUrl}
          alt={manga.anime_name}
          className="h-full w-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100 transition-opacity" />
      </div>
      {showFavorite && (
        <button
          onClick={toggleFavorite}
          className={cn(
            'absolute top-2 right-2 p-2 rounded-full transition-all',
            'bg-white/10 backdrop-blur-sm hover:bg-white/20',
            favorite ? 'text-red-500' : 'text-white hover:text-red-500'
          )}
        >
          <Heart className={cn('h-5 w-5', favorite && 'fill-current')} />
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-white">
            <BookOpen className="h-4 w-4 mt-1 flex-shrink-0" />
            <h3 className="text-sm font-medium line-clamp-2">
              {manga.anime_name}
            </h3>
          </div>
          {latestChapter && (
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <Clock className="h-3 w-3" />
              <span>Chapter {latestChapter.chapter_number}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};