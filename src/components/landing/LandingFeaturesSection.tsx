import Icon from "@/components/ui/icon";

interface LandingFeaturesSectionProps {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingFeaturesSection({ 
  handleMouseMove, 
  handleMouseLeave 
}: LandingFeaturesSectionProps) {
  const features = [
    {
      icon: "Upload",
      title: "Дистрибуция",
      description: "Загружай треки и альбомы — мы разместим их на всех крупнейших платформах. Spotify, Apple Music, Яндекс.Музыка, VK и ещё 50+ сервисов.",
      highlight: "Выход за 3-5 дней",
      progress: 100
    },
    {
      icon: "Shield",
      title: "Защита прав",
      description: "Все авторские права остаются у тебя. Мы только распространяем твою музыку и собираем роялти. Ты полностью владеешь своим контентом.",
      highlight: "100% твои права",
      progress: 100
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Следи за успехом своих релизов в реальном времени. Просматривай прослушивания, географию, доходы по каждой площадке.",
      highlight: "Подробная статистика",
      progress: 95
    },
    {
      icon: "Wallet",
      title: "Выплаты",
      description: "Получай честные роялти без скрытых комиссий. Вывод денег на карту или электронный кошелёк. Минимальная сумма — всего 500₽.",
      highlight: "Выплаты 2 раза в месяц",
      progress: 90
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Как это работает?
          </h2>
          <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto">
            Простой путь от загрузки трека до первых денег
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="scroll-animate group p-8 neomorphism glassmorphism rounded-3xl glow-border transition-all duration-500 card-3d wave-enter color-shift"
              style={{ 
                transitionDelay: `${i * 100}ms`,
                animationDelay: `${i * 150}ms`
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-all duration-500 backdrop-blur-sm icon-morph shadow-lg shadow-orange-500/20">
                <Icon name={feature.icon as any} size={28} className="text-orange-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4 font-light">
                {feature.description}
              </p>
              
              <div className="mb-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-600 progress-bar"
                    style={{ '--progress-width': `${feature.progress}%` } as React.CSSProperties}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Эффективность: {feature.progress}%</p>
              </div>
              
              <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-400 font-medium group-hover:bg-orange-500/20 transition-all duration-300">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}