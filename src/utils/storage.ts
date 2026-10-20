/**
 * Local Device Storage Adapter (AsyncStorage compatible for React Native & Web)
 * 
 * Provides an asynchronous API compatible with @react-native-async-storage/async-storage
 * while running smoothly on Web localStorage in AI Studio preview.
 */

import { KoreanLearningLevel } from '../types';

export const STORAGE_KEYS = {
  LEARNING_LEVEL: 'korea_life_learning_level',
  LEARNING_LEVEL_SET_AT: 'korea_life_learning_level_set_at',
  QUIZ_HISTORY: 'korea_life_quiz_history',
  LANGUAGE: 'korea_life_language',
  HAS_SELECTED_LANG: 'korea_life_has_selected_lang',
  HAS_SELECTED_LEVEL: 'korea_life_has_selected_level',
  SAVED_GUIDES: 'korea_life_saved_guides',
  CHECKLISTS: 'korea_life_checklists',
  PERSONAL_NOTES: 'korea_life_personal_notes',
  VISA_STATE: 'korea_life_visa_state',
  SIMULATOR_MODE: 'korea_life_simulator_mode',
} as const;

export interface IAsyncStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
}

/**
 * Universal AsyncStorage adapter.
 * In a native Expo / React Native environment, this directly wraps:
 * `import AsyncStorage from '@react-native-async-storage/async-storage';`
 */
export const appStorage: IAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn(`[appStorage] getItem failed for ${key}:`, error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`[appStorage] setItem failed for ${key}:`, error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`[appStorage] removeItem failed for ${key}:`, error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (error) {
      console.warn('[appStorage] clear failed:', error);
    }
  },

  getAllKeys: async (): Promise<string[]> => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return Object.keys(window.localStorage);
      }
      return [];
    } catch (error) {
      console.warn('[appStorage] getAllKeys failed:', error);
      return [];
    }
  },
};

/**
 * Helper to fetch stored Korean Learning Level
 */
export async function getStoredLearningLevel(): Promise<KoreanLearningLevel> {
  const raw = await appStorage.getItem(STORAGE_KEYS.LEARNING_LEVEL);
  if (!raw) return 'beginner';
  try {
    const parsed = JSON.parse(raw);
    if (['intro', 'beginner', 'intermediate', 'advanced'].includes(parsed)) {
      return parsed as KoreanLearningLevel;
    }
  } catch {
    if (['intro', 'beginner', 'intermediate', 'advanced'].includes(raw)) {
      return raw as KoreanLearningLevel;
    }
  }
  return 'beginner';
}

/**
 * Helper to persist Korean Learning Level
 */
export async function saveStoredLearningLevel(level: KoreanLearningLevel): Promise<void> {
  await appStorage.setItem(STORAGE_KEYS.LEARNING_LEVEL, JSON.stringify(level));
  await appStorage.setItem(STORAGE_KEYS.LEARNING_LEVEL_SET_AT, new Date().toISOString());
  await appStorage.setItem(STORAGE_KEYS.HAS_SELECTED_LEVEL, JSON.stringify(true));
}
