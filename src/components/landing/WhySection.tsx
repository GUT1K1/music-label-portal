import Icon from "@/components/ui/icon";
import { useEffect, useRef, useState } from "react";

export default function WhySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="why" ref={sectionRef} className="py-32 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-gold-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-500/20 to-orange-500/20 border border-gold-400/30 rounded-full mb-6">
            <span className="text-gold-300 font-bold text-sm uppercase tracking-wider">Наше преимущество</span>
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Почему 420?
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Честные условия и полная прозрачность работы
          </p>
        </div>

        <div className="grid gap-8 max-w-5xl mx-auto">
          <div className={`relative group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.2s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 via-orange-600 to-gold-600 rounded-[40px] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />
            
            <div className="relative p-12 lg:p-16 bg-gradient-to-br from-gold-500/20 via-orange-500/15 to-gold-600/20 border-2 border-gold-400/40 rounded-[36px] overflow-hidden backdrop-blur-sm group-hover:border-gold-400/70 transition-all duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-400/30 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl" />
              
              <div className="absolute -top-10 -right-10 w-40 h-40 border-4 border-gold-400/20 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 border-4 border-orange-400/20 rounded-full" />
              
              <div className="absolute top-6 right-6 z-10">
                <div className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-gold-500 rounded-full shadow-2xl shadow-gold-500/50">
                  <span className="text-black text-sm font-black uppercase tracking-wider flex items-center gap-2">
                    <Icon name="Star" size={16} className="fill-black" />
                    Лучшее предложение
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-8 relative z-10">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-orange-500 rounded-3xl blur-2xl opacity-60 animate-pulse" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-gold-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Icon name="Zap" size={48} className="text-black" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 pt-2">
                  <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                    0₽ за старт + <span className="bg-gradient-to-r from-gold-200 to-gold-400 bg-clip-text text-transparent">Высокая ставка 50%</span>
                  </h3>
                  <p className="text-gray-200 text-xl leading-relaxed">
                    Без платы за выпуск релиза. Ты платишь только процент от заработка — <span className="text-gold-300 font-bold">50% тебе, 50% нам</span>. Выплаты ежеквартально от 1500₽.
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-gold-500 via-orange-500 to-gold-500 opacity-80" />
            </div>
          </div>

          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.4s' }}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
              
              <div className="relative p-10 bg-black/60 backdrop-blur-sm border-2 border-purple-500/30 rounded-3xl group-hover:border-purple-500/60 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="absolute top-6 right-6 w-24 h-24 border-2 border-purple-400/20 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <Icon name="Upload" size={32} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-6">Дистрибуция</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Icon name="Target" size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">50+ платформ</p>
                      <p className="text-gray-400">Spotify, Apple Music, YouTube, Яндекс, VK и другие</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Icon name="Clock" size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">7 лет лицензии</p>
                      <p className="text-gray-400">Долгосрочное размещение твоих треков</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
              
              <div className="relative p-10 bg-black/60 backdrop-blur-sm border-2 border-cyan-500/30 rounded-3xl group-hover:border-cyan-500/60 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="absolute bottom-6 left-6 w-32 h-32 border-2 border-cyan-400/20 rounded-full -rotate-12 group-hover:-rotate-45 transition-transform duration-700" />
                
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <Icon name="BarChart3" size={32} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-black text-white mb-6">Аналитика & Выплаты</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Icon name="LineChart" size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">Детальная статистика</p>
                      <p className="text-gray-400">Следи за прослушиваниями и доходами в реальном времени</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 group/item">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Icon name="Wallet" size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg mb-1">Выплаты ежеквартально</p>
                      <p className="text-gray-400">От 1500₽ на карту или электронный кошелёк</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
