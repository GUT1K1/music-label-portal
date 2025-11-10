import Icon from "@/components/ui/icon";
import BlogCarousel from "./BlogCarousel";

export default function LandingContent() {
  const stats = [
    { value: "90%", label: "Музыкантов достигают топ-100 в первый месяц" },
    { value: "24ч", label: "Средняя скорость модерации релизов" },
    { value: "50+", label: "Платформ для распространения музыки" },
  ];

  const features = [
    {
      icon: "Upload",
      title: "Дистрибуция",
      description: "Выпускай музыку на всех площадках мира — от Spotify до Яндекс.Музыки. Быстрая модерация, прозрачные условия.",
      highlight: "Без комиссий за релиз"
    },
    {
      icon: "TrendingUp",
      title: "Промо и питчинг",
      description: "Продвигаем треки в редакционные плейлисты, работаем с кураторами площадок, запускаем таргет.",
      highlight: "Попадание в топ-плейлисты"
    },
    {
      icon: "BarChart3",
      title: "Аналитика",
      description: "Детальная статистика по каждому релизу: прослушивания, география, возраст слушателей, доходы.",
      highlight: "Ежедневные обновления"
    },
    {
      icon: "Wallet",
      title: "Выплаты",
      description: "Получай честные роялти без скрытых комиссий. Вывод от 500₽ на карту или электронный кошелёк.",
      highlight: "Выплаты 2 раза в месяц"
    },
  ];

  const platforms = [
    { name: "Яндекс Музыка", icon: "Music" },
    { name: "VK Музыка", icon: "Music2" },
    { name: "Spotify", icon: "Music3" },
    { name: "Apple Music", icon: "Music4" },
    { name: "YouTube Music", icon: "Youtube" },
    { name: "Deezer", icon: "Disc3" },
  ];

  const faqs = [
    {
      q: "Сколько стоит выпуск релиза?",
      a: "Мы не берём плату за выпуск релизов. Зарабатываем только небольшой процент с твоих доходов — ты платишь, только когда получаешь деньги."
    },
    {
      q: "Как быстро выйдет мой трек?",
      a: "Модерация занимает в среднем 24 часа. После одобрения релиз появится на площадках в течение 3-5 рабочих дней."
    },
    {
      q: "Какие права остаются у меня?",
      a: "Все авторские права остаются у тебя. Мы только распространяем музыку и собираем роялти — ты полностью владеешь своим контентом."
    },
    {
      q: "Когда придут деньги?",
      a: "Площадки присылают отчёты с задержкой 1-3 месяца. Мы выплачиваем роялти дважды в месяц — как только получаем данные от сервисов."
    },
  ];

  return (
    <>
      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/6f1dd302-dd25-49ae-aebf-13f4871d0d4d.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Откуда мы знаем, что работаем хорошо?
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Результаты наших артистов говорят сами за себя
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="scroll-animate group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl hover:border-orange-500/50 transition-all duration-500 card-hover glow-on-hover"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-6xl font-bold text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/cd01e971-8333-4e23-bee8-22a54c946842.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Инструменты для твоего успеха
            </h2>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Полный цикл работы с музыкой: от загрузки трека до получения денег на карту
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="scroll-animate group p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-3xl hover:border-orange-500/50 transition-all duration-500 card-hover glow-on-hover"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 backdrop-blur-sm">
                  <Icon name={feature.icon as any} size={28} className="text-orange-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4 font-light">
                  {feature.description}
                </p>
                
                <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-400 font-medium group-hover:bg-orange-500/20 transition-all duration-300">
                  {feature.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/28767271-4aef-4a51-b799-796154fc31c0.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Дистрибуция на все площадки
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Твоя музыка будет доступна миллионам слушателей по всему миру
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform, i) => (
              <div
                key={i}
                className="scroll-animate group p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl hover:border-orange-500/50 transition-all duration-500 card-hover glow-on-hover flex flex-col items-center justify-center text-center"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <Icon name={platform.icon as any} size={32} className="text-orange-400 mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                  {platform.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center scroll-animate">
            <p className="text-gray-500 text-sm">+ ещё 40 музыкальных сервисов по всему миру</p>
          </div>
        </div>
      </section>

      <BlogCarousel />

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Популярные вопросы
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="scroll-animate group p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl hover:border-orange-500/30 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <summary className="cursor-pointer font-semibold text-lg flex items-center justify-between group-hover:text-orange-400 transition-colors duration-300">
                  {faq.q}
                  <Icon name="ChevronDown" size={20} className="text-orange-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed font-light">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <img 
            src="https://cdn.poehali.dev/projects/0e0d66e6-7f6e-47fa-9e86-41a58867df5f/files/33f4d99e-a10a-4062-b1e3-0e97b2f60bed.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 scroll-animate">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Готов начать работу?
          </h2>
          <p className="text-gray-400 text-lg mb-12 font-light max-w-2xl mx-auto">
            Присоединяйся к сообществу артистов, которые зарабатывают на своей музыке
          </p>
          
          <a
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
            style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
          >
            Выпустить первый релиз
            <Icon name="ArrowRight" size={22} />
          </a>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
              <Icon name="Check" size={16} className="text-orange-400" />
              <span>Без скрытых комиссий</span>
            </div>
            <div className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
              <Icon name="Check" size={16} className="text-orange-400" />
              <span>Быстрая модерация</span>
            </div>
            <div className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-300">
              <Icon name="Check" size={16} className="text-orange-400" />
              <span>Поддержка 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold text-orange-500">
              420.рф
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <a href="/blog" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">Блог</a>
              <a href="/terms" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">Условия</a>
              <a href="/privacy" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">Конфиденциальность</a>
              <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">
                Telegram
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-900 text-center text-sm text-gray-600">
            © 2024 420 Music. Все права защищены.
          </div>
        </div>
      </footer>
    </>
  );
}