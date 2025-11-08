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

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      icon: 'Home',
      label: 'Главная',
      description: 'Вернуться на главную',
      href: '#'
    },
    {
      icon: 'Music',
      label: 'Услуги',
      description: 'Дистрибуция музыки',
      href: '#services'
    },
    {
      icon: 'Radio',
      label: 'Площадки',
      description: 'Все стриминговые сервисы',
      href: '#platforms'
    },
    {
      icon: 'BarChart3',
      label: 'Аналитика',
      description: 'Статистика релизов',
      action: () => {
        navigate('/analytics');
        setIsOpen(false);
      }
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
      description: 'Личный кабинет',
      action: () => {
        navigate('/app');
        setIsOpen(false);
      },
      variant: 'primary'
    }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      window.location.href = item.href;
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Кнопка бургера */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-[100] w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 backdrop-blur-xl flex flex-col items-center justify-center gap-1.5 group hover:border-amber-400/50 transition-all duration-300 shadow-lg shadow-amber-500/20"
        aria-label="Меню"
      >
        {/* Анимированные линии бургера */}
        <div
          className={`w-7 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        ></div>
        <div
          className={`w-7 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300 ${
            isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
        ></div>
        <div
          className={`w-7 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        ></div>
        
        {/* Свечение при ховере */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
      </button>

      {/* Оверлей */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Меню */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-b from-black via-amber-950/20 to-black border-l-2 border-amber-500/30 z-[95] transform transition-transform duration-500 ease-out shadow-2xl shadow-amber-500/20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Декоративное свечение */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-orange-500/10 to-amber-500/5 pointer-events-none"></div>
        
        {/* Контент меню */}
        <div className="relative h-full flex flex-col p-8 pt-28 overflow-y-auto">
          {/* Логотип */}
          <div className="mb-12 text-center">
            <div className="inline-block relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-6xl font-black bg-gradient-to-b from-amber-300 via-orange-400 to-red-600 bg-clip-text text-transparent drop-shadow-2xl mb-2">
                  420
                </div>
                <div className="text-sm text-gray-400 font-medium">Музыкальный лейбл</div>
              </div>
            </div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-500/70 to-transparent mx-auto mt-4"></div>
          </div>

          {/* Пункты меню */}
          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => {
              const isPrimary = item.variant === 'primary';
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    isPrimary
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 p-5 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105'
                      : 'bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-5 hover:from-amber-500/10 hover:to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-4">
                    {/* Иконка */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                      isPrimary 
                        ? 'bg-black/20' 
                        : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30'
                    }`}>
                      <Icon 
                        name={item.icon as any} 
                        size={24} 
                        className={isPrimary ? 'text-white' : 'text-amber-400 group-hover:text-amber-300'}
                      />
                    </div>
                    
                    {/* Текст */}
                    <div className="flex-1 text-left">
                      <div className={`font-bold mb-0.5 ${
                        isPrimary ? 'text-black text-lg' : 'text-amber-400 group-hover:text-amber-300'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-sm ${
                        isPrimary ? 'text-black/70' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Стрелка */}
                    <Icon 
                      name="ChevronRight" 
                      size={20} 
                      className={`${
                        isPrimary ? 'text-black/50' : 'text-amber-500/50 group-hover:text-amber-400'
                      } group-hover:translate-x-1 transition-transform`}
                    />
                  </div>
                  
                  {/* Анимированный фон при ховере */}
                  {!isPrimary && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-orange-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Футер */}
          <div className="mt-8 pt-6 border-t border-amber-500/20 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse"></div>
              <span>2025 © 420 Music</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}