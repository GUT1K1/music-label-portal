import Icon from "@/components/ui/icon";

export default function WhySection() {
  return (
    <section className="py-32 px-6 lg:px-12 relative scroll-animate">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Почему 420?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Честные условия и полная прозрачность работы
          </p>
        </div>

        <div className="grid gap-6">
          <div className="relative group p-10 lg:p-12 bg-gradient-to-br from-gold-500/20 via-orange-500/10 to-gold-600/20 border-2 border-gold-400/40 rounded-3xl hover:border-gold-400/70 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-gold-500 rounded-full text-black text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse-glow">
              Лучшее предложение
            </div>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-gold-500/50">
                <Icon name="Zap" size={32} className="text-black" />
              </div>
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  0₽ за старт + Высокая ставка 50%
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Без платы за выпуск релиза. Ты платишь только процент от заработка — 50% тебе, 50% нам. Выплаты ежеквартально от 1500₽.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 border border-gold-400/30 rounded-3xl hover:border-gold-400/60 transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-500/30 to-gold-600/20 border border-gold-400/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Icon name="Upload" size={28} className="text-gold-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Дистрибуция</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Target" size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">50+ платформ</p>
                    <p className="text-gray-400 text-sm">Spotify, Apple Music, YouTube, Яндекс, VK и другие</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Clock" size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">7 лет лицензии</p>
                    <p className="text-gray-400 text-sm">Долгосрочное размещение твоих треков</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 border border-gold-400/30 rounded-3xl hover:border-gold-400/60 transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-500/30 to-gold-600/20 border border-gold-400/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Icon name="BarChart3" size={28} className="text-gold-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Аналитика & Выплаты</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="LineChart" size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Детальная статистика</p>
                    <p className="text-gray-400 text-sm">Следи за прослушиваниями и доходами в реальном времени</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="FileText" size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Прозрачная отчётность</p>
                    <p className="text-gray-400 text-sm">Полный отчёт по каждой площадке</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Wallet" size={16} className="text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Выплаты ежеквартально</p>
                    <p className="text-gray-400 text-sm">Минимум 1500₽ для вывода средств</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group p-8 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 border border-gold-400/30 rounded-3xl hover:border-gold-400/60 transition-all duration-500 hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-500/30 to-gold-600/20 border border-gold-400/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <Icon name="Heart" size={28} className="text-gold-300" />
              </div>
              <h3 className="text-2xl font-bold text-white">Комфорт & Поддержка</h3>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="User" size={16} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Простой интерфейс</p>
                  <p className="text-gray-400 text-sm">Интуитивная загрузка и управление</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Bell" size={16} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Уведомления</p>
                  <p className="text-gray-400 text-sm">О статусе релиза и выплатах</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Headphones" size={16} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Поддержка 24/7</p>
                  <p className="text-gray-400 text-sm">Всегда на связи для помощи</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
