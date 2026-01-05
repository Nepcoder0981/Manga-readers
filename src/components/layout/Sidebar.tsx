import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Heart,
  History,
  X,
  User,
  Tag,
  Bookmark,
  TrendingUp,
  Code,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { anilist } from '../../lib/anilist';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Categories', href: '/categories', icon: BookOpen },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Recently Read', href: '/history', icon: History },
  { name: 'Profile', href: '/profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [genres, setGenres] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await anilist.getGenres();
      setGenres(genreList);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-[2px]',
          'transition-all duration-300 ease-in-out',
          'z-[9999]',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0',
          'w-[280px] bg-white dark:bg-gray-900',
          'shadow-2xl',
          'z-[10000]',
          'transition-all duration-300 ease-in-out',
          'transform',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900">
          <div className="flex items-center justify-between p-4">
            <Link 
              to="/" 
              className="flex items-center gap-2" 
              onClick={onClose}
            >
              <BookOpen className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">
                MangaReader
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="h-[calc(100vh-65px)] overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 space-y-6">
            {/* Developer Info */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Developer</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">nepcoder</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Full Stack Developer & AI Engineer
                </p>
                <div className="space-y-1">
                  <a
                    href="https://t.me/nepcodex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Contact Developer
                    <ChevronRight className="h-4 w-4" />
                  </a>
                  <a
                    href="https://t.me/nepcodexcc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Join Telegram Channel
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {defaultNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg',
                      'transition-all duration-200',
                      'group relative overflow-hidden',
                      isActive 
                        ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <Icon className={cn(
                      'h-5 w-5 transition-colors duration-200',
                      isActive 
                        ? 'text-white'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    )} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-white" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Genres */}
            <div className="space-y-3">
              <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Genres
              </h3>
              <div className="grid grid-cols-2 gap-2 px-4">
                {genres.map((genre, index) => (
                  <Link
                    key={genre}
                    to={`/categories?genre=${encodeURIComponent(genre)}`}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm rounded-lg',
                      'bg-white dark:bg-gray-800',
                      'border border-gray-100 dark:border-gray-700',
                      'hover:border-indigo-500 dark:hover:border-indigo-500',
                      'hover:shadow-md transition-all duration-200',
                      'animate-fadeIn'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Tag className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <span className="truncate">{genre}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quick Links
              </h3>
              <div className="space-y-1">
                <Link
                  to="/bookmarks"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Bookmark className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  <span>Bookmarks</span>
                </Link>
                <Link
                  to="/trending"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <TrendingUp className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  <span>Trending</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};