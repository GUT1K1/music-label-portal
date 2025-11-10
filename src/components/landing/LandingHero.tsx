import Icon from "@/components/ui/icon";

interface LandingHeroProps {
  scrollY: number;
  typedText: string;
  isTypingComplete: boolean;
}

export default function LandingHero({ scrollY, typedText, isTypingComplete }: LandingHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.5) 1px, transparent 1px)',
          backgroundSize: '100px 100px' 
        }} 
      />
      
      {/* Golden gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-gold-500/10 via-gold-600/5 to-transparent blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-12 inline-block">
          <div className="px-5 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full backdrop-blur-sm">
            <span className="text-gold-400 text-sm font-semibold tracking-wider">420 MUSIC</span>
          </div>
        </div>
        
        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="block text-white mb-3">
            МУЗЫКА БЕЗ ГРАНИЦ.
          </span>
          <span 
            className={`block bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent ${!isTypingComplete ? 'typing-cursor' : ''}`}
          >
            {typedText}
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Выпускай треки на Spotify, Apple Music, Яндекс.Музыку и ещё 50+ площадок. Зарабатывай на своём творчестве.
        </p>
        
        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/app"
            className="group px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg font-semibold text-lg text-black hover:shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            Загрузить трек
            <Icon name="ArrowRight" className="group-hover:translate-x-1 transition-transform" size={20} />
          </a>
          
          <a
            href="#features"
            className="px-8 py-4 border border-gold-500/30 rounded-lg font-semibold text-lg text-white hover:bg-gold-500/5 hover:border-gold-500/50 transition-all duration-300"
          >
            Узнать больше
          </a>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold-400 mb-2">50+</div>
            <div className="text-sm text-gray-500">Платформ</div>
          </div>
          <div className="text-center border-x border-gray-800">
            <div className="text-4xl font-bold text-gold-400 mb-2">0₽</div>
            <div className="text-sm text-gray-500">За выпуск</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold-400 mb-2">100%</div>
            <div className="text-sm text-gray-500">Твои права</div>
          </div>
        </div>
      </div>
    </section>
  );
}
