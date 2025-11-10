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
        <div className="mb-12 inline-block animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <div className="px-5 py-2.5 bg-gradient-to-r from-gold-500/5 to-gold-600/5 border border-gold-400/20 rounded-full backdrop-blur-sm">
            <span className="text-gold-300 text-sm font-medium tracking-wide">ДИСТРИБУЦИЯ МУЗЫКИ</span>
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="block text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            МУЗЫКА БЕЗ ГРАНИЦ.
          </span>
          <span 
            className={`block bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200 bg-clip-text text-transparent animate-fade-in-up ${!isTypingComplete ? 'typing-cursor' : ''}`}
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            {typedText}
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          Выпускай треки на Spotify, Apple Music, Яндекс.Музыку и ещё 50+ площадок. Зарабатывай на своём творчестве.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <a
            href="/app"
            className="group px-8 py-4 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-xl font-semibold text-lg text-black hover:shadow-xl hover:shadow-gold-400/30 transition-all duration-500 hover:scale-[1.02] flex items-center gap-2"
          >
            Загрузить трек
            <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform" size={20} />
          </a>
          
          <a
            href="#features"
            className="px-8 py-4 border border-gold-400/20 rounded-xl font-semibold text-lg text-gray-300 hover:text-white hover:bg-gold-500/5 hover:border-gold-400/40 transition-all duration-500"
          >
            Узнать больше
          </a>
        </div>
        
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-br from-gold-300 to-gold-500 bg-clip-text text-transparent mb-2">50+</div>
            <div className="text-sm text-gray-500">Платформ</div>
          </div>
          <div className="text-center border-x border-gray-800/50">
            <div className="text-4xl font-bold bg-gradient-to-br from-gold-300 to-gold-500 bg-clip-text text-transparent mb-2">0₽</div>
            <div className="text-sm text-gray-500">За выпуск</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-br from-gold-300 to-gold-500 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-sm text-gray-500">Твои права</div>
          </div>
        </div>
      </div>
    </section>
  );
}