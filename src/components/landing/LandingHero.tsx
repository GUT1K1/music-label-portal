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
        
        <p className="text-lg md:text-2xl text-gray-100 max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed opacity-0 animate-fade-in-up px-4 font-medium" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Бесплатно выпускай треки на <span className="font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">170+ площадок</span>. 
          Лицензия на 7 лет, 50% роялти тебе, <span className="font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">100% прав</span> твои.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <a
            href="/app?demo=true"
            className="group relative px-10 py-5 bg-black/60 backdrop-blur-xl rounded-2xl font-black text-xl text-white hover:shadow-2xl transition-all duration-500 active:scale-95 md:hover:scale-105 flex items-center gap-3 overflow-hidden w-full sm:w-auto justify-center border-2 border-purple-500/50 hover:border-pink-400"
            style={{
              boxShadow: '0 0 40px rgba(168,85,247,0.3), inset 0 0 60px rgba(236,72,153,0.1)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-purple-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-400/20 via-transparent to-pink-400/20" />
            <span className="relative z-10 drop-shadow-lg">🚀 Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-2 transition-transform relative z-10" size={24} />
          </a>
          
          <a
            href="#features"
            className="group relative px-10 py-5 bg-black/40 backdrop-blur-xl rounded-2xl font-bold text-xl text-white transition-all duration-500 overflow-hidden active:scale-95 md:hover:scale-105 w-full sm:w-auto border-2 border-cyan-500/40 hover:border-cyan-300"
            style={{
              boxShadow: '0 0 30px rgba(6,182,212,0.2), inset 0 0 60px rgba(6,182,212,0.05)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-400/10" />
            <span className="relative z-10">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-20 md:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="text-center group cursor-pointer p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-purple-500/40 hover:border-purple-400 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 30px rgba(168,85,247,0.2), inset 0 0 60px rgba(168,85,247,0.1)' }}>
            <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)] leading-tight">0₽</div>
            <div className="text-sm md:text-base text-purple-200 font-bold leading-tight">Бесплатный<br/>старт</div>
          </div>
          <div className="text-center group cursor-pointer p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-cyan-500/40 hover:border-cyan-400 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 30px rgba(6,182,212,0.2), inset 0 0 60px rgba(6,182,212,0.1)' }}>
            <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)] leading-tight">7 лет</div>
            <div className="text-sm md:text-base text-cyan-200 font-bold leading-tight">Срок<br/>лицензии</div>
          </div>
          <div className="text-center group cursor-pointer p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-pink-500/40 hover:border-pink-400 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 30px rgba(236,72,153,0.2), inset 0 0 60px rgba(236,72,153,0.1)' }}>
            <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-pink-400 via-orange-400 to-pink-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] leading-tight">100%</div>
            <div className="text-sm md:text-base text-pink-200 font-bold leading-tight">Твоё<br/>авторство</div>
          </div>
          <div className="text-center group cursor-pointer p-6 md:p-8 rounded-3xl bg-black/60 backdrop-blur-xl border-2 border-orange-500/40 hover:border-orange-400 hover:scale-105 transition-all duration-500" style={{ boxShadow: '0 0 30px rgba(249,115,22,0.2), inset 0 0 60px rgba(249,115,22,0.1)' }}>
            <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)] leading-tight">170+</div>
            <div className="text-sm md:text-base text-orange-200 font-bold leading-tight">Платформ</div>
          </div>
        </div>
      </div>
    </section>
  );
}