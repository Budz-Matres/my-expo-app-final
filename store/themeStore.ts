import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'custom';

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface CustomTheme {
  name: string;
  colors: ThemeColors;
}

// Predefined themes
const LIGHT_THEME: CustomTheme = {
  name: 'Light',
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#1DB954',
    secondary: '#E0E0E0',
    accent: '#191414',
  },
};

const DARK_THEME: CustomTheme = {
  name: 'Dark',
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    primary: '#1DB954',
    secondary: '#282828',
    accent: '#FFFFFF',
  },
};

const NEON_THEME: CustomTheme = {
  name: 'Neon',
  colors: {
    background: '#0A0E27',
    text: '#00FF88',
    primary: '#FF006E',
    secondary: '#1A1A3E',
    accent: '#00D9FF',
  },
};

interface ThemeContextType {
  mode: ThemeMode;
  currentTheme: CustomTheme;
  setThemeMode: (mode: ThemeMode) => void;
  setCustomTheme: (theme: CustomTheme) => void;
  updateThemeColor: (key: keyof ThemeColors, value: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [customTheme, setCustomThemeState] = useState<CustomTheme>(DARK_THEME);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    if (newMode === 'light') {
      setCustomThemeState(LIGHT_THEME);
    } else if (newMode === 'dark') {
      setCustomThemeState(DARK_THEME);
    }
  }, []);

  const setCustomTheme = useCallback((theme: CustomTheme) => {
    setMode('custom');
    setCustomThemeState(theme);
  }, []);

  const updateThemeColor = useCallback((key: keyof ThemeColors, value: string) => {
    setMode('custom');
    setCustomThemeState((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  }, []);

  const value: ThemeContextType = {
    mode,
    currentTheme: customTheme,
    setThemeMode,
    setCustomTheme,
    updateThemeColor,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};

export const PRESET_THEMES = [LIGHT_THEME, DARK_THEME, NEON_THEME];
export { LIGHT_THEME, DARK_THEME, NEON_THEME };
