import React from 'react';
import { cn } from '../../lib/utils';
import type { MangaPage } from '../../types/manga';

interface PagePreviewProps {
  pages: MangaPage[];
  currentPage: number;
  onPageClick: (index: number) => void;
}

export const PagePreview: React.FC<PagePreviewProps> = ({
  pages,
  currentPage,
  onPageClick
}) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {pages.map((page, index) => (
            <button
              key={page.page}
              onClick={() => onPageClick(index)}
              className={cn(
                "flex-shrink-0 relative rounded overflow-hidden transition-all",
                "hover:ring-2 hover:ring-indigo-500 dark:hover:ring-indigo-400",
                currentPage === index && "ring-2 ring-indigo-600 dark:ring-indigo-400"
              )}
            >
              <img
                src={page.url}
                alt={`Page ${page.page}`}
                className="w-16 h-24 object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                {page.page}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};