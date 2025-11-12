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
      description: "Загружай треки и альбомы — мы разместим их на 170+ платформах. Spotify, Apple Music, Яндекс.Музыка, VK. Лицензия на 7 лет.",
      color: "from-purple-400 to-pink-400",
      shadowColor: "rgba(168, 85, 247, 0.8)",
      glowColor: "purple-500"
    },
    {
      icon: "Shield",
      title: "Твои права",
      description: "100% авторских прав остаются за тобой. Мы берём лицензию на 7 лет только для дистрибуции и сбора роялти. Контент — твой.",
      color: "from-cyan-400 to-blue-400",
      shadowColor: "rgba(6, 182, 212, 0.8)",
      glowColor: "cyan-500"
    },
    {
      icon: "Percent",
      title: "Честный сплит",
      description: "50% роялти получаешь ты, 50% — сервис. Без скрытых комиссий. Выплаты ежеквартально при балансе от 1500₽.",
      color: "from-orange-400 to-red-400",
      shadowColor: "rgba(249, 115, 22, 0.8)",
      glowColor: "orange-500"
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Следи за успехом релизов в реальном времени. Прослушивания, география, доходы по каждой площадке — всё прозрачно.",
      color: "from-emerald-400 to-teal-400",
      shadowColor: "rgba(16, 185, 129, 0.8)",
      glowColor: "emerald-500"
    },
  ];

  return (
    <section id="features" className="py-16 md:py-32 px-4 md:px-6 lg:px-12 relative scroll-animate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-16 md:h-24 bg-gold-500/20 rounded-full blur-2xl md:blur-3xl" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 relative px-4">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              Как это работает?
            </span>
          </h2>
          <div className="h-1 w-20 md:w-32 mx-auto bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-4 md:mb-6 rounded-full" />
          <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto px-4">
            Простой путь от загрузки трека до первых денег
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative group p-8 md:p-12 bg-black/60 backdrop-blur-sm border-2 border-white/10 rounded-3xl transition-all duration-700 overflow-hidden cursor-pointer md:hover:-translate-y-3 hover:border-white/30"
              style={{
                transform: 'perspective(1500px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: `0 25px 50px -12px ${feature.shadowColor}, 0 0 0 1px ${feature.shadowColor}`
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-20 transition-opacity duration-700`} />
              
              <div className={`absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br ${feature.color} opacity-40 rounded-full blur-3xl group-hover:scale-150 group-hover:opacity-70 transition-all duration-1000`} />
              
              <div className="absolute top-8 right-8 w-32 h-32 border-2 border-white/10 rounded-full group-hover:scale-150 group-hover:rotate-180 transition-all duration-1000" />
              <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-white/5 rounded-full group-hover:scale-150 group-hover:-rotate-180 transition-all duration-1000" />
              
              <div className="relative mb-8">
                <div className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl`}
                  style={{
                    boxShadow: `0 15px 60px -5px ${feature.shadowColor}, 0 0 30px ${feature.shadowColor}`
                  }}
                >
                  <Icon name={feature.icon as any} size={40} className="text-white relative z-10 drop-shadow-lg" />
                </div>
                <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${feature.color} rounded-3xl blur-3xl opacity-80 animate-pulse`} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <h3 className={`text-4xl font-black bg-gradient-to-br ${feature.color} bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300 drop-shadow-lg`}>
                    {feature.title}
                  </h3>
                  <div className={`h-1 flex-1 bg-gradient-to-r ${feature.color} opacity-30 group-hover:opacity-60 rounded-full transition-opacity duration-300`} />
                </div>
                <p className="text-gray-300 leading-relaxed text-xl group-hover:text-white transition-colors duration-300 font-medium">
                  {feature.description}
                </p>
              </div>
              
              <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_currentColor]`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}