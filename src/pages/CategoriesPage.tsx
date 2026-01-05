import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MangaCard } from '../components/ui/MangaCard';
import { api } from '../lib/api';
import { anilist } from '../lib/anilist';
import { 
  Sword, Heart, Wand2, Flame, Crown, Ghost, 
  Footprints, Coffee, Rocket, Laugh, Users, 
  Zap, Brain, Loader2, BookOpen, Search, 
  Filter, Grid, List as ListIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { MangaResult, Chapter } from '../types/manga';

const categoryIcons = {
  Action: Sword,
  Adventure: Footprints,
  Comedy: Laugh,
  Drama: Users,
  Fantasy: Wand2,
  Horror: Ghost,
  Mystery: Brain,
  Romance: Heart,
  'Sci-Fi': Rocket,
  'Slice of Life': Coffee,
  Sports: Flame,
  Supernatural: Zap,
  Thriller: Crown,
};

const categoryColors = {
  Action: 'from-red-500 to-orange-500',
  Adventure: 'from-green-500 to-emerald-500',
  Comedy: 'from-yellow-500 to-amber-500',
  Drama: 'from-purple-500 to-pink-500',
  Fantasy: 'from-blue-500 to-indigo-500',
  Horror: 'from-gray-700 to-gray-900',
  Mystery: 'from-indigo-500 to-purple-500',
  Romance: 'from-pink-500 to-rose-500',
  'Sci-Fi': 'from-cyan-500 to-blue-500',
  'Slice of Life': 'from-amber-500 to-orange-500',
  Sports: 'from-orange-500 to-red-500',
  Supernatural: 'from-violet-500 to-purple-500',
  Thriller: 'from-rose-500 to-red-500',
};

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGenre = searchParams.get('genre');
  const [genres] = useState<string[]>(Object.keys(categoryIcons));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MangaResult[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [chaptersMap, setChaptersMap] = useState<Record<string, Chapter[]>>({});

  useEffect(() => {
    const fetchManga = async () => {
      if (!selectedGenre && !searchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { results } = await anilist.searchManga(searchQuery, selectedGenre);
        
        // Map through results and get proxy data for each manga
        const mangaWithProxyData = await Promise.all(
          results.map(async (manga) => {
            try {
              const proxyResponse = await api.searchManga(manga.anime_name);
              if (proxyResponse.results.length > 0) {
                const proxyManga = proxyResponse.results[0];
                const chapters = await api.getChapters(proxyManga.source_id);
                return {
                  ...manga,
                  source_id: proxyManga.source_id, // Use proxy source_id instead of anilist id
                  chapters
                };
              }
              return manga;
            } catch (error) {
              console.error(`Error fetching proxy data for ${manga.anime_name}:`, error);
              return manga;
            }
          })
        );

        // Update state with manga that have proxy data
        const validManga = mangaWithProxyData.filter(manga => !manga.source_id.includes('anilist-'));
        setSearchResults(validManga);

        // Update chapters map
        const newChaptersMap = validManga.reduce((acc, manga) => ({
          ...acc,
          [manga.source_id]: manga.chapters || []
        }), {});
        setChaptersMap(newChaptersMap);

      } catch (err) {
        setError('Failed to load manga. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchManga, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGenre]);

  const handleMangaClick = (manga: MangaResult) => {
    if (manga.source_id.includes('anilist-')) {
      setError('Unable to find manga details. Please try again.');
      return;
    }
    navigate(`/manga/${manga.source_id}`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Manga Categories
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-lg py-2 pl-10 pr-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded",
                  viewMode === 'grid'
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded",
                  viewMode === 'list'
                    ? "bg-white dark:bg-gray-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm">Sort</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {genres.map((genre) => {
          const Icon = categoryIcons[genre as keyof typeof categoryIcons] || BookOpen;
          const isSelected = selectedGenre === genre;
          const gradientColor = categoryColors[genre as keyof typeof categoryColors] || 'from-gray-500 to-gray-600';

          return (
            <button
              key={genre}
              onClick={() => {
                if (isSelected) {
                  searchParams.delete('genre');
                  setSearchQuery('');
                } else {
                  searchParams.set('genre', genre);
                  setSearchQuery('');
                }
                setSearchParams(searchParams);
              }}
              className={cn(
                'relative overflow-hidden group',
                'flex items-center gap-3 p-4 rounded-xl transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-1',
                isSelected
                  ? `bg-gradient-to-r ${gradientColor}`
                  : 'bg-white dark:bg-gray-800'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg transition-transform duration-300 group-hover:scale-110',
                isSelected
                  ? 'bg-white/20'
                  : `bg-gradient-to-r ${gradientColor}`
              )}>
                <Icon className={cn(
                  'h-5 w-5',
                  isSelected ? 'text-white' : 'text-white'
                )} />
              </div>
              <span className={cn(
                'font-medium truncate',
                isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'
              )}>
                {genre}
              </span>
              {isSelected && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {(selectedGenre || searchQuery) && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {searchResults.length} Results
              {selectedGenre && ` in ${selectedGenre}`}
              {searchQuery && ` for "${searchQuery}"`}
            </h2>
          </div>
        )}

        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
            : "grid gap-4"
        )}>
          {searchResults.map((manga) => (
            <MangaCard 
              key={manga.source_id} 
              manga={manga}
              chapters={chaptersMap[manga.source_id]}
              onClick={() => handleMangaClick(manga)}
              className={cn(
                "animate-fadeIn cursor-pointer",
                viewMode === 'list' && "!flex !flex-row !h-32"
              )}
            />
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {searchResults.length === 0 && !isLoading && (selectedGenre || searchQuery) && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No manga found
              {selectedGenre && ` in ${selectedGenre}`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {!selectedGenre && !searchQuery && !isLoading && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Select a category or search for manga
            </p>
          </div>
        )}
      </div>
    </div>
  );
};