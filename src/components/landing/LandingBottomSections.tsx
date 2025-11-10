import Icon from "@/components/ui/icon";
import BlogCarousel from "./BlogCarousel";

interface LandingBottomSectionsProps {
  scrollY: number;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingBottomSections({ 
  scrollY, 
  handleMouseMove, 
  handleMouseLeave
}: LandingBottomSectionsProps) {
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
      {/* Platforms Section */}
      <section id="platforms" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
              Дистрибуция на все площадки
            </h2>
            <p className="text-gray-300 text-lg font-light">
              Твоя музыка будет доступна миллионам слушателей по всему миру
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform, i) => (
              <div
                key={i}
                className="scroll-animate group p-6 neomorphism glassmorphism rounded-2xl glow-border transition-all duration-500 card-3d wave-enter flex flex-col items-center justify-center text-center color-shift"
                style={{ 
                  transitionDelay: `${i * 50}ms`,
                  animationDelay: `${i * 100}ms`
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <Icon name={platform.icon as any} size={32} className="text-orange-400 mb-3 group-hover:scale-125 transition-all duration-500 wave-animate" />
                <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-300">
                  {platform.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center scroll-animate">
            <p className="text-gray-400 text-sm">+ ещё 40 музыкальных сервисов по всему миру</p>
          </div>
        </div>
      </section>

      <BlogCarousel />

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
              Популярные вопросы
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="scroll-animate group p-6 neomorphism glassmorphism rounded-2xl glow-border transition-all duration-500 wave-enter color-shift"
                style={{ 
                  transitionDelay: `${i * 100}ms`,
                  animationDelay: `${i * 150}ms`
                }}
              >
                <summary className="cursor-pointer font-semibold text-lg flex items-center justify-between group-hover:text-orange-400 transition-colors duration-300">
                  {faq.q}
                  <Icon name="ChevronDown" size={20} className="text-orange-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <p className="mt-4 text-gray-300 leading-relaxed font-light">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 scroll-animate">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Готов начать работу?
          </h2>
          <p className="text-gray-300 text-lg mb-12 font-light max-w-2xl mx-auto">
            Присоединяйся к сообществу артистов, которые зарабатывают на своей музыке
          </p>
          
          <a
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 button-ripple glow-border"
          >
            Выпустить первый релиз
            <Icon name="ArrowRight" size={22} />
          </a>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
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
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-950 border-t border-orange-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold text-orange-500">
              420.рф
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="/blog" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">Блог</a>
              <a href="/terms" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">Условия</a>
              <a href="/privacy" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">Конфиденциальность</a>
              <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-all duration-300 hover:scale-110">
                Telegram
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2024 420 Music. Все права защищены.
          </div>
        </div>
      </footer>
    </>
  );
}