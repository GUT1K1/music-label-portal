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
      }, i * 350);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12 pt-24 md:pt-32 overflow-hidden">
      {/* Парящие частицы */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full animate-float hidden md:block ${
            i % 4 === 0 ? 'bg-purple-400' :
            i % 4 === 1 ? 'bg-pink-400' :
            i % 4 === 2 ? 'bg-cyan-400' : 'bg-gold-400'
          }`}
          style={{
            left: `${10 + (i * 8) % 80}%`,
            top: `${15 + (i * 13) % 70}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + (i % 3)}s`,
            boxShadow: `0 0 20px currentColor`,
            opacity: 0.6
          }}
        />
      ))}
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 md:mb-10 tracking-tight">
          <span className="block mb-4 md:mb-6 flex flex-wrap justify-center gap-x-3 md:gap-x-4 gap-y-2">
            {words1.map((word, i) => (
              <span 
                key={`w1-${i}`}
                className={`inline-block transition-all duration-700 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent hover:scale-110 cursor-default ${
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
                  className={`inline-block transition-all duration-700 hover:scale-110 cursor-default ${
                    visibleWords.includes(wordIndex) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  <span className="relative inline-block">
                    <span className="absolute inset-0 blur-3xl bg-gradient-to-r from-yellow-400 via-gold-500 to-orange-500 animate-pulse" />
                    <span className="relative bg-gradient-to-r from-yellow-300 via-gold-400 to-orange-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_50px_rgba(234,179,8,1)]">
                      {word}
                    </span>
                  </span>
                </span>
              );
            })}
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-white max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed opacity-0 animate-fade-in-up px-4 font-medium" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Бесплатно выпускай треки на <span className="font-black bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">170+ площадок</span>. 
          Лицензия на 7 лет, 50% роялти тебе, <span className="font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">100% прав</span> твои.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <a
            href="/app?demo=true"
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 rounded-2xl font-black text-xl text-white hover:shadow-2xl transition-all duration-500 active:scale-95 md:hover:scale-110 flex items-center gap-3 overflow-hidden w-full sm:w-auto justify-center border-2 border-purple-300/50"
            style={{
              boxShadow: '0 0 60px rgba(168,85,247,0.6), 0 0 100px rgba(236,72,153,0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">🚀 Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-2 transition-transform relative z-10" size={24} />
          </a>
          
          <a
            href="#features"
            className="group relative px-10 py-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl font-bold text-xl text-white transition-all duration-500 overflow-hidden active:scale-95 md:hover:scale-110 w-full sm:w-auto border-2 border-cyan-300/50"
            style={{
              boxShadow: '0 0 60px rgba(6,182,212,0.5), 0 0 100px rgba(59,130,246,0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-20 md:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="text-center group cursor-pointer p-4 md:p-6 rounded-3xl bg-gradient-to-br from-purple-600/40 via-fuchsia-600/40 to-pink-600/40 backdrop-blur-xl border-2 border-purple-400/60 hover:border-fuchsia-300 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(236,72,153,0.3), inset 0 0 60px rgba(168,85,247,0.2)' }}>
            <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-purple-200 via-fuchsia-200 to-pink-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(168,85,247,1)] leading-tight">0₽</div>
            <div className="text-xs md:text-sm text-purple-100 font-bold leading-snug">Бесплатный старт</div>
          </div>
          <div className="text-center group cursor-pointer p-4 md:p-6 rounded-3xl bg-gradient-to-br from-cyan-600/40 via-blue-600/40 to-indigo-600/40 backdrop-blur-xl border-2 border-cyan-400/60 hover:border-blue-300 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 40px rgba(6,182,212,0.5), 0 0 80px rgba(59,130,246,0.3), inset 0 0 60px rgba(6,182,212,0.2)' }}>
            <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(6,182,212,1)] leading-tight">7 лет</div>
            <div className="text-xs md:text-sm text-cyan-100 font-bold leading-snug">Срок лицензии</div>
          </div>
          <div className="text-center group cursor-pointer p-4 md:p-6 rounded-3xl bg-gradient-to-br from-pink-600/40 via-rose-600/40 to-orange-600/40 backdrop-blur-xl border-2 border-pink-400/60 hover:border-rose-300 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 40px rgba(236,72,153,0.5), 0 0 80px rgba(251,113,133,0.3), inset 0 0 60px rgba(236,72,153,0.2)' }}>
            <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-pink-200 via-rose-200 to-orange-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(236,72,153,1)] leading-tight">100%</div>
            <div className="text-xs md:text-sm text-pink-100 font-bold leading-snug">Твоё авторство</div>
          </div>
          <div className="text-center group cursor-pointer p-4 md:p-6 rounded-3xl bg-gradient-to-br from-orange-600/40 via-amber-600/40 to-yellow-600/40 backdrop-blur-xl border-2 border-orange-400/60 hover:border-amber-300 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 40px rgba(249,115,22,0.5), 0 0 80px rgba(251,191,36,0.3), inset 0 0 60px rgba(249,115,22,0.2)' }}>
            <div className="text-4xl md:text-6xl font-black bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(249,115,22,1)] leading-tight">170+</div>
            <div className="text-xs md:text-sm text-orange-100 font-bold leading-snug">Платформ</div>
          </div>
        </div>
      </div>
    </section>
  );
}