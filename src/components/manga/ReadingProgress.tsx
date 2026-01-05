import React from 'react';
import { cn } from '../../lib/utils';

interface ReadingProgressProps {
  progress: number;
  total: number;
  className?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  progress,
  total,
  className
}) => {
  const percentage = Math.min(100, Math.round((progress / total) * 100));

  return (
    <div className={cn("w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", className)}>
      <div
        className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};