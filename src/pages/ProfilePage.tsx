import React from 'react';
import { User, BookMarked, History, Settings } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <BookMarked className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Bookmarks</h2>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Access your saved manga</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Reading History</h2>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">View your reading progress</p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Customize your reading experience</p>
        </div>
      </div>
    </div>
  );
};