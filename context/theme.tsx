/**
 * Theme Context Provider — context/theme.tsx
 *
 * Manages global Light Mode / Dark Mode state for the Hafana Travel mobile app.
 * Persists theme preference across restarts (like web cookies) using SecureStore & localStorage.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from '@/components/styles/theme';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'hafana_app_theme';

interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDarkMode: false,
  colors: LIGHT_COLORS,
  toggleTheme: () => {},
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Load stored theme choice on startup (like cookies)
  useEffect(() => {
    async function loadStoredTheme() {
      try {
        let saved: string | null = null;
        if (Platform.OS === 'web') {
          saved = localStorage.getItem(THEME_KEY);
        } else {
          saved = await SecureStore.getItemAsync(THEME_KEY);
        }
        if (saved === 'dark' || saved === 'light') {
          setTheme(saved);
        }
      } catch (err) {
        // Fallback to light
      }
    }
    loadStoredTheme();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      // Persist choice to SecureStore / localStorage
      if (Platform.OS === 'web') {
        localStorage.setItem(THEME_KEY, nextTheme);
      } else {
        SecureStore.setItemAsync(THEME_KEY, nextTheme).catch(() => {});
      }
      return nextTheme;
    });
  };

  const isDarkMode = theme === 'dark';
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
