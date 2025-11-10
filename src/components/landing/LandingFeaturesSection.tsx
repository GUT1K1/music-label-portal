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
    <section id="features" className="py-20 px-6 lg:px-12 relative scroll-animate overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-gold-500/40 to-transparent animate-draw-line" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-t from-transparent via-gold-500/40 to-transparent animate-draw-line" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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
              className="relative group p-10 bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 border border-gold-400/20 rounded-3xl hover:border-gold-400/50 hover:bg-gradient-to-br hover:from-gray-900/60 hover:via-gray-900/50 hover:to-black/60 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/20 overflow-hidden cursor-pointer holographic-effect"
              style={{
                transform: 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) scale(1)',
                transition: 'transform 0.3s ease-out, box-shadow 0.5s ease'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-400/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-gold-500/30 group-hover:to-gold-600/20 group-hover:rotate-12 transition-all duration-500 z-10">
                <div className="absolute inset-0 bg-gold-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icon name={feature.icon as any} size={32} className="text-gold-300 group-hover:text-gold-200 transition-colors" />
              </div>
              
              <h3 className="relative text-2xl font-bold mb-4 text-white group-hover:text-gold-200 transition-colors duration-300 z-10">
                {feature.title}
              </h3>
              <p className="relative text-gray-400 leading-relaxed text-base group-hover:text-gray-300 transition-colors duration-300 z-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}