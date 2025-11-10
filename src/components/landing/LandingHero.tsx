import Icon from "@/components/ui/icon";

interface LandingHeroProps {
  scrollY: number;
  typedText: string;
  isTypingComplete: boolean;
}

export default function LandingHero({ scrollY, typedText, isTypingComplete }: LandingHeroProps) {
  return (
    <>
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
          style={{ 
            animation: 'float-up 20s ease-in-out infinite',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
          style={{ 
            animation: 'float-up 25s ease-in-out infinite reverse',
            transform: `translate(-${scrollY * 0.08}px, -${scrollY * 0.12}px)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-rotate"
        />
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block animate-slideIn opacity-0" style={{ animation: 'slide-in-up 0.8s 0.2s forwards' }}>
            <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400 font-medium backdrop-blur-sm">
              420
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[1.15] tracking-tight px-4">
            <span className="block opacity-0 animate-slideIn text-white" style={{ animation: 'slide-in-up 0.8s 0.4s forwards', textShadow: '0 0 30px rgba(0,0,0,0.8)' }}>
              ВСЁ, ЧТО НУЖНО АРТИСТУ ДЛЯ
            </span>
            <span 
              className={`block opacity-0 ${!isTypingComplete ? 'typing-cursor' : ''}`} 
              style={{ 
                animation: 'slide-in-up 0.8s 0.8s forwards',
                background: 'linear-gradient(270deg, #f97316, #fb923c, #f59e0b, #fb923c, #f97316)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))',
                animationName: 'slide-in-up, gradient-shift',
                animationDuration: '0.8s, 8s',
                animationDelay: '0.8s, 0s',
                animationIterationCount: '1, infinite',
                animationTimingFunction: 'ease, ease',
                animationFillMode: 'forwards, none'
              }}
            >
              {typedText}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light opacity-0" style={{ animation: 'slide-in-up 0.8s 1.5s forwards' }}>
            Дистрибуция музыки на все площадки мира. Промо в плейлисты. Детальная аналитика. Честные выплаты.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0" style={{ animation: 'slide-in-up 0.8s 1.8s forwards' }}>
            <a
              href="/app"
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 button-ripple relative z-10"
            >
              Выпустить релиз
              <Icon name="ArrowRight" className="inline ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </a>
            
            <a
              href="#features"
              className="px-8 py-4 glassmorphism rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm color-shift"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </section>
    </>
  );
}