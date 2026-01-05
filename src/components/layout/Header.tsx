import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, Moon, Search, Sun, Code, X, Bell } from 'lucide-react';
import { useThemeStore } from '../../store/theme';
import { useMangaStore } from '../../store/manga';
import { useDebounce } from '../../hooks/useDebounce';
import { Sidebar } from './Sidebar';
import { cn } from '../../lib/utils';

export const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const searchManga = useMangaStore((state) => state.searchManga);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showDevInfo, setShowDevInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const debouncedSearch = useDebounce((value: string) => {
    searchManga(value);
    setIsSearching(false);
  }, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dev-info') && !target.closest('.dev-trigger')) {
        setShowDevInfo(false);
      }
      if (!target.closest('.notifications')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <header className="sticky top-0 z-[50] border-b bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 backdrop-blur dark:from-violet-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300 transform hover:scale-105"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="h-6 w-6 animate-float text-violet-600 dark:text-violet-400" />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">
              MangaReader
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          <div className={cn(
            "relative w-full max-w-[160px] sm:max-w-md transition-all duration-300",
            isSearchFocused ? "sm:max-w-xl" : "sm:max-w-md"
          )}>
            <Search className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300",
              isSearching ? "text-violet-600 animate-spin" : "text-gray-500"
            )} />
            <input
              type="search"
              placeholder="Search manga..."
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "w-full rounded-full py-2 pl-10 pr-4 text-sm transition-all duration-300",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur",
                "focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400",
                "transform hover:scale-[1.02] hover:shadow-lg",
                isSearchFocused && "shadow-lg ring-2 ring-violet-500 dark:ring-violet-400"
              )}
            />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="relative p-2 hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            <button 
              className="dev-trigger p-2 hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => setShowDevInfo(!showDevInfo)}
              aria-label="Developer info"
            >
              <Code className="h-5 w-5" />
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Developer Info Card */}
      <div className={cn(
        "dev-info fixed right-4 top-20 w-[calc(100%-2rem)] sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-violet-200 dark:border-violet-800 transition-all duration-300 transform z-[60]",
        showDevInfo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="relative p-6 space-y-4">
          <button
            onClick={() => setShowDevInfo(false)}
            className="absolute right-2 top-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close developer info"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              nepcoder
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Full Stack Developer & AI Engineer
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Technical Specialties</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Full Stack Development
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                AI/ML Engineering
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                API Development
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Connect</h4>
            <a
              href="https://t.me/nepcodex"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              Contact Developer (@nepcodex) →
            </a>
            <a
              href="https://t.me/nepcodexcc"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              Join Telegram Channel (@nepcodexcc) →
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              Building the future of AI-powered creativity
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      <div className={cn(
        "notifications fixed right-4 top-20 w-[calc(100%-2rem)] sm:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-violet-200 dark:border-violet-800 transition-all duration-300 transform z-[60]",
        showNotifications ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium">New Chapter Available</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chapter 123 of Manga Title is now available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};