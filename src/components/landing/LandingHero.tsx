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
        
        <p className="text-xl md:text-3xl text-gray-200 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed opacity-0 animate-fade-in-up px-4 font-bold" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Бесплатно выпускай треки на <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">170+ площадок</span>. 
          Лицензия на 7 лет, 50% роялти тебе, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">100% прав</span> твои.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <a
            href="/app?demo=true"
            className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl font-black text-2xl text-white hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 active:scale-95 md:hover:scale-110 flex items-center gap-4 overflow-hidden w-full sm:w-auto justify-center shadow-[0_0_40px_rgba(219,39,119,0.5)] border-2 border-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.9),transparent)]" />
            <span className="relative z-10 drop-shadow-lg">🚀 Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-2 transition-transform relative z-10" size={28} />
          </a>
          
          <a
            href="#features"
            className="group relative px-12 py-6 border-3 border-purple-400/60 rounded-3xl font-black text-2xl text-white hover:border-pink-300 transition-all duration-500 overflow-hidden active:scale-95 md:hover:scale-105 backdrop-blur-sm w-full sm:w-auto hover:shadow-[0_0_30px_rgba(219,39,119,0.4)] bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-20 md:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="text-center group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-2 border-purple-400/30 hover:border-purple-300 hover:scale-110 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]">
            <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-purple-300 via-pink-300 to-purple-200 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">0₽</div>
            <div className="text-base md:text-lg text-white font-bold">Бесплатный старт</div>
          </div>
          <div className="text-center group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border-2 border-cyan-400/30 hover:border-cyan-300 hover:scale-110 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
            <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-cyan-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">7 лет</div>
            <div className="text-base md:text-lg text-white font-bold">Срок лицензии</div>
          </div>
          <div className="text-center group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-md border-2 border-pink-400/30 hover:border-pink-300 hover:scale-110 transition-all duration-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]">
            <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-pink-300 via-orange-300 to-pink-200 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">100%</div>
            <div className="text-base md:text-lg text-white font-bold">Твоё авторство</div>
          </div>
          <div className="text-center group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md border-2 border-orange-400/30 hover:border-orange-300 hover:scale-110 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]">
            <div className="text-6xl md:text-8xl font-black bg-gradient-to-br from-orange-300 via-red-300 to-orange-200 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">170+</div>
            <div className="text-base md:text-lg text-white font-bold">Платформ</div>
          </div>
        </div>
      </div>
    </section>
  );
}