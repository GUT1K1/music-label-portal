import Icon from "@/components/ui/icon";

export default function WhySection() {
  const hero = {
    title: "0₽ за старт",
    subtitle: "Высокая ставка 50%",
    description: "Отгружай бесплатно и получай честные 50% роялти — одно из лучших предложений на рынке"
  };

  const distribution = [
    {
      icon: "Upload",
      title: "Самостоятельная отгрузка",
      description: "Загружай релизы когда удобно, без ожидания"
    },
    {
      icon: "Target",
      title: "Питчинг релизов",
      description: "Попади в редакторские плейлисты площадок"
    }
  ];

  const analytics = [
    {
      icon: "BarChart3",
      title: "Полный контроль аналитики",
      description: "Детальные отчёты по каждой платформе"
    },
    {
      icon: "FileText",
      title: "Детализация отчётов",
      description: "Прозрачные данные по прослушиваниям"
    },
    {
      icon: "Wallet",
      title: "Прозрачные выплаты",
      description: "Выплаты ежеквартально от 1500₽"
    }
  ];

  const comfort = [
    {
      icon: "User",
      title: "Личный кабинет",
      description: "Удобный интерфейс для управления"
    },
    {
      icon: "Bell",
      title: "Уведомления в Telegram",
      description: "Важные обновления мгновенно"
    },
    {
      icon: "Headphones",
      title: "Техподдержка 5/2",
      description: "Помощь с 12:00 до 17:00 по будням"
    }
  ];

  return (
    <section className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Почему 420?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Всё, что нужно для успешной дистрибуции музыки
          </p>
        </div>

        <div className="space-y-8 mb-8">
          <div className="relative group p-12 bg-gradient-to-br from-gold-500/20 via-orange-500/15 to-gold-600/20 border-2 border-gold-400/50 rounded-3xl overflow-hidden hover:border-gold-400/80 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/30">
            <div className="absolute top-6 right-6">
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-300 via-gold-400 to-orange-500 rounded-full text-xs font-black text-black uppercase tracking-wider shadow-lg animate-pulse-glow">
                ЛУЧШЕЕ ПРЕДЛОЖЕНИЕ
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 group-hover:scale-110 transition-transform duration-500">
                  <Icon name="Zap" size={48} className="text-black" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-r from-yellow-200 via-gold-300 to-orange-400 bg-clip-text text-transparent">
                  {hero.title}
                </div>
                <div className="text-2xl font-bold text-gold-200 mb-3">
                  {hero.subtitle}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                  {hero.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 border border-gold-400/30 rounded-2xl hover:border-gold-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500/30 to-orange-500/20 border border-gold-400/40 rounded-xl flex items-center justify-center">
                  <Icon name="Rocket" size={24} className="text-gold-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Дистрибуция</h3>
              </div>
              <div className="space-y-4">
                {distribution.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gold-500/10 border border-gold-400/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 group-hover:border-gold-400/40 transition-all duration-300">
                      <Icon name={item.icon as any} size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-gold-200 transition-colors">{item.title}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 border border-gold-400/30 rounded-2xl hover:border-gold-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500/30 to-orange-500/20 border border-gold-400/40 rounded-xl flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-gold-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Аналитика & Выплаты</h3>
              </div>
              <div className="space-y-4">
                {analytics.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-gold-500/10 border border-gold-400/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 group-hover:border-gold-400/40 transition-all duration-300">
                      <Icon name={item.icon as any} size={18} className="text-gold-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-gold-200 transition-colors">{item.title}</div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 border border-gold-400/30 rounded-2xl hover:border-gold-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500/30 to-orange-500/20 border border-gold-400/40 rounded-xl flex items-center justify-center">
                <Icon name="Heart" size={24} className="text-gold-300" />
              </div>
              <h3 className="text-2xl font-bold text-white">Комфорт & Поддержка</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {comfort.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group cursor-pointer">
                  <div className="w-10 h-10 bg-gold-500/10 border border-gold-400/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 group-hover:border-gold-400/40 transition-all duration-300">
                    <Icon name={item.icon as any} size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-gold-200 transition-colors">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
