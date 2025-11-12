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
      gradient: "from-purple-600/90 via-purple-500/90 to-pink-600/90",
      iconBg: "from-purple-500 to-pink-500",
      borderGlow: "rgba(168, 85, 247, 0.6)",
      shadow: "0 30px 60px -15px rgba(168, 85, 247, 0.5)"
    },
    {
      icon: "Shield",
      title: "Твои права",
      description: "100% авторских прав остаются за тобой. Мы берём лицензию на 7 лет только для дистрибуции и сбора роялти. Контент — твой.",
      gradient: "from-cyan-600/90 via-cyan-500/90 to-blue-600/90",
      iconBg: "from-cyan-500 to-blue-500",
      borderGlow: "rgba(6, 182, 212, 0.6)",
      shadow: "0 30px 60px -15px rgba(6, 182, 212, 0.5)"
    },
    {
      icon: "Percent",
      title: "Честный сплит",
      description: "50% роялти получаешь ты, 50% — сервис. Без скрытых комиссий. Выплаты ежеквартально при балансе от 1500₽.",
      gradient: "from-orange-600/90 via-orange-500/90 to-red-600/90",
      iconBg: "from-orange-500 to-red-500",
      borderGlow: "rgba(249, 115, 22, 0.6)",
      shadow: "0 30px 60px -15px rgba(249, 115, 22, 0.5)"
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Следи за успехом релизов в реальном времени. Прослушивания, география, доходы по каждой площадке — всё прозрачно.",
      gradient: "from-emerald-600/90 via-emerald-500/90 to-teal-600/90",
      iconBg: "from-emerald-500 to-teal-500",
      borderGlow: "rgba(16, 185, 129, 0.6)",
      shadow: "0 30px 60px -15px rgba(16, 185, 129, 0.5)"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative group cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: 'perspective(1500px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* 3D карточка с градиентом */}
              <div 
                className="relative p-10 rounded-[32px] transition-all duration-500 group-hover:-translate-y-4 overflow-hidden min-h-[420px] flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${feature.gradient})`,
                  boxShadow: `${feature.shadow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {/* Эффект стекла сверху */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Большое свечение справа сверху */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                
                {/* Цветные пятна */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
                
                {/* Декоративные круги */}
                <div className="absolute top-10 right-10 w-40 h-40 border-2 border-white/10 rounded-full group-hover:scale-125 group-hover:rotate-90 transition-all duration-1000" />
                <div className="absolute bottom-10 left-10 w-32 h-32 border-2 border-white/5 rounded-full group-hover:scale-125 group-hover:-rotate-90 transition-all duration-1000" />
                <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-white/5 rounded-full group-hover:scale-150 transition-all duration-1000" />
                
                {/* Квадраты */}
                <div className="absolute top-16 left-16 w-16 h-16 border border-white/10 rounded-xl rotate-45 group-hover:rotate-[225deg] transition-all duration-1000" />
                <div className="absolute bottom-16 right-16 w-20 h-20 border border-white/5 rounded-2xl -rotate-12 group-hover:rotate-[60deg] transition-all duration-1000" />
                
                {/* Светящиеся точки */}
                <div className="absolute top-20 right-20 w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-32 right-32 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-200/50 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-pink-200/40 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
                <div className="absolute top-1/2 right-1/2 w-1 h-1 bg-cyan-200/40 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
                
                {/* Линии */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <div className="absolute top-1/4 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                {/* Свечение сзади */}
                <div className="absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{ background: `linear-gradient(135deg, ${feature.gradient})` }} />
                
                {/* Иконка */}
                <div className="relative mb-8 w-fit">
                  <div 
                    className={`w-20 h-20 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative z-10`}
                    style={{
                      boxShadow: `0 10px 40px -10px ${feature.borderGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`
                    }}
                  >
                    <Icon name={feature.icon as any} size={36} className="text-white" />
                  </div>
                  {/* Свечение под иконкой */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} rounded-2xl blur-xl opacity-60 animate-pulse`} />
                </div>
                
                {/* Контент */}
                <div className="relative z-10">
                  <h3 className="text-3xl font-black text-white mb-4 drop-shadow-lg">
                    {feature.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed text-lg font-medium">
                    {feature.description}
                  </p>
                </div>
                
                {/* Нижняя подсветка */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 group-hover:h-2 transition-all duration-300" />
              </div>
              
              {/* Тень под карточкой */}
              <div 
                className="absolute inset-0 rounded-[32px] -z-20 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${feature.gradient})` }} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}