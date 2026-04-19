/**
 * Dark Mode Hook & Utilities
 * Feature 8: Dark Mode Toggle
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rut-dark-mode';

export type ThemePreference = 'system' | 'light' | 'dark';

interface DarkModeState {
  isDark: boolean;
  preference: ThemePreference;
}

function getSystemPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function useDarkMode() {
  const [state, setState] = useState<DarkModeState>({
    isDark: false,
    preference: 'system',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const preference = getStoredPreference();
    const isDark = preference === 'system' ? getSystemPreference() : preference === 'dark';
    setState({ isDark, preference });

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const currentPreference = getStoredPreference();
      if (currentPreference === 'system') {
        setState(prev => ({ ...prev, isDark: e.matches }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (!isMounted) return;
    
    const root = document.documentElement;
    if (state.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDark, isMounted]);

  const setPreference = useCallback((preference: ThemePreference) => {
    localStorage.setItem(STORAGE_KEY, preference);
    const isDark = preference === 'system' ? getSystemPreference() : preference === 'dark';
    setState({ isDark, preference });
  }, []);

  const toggle = useCallback(() => {
    const newPreference = state.isDark ? 'light' : 'dark';
    setPreference(newPreference);
  }, [state.isDark, setPreference]);

  return {
    isDark: state.isDark,
    preference: state.preference,
    setPreference,
    toggle,
    isMounted,
  };
}

export function getThemeClasses(isDark: boolean): {
  bg: string;
  text: string;
  card: string;
  border: string;
  accent: string;
} {
  return {
    bg: isDark ? 'bg-gray-900' : 'bg-[#F8F9FA]',
    text: isDark ? 'text-gray-100' : 'text-[#2D3436]',
    card: isDark ? 'bg-gray-800' : 'bg-white',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    accent: isDark ? 'text-[#5BA3B8]' : 'text-[#4A90A4]',
  };
}
