import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'golden-night' | 'purple-cosmos' | 'blue-ocean' | 'green-forest';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  cardBg: string;
  foreground: string;
  sidebarBg: string;
  sidebarAccent: string;
  border: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
}

interface Theme {
  name: ThemeName;
  displayName: string;
  colors: ThemeColors;
  icon: string;
}

export const themes: Record<ThemeName, Theme> = {
  'golden-night': {
    name: 'golden-night',
    displayName: 'Золотая ночь',
    icon: '✨',
    colors: {
      primary: '45 100% 60%',
      secondary: '30 100% 50%',
      background: '0 0% 12%',
      cardBg: '0 0% 15%',
      foreground: '0 0% 90%',
      sidebarBg: '0 0% 13%',
      sidebarAccent: '0 0% 18%',
      border: '0 0% 25%',
      scrollbarThumb: 'rgba(234, 179, 8, 0.5)',
      scrollbarThumbHover: 'rgba(234, 179, 8, 0.7)'
    }
  },
  'purple-cosmos': {
    name: 'purple-cosmos',
    displayName: 'Фиолетовый космос',
    icon: '🌌',
    colors: {
      primary: '270 95% 75%',
      secondary: '330 85% 60%',
      background: '260 50% 8%',
      cardBg: '260 40% 12%',
      foreground: '270 20% 90%',
      sidebarBg: '260 45% 10%',
      sidebarAccent: '260 35% 15%',
      border: '260 30% 25%',
      scrollbarThumb: 'rgba(168, 85, 247, 0.5)',
      scrollbarThumbHover: 'rgba(168, 85, 247, 0.7)'
    }
  },
  'blue-ocean': {
    name: 'blue-ocean',
    displayName: 'Синий океан',
    icon: '🌊',
    colors: {
      primary: '210 100% 60%',
      secondary: '190 95% 45%',
      background: '210 80% 8%',
      cardBg: '210 65% 12%',
      foreground: '210 20% 90%',
      sidebarBg: '210 70% 10%',
      sidebarAccent: '210 55% 15%',
      border: '210 40% 25%',
      scrollbarThumb: 'rgba(59, 130, 246, 0.5)',
      scrollbarThumbHover: 'rgba(59, 130, 246, 0.7)'
    }
  },
  'green-forest': {
    name: 'green-forest',
    displayName: 'Зелёный лес',
    icon: '🌲',
    colors: {
      primary: '142 70% 50%',
      secondary: '160 85% 45%',
      background: '150 60% 8%',
      cardBg: '150 50% 12%',
      foreground: '150 15% 90%',
      sidebarBg: '150 55% 10%',
      sidebarAccent: '150 45% 15%',
      border: '150 35% 25%',
      scrollbarThumb: 'rgba(34, 197, 94, 0.5)',
      scrollbarThumbHover: 'rgba(34, 197, 94, 0.7)'
    }
  }
};

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => Promise<void>;
  themes: Record<ThemeName, Theme>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_API_URL = 'https://functions.poehali.dev/92c94673-4ea2-4dd2-a145-93a60cd5b93d';

function applyTheme(themeName: ThemeName) {
  const theme = themes[themeName];
  const root = document.documentElement;
  
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--card', theme.colors.cardBg);
  root.style.setProperty('--popover', theme.colors.cardBg);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--card-foreground', theme.colors.foreground);
  root.style.setProperty('--popover-foreground', theme.colors.foreground);
  root.style.setProperty('--sidebar-background', theme.colors.sidebarBg);
  root.style.setProperty('--sidebar-accent', theme.colors.sidebarAccent);
  root.style.setProperty('--sidebar-primary', theme.colors.primary);
  root.style.setProperty('--sidebar-accent-foreground', theme.colors.primary);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--sidebar-border', theme.colors.border);
  root.style.setProperty('--accent', theme.colors.primary);
  root.style.setProperty('--accent-foreground', theme.colors.background);
  root.style.setProperty('--primary-foreground', theme.colors.background);
  root.style.setProperty('--ring', theme.colors.primary);
  root.style.setProperty('--sidebar-ring', theme.colors.primary);
  
  const style = document.createElement('style');
  style.id = 'theme-scrollbar-override';
  const existingStyle = document.getElementById('theme-scrollbar-override');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  style.textContent = `
    * {
      scrollbar-color: ${theme.colors.scrollbarThumb} rgba(0, 0, 0, 0.2) !important;
    }
    *::-webkit-scrollbar-thumb {
      background: ${theme.colors.scrollbarThumb} !important;
    }
    *::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.scrollbarThumbHover} !important;
    }
  `;
  document.head.appendChild(style);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('golden-night');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await fetch(THEME_API_URL);
        if (response.ok) {
          const data = await response.json();
          const themeName = data.theme_name as ThemeName;
          if (themes[themeName]) {
            setCurrentTheme(themeName);
            applyTheme(themeName);
          }
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTheme();
  }, []);

  const setTheme = async (themeName: ThemeName) => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('🎨 Setting theme:', { themeName, userId, apiUrl: THEME_API_URL });
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const requestBody = { theme_name: themeName };
      console.log('🎨 Request:', { method: 'POST', userId, body: requestBody });

      const response = await fetch(THEME_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🎨 Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Failed to save theme';
        try {
          const error = await response.json();
          console.error('🎨 Error response:', error);
          errorMessage = error.error || errorMessage;
        } catch (parseError) {
          console.error('🎨 Failed to parse error:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('🎨 Success response:', result);

      setCurrentTheme(themeName);
      applyTheme(themeName);
    } catch (error) {
      console.error('🎨 Failed to set theme:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}