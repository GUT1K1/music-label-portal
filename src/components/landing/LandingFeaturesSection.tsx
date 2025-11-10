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
      description: "Загружай треки и альбомы — мы разместим их на 50+ платформах. Spotify, Apple Music, Яндекс.Музыка, VK. Лицензия на 7 лет.",
    },
    {
      icon: "Shield",
      title: "Твои права",
      description: "100% авторских прав остаются за тобой. Мы берём лицензию на 7 лет только для дистрибуции и сбора роялти. Контент — твой.",
    },
    {
      icon: "Percent",
      title: "Честный сплит",
      description: "50% роялти получаешь ты, 50% — сервис. Без скрытых комиссий. Выплаты ежеквартально при балансе от 1500₽.",
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Следи за успехом релизов в реальном времени. Прослушивания, география, доходы по каждой площадке — всё прозрачно.",
    },
  ];

  return (
    <section id="features" className="py-32 px-6 lg:px-12 relative scroll-animate">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Как это работает?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Простой путь от загрузки трека до первых денег
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-10 bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 border border-gold-400/20 rounded-3xl hover:border-gold-400/50 hover:bg-gradient-to-br hover:from-gray-900/60 hover:via-gray-900/50 hover:to-black/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-400/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-gold-500/30 group-hover:to-gold-600/20 transition-all duration-500">
                <Icon name={feature.icon as any} size={32} className="text-gold-300 group-hover:text-gold-200 transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold-200 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}