import { useEffect, useState } from "react";
import BurgerMenu from "@/components/BurgerMenu";
import Icon from "@/components/ui/icon";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BurgerMenu />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400 font-medium">
              420 Music Distribution
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
            <span className="block">ВСЁ, ЧТО НУЖНО</span>
            <span className="block">АРТИСТУ ДЛЯ</span>
            <span className="block bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              УСПЕШНОЙ РАБОТЫ
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Дистрибуция музыки на все площадки мира. Промо в плейлисты. Детальная аналитика. Честные выплаты.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/app"
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105"
            >
              Выпустить релиз
              <Icon name="ArrowRight" className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            
            <a
              href="#features"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
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
                className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10"
              >
                <div className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-4">
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
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
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
                className="group p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800 rounded-3xl hover:border-orange-500/50 transition-all hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                  <Icon name={feature.icon as any} size={28} className="text-orange-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4 font-light">
                  {feature.description}
                </p>
                
                <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-400 font-medium">
                  {feature.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
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
                className="group p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10 flex flex-col items-center justify-center text-center"
              >
                <Icon name={platform.icon as any} size={32} className="text-orange-400 mb-3" />
                <div className="text-sm font-medium text-gray-300">{platform.name}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">+ ещё 40 музыкальных сервисов по всему миру</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Популярные вопросы
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl hover:border-orange-500/30 transition-all"
              >
                <summary className="cursor-pointer font-semibold text-lg flex items-center justify-between">
                  {faq.q}
                  <Icon name="ChevronDown" size={20} className="text-orange-400 group-open:rotate-180 transition-transform" />
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Готов начать работу?
          </h2>
          <p className="text-gray-400 text-lg mb-12 font-light max-w-2xl mx-auto">
            Присоединяйся к сообществу артистов, которые зарабатывают на своей музыке
          </p>
          
          <a
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105"
          >
            Выпустить первый релиз
            <Icon name="ArrowRight" size={22} />
          </a>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-orange-400" />
              <span>Без скрытых комиссий</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-orange-400" />
              <span>Быстрая модерация</span>
            </div>
            <div className="flex items-center gap-2">
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
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
              420.рф
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <a href="/blog" className="hover:text-orange-400 transition-colors">Блог</a>
              <a href="/terms" className="hover:text-orange-400 transition-colors">Условия</a>
              <a href="/privacy" className="hover:text-orange-400 transition-colors">Конфиденциальность</a>
              <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                Telegram
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-900 text-center text-sm text-gray-600">
            © 2024 420 Music. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
