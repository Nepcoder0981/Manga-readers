import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadingSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  colorScheme: 'light' | 'dark' | 'sepia';
  readingMode: 'vertical' | 'horizontal' | 'single' | 'double';
  autoScroll: boolean;
  autoScrollSpeed: number;
}

interface SettingsState {
  settings: ReadingSettings;
  updateSettings: (settings: Partial<ReadingSettings>) => void;
}

const defaultSettings: ReadingSettings = {
  fontSize: 16,
  lineHeight: 1.5,
  fontFamily: 'system-ui',
  colorScheme: 'light',
  readingMode: 'vertical',
  autoScroll: false,
  autoScrollSpeed: 8, // Default speed increased
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'reading-settings',
    }
  )
);