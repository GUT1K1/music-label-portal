import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface MenuItem {
  icon: string;
  label: string;
  description: string;
  href: string;
}

export default function SideMenu() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    }
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="w-20 bg-gradient-to-b from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-xl shadow-2xl shadow-amber-500/10">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="text-2xl font-black bg-gradient-to-b from-amber-400 to-orange-500 bg-clip-text text-transparent">
            420
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        </div>
        
        <div className="flex flex-col gap-4 items-center">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <a
                href={item.href}
                className="flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-300 cursor-pointer group relative"
              >
                <Icon name={item.icon as any} size={24} />
                
                {/* Подсветка при ховере */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* Всплывающая подсказка */}
              {hoveredItem === item.label && (
                <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 animate-fadeIn pointer-events-none">
                  <div className="relative">
                    {/* Стрелка */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-amber-500/20"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-black/90 translate-x-[-1px]"></div>
                    </div>
                    
                    {/* Контент подсказки */}
                    <div className="bg-black/90 backdrop-blur-xl border border-amber-500/20 rounded-xl px-4 py-3 min-w-[200px] shadow-2xl shadow-amber-500/20">
                      <div className="font-bold text-amber-400 mb-1 flex items-center gap-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {item.description}
                      </div>
                      
                      {/* Декоративное свечение */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 -z-10 blur-xl"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
