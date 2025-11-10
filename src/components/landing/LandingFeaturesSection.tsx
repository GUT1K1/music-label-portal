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
    },
    {
      icon: "Shield",
      title: "Защита прав",
      description: "Все авторские права остаются у тебя. Мы только распространяем твою музыку и собираем роялти. Ты полностью владеешь своим контентом.",
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Следи за успехом своих релизов в реальном времени. Просматривай прослушивания, географию, доходы по каждой площадке.",
    },
    {
      icon: "Wallet",
      title: "Выплаты",
      description: "Получай честные роялти без скрытых комиссий. Вывод денег на карту или электронный кошелёк. Минимальная сумма — всего 500₽.",
    },
  ];

  return (
    <section id="features" className="py-32 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              Как это работает?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Простой путь от загрузки трека до первых денег
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-8 bg-gradient-to-b from-gray-900/50 to-black/50 border border-gold-500/10 rounded-2xl hover:border-gold-500/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all">
                <Icon name={feature.icon as any} size={28} className="text-gold-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
