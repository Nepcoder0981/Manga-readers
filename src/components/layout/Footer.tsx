import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Heart, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isReaderPage = location.pathname.includes('/reader/');

  if (isReaderPage) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-2 px-4 z-50">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/categories" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary">
            <BookOpen className="h-6 w-6" />
            <span className="text-xs">Categories</span>
          </Link>
          <Link to="/favorites" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary">
            <Heart className="h-6 w-6" />
            <span className="text-xs">Favorites</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary">
            <User className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};