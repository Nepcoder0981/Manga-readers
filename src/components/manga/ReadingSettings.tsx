import React from 'react';
import { Moon, Sun, Palette, ZoomIn, ZoomOut, RotateCw, Eye, Layout } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReadingSettingsProps {
  colorScheme: 'light' | 'dark' | 'sepia';
  onColorSchemeChange: (scheme: 'light' | 'dark' | 'sepia') => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  rotation: number;
  onRotationChange: (rotation: number) => void;
  viewMode: 'vertical' | 'horizontal' | 'single' | 'double';
  onViewModeChange: (mode: 'vertical' | 'horizontal' | 'single' | 'double') => void;
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({
  colorScheme,
  onColorSchemeChange,
  zoom,
  onZoomChange,
  rotation,
  onRotationChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Reading Settings</h3>
        
        <div className="space-y-4">
          {/* Color Scheme */}
          <div>
            <label className="text-sm font-medium mb-2 block">Color Scheme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', icon: Sun },
                { value: 'dark', icon: Moon },
                { value: 'sepia', icon: Palette }
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onColorSchemeChange(value as 'light' | 'dark' | 'sepia')}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-center",
                    colorScheme === value
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div>
            <label className="text-sm font-medium mb-2 block">Zoom Level</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onZoomChange(Math.max(50, zoom - 10))}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={zoom}
                  onChange={(e) => onZoomChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <span className="w-16 text-center">{zoom}%</span>
            </div>
          </div>

          {/* View Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">View Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'vertical', icon: Layout, label: 'Vertical' },
                { value: 'horizontal', icon: Eye, label: 'Horizontal' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => onViewModeChange(value as 'vertical' | 'horizontal' | 'single' | 'double')}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-center gap-2",
                    viewMode === value
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="text-sm font-medium mb-2 block">Rotation</label>
            <button
              onClick={() => onRotationChange((rotation + 90) % 360)}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center gap-2"
            >
              <RotateCw className="h-5 w-5" />
              <span>Rotate {rotation}°</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};