import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";

interface LandingHeroProps {
  scrollY: number;
  typedText: string;
  isTypingComplete: boolean;
}

export default function LandingHero({ scrollY, typedText, isTypingComplete }: LandingHeroProps) {
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  
  const words1 = ['МУЗЫКА', 'БЕЗ', 'ГРАНИЦ.'];
  const words2 = ['ТВОРИ', 'СВОБОДНО'];
  
  useEffect(() => {
    const order = [0, 3, 1, 4, 2];
    const timers: NodeJS.Timeout[] = [];
    
    order.forEach((index, i) => {
      const timer = setTimeout(() => {
        setVisibleWords(prev => [...prev, index]);
      }, i * 200);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12 pt-24 md:pt-32 overflow-hidden">
      <div className="absolute top-20 right-32 w-4 h-4 bg-gold-400 rounded-full animate-pulse hidden md:block shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
      <div className="absolute top-40 left-24 w-3 h-3 bg-orange-400 rounded-full animate-pulse hidden md:block shadow-[0_0_15px_rgba(251,146,60,0.8)]" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 right-1/4 w-3 h-3 bg-gold-500 rounded-full animate-pulse hidden md:block shadow-[0_0_15px_rgba(234,179,8,0.8)]" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-48 left-1/3 w-4 h-4 bg-orange-500 rounded-full animate-pulse hidden md:block shadow-[0_0_20px_rgba(251,146,60,0.8)]" style={{ animationDelay: '1.5s' }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-8 md:mb-10 tracking-tight">
          <span className="block text-white mb-4 md:mb-6 flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2">
            {words1.map((word, i) => (
              <span 
                key={`w1-${i}`}
                className={`inline-block transition-all duration-700 ${
                  visibleWords.includes(i) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {word}
              </span>
            ))}
          </span>
          <span className="block flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2">
            {words2.map((word, i) => {
              const wordIndex = words1.length + i;
              return (
                <span 
                  key={`w2-${i}`}
                  className={`inline-block transition-all duration-700 ${
                    visibleWords.includes(wordIndex) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <span className="relative inline-block">
                    <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-gold-400/30 via-gold-500/40 to-orange-500/30" />
                    <span className="relative bg-gradient-to-r from-yellow-200 via-gold-300 to-orange-300 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                      {word}
                    </span>
                  </span>
                </span>
              );
            })}
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>Бесплатно выпускай треки на 170+ площадок. Лицензия на 7 лет, 50% роялти тебе, 100% авторских прав остаются за тобой.</p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <a
            href="/app?demo=true"
            className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 via-gold-400 to-orange-400 rounded-2xl font-black text-xl text-black hover:shadow-2xl hover:shadow-gold-400/70 transition-all duration-500 active:scale-95 md:hover:scale-110 flex items-center gap-3 overflow-hidden w-full sm:w-auto justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-gold-300 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.9),transparent)]" />
            <span className="relative z-10 drop-shadow-md">Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform relative z-10" size={24} />
          </a>
          
          <a
            href="#features"
            className="group relative px-10 py-5 border-2 border-gold-400/60 rounded-2xl font-bold text-xl text-white hover:border-gold-300 transition-all duration-500 overflow-hidden active:scale-95 md:hover:scale-105 backdrop-blur-sm w-full sm:w-auto hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/30 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-20 md:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto opacity-0 animate-fade-in-up px-6" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="text-center group cursor-pointer px-4 py-8 md:px-6 md:py-10 rounded-3xl bg-gradient-to-br from-gold-600/30 via-orange-600/20 to-gold-600/30 backdrop-blur-sm border-2 border-gold-400/40 hover:border-gold-300 hover:bg-gradient-to-br hover:from-gold-500/40 hover:via-orange-500/30 hover:to-gold-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] min-h-[180px] flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] leading-tight">0₽</div>
            <div className="text-xs md:text-sm text-gold-200 group-hover:text-gold-100 font-bold transition-colors duration-300 leading-snug">Бесплатный<br/>старт</div>
          </div>
          <div className="text-center group cursor-pointer px-4 py-8 md:px-6 md:py-10 rounded-3xl bg-gradient-to-br from-orange-600/30 via-gold-600/20 to-orange-600/30 backdrop-blur-sm border-2 border-orange-400/40 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-500/40 hover:via-gold-500/30 hover:to-orange-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:shadow-[0_0_50px_rgba(251,146,60,0.6)] min-h-[180px] flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-orange-300 via-gold-400 to-yellow-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(251,146,60,0.8)] leading-tight">7 лет</div>
            <div className="text-xs md:text-sm text-orange-200 group-hover:text-orange-100 font-bold transition-colors duration-300 leading-snug">Срок<br/>лицензии</div>
          </div>
          <div className="text-center group cursor-pointer px-4 py-8 md:px-6 md:py-10 rounded-3xl bg-gradient-to-br from-yellow-600/30 via-gold-600/20 to-yellow-600/30 backdrop-blur-sm border-2 border-yellow-400/40 hover:border-yellow-300 hover:bg-gradient-to-br hover:from-yellow-500/40 hover:via-gold-500/30 hover:to-yellow-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:shadow-[0_0_50px_rgba(250,204,21,0.6)] min-h-[180px] flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] leading-tight">100%</div>
            <div className="text-xs md:text-sm text-yellow-200 group-hover:text-yellow-100 font-bold transition-colors duration-300 leading-snug">Твоё<br/>авторство</div>
          </div>
          <div className="text-center group cursor-pointer px-4 py-8 md:px-6 md:py-10 rounded-3xl bg-gradient-to-br from-gold-600/30 via-yellow-600/20 to-orange-600/30 backdrop-blur-sm border-2 border-gold-400/40 hover:border-gold-300 hover:bg-gradient-to-br hover:from-gold-500/40 hover:via-yellow-500/30 hover:to-orange-500/40 transition-all duration-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] min-h-[180px] flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gold-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] leading-tight">170+</div>
            <div className="text-xs md:text-sm text-gold-200 group-hover:text-gold-100 font-bold transition-colors duration-300 leading-snug">Платформ</div>
          </div>
        </div>
      </div>
    </section>
  );
}