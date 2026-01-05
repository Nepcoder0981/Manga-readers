import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Settings,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Layout,
  List,
  ImageIcon,
  AlertCircle,
  Bookmark,
  Share2,
  Moon,
  Sun,
  Palette,
  RotateCw,
  Keyboard,
  ChevronDown,
  BookOpen,
  Download
} from 'lucide-react';
import { useMangaStore } from '../store/manga';
import { useRecentStore } from '../store/recent';
import { useThemeStore } from '../store/theme';
import { useSettingsStore } from '../store/settings';
import { cn } from '../lib/utils';
import { downloadChapter } from '../lib/download';

type ViewMode = 'vertical' | 'horizontal' | 'single' | 'double';
type ColorScheme = 'light' | 'dark' | 'sepia';

const ReaderPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { settings, updateSettings } = useSettingsStore();
  const { 
    currentPages, 
    currentChapters, 
    isLoading, 
    error, 
    fetchPages, 
    fetchChapters 
  } = useMangaStore();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState<Record<number, boolean>>({});
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<ViewMode>('vertical');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(isDarkMode ? 'dark' : 'light');
  const [showChapterList, setShowChapterList] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const [imageRotation, setImageRotation] = useState(0);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [autoScroll, setAutoScroll] = useState(settings.autoScroll);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(settings.autoScrollSpeed);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const autoScrollRef = useRef<number>();

  useEffect(() => {
    if (chapterId && currentChapters.length > 0) {
      const index = currentChapters.findIndex(chapter => chapter.chapter_id === chapterId);
      if (index !== -1) {
        setCurrentChapterIndex(index);
      }
    }
  }, [chapterId, currentChapters]);

  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleChapterChange = (newChapterId: string) => {
    navigate(`/reader/${newChapterId}`);
    setShowChapterSelector(false);
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < currentChapters.length - 1) {
      const nextChapter = currentChapters[currentChapterIndex + 1];
      handleChapterChange(nextChapter.chapter_id);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = currentChapters[currentChapterIndex - 1];
      handleChapterChange(prevChapter.chapter_id);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showSettings && !showChapterList) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      const scroll = () => {
        if (containerRef.current) {
          containerRef.current.scrollBy({
            top: autoScrollSpeed,
            behavior: 'smooth'
          });
        }
      };
      autoScrollRef.current = window.setInterval(scroll, 50);
    }
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [autoScroll, autoScrollSpeed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'v') setViewMode('vertical');
      if (e.key === 'h') setViewMode('horizontal');
      if (e.key === 'd') setViewMode('double');
      if (e.key === 's') setViewMode('single');
      if (e.key === '+') setZoom(prev => Math.min(200, prev + 10));
      if (e.key === '-') setZoom(prev => Math.max(50, prev - 10));
      if (e.key === 'r') setImageRotation(prev => (prev + 90) % 360);
      if (e.key === ' ') {
        e.preventDefault();
        setAutoScroll(prev => !prev);
        updateSettings({ autoScroll: !autoScroll });
      }
      if (e.key === 'ArrowUp' && autoScroll) {
        e.preventDefault();
        const newSpeed = Math.max(1, autoScrollSpeed - 1);
        setAutoScrollSpeed(newSpeed);
        updateSettings({ autoScrollSpeed: newSpeed });
      }
      if (e.key === 'ArrowDown' && autoScroll) {
        e.preventDefault();
        const newSpeed = Math.min(15, autoScrollSpeed + 1);
        setAutoScrollSpeed(newSpeed);
        updateSettings({ autoScrollSpeed: newSpeed });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [autoScroll, autoScrollSpeed, updateSettings]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  useEffect(() => {
    if (chapterId) fetchPages(chapterId);
  }, [chapterId, fetchPages]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await readerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={readerRef}
      className={cn(
        'min-h-screen w-full relative',
        colorScheme === 'light' && 'bg-gray-50',
        colorScheme === 'dark' && 'bg-gray-900',
        colorScheme === 'sepia' && 'bg-[#f4ecd8]',
        isFullscreen && 'bg-black'
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Top Controls */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300 transform",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className={cn(
          "backdrop-blur-lg border-b",
          colorScheme === 'light' && 'bg-white/90 border-gray-200',
          colorScheme === 'dark' && 'bg-gray-900/90 border-gray-800',
          colorScheme === 'sepia' && 'bg-[#f4ecd8]/90 border-[#e4d5b7]'
        )}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              
              <div className="flex items-center gap-2">
                {['vertical', 'horizontal', 'single', 'double'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as ViewMode)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === mode
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    )}
                    title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
                  >
                    {mode === 'vertical' && <Layout className="h-5 w-5" />}
                    {mode === 'horizontal' && <List className="h-5 w-5" />}
                    {mode === 'single' && <Eye className="h-5 w-5" />}
                    {mode === 'double' && <EyeOff className="h-5 w-5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm w-12 text-center text-gray-900 dark:text-gray-100">{zoom}%</span>
                <button
                  onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Auto-scroll Controls */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => {
                    const newState = !autoScroll;
                    setAutoScroll(newState);
                    updateSettings({ autoScroll: newState });
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    autoScroll
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  )}
                  title="Toggle Auto-scroll"
                >
                  {autoScroll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {autoScroll && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={autoScrollSpeed}
                      onChange={(e) => {
                        const newSpeed = Number(e.target.value);
                        setAutoScrollSpeed(newSpeed);
                        updateSettings({ autoScrollSpeed: newSpeed });
                      }}
                      className="w-24 accent-indigo-600 dark:accent-indigo-400"
                    />
                    <span className="text-sm w-8 text-center text-gray-900 dark:text-gray-100">
                      {autoScrollSpeed}x
                    </span>
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

              {/* Feature Buttons */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setImageRotation(prev => (prev + 90) % 360)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Rotate Image"
              >
                <RotateCw className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="h-5 w-5" />
              </button>

              <button
                onClick={async () => {
                  try {
                    const chapter = currentChapters[currentChapterIndex];
                    await downloadChapter(
                      currentPages,
                      chapter.chapter_name || `Chapter ${chapter.chapter_number}`,
                      chapter.chapter_number
                    );
                  } catch (error) {
                    console.error('Download failed:', error);
                  }
                }}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Download Chapter"
              >
                <Download className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showSettings
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Navigation Bar */}
      <div className={cn(
        "fixed top-16 left-0 right-0 z-40",
        "transition-all duration-300 transform",
        showControls ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className={cn(
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg",
          "border-b border-gray-200 dark:border-gray-800"
        )}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => goToPreviousChapter()}
                  disabled={currentChapterIndex === 0}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    "text-gray-600 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    currentChapterIndex === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowChapterSelector(!showChapterSelector)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "bg-gray-100 dark:bg-gray-800",
                      "text-gray-900 dark:text-gray-100",
                      "hover:bg-gray-200 dark:hover:bg-gray-700",
                      "transition-colors"
                    )}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="font-medium">
                      Chapter {currentChapters[currentChapterIndex]?.chapter_number}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showChapterSelector && (
                    <div className={cn(
                      "absolute top-full left-0 mt-2",
                      "w-64 max-h-96 overflow-y-auto",
                      "bg-white dark:bg-gray-800",
                      "rounded-lg shadow-xl",
                      "border border-gray-200 dark:border-gray-700"
                    )}>
                      <div className="p-2 space-y-1">
                        {currentChapters.map((chapter, index) => (
                          <button
                            key={chapter.chapter_id}
                            onClick={() => handleChapterChange(chapter.chapter_id)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg",
                              "transition-colors",
                              currentChapterIndex === index
                                ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                                : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span>Chapter {chapter.chapter_number}</span>
                              {currentChapterIndex === index && (
                                <BookOpen className="h-4 w-4" />
                              )}
                            </div>
                            {chapter.chapter_name && chapter.chapter_name !== "Chapter" && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {chapter.chapter_name}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => goToNextChapter()}
                  disabled={currentChapterIndex === currentChapters.length - 1}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    "text-gray-600 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    currentChapterIndex === currentChapters.length - 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentChapterIndex + 1} / {currentChapters.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={cn(
          "fixed top-16 right-0 w-80 z-40",
          "bg-white dark:bg-gray-800 shadow-xl",
          "border-l border-gray-200 dark:border-gray-700",
          "h-[calc(100vh-4rem)] overflow-y-auto"
        )}>
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Reading Settings</h3>
              
              <div className="space-y-4">
                {/* Color Scheme */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'sepia'].map((scheme) => (
                      <button
                        key={scheme}
                        onClick={() => setColorScheme(scheme as ColorScheme)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          colorScheme === scheme
                            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        )}
                      >
                        {scheme === 'light' && <Sun className="h-5 w-5 mx-auto" />}
                        {scheme === 'dark' && <Moon className="h-5 w-5 mx-auto" />}
                        {scheme === 'sepia' && <Palette className="h-5 w-5 mx-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-scroll Speed */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                    Auto-scroll Speed
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={autoScrollSpeed}
                    onChange={(e) => {
                      const newSpeed = Number(e.target.value);
                      setAutoScrollSpeed(newSpeed);
                      updateSettings({ autoScrollSpeed: newSpeed });
                    }}
                    className="w-full accent-indigo-600 dark:accent-indigo-400"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>1x</span>
                    <span>{autoScrollSpeed}x</span>
                    <span>15x</span>
                  </div>
                </div>

                {/* Image Quality */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                    Image Quality
                  </label>
                  <select
                    className={cn(
                      "w-full rounded-lg border p-2",
                      "bg-white dark:bg-gray-800",
                      "text-gray-900 dark:text-gray-100",
                      "border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (Faster)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Toggle Fullscreen</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">F</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Vertical View</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">V</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Horizontal View</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">H</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Zoom In/Out</span>
                  <div className="space-x-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">+</kbd>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">-</kbd>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Toggle Auto-scroll</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Adjust Speed</span>
                  <div className="space-x-2">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">↑</kbd>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">↓</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reader Content */}
      <div 
        ref={containerRef}
        className={cn(
          "h-screen overflow-y-auto scroll-smooth",
          viewMode === 'horizontal' && "flex items-center",
          showSettings && "pr-80"
        )}
      >
        <div className={cn(
          "max-w-4xl mx-auto px-4 py-20 space-y-4",
          viewMode === 'horizontal' && "flex gap-4 px-20",
          viewMode === 'double' && "grid grid-cols-2 gap-4"
        )}>
          {currentPages.map((page, index) => (
            <div 
              key={page.page} 
              className={cn(
                "relative rounded-lg overflow-hidden",
                "transform transition-all duration-300",
                colorScheme === 'light' && "bg-gray-100",
                colorScheme === 'dark' && "bg-gray-800",
                colorScheme === 'sepia' && "bg-[#e4d5b7]",
                viewMode === 'horizontal' && "flex-shrink-0",
                viewMode === 'double' && index % 2 === 0 && "col-span-2"
              )}
              style={{
                transform: `scale(${zoom / 100}) rotate(${imageRotation}deg)`,
                transformOrigin: 'center center',
                width: viewMode === 'horizontal' ? '70vw' : '100%',
                minHeight: '200px'
              }}
            >
              {isImageLoading[page.page] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <img
                src={page.url}
                alt={`Page ${page.page}`}
                className={cn(
                  "w-full h-auto select-none",
                  "transition-opacity duration-300",
                  isImageLoading[page.page] ? "opacity-0" : "opacity-100"
                )}
                loading="lazy"
                onLoad={() => {
                  setIsImageLoading(prev => ({ ...prev, [page.page]: false }));
                }}
                onError={() => {
                  setIsImageLoading(prev => ({ ...prev, [page.page]: false }));
                }}
                style={{
                  imageRendering: 'high-quality',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Overlay */}
      <div className={cn(
        "fixed inset-0 pointer-events-none",
        "flex items-center justify-between px-4",
        "transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <button
          onClick={() => goToPreviousChapter()}
          disabled={currentChapterIndex === 0}
          className={cn(
            "pointer-events-auto",
            "p-4 rounded-full",
            "bg-black/20 backdrop-blur-lg",
            "hover:bg-black/30",
            "transition-colors",
            currentChapterIndex === 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <button
          onClick={() => goToNextChapter()}
          disabled={currentChapterIndex === currentChapters.length - 1}
          className={cn(
            "pointer-events-auto",
            "p-4 rounded-full",
            "bg-black/20 backdrop-blur-lg",
            "hover:bg-black/30",
            "transition-colors",
            currentChapterIndex === currentChapters.length - 1 && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 h-1",
        "transition-all duration-300",
        showControls ? "opacity-100" : "opacity-0",
        colorScheme === 'light' && "bg-gray-200",
        colorScheme === 'dark' && "bg-gray-800",
        colorScheme === 'sepia' && "bg-[#e4d5b7]"
      )}>
        <div 
          className="h-full bg-indigo-600 dark:bg-indigo-400"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ReaderPage;

export { ReaderPage };