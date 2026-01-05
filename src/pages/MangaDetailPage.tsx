import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMangaStore } from '../store/manga';
import { ChapterList } from '../components/manga/ChapterList';
import { ArrowLeft, Star, Clock, BookOpen, Info } from 'lucide-react';
import { anilist } from '../lib/anilist';
import { cn } from '../lib/utils';
import { useThemeStore } from '../store/theme';

interface AniListInfo {
  description: string;
  averageScore: number;
  genres: string[];
  status: string;
  startDate: { year: number };
  coverImage: { large: string };
}

export const MangaDetailPage: React.FC = () => {
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { 
    isLoading, 
    error, 
    fetchChapters,
    getChaptersForManga
  } = useMangaStore();
  
  const manga = useMangaStore(state => 
    state.recentManga.find(m => m.source_id === sourceId) || 
    state.searchResults.find(m => m.source_id === sourceId) ||
    state.hotSeries.find(m => m.source_id === sourceId)
  );

  const [anilistInfo, setAnilistInfo] = useState<AniListInfo | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const chapters = sourceId ? getChaptersForManga(sourceId) : [];

  useEffect(() => {
    if (sourceId) {
      fetchChapters(sourceId);
    }
    if (manga) {
      anilist.getMangaInfo(manga.anime_name).then(setAnilistInfo);
    }
  }, [sourceId, fetchChapters, manga]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
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

  if (!manga) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Manga not found</p>
      </div>
    );
  }

  const proxyImageUrl = `https://mangaimageproxy.techzone.workers.dev/?imageurl=${encodeURIComponent(manga.image_src)}`;
  const coverImageUrl = anilistInfo?.coverImage?.large 
    ? `https://mangaimageproxy.techzone.workers.dev/?imageurl=${encodeURIComponent(anilistInfo.coverImage.large)}`
    : proxyImageUrl;

  return (
    <div className="min-h-screen pb-24 bg-white dark:bg-gray-900">
      {/* Fixed Top Navigation */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "border border-gray-200 dark:border-gray-700",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                showInfo && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
              )}
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32">
        <div className="grid md:grid-cols-[350px,1fr] lg:grid-cols-[400px,1fr] gap-8">
          {/* Manga Info Section */}
          <div className={cn(
            "transition-all duration-300",
            !showInfo && "md:hidden"
          )}>
            <div className="sticky top-32">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <img
                    src={coverImageUrl}
                    alt={manga.anime_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h1 className="text-2xl font-bold mb-2">{manga.anime_name}</h1>
                    {anilistInfo && (
                      <div className="flex flex-wrap gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{anilistInfo.averageScore}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{anilistInfo.startDate?.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span>{anilistInfo.status}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {anilistInfo?.description && (
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ 
                          __html: anilistInfo.description.replace(/\n/g, '<br/>') 
                        }}
                      />
                    </div>
                  )}
                  
                  {anilistInfo?.genres && (
                    <div className="flex flex-wrap gap-2">
                      {anilistInfo.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chapter List Section */}
          <div>
            <ChapterList 
              chapters={chapters} 
              mangaTitle={manga.anime_name}
              onChapterClick={(chapterId) => navigate(`/reader/${chapterId}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};