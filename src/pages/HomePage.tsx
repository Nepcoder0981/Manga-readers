import React, { useEffect, useState } from 'react';
import { useMangaStore } from '../store/manga';
import { MangaCard } from '../components/ui/MangaCard';
import { BookOpen, Flame, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    recentManga, 
    hotSeries,
    searchResults, 
    isLoading, 
    error, 
    fetchRecentManga,
    fetchHotSeries,
    fetchChapters,
    getChaptersForManga
  } = useMangaStore();
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchRecentManga(),
          fetchHotSeries()
        ]);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, [fetchRecentManga, fetchHotSeries]);

  useEffect(() => {
    const fetchMissingChapters = async () => {
      const allManga = [...hotSeries, ...recentManga];
      const uniqueManga = Array.from(new Set(allManga.map(m => m.source_id)))
        .map(id => allManga.find(m => m.source_id === id)!);
      
      await Promise.all(
        uniqueManga.map(manga => fetchChapters(manga.source_id))
      );
    };
    
    if (!isInitialLoading && (hotSeries.length > 0 || recentManga.length > 0)) {
      fetchMissingChapters();
    }
  }, [hotSeries, recentManga, fetchChapters, isInitialLoading]);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (searchResults.length > 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Search Results
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {searchResults.map((manga) => (
            <MangaCard 
              key={manga.source_id} 
              manga={manga}
              chapters={getChaptersForManga(manga.source_id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Featured Hot Series */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl -z-10" />
        <div className="p-8 rounded-3xl border border-red-100 dark:border-red-900/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Hot Series
            </h2>
            <div className="flex-1 border-t-2 border-dashed border-red-200 dark:border-red-800/30 ml-4" />
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Trending Now</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {hotSeries.map((manga) => (
              <MangaCard 
                key={manga.source_id} 
                manga={manga}
                chapters={getChaptersForManga(manga.source_id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl -z-10" />
        <div className="p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recently Added
            </h2>
            <div className="flex-1 border-t-2 border-dashed border-indigo-200 dark:border-indigo-800/30 ml-4" />
            <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Latest Updates
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {recentManga.map((manga) => (
              <MangaCard 
                key={manga.source_id} 
                manga={manga}
                chapters={getChaptersForManga(manga.source_id)}
              />
            ))}
          </div>
        </div>
      </section>

      {hotSeries.length === 0 && recentManga.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
            No manga found
          </p>
        </div>
      )}
    </div>
  );
};