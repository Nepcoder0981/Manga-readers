import React, { useState } from 'react';
import { BookOpen, Clock, Search, Filter, Loader2, Calendar, Eye, Star } from 'lucide-react';
import type { Chapter } from '../../types/manga';
import { cn } from '../../lib/utils';

interface ChapterListProps {
  chapters: Chapter[];
  mangaTitle?: string;
  onChapterClick?: (chapterId: string) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters = [], mangaTitle, onChapterClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredChapters = chapters
    .filter(chapter => 
      chapter.chapter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chapter.chapter_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const numA = parseFloat(a.chapter_number);
      const numB = parseFloat(b.chapter_number);
      return sortAscending ? numA - numB : numB - numA;
    });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setSearchQuery(e.target.value);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleChapterClick = (chapterId: string) => {
    if (onChapterClick) {
      onChapterClick(chapterId);
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full animate-pulse">
          <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No chapters available yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chapter Header with Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-6">
          {/* Title and Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Available Chapters
              </h2>
              {mangaTitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mangaTitle}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <span>{chapters.length}</span>
                <span className="text-gray-600 dark:text-gray-400">Chapters</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Updated recently</span>
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">10.2K</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">4.8/5</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Update</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              {isLoading ? (
                <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              )}
              <input
                type="search"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={handleSearch}
                className={cn(
                  "w-full rounded-lg py-2.5 pl-10 pr-4",
                  "bg-gray-100 dark:bg-gray-800",
                  "border border-gray-200 dark:border-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
                  "transition-all duration-300 ease-in-out",
                  "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "hover:border-indigo-500 dark:hover:border-indigo-500"
                )}
              >
                <Eye className="h-4 w-4" />
                <span className="text-sm">
                  {viewMode === 'grid' ? 'List View' : 'Grid View'}
                </span>
              </button>
              <button
                onClick={() => setSortAscending(!sortAscending)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "hover:border-indigo-500 dark:hover:border-indigo-500"
                )}
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm">
                  {sortAscending ? "Oldest First" : "Newest First"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Chapter Count Bar */}
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            style={{ width: `${(filteredChapters.length / chapters.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chapter List */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "grid gap-3"
      )}>
        {filteredChapters.map((chapter, index) => (
          <button
            key={chapter.chapter_id}
            onClick={() => handleChapterClick(chapter.chapter_id)}
            className={cn(
              "w-full text-left",
              "group relative p-4 bg-white dark:bg-gray-800 rounded-xl",
              "hover:shadow-lg transition-all duration-300",
              "border border-gray-100 dark:border-gray-700",
              "hover:border-indigo-500 dark:hover:border-indigo-500",
              "transform hover:-translate-y-1",
              "animate-fadeIn"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl group-hover:bg-indigo-500 transition-colors">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Chapter {chapter.chapter_number}
                  </h3>
                  {chapter.chapter_name && chapter.chapter_name !== "Chapter" && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {chapter.chapter_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Updated recently</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No chapters found matching your search
          </p>
        </div>
      )}
    </div>
  );
};