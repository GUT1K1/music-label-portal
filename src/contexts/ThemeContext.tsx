import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, Theme } from './theme-types';
import { themes } from './theme-definitions';
import { applyTheme } from './theme-utils';

export type { ThemeName, Theme };
export { themes };

const THEME_API_URL = 'https://functions.poehali.dev/92c94673-4ea2-4dd2-a145-93a60cd5b93d';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (themeName: ThemeName, userId?: number) => Promise<void>;
  themes: Record<ThemeName, Theme>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('summer');
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

  const setTheme = async (themeName: ThemeName, userId?: number) => {
    try {
      const userIdToUse = userId || localStorage.getItem('userId');
      console.log('🎨 Setting theme:', { themeName, userId: userIdToUse, apiUrl: THEME_API_URL });
      
      if (!userIdToUse) {
        throw new Error('User not authenticated');
      }

      const requestBody = { theme_name: themeName };
      console.log('🎨 Request:', { method: 'POST', userId: userIdToUse, body: requestBody });

      const response = await fetch(THEME_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': String(userIdToUse)
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
