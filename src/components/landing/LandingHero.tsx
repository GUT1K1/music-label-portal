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
    
    order.forEach((index, i) => {
      setTimeout(() => {
        setVisibleWords(prev => [...prev, index]);
      }, i * 350);
    });
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-32">
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold mb-10 tracking-tight">
          <span className="block text-white mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
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
          <span className="block flex flex-wrap justify-center gap-x-4 gap-y-2">
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
                  <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                    {word}
                  </span>
                </span>
              );
            })}
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Выпускай треки на Spotify, Apple Music, Яндекс.Музыку и ещё 50+ площадок. Зарабатывай на своём творчестве.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <a
            href="/app"
            className="group relative px-8 py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 rounded-xl font-bold text-lg text-black hover:shadow-2xl hover:shadow-gold-500/50 transition-all duration-500 hover:scale-[1.08] flex items-center gap-2 overflow-hidden animate-pulse-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-gold-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
            <span className="relative z-10 drop-shadow-sm">Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
          </a>
          
          <a
            href="#features"
            className="group relative px-8 py-4 border-2 border-gold-400/40 rounded-xl font-semibold text-lg text-gray-300 hover:text-white hover:border-gold-400/80 transition-all duration-500 overflow-hidden hover:scale-[1.05] backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/20 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]">50+</div>
            <div className="text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">Платформ</div>
          </div>
          <div className="text-center border-x border-gold-500/20 group cursor-pointer">
            <div className="text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]">0₽</div>
            <div className="text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">За выпуск</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-3 group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]">100%</div>
            <div className="text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">Твои права</div>
          </div>
        </div>
      </div>
    </section>
  );
}