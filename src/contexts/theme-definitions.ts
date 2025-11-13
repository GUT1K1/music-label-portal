import { ThemeName, Theme } from './theme-types';

export const themes: Record<ThemeName, Theme> = {
  'default': {
    name: 'default',
    displayName: 'Стандартный',
    description: 'Оригинальный дизайн сайта',
    icon: '🎨',
    colors: {
      primary: '45 100% 60%',
      secondary: '30 100% 50%',
      background: '0 0% 12%',
      cardBg: '0 0% 15%',
      foreground: '0 0% 90%',
      sidebarBg: '0 0% 13%',
      sidebarAccent: '0 0% 18%',
      border: '0 0% 25%',
      scrollbarThumb: 'rgba(251, 191, 36, 0.5)',
      scrollbarThumbHover: 'rgba(251, 191, 36, 0.7)',
      backgroundPattern: 'none'
    }
  },
  'spring': {
    name: 'spring',
    displayName: 'Весна',
    description: 'Свежесть цветущих садов',
    icon: '🌸',
    colors: {
      primary: '330 70% 65%',
      secondary: '150 60% 55%',
      background: '140 25% 12%',
      cardBg: '140 20% 16%',
      foreground: '140 10% 92%',
      sidebarBg: '140 22% 14%',
      sidebarAccent: '140 18% 20%',
      border: '140 15% 28%',
      scrollbarThumb: 'rgba(244, 114, 182, 0.5)',
      scrollbarThumbHover: 'rgba(244, 114, 182, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 20% 80%, rgba(244, 114, 182, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.06) 0%, transparent 50%)'
    }
  },
  'summer': {
    name: 'summer',
    displayName: 'Лето',
    description: 'Тепло солнечных дней',
    icon: '☀️',
    colors: {
      primary: '45 95% 60%',
      secondary: '30 90% 55%',
      background: '35 30% 10%',
      cardBg: '35 25% 14%',
      foreground: '35 10% 93%',
      sidebarBg: '35 28% 12%',
      sidebarAccent: '35 22% 18%',
      border: '35 20% 26%',
      scrollbarThumb: 'rgba(251, 191, 36, 0.6)',
      scrollbarThumbHover: 'rgba(251, 191, 36, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 50% 10%, rgba(251, 191, 36, 0.1) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)'
    }
  },
  'autumn': {
    name: 'autumn',
    displayName: 'Осень',
    description: 'Золото падающих листьев',
    icon: '🍂',
    colors: {
      primary: '25 85% 60%',
      secondary: '10 80% 55%',
      background: '20 35% 10%',
      cardBg: '20 30% 13%',
      foreground: '25 12% 91%',
      sidebarBg: '20 32% 11%',
      sidebarAccent: '20 25% 17%',
      border: '20 22% 25%',
      scrollbarThumb: 'rgba(251, 146, 60, 0.6)',
      scrollbarThumbHover: 'rgba(251, 146, 60, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 30% 30%, rgba(251, 146, 60, 0.09) 0%, transparent 45%), radial-gradient(circle at 70% 70%, rgba(239, 68, 68, 0.07) 0%, transparent 50%)'
    }
  },
  'winter': {
    name: 'winter',
    displayName: 'Зима',
    description: 'Чистота снежных просторов',
    icon: '❄️',
    colors: {
      primary: '200 90% 65%',
      secondary: '220 85% 70%',
      background: '210 40% 9%',
      cardBg: '210 35% 12%',
      foreground: '210 15% 94%',
      sidebarBg: '210 38% 10%',
      sidebarAccent: '210 30% 15%',
      border: '210 25% 24%',
      scrollbarThumb: 'rgba(96, 165, 250, 0.5)',
      scrollbarThumbHover: 'rgba(96, 165, 250, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 70% 20%, rgba(96, 165, 250, 0.08) 0%, transparent 45%), radial-gradient(circle at 30% 80%, rgba(147, 197, 253, 0.06) 0%, transparent 50%)'
    }
  },
  'sunset': {
    name: 'sunset',
    displayName: 'Закат',
    description: 'Магия заходящего солнца',
    icon: '🌅',
    colors: {
      primary: '15 90% 65%',
      secondary: '340 85% 60%',
      background: '25 40% 9%',
      cardBg: '25 35% 12%',
      foreground: '30 12% 92%',
      sidebarBg: '25 38% 10%',
      sidebarAccent: '25 30% 16%',
      border: '25 25% 24%',
      scrollbarThumb: 'rgba(251, 113, 133, 0.6)',
      scrollbarThumbHover: 'rgba(251, 113, 133, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 50% 100%, rgba(251, 113, 133, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 10%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)'
    }
  },
  'ocean': {
    name: 'ocean',
    displayName: 'Океан',
    description: 'Глубина морских волн',
    icon: '🌊',
    colors: {
      primary: '195 85% 60%',
      secondary: '170 70% 55%',
      background: '195 50% 8%',
      cardBg: '195 45% 11%',
      foreground: '195 15% 93%',
      sidebarBg: '195 48% 9%',
      sidebarAccent: '195 40% 14%',
      border: '195 30% 23%',
      scrollbarThumb: 'rgba(34, 211, 238, 0.5)',
      scrollbarThumbHover: 'rgba(34, 211, 238, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.09) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.07) 0%, transparent 45%)'
    }
  },
  'forest': {
    name: 'forest',
    displayName: 'Лес',
    description: 'Тишина хвойного леса',
    icon: '🌲',
    colors: {
      primary: '145 65% 55%',
      secondary: '125 60% 50%',
      background: '145 45% 9%',
      cardBg: '145 40% 12%',
      foreground: '145 12% 92%',
      sidebarBg: '145 43% 10%',
      sidebarAccent: '145 35% 15%',
      border: '145 28% 24%',
      scrollbarThumb: 'rgba(74, 222, 128, 0.5)',
      scrollbarThumbHover: 'rgba(74, 222, 128, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 40% 20%, rgba(74, 222, 128, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.06) 0%, transparent 45%)'
    }
  },
  'cosmic': {
    name: 'cosmic',
    displayName: 'Космос',
    description: 'Бесконечность звёздного неба',
    icon: '🌌',
    colors: {
      primary: '270 85% 70%',
      secondary: '290 75% 65%',
      background: '260 55% 8%',
      cardBg: '260 50% 11%',
      foreground: '270 18% 93%',
      sidebarBg: '260 53% 9%',
      sidebarAccent: '260 45% 14%',
      border: '260 35% 23%',
      scrollbarThumb: 'rgba(167, 139, 250, 0.5)',
      scrollbarThumbHover: 'rgba(167, 139, 250, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 30% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(192, 132, 252, 0.08) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 30%)'
    }
  },
  'lavender': {
    name: 'lavender',
    displayName: 'Лаванда',
    description: 'Нежность лавандовых полей',
    icon: '💜',
    colors: {
      primary: '265 75% 70%',
      secondary: '280 60% 65%',
      background: '265 35% 10%',
      cardBg: '265 30% 13%',
      foreground: '265 15% 92%',
      sidebarBg: '265 33% 11%',
      sidebarAccent: '265 28% 16%',
      border: '265 22% 25%',
      scrollbarThumb: 'rgba(196, 181, 253, 0.5)',
      scrollbarThumbHover: 'rgba(196, 181, 253, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 40% 30%, rgba(196, 181, 253, 0.09) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(167, 139, 250, 0.07) 0%, transparent 45%)'
    }
  },
  'cherry': {
    name: 'cherry',
    displayName: 'Вишня',
    description: 'Сочная яркость спелых ягод',
    icon: '🍒',
    colors: {
      primary: '350 85% 65%',
      secondary: '10 80% 60%',
      background: '350 40% 9%',
      cardBg: '350 35% 12%',
      foreground: '350 12% 92%',
      sidebarBg: '350 38% 10%',
      sidebarAccent: '350 32% 15%',
      border: '350 25% 24%',
      scrollbarThumb: 'rgba(244, 63, 94, 0.6)',
      scrollbarThumbHover: 'rgba(244, 63, 94, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 60% 20%, rgba(244, 63, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(251, 113, 133, 0.08) 0%, transparent 45%)'
    }
  },
  'mint': {
    name: 'mint',
    displayName: 'Мята',
    description: 'Свежесть мятного бриза',
    icon: '🌿',
    colors: {
      primary: '160 70% 60%',
      secondary: '175 65% 55%',
      background: '160 35% 9%',
      cardBg: '160 30% 12%',
      foreground: '160 12% 92%',
      sidebarBg: '160 33% 10%',
      sidebarAccent: '160 28% 15%',
      border: '160 22% 24%',
      scrollbarThumb: 'rgba(52, 211, 153, 0.5)',
      scrollbarThumbHover: 'rgba(52, 211, 153, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 30% 40%, rgba(52, 211, 153, 0.09) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(16, 185, 129, 0.07) 0%, transparent 45%)'
    }
  },
  'amber': {
    name: 'amber',
    displayName: 'Янтарь',
    description: 'Тепло золотого янтаря',
    icon: '🟡',
    colors: {
      primary: '40 95% 65%',
      secondary: '35 90% 60%',
      background: '38 40% 9%',
      cardBg: '38 35% 12%',
      foreground: '40 12% 92%',
      sidebarBg: '38 38% 10%',
      sidebarAccent: '38 32% 15%',
      border: '38 25% 24%',
      scrollbarThumb: 'rgba(251, 191, 36, 0.6)',
      scrollbarThumbHover: 'rgba(251, 191, 36, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 50% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 45%)'
    }
  },
  'neon': {
    name: 'neon',
    displayName: 'Неон',
    description: 'Яркие неоновые огни',
    icon: '⚡',
    colors: {
      primary: '320 90% 65%',
      secondary: '180 90% 60%',
      background: '250 50% 8%',
      cardBg: '250 45% 11%',
      foreground: '0 0% 95%',
      sidebarBg: '250 48% 9%',
      sidebarAccent: '250 40% 14%',
      border: '250 30% 23%',
      scrollbarThumb: 'rgba(236, 72, 153, 0.6)',
      scrollbarThumbHover: 'rgba(236, 72, 153, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 30% 20%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 45%)'
    }
  },
  'midnight': {
    name: 'midnight',
    displayName: 'Полночь',
    description: 'Тайны полуночного неба',
    icon: '🌙',
    colors: {
      primary: '220 85% 70%',
      secondary: '240 75% 65%',
      background: '230 60% 6%',
      cardBg: '230 55% 9%',
      foreground: '220 20% 94%',
      sidebarBg: '230 58% 7%',
      sidebarAccent: '230 50% 12%',
      border: '230 40% 20%',
      scrollbarThumb: 'rgba(147, 197, 253, 0.5)',
      scrollbarThumbHover: 'rgba(147, 197, 253, 0.7)',
      backgroundPattern: 'radial-gradient(circle at 50% 20%, rgba(147, 197, 253, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 45%)'
    }
  },
  'peach': {
    name: 'peach',
    displayName: 'Персик',
    description: 'Нежность персикового заката',
    icon: '🍑',
    colors: {
      primary: '20 95% 70%',
      secondary: '340 80% 65%',
      background: '15 35% 10%',
      cardBg: '15 30% 13%',
      foreground: '20 12% 92%',
      sidebarBg: '15 33% 11%',
      sidebarAccent: '15 28% 16%',
      border: '15 22% 25%',
      scrollbarThumb: 'rgba(251, 146, 60, 0.6)',
      scrollbarThumbHover: 'rgba(251, 146, 60, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 40% 30%, rgba(251, 146, 60, 0.09) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(251, 113, 133, 0.07) 0%, transparent 45%)'
    }
  },
  'emerald': {
    name: 'emerald',
    displayName: 'Изумруд',
    description: 'Глубина изумрудных кристаллов',
    icon: '💚',
    colors: {
      primary: '155 85% 60%',
      secondary: '165 75% 55%',
      background: '155 50% 8%',
      cardBg: '155 45% 11%',
      foreground: '155 15% 93%',
      sidebarBg: '155 48% 9%',
      sidebarAccent: '155 40% 14%',
      border: '155 30% 23%',
      scrollbarThumb: 'rgba(16, 185, 129, 0.6)',
      scrollbarThumbHover: 'rgba(16, 185, 129, 0.8)',
      backgroundPattern: 'radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(5, 150, 105, 0.08) 0%, transparent 45%)'
    }
  }
};
