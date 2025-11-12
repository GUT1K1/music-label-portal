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
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
      iconBg: "from-purple-500 to-pink-500",
      borderGlow: "rgba(168, 85, 247, 0.6)",
      shadow: "0 0 80px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.4)",
      particles: ["bg-purple-300", "bg-fuchsia-300", "bg-pink-300"],
      colorFrom: "purple-400",
      colorTo: "pink-400"
    },
    {
      icon: "Shield",
      title: "Твои права",
      description: "100% авторских прав остаются за тобой. Мы берём лицензию на 7 лет только для дистрибуции и сбора роялти. Контент — твой.",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      iconBg: "from-cyan-500 to-blue-500",
      borderGlow: "rgba(6, 182, 212, 0.6)",
      shadow: "0 0 80px rgba(6, 182, 212, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)",
      particles: ["bg-cyan-300", "bg-blue-300", "bg-indigo-300"],
      colorFrom: "cyan-400",
      colorTo: "indigo-400"
    },
    {
      icon: "Percent",
      title: "Честный сплит",
      description: "50% роялти получаешь ты, 50% — сервис. Без скрытых комиссий. Выплаты ежеквартально при балансе от 1500₽.",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      iconBg: "from-orange-500 to-red-500",
      borderGlow: "rgba(249, 115, 22, 0.6)",
      shadow: "0 0 80px rgba(249, 115, 22, 0.7), 0 0 40px rgba(239, 68, 68, 0.5)",
      particles: ["bg-orange-300", "bg-red-300", "bg-pink-300"],
      colorFrom: "orange-400",
      colorTo: "pink-400"
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Следи за успехом релизов в реальном времени. Прослушивания, география, доходы по каждой площадке — всё прозрачно.",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      iconBg: "from-emerald-500 to-teal-500",
      borderGlow: "rgba(16, 185, 129, 0.6)",
      shadow: "0 0 80px rgba(16, 185, 129, 0.6), 0 0 40px rgba(20, 184, 166, 0.4),"
      particles: ["bg-emerald-300", "bg-green-300", "bg-teal-300"],
      colorFrom: "emerald-400",
      colorTo: "teal-400"
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
                  boxShadow: `${feature.shadow}`,
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'transparent'
                }}
              >
                
                {/* ВАРИАНТ 1: Космическая туманность */}
                {i === 0 && (
                  <>
                    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[100px] animate-pulse opacity-80" style={{ animationDuration: '6s' }} />
                    <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-pink-500 rounded-full blur-[100px] animate-pulse opacity-70" style={{ animationDuration: '7s', animationDelay: '1s' }} />
                    <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-fuchsia-400 rounded-full blur-[80px] animate-pulse opacity-60" style={{ animationDuration: '5s', animationDelay: '2s' }} />
                    
                    {/* Плавающие звезды */}
                    {[...Array(12)].map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute bg-white/70 rounded-full animate-float"
                        style={{
                          width: `${2 + (idx % 4)}px`,
                          height: `${2 + (idx % 4)}px`,
                          left: `${10 + idx * 8}%`,
                          top: `${15 + (idx * 7) % 70}%`,
                          animationDelay: `${idx * 0.5}s`,
                          animationDuration: `${3 + (idx % 3)}s`,
                          boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                        }}
                      />
                    ))}
                    
                    {/* Вращающиеся кольца */}
                    <div className="absolute top-1/4 right-1/4 w-60 h-60 border-[3px] border-purple-300/30 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                    <div className="absolute top-1/4 right-1/4 w-48 h-48 border-[2px] border-pink-300/25 rounded-full animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                    <div className="absolute bottom-1/3 left-1/3 w-52 h-52 border-[2px] border-fuchsia-300/30 rounded-full animate-spin-slow" style={{ animationDuration: '18s' }} />
                    
                    {/* Светящиеся орбиты */}
                    <div className="absolute top-20 left-20 w-4 h-4 bg-purple-300/80 rounded-full animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
                    <div className="absolute bottom-24 right-24 w-3 h-3 bg-pink-300/80 rounded-full animate-pulse shadow-[0_0_15px_rgba(236,72,153,0.8)]" style={{ animationDelay: '0.8s' }} />
                    <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-fuchsia-300/80 rounded-full animate-pulse shadow-[0_0_25px_rgba(217,70,239,0.8)]" style={{ animationDelay: '1.5s' }} />
                  </>
                )}

                {/* ВАРИАНТ 2: Океанские волны */}
                {i === 1 && (
                  <>
                    <div className="absolute -top-32 -right-32 w-[600px] h-[400px] bg-cyan-500 rounded-[50%] blur-[120px] animate-pulse opacity-75" style={{ animationDuration: '8s' }} />
                    <div className="absolute -bottom-32 -left-32 w-[550px] h-[400px] bg-indigo-500 rounded-[50%] blur-[100px] animate-pulse opacity-70" style={{ animationDuration: '9s', animationDelay: '2s' }} />
                    <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-blue-400 rounded-full blur-[90px] animate-pulse opacity-60" style={{ animationDuration: '7s', animationDelay: '1s' }} />
                    
                    {/* Волновые линии */}
                    <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-300/50 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                    <div className="absolute top-3/4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
                    
                    {/* Плавающие пузырьки */}
                    {[...Array(15)].map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute rounded-full border-2 animate-float"
                        style={{
                          width: `${8 + (idx % 5) * 3}px`,
                          height: `${8 + (idx % 5) * 3}px`,
                          borderColor: idx % 3 === 0 ? 'rgba(6,182,212,0.4)' : idx % 3 === 1 ? 'rgba(59,130,246,0.4)' : 'rgba(99,102,241,0.4)',
                          left: `${5 + idx * 6.5}%`,
                          top: `${10 + (idx * 6) % 80}%`,
                          animationDelay: `${idx * 0.4}s`,
                          animationDuration: `${4 + (idx % 4)}s`,
                          background: idx % 2 === 0 ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)' : 'transparent'
                        }}
                      />
                    ))}
                    
                    {/* Шестиугольники */}
                    <div className="absolute top-16 right-16 w-16 h-16 border-2 border-cyan-300/40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'spin 25s linear infinite' }} />
                    <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-blue-300/35" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', animation: 'spin 30s linear infinite reverse' }} />
                  </>
                )}

                {/* ВАРИАНТ 3: Огненный закат */}
                {i === 2 && (
                  <>
                    <div className="absolute -top-48 -right-48 w-[550px] h-[550px] bg-orange-500 rounded-full blur-[110px] animate-pulse opacity-85" style={{ animationDuration: '5s' }} />
                    <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-red-500 rounded-full blur-[110px] animate-pulse opacity-75" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-500 rounded-full blur-[100px] animate-pulse opacity-65" style={{ animationDuration: '7s', animationDelay: '3s' }} />
                    <div className="absolute top-1/4 right-1/3 w-[280px] h-[280px] bg-yellow-400 rounded-full blur-[80px] animate-pulse opacity-60" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
                    
                    {/* Искры и частицы */}
                    {[...Array(20)].map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute animate-float"
                        style={{
                          width: idx % 4 === 0 ? '6px' : idx % 4 === 1 ? '4px' : '3px',
                          height: idx % 4 === 0 ? '6px' : idx % 4 === 1 ? '4px' : '3px',
                          background: idx % 3 === 0 ? 'linear-gradient(135deg, #fb923c, #ef4444)' : idx % 3 === 1 ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'linear-gradient(135deg, #fbbf24, #f43f5e)',
                          borderRadius: idx % 2 === 0 ? '50%' : '30%',
                          left: `${8 + idx * 4.7}%`,
                          top: `${12 + (idx * 4.3) % 76}%`,
                          animationDelay: `${idx * 0.3}s`,
                          animationDuration: `${2.5 + (idx % 3) * 0.5}s`,
                          boxShadow: '0 0 15px rgba(251,146,60,0.8)',
                          opacity: 0.7
                        }}
                      />
                    ))}
                    
                    {/* Диагональные полосы */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-orange-300/50 to-transparent rotate-45 origin-top-left animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-1/4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-300/40 to-transparent rotate-45 origin-top-left animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                    <div className="absolute bottom-0 right-0 w-full h-[3px] bg-gradient-to-r from-transparent via-pink-300/50 to-transparent -rotate-45 origin-bottom-right animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
                    
                    {/* Треугольники */}
                    <div className="absolute top-20 left-24 w-12 h-12 border-2 border-orange-300/50 rotate-0 group-hover:rotate-180 transition-all duration-1000" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    <div className="absolute bottom-24 right-28 w-14 h-14 border-2 border-red-300/45 rotate-180 group-hover:rotate-0 transition-all duration-1000" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    <div className="absolute top-1/2 right-20 w-10 h-10 border-2 border-pink-300/40 rotate-90 group-hover:rotate-[270deg] transition-all duration-1000" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  </>
                )}

                {/* ВАРИАНТ 4: Изумрудный лес */}
                {i === 3 && (
                  <>
                    <div className="absolute -top-36 -right-36 w-[520px] h-[520px] bg-emerald-500 rounded-full blur-[110px] animate-pulse opacity-75" style={{ animationDuration: '7s' }} />
                    <div className="absolute -bottom-36 -left-36 w-[480px] h-[480px] bg-teal-500 rounded-full blur-[100px] animate-pulse opacity-70" style={{ animationDuration: '8s', animationDelay: '2s' }} />
                    <div className="absolute top-1/3 left-1/2 w-[360px] h-[360px] bg-green-400 rounded-full blur-[90px] animate-pulse opacity-60" style={{ animationDuration: '6s', animationDelay: '1s' }} />
                    
                    {/* Листья и лепестки */}
                    {[...Array(18)].map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute animate-float"
                        style={{
                          width: `${6 + (idx % 4) * 2}px`,
                          height: `${12 + (idx % 4) * 3}px`,
                          background: idx % 3 === 0 ? 'linear-gradient(135deg, #10b981, #14b8a6)' : idx % 3 === 1 ? 'linear-gradient(135deg, #22c55e, #0d9488)' : 'linear-gradient(135deg, #34d399, #2dd4bf)',
                          borderRadius: '50% 50% 50% 0',
                          left: `${6 + idx * 5.5}%`,
                          top: `${8 + (idx * 5.1) % 84}%`,
                          animationDelay: `${idx * 0.35}s`,
                          animationDuration: `${3.5 + (idx % 3) * 0.6}s`,
                          transform: `rotate(${idx * 20}deg)`,
                          opacity: 0.6
                        }}
                      />
                    ))}
                    
                    {/* Органические круги */}
                    <div className="absolute top-1/4 right-1/4 w-56 h-56 border-[3px] border-emerald-300/35 rounded-full animate-spin-slow" style={{ animationDuration: '22s' }} />
                    <div className="absolute top-1/4 right-1/4 w-40 h-40 border-[2px] border-green-300/30 rounded-full animate-spin-slow" style={{ animationDuration: '17s', animationDirection: 'reverse' }} />
                    <div className="absolute bottom-1/3 left-1/4 w-48 h-48 border-[2px] border-teal-300/30 rounded-full animate-spin-slow" style={{ animationDuration: '19s' }} />
                    
                    {/* Светящиеся точки роста */}
                    <div className="absolute top-16 left-16 w-3 h-3 bg-emerald-300/90 rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.9)]" style={{ animationDuration: '2s' }} />
                    <div className="absolute bottom-20 right-20 w-4 h-4 bg-green-300/90 rounded-full animate-pulse shadow-[0_0_25px_rgba(34,197,94,0.9)]" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                    <div className="absolute top-1/2 left-1/3 w-3.5 h-3.5 bg-teal-300/90 rounded-full animate-pulse shadow-[0_0_22px_rgba(20,184,166,0.9)]" style={{ animationDuration: '2.2s', animationDelay: '1s' }} />
                    <div className="absolute top-2/3 right-1/3 w-2.5 h-2.5 bg-emerald-400/80 rounded-full animate-pulse shadow-[0_0_18px_rgba(52,211,153,0.8)]" style={{ animationDuration: '1.8s', animationDelay: '1.5s' }} />
                  </>
                )}
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