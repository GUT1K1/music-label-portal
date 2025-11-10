import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";

interface LandingHeroProps {
  scrollY: number;
  typedText: string;
  isTypingComplete: boolean;
}

export default function LandingHero({ scrollY, typedText, isTypingComplete }: LandingHeroProps) {
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setCursorPos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
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
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12 pt-24 md:pt-32 overflow-hidden">
      <div className="absolute top-20 right-32 w-3 h-3 bg-gold-400/40 rounded-full animate-pulse hidden md:block" />
      <div className="absolute top-40 left-24 w-2 h-2 bg-orange-400/40 rounded-full animate-pulse hidden md:block" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-gold-400/40 rounded-full animate-pulse hidden md:block" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-48 left-1/3 w-3 h-3 bg-orange-400/30 rounded-full animate-pulse hidden md:block" style={{ animationDelay: '1.5s' }} />
      
      <div 
        className="absolute z-0 pointer-events-none transition-all duration-300 ease-out hidden md:block"
        style={{
          left: `${cursorPos.x}%`,
          top: `${cursorPos.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
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
                    <span className="absolute inset-0 blur-xl bg-gradient-to-r from-gold-400/20 via-gold-500/30 to-orange-500/20" />
                    <span className="relative bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                      {word}
                    </span>
                  </span>
                </span>
              );
            })}
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          Выпускай треки на 50+ площадок. Лицензия на 7 лет, 50% роялти тебе, 100% авторских прав остаются твоими.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <a
            href="/app?demo=true"
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-orange-500 rounded-xl font-bold text-base md:text-lg text-black hover:shadow-2xl hover:shadow-gold-500/50 transition-all duration-500 active:scale-95 md:hover:scale-[1.08] flex items-center gap-2 overflow-hidden w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-gold-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
            <span className="relative z-10 drop-shadow-sm">Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
          </a>
          
          <a
            href="#features"
            className="group relative px-6 md:px-8 py-3 md:py-4 border-2 border-gold-400/40 rounded-xl font-semibold text-base md:text-lg text-gray-300 hover:text-white hover:border-gold-400/80 transition-all duration-500 overflow-hidden active:scale-95 md:hover:scale-[1.05] backdrop-blur-sm w-full sm:w-auto justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/20 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-16 md:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto opacity-0 animate-fade-in-up px-4" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 md:group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">0₽</div>
            <div className="text-xs md:text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">Бесплатный старт</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 md:group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">7 лет</div>
            <div className="text-xs md:text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">Срок лицензии</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 md:group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">100%</div>
            <div className="text-xs md:text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">Твоё авторство</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl md:text-5xl font-bold bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 md:group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">50+</div>
            <div className="text-xs md:text-sm text-gray-400 group-hover:text-gold-300 transition-colors duration-300">Платформ</div>
          </div>
        </div>
      </div>
    </section>
  );
}