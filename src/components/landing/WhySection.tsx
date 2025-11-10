import Icon from "@/components/ui/icon";

export default function WhySection() {
  const features = [
    {
      icon: "Zap",
      title: "0₽ за старт",
      description: "Отгружай бесплатно, плати только когда зарабатываешь",
      accent: true
    },
    {
      icon: "TrendingUp",
      title: "Высокая ставка",
      description: "50% роялти — одно из лучших предложений на рынке",
      accent: true
    },
    {
      icon: "Upload",
      title: "Самостоятельная отгрузка",
      description: "Загружай релизы когда удобно, без ожидания менеджера",
    },
    {
      icon: "Target",
      title: "Питчинг релизов",
      description: "Отправь трек на питчинг и попади в редакторские плейлисты",
    },
    {
      icon: "BarChart3",
      title: "Полный контроль аналитики",
      description: "Детальные отчёты по каждой платформе в реальном времени",
    },
    {
      icon: "FileText",
      title: "Детализация отчётов",
      description: "Прозрачные данные по прослушиваниям и доходам",
    },
    {
      icon: "Wallet",
      title: "Прозрачные выплаты",
      description: "Видишь каждую копейку, выплаты ежеквартально от 1500₽",
    },
    {
      icon: "User",
      title: "Личный кабинет",
      description: "Удобный интерфейс для управления релизами и финансами",
    },
    {
      icon: "Bell",
      title: "Уведомления в Telegram",
      description: "Привяжи аккаунт и получай важные обновления мгновенно",
    },
    {
      icon: "Headphones",
      title: "Техподдержка 5/2",
      description: "Помощь специалистов с 12:00 до 17:00 по будням",
    },
  ];

  return (
    <section className="py-32 px-6 lg:px-12 relative scroll-animate">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Почему 420?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Мы создали сервис, который даёт артистам всё необходимое
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-2xl transition-all duration-500 hover:scale-[1.03] ${
                feature.accent
                  ? 'bg-gradient-to-br from-gold-500/20 via-orange-500/10 to-gold-600/20 border-2 border-gold-400/40 hover:border-gold-400/70 hover:shadow-2xl hover:shadow-gold-500/20'
                  : 'bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-black/40 border border-gold-400/20 hover:border-gold-400/40 hover:shadow-xl hover:shadow-gold-500/10'
              }`}
            >
              {feature.accent && (
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-[10px] font-bold text-black uppercase tracking-wider">
                    ТОП
                  </div>
                </div>
              )}
              
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${
                feature.accent
                  ? 'bg-gradient-to-br from-gold-400/30 to-orange-500/20 border border-gold-400/50 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-gold-400/40 group-hover:to-orange-500/30'
                  : 'bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-400/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-gold-500/30 group-hover:to-gold-600/20'
              }`}>
                <Icon 
                  name={feature.icon as any} 
                  size={28} 
                  className={`transition-colors ${
                    feature.accent
                      ? 'text-gold-200 group-hover:text-gold-100'
                      : 'text-gold-300 group-hover:text-gold-200'
                  }`}
                />
              </div>
              
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                feature.accent
                  ? 'text-white group-hover:text-gold-100'
                  : 'text-white group-hover:text-gold-200'
              }`}>
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
