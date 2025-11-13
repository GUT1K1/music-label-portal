export type ThemeName = 'default' | 'spring' | 'summer' | 'autumn' | 'winter' | 'sunset' | 'ocean' | 'forest' | 'cosmic' | 'lavender' | 'cherry' | 'mint' | 'amber' | 'neon' | 'midnight' | 'peach' | 'emerald';

export interface ThemeColors {
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
  backgroundPattern?: string;
}

export interface Theme {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: ThemeColors;
  icon: string;
}
