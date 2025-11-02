import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  icon: string;
  label: string;
  description: string;
  href?: string;
  action?: () => void;
  variant?: 'default' | 'primary';
}

export default function SideMenu() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      icon: 'Home',
      label: 'Главная',
      description: 'Вернуться на главную страницу',
      href: '#'
    },
    {
      icon: 'Music',
      label: 'Услуги',
      description: 'Дистрибуция музыки на площадках',
      href: '#services'
    },
    {
      icon: 'Radio',
      label: 'Площадки',
      description: 'Spotify, Apple Music, Яндекс.Музыка',
      href: '#platforms'
    },
    {
      icon: 'Trophy',
      label: 'Кейсы',
      description: 'Успешные релизы наших клиентов',
      href: '#cases'
    },
    {
      icon: 'Users',
      label: 'Контакты',
      description: 'Связаться с нами',
      href: '#contacts'
    },
    {
      icon: 'LogIn',
      label: 'Войти',
      description: 'Перейти в личный кабинет',
      action: () => navigate('/app'),
      variant: 'primary'
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <div className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 hidden sm:block">
      <div className="relative w-20 bg-gradient-to-b from-black/80 via-amber-950/40 to-black/80 border border-amber-500/30 rounded-3xl p-4 backdrop-blur-2xl shadow-2xl shadow-amber-500/20">
        {/* Внутреннее свечение */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-amber-500/5 via-orange-500/10 to-amber-500/5 blur-xl -z-10"></div>
        
        {/* Логотип */}
        <div className="flex flex-col items-center gap-2 mb-6 pb-4 border-b border-amber-500/20">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
            <div className="relative text-3xl font-black bg-gradient-to-b from-amber-300 via-orange-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
              420
            </div>
          </div>
          <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent"></div>
        </div>
        
        {/* Пункты меню */}
        <div className="flex flex-col gap-3 items-center">
          {menuItems.map((item) => {
            const isPrimary = item.variant === 'primary';
            
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 cursor-pointer group
                    ${isPrimary 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-110' 
                      : 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30'
                    }
                  `}
                >
                  <Icon name={item.icon as any} size={isPrimary ? 26 : 24} className={isPrimary ? 'font-bold' : ''} />
                  
                  {/* Анимированная рамка при ховере */}
                  {!isPrimary && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  
                  {/* Пульсирующее свечение для кнопки "Войти" */}
                  {isPrimary && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300 -z-10"></div>
                  )}
                </button>

                {/* Всплывающая подсказка */}
                {hoveredItem === item.label && (
                  <div className="absolute left-full ml-8 top-1/2 -translate-y-1/2 animate-fadeIn pointer-events-none hidden md:block">
                    <div className="relative">
                      {/* Улучшенная стрелка */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-2px]">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px] border-r-amber-500/30"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-black/95 translate-x-[-2px]"></div>
                      </div>
                      
                      {/* Контент подсказки с улучшенным дизайном */}
                      <div className="relative bg-gradient-to-br from-black/95 via-amber-950/30 to-black/95 backdrop-blur-2xl border-2 border-amber-500/30 rounded-2xl px-5 py-4 min-w-[220px] shadow-2xl">
                        {/* Заголовок */}
                        <div className={`font-bold mb-2 flex items-center gap-2 ${isPrimary ? 'text-amber-300' : 'text-amber-400'}`}>
                          <div className={`w-1.5 h-5 rounded-full ${isPrimary ? 'bg-gradient-to-b from-yellow-400 to-orange-500' : 'bg-gradient-to-b from-amber-400 to-orange-500'}`}></div>
                          <span className="text-base">{item.label}</span>
                        </div>
                        
                        {/* Описание */}
                        <div className="text-sm text-gray-300 leading-relaxed pl-4">
                          {item.description}
                        </div>
                        
                        {/* Декоративный градиент снизу */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent rounded-b-2xl"></div>
                        
                        {/* Внешнее свечение */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 -z-10 blur-2xl"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Декоративная нижняя линия */}
        <div className="mt-6 pt-4 border-t border-amber-500/20 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
