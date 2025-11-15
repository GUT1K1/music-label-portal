import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLocation, useNavigate } from "react-router-dom";

interface LandingHeaderProps {
  isScrolled: boolean;
}

export default function LandingHeader({ isScrolled }: LandingHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Закрываем меню при клике
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleNavigation = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (path === '/blog') {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header className={`fixed top-4 md:top-6 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6`}>
        <div className={`max-w-7xl mx-auto rounded-xl md:rounded-2xl transition-all duration-500 ${
          isScrolled 
            ? 'bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-xl border border-gold-400/40 shadow-2xl shadow-gold-500/20' 
            : 'bg-gradient-to-r from-black/60 via-gray-900/50 to-black/60 backdrop-blur-lg border border-gold-400/20'
        }`}>
          <div className="px-4 md:px-8 lg:px-10">
            <div className="flex items-center justify-between h-[60px] md:h-[72px]">
              <a href="/" className="flex items-center gap-3 group relative">
                <div className="relative">
                  <span className="text-[28px] md:text-[36px] font-black bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                    420
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-400/0 via-gold-400/40 to-gold-400/0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </a>
            
              {/* Desktop menu */}
              <nav className="hidden md:flex items-center gap-8">
                <a href="/blog" onClick={(e) => handleNavigation('/blog', e)} className="text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 relative group px-2 py-1">
                  Блог
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-400 via-gold-400 to-orange-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                </a>
                <a href="#why" onClick={(e) => handleAnchorClick(e, '#why')} className="text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 relative group px-2 py-1">
                  Преимущества
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-400 via-gold-400 to-orange-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                </a>
                <a href="#faq" onClick={(e) => handleAnchorClick(e, '#faq')} className="text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 relative group px-2 py-1">
                  Вопросы
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-yellow-400 via-gold-400 to-orange-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                </a>
                <a
                  href="/app"
                  className="ml-4 px-7 py-3 bg-gradient-to-r from-yellow-400 via-gold-500 to-orange-500 text-black rounded-xl font-bold text-sm transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-gold-500/50 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-gold-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
                  <span className="relative z-10 drop-shadow-sm">Начать</span>
                </a>
              </nav>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-gold-300 transition-colors relative z-[110]"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <Icon name="X" size={24} />
                ) : (
                  <Icon name="Menu" size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <>
          {/* Фоновый overlay */}
          <div className="md:hidden fixed inset-0 bg-black z-[100]" />
          
          {/* Контент меню */}
          <nav className="md:hidden fixed inset-0 z-[101] flex flex-col items-center justify-start pt-24 gap-8 px-6">
            <a 
              href="/blog" 
              onClick={(e) => handleNavigation('/blog', e)}
              className="text-3xl font-bold text-white hover:text-gold-400 transition-colors"
            >
              Блог
            </a>
            
            <a 
              href="#why" 
              onClick={(e) => handleAnchorClick(e, '#why')} 
              className="text-3xl font-bold text-white hover:text-gold-400 transition-colors"
            >
              Преимущества
            </a>
            
            <a 
              href="#faq" 
              onClick={(e) => handleAnchorClick(e, '#faq')} 
              className="text-3xl font-bold text-white hover:text-gold-400 transition-colors"
            >
              Вопросы
            </a>
            
            <a
              href="/app"
              onClick={() => handleNavigation('/app')}
              className="mt-8 px-12 py-5 bg-gradient-to-r from-yellow-400 via-gold-500 to-orange-500 text-black rounded-xl font-bold text-xl transition-all active:scale-95"
            >
              Начать
            </a>
          </nav>
        </>
      )}
    </>
  );
}