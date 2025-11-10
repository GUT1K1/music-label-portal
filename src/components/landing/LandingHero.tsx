import Icon from "@/components/ui/icon";

interface LandingHeroProps {
  scrollY: number;
  typedText: string;
  isTypingComplete: boolean;
}

export default function LandingHero({ scrollY, typedText, isTypingComplete }: LandingHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-32">
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-12 inline-block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <div className="px-6 py-3 bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-400/30 rounded-full backdrop-blur-sm">
            <span className="text-gold-300 text-sm font-semibold tracking-wide">ДИСТРИБУЦИЯ МУЗЫКИ</span>
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
          <span className="block text-white mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            МУЗЫКА БЕЗ ГРАНИЦ.
          </span>
          <span 
            className={`block bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent opacity-0 animate-fade-in-up animate-shimmer bg-[length:200%_100%] ${!isTypingComplete ? 'typing-cursor' : ''}`}
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            {typedText}
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          Выпускай треки на Spotify, Apple Music, Яндекс.Музыку и ещё 50+ площадок. Зарабатывай на своём творчестве.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <a
            href="/app"
            className="group relative px-8 py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-xl font-bold text-lg text-black hover:shadow-2xl hover:shadow-gold-400/40 transition-all duration-500 hover:scale-[1.05] flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-gold-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Загрузить трек</span>
            <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
          </a>
          
          <a
            href="#features"
            className="group relative px-8 py-4 border-2 border-gold-400/30 rounded-xl font-semibold text-lg text-gray-300 hover:text-white hover:border-gold-400/60 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/10 to-gold-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10">Узнать больше</span>
          </a>
        </div>
        
        <div className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="text-center group">
            <div className="text-5xl font-bold bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-sm text-gray-400">Платформ</div>
          </div>
          <div className="text-center border-x border-gray-800/50 group">
            <div className="text-5xl font-bold bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">0₽</div>
            <div className="text-sm text-gray-400">За выпуск</div>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-bold bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
            <div className="text-sm text-gray-400">Твои права</div>
          </div>
        </div>
      </div>
    </section>
  );
}