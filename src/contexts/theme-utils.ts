import { ThemeName } from './theme-types';
import { themes } from './theme-definitions';

export function applyTheme(themeName: ThemeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const existingStyle = document.getElementById('theme-vars');
  if (existingStyle) {
    existingStyle.remove();
  }

  const root = document.documentElement;
  const colors = theme.colors;
  
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--foreground', colors.foreground);
  root.style.setProperty('--card', colors.cardBg);
  root.style.setProperty('--card-foreground', colors.foreground);
  root.style.setProperty('--popover', colors.cardBg);
  root.style.setProperty('--popover-foreground', colors.foreground);
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-foreground', colors.background);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--secondary-foreground', colors.foreground);
  root.style.setProperty('--muted', colors.sidebarAccent);
  root.style.setProperty('--muted-foreground', colors.foreground);
  root.style.setProperty('--accent', colors.primary);
  root.style.setProperty('--accent-foreground', colors.background);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--input', colors.cardBg);
  root.style.setProperty('--ring', colors.primary);
  root.style.setProperty('--sidebar-background', colors.sidebarBg);
  root.style.setProperty('--sidebar-foreground', colors.foreground);
  root.style.setProperty('--sidebar-primary', colors.primary);
  root.style.setProperty('--sidebar-primary-foreground', colors.background);
  root.style.setProperty('--sidebar-accent', colors.sidebarAccent);
  root.style.setProperty('--sidebar-accent-foreground', colors.foreground);
  root.style.setProperty('--sidebar-border', colors.border);
  root.style.setProperty('--sidebar-ring', colors.primary);

  const style = document.createElement('style');
  style.id = 'theme-vars';
  const backgroundPattern = colors.backgroundPattern || 'none';
  style.textContent = `
    body {
      ${backgroundPattern !== 'none' ? `background-image: ${backgroundPattern};` : ''}
      background-attachment: fixed;
      transition: background 0.6s ease-in-out;
    }
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
