import React from 'react';
import { Link } from 'react-router-dom';
import { History, Trash2 } from 'lucide-react';
import { useRecentStore } from '../store/recent';
import { formatDistanceToNow } from 'date-fns';

export const HistoryPage: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentStore();

  if (recentlyViewed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <History className="h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">
          No reading history yet
        </h2>
        <p className="text-gray-500 dark:text-gray-500">
          Start reading some manga to see your history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-indigo-600" />
          <h1 className="text-3xl font-bold">Recently Read</h1>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid gap-6">
        {recentlyViewed.map((item) => (
          <Link
            key={item.id}
            to={`/manga/${item.id}`}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-20 h-28 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last read {formatDistanceToNow(item.lastViewed)} ago
              </p>
              {item.lastChapter && (
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
                  Chapter {item.lastChapter}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};