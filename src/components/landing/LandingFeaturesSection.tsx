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
      description: "Выпускай музыку на всех площадках мира — от Spotify до Яндекс.Музыки. Быстрая модерация, прозрачные условия.",
      highlight: "Без комиссий за релиз",
      progress: 95
    },
    {
      icon: "TrendingUp",
      title: "Промо и питчинг",
      description: "Продвигаем треки в редакционные плейлисты, работаем с кураторами площадок, запускаем таргет.",
      highlight: "Попадание в топ-плейлисты",
      progress: 88
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Детальная статистика по каждому релизу: прослушивания, география, возраст слушателей, доходы.",
      highlight: "Ежедневные обновления",
      progress: 100
    },
    {
      icon: "Wallet",
      title: "Выплаты",
      description: "Получай честные роялти без скрытых комиссий. Вывод от 500₽ на карту или электронный кошелёк.",
      highlight: "Выплаты 2 раза в месяц",
      progress: 92
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Инструменты для твоего успеха
          </h2>
          <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto">
            Полный цикл работы с музыкой: от загрузки трека до получения денег на карту
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