import Icon from "@/components/ui/icon";
import BlogCarousel from "./BlogCarousel";

interface LandingBottomSectionsProps {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingBottomSections({ 
  handleMouseMove, 
  handleMouseLeave
}: LandingBottomSectionsProps) {
  const platforms = [
    { name: "Spotify", icon: "Music" },
    { name: "Apple Music", icon: "Music2" },
    { name: "Яндекс Музыка", icon: "Music3" },
    { name: "VK Музыка", icon: "Music4" },
    { name: "YouTube Music", icon: "Youtube" },
    { name: "Deezer", icon: "Disc3" },
  ];

  const faqs = [
    {
      q: "Сколько стоит выпуск релиза?",
      a: "Выпуск релиза бесплатный. Мы зарабатываем небольшой процент с твоих роялти — ты платишь, только когда зарабатываешь."
    },
    {
      q: "Как быстро выйдет моя музыка?",
      a: "После загрузки трека модерация занимает 1-2 дня. Затем релиз появляется на всех площадках в течение 3-5 дней."
    },
    {
      q: "Могу ли я удалить свою музыку?",
      a: "Да, в любой момент ты можешь удалить релиз со всех платформ. Все права принадлежат тебе, ты полностью контролируешь свой контент."
    },
    {
      q: "Когда я получу деньги?",
      a: "Музыкальные платформы передают данные о прослушиваниях с задержкой 1-3 месяца. Мы делаем выплаты 2 раза в месяц после получения данных."
    },
  ];

  return (
    <>
      {/* Platforms Section */}
      <section id="platforms" className="py-32 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
                50+ музыкальных платформ
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Твоя музыка будет доступна миллионам слушателей
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform, i) => (
              <div
                key={i}
                className="group p-6 bg-gradient-to-b from-gray-900/50 to-black/50 border border-gold-500/10 rounded-xl hover:border-gold-500/30 transition-all duration-300 flex flex-col items-center justify-center text-center"
              >
                <Icon name={platform.icon as any} size={32} className="text-gold-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-medium text-gray-200">
                  {platform.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">+ ещё 40 музыкальных сервисов по всему миру</p>
          </div>
        </div>
      </section>

      <BlogCarousel />

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 lg:px-12 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
                Популярные вопросы
              </span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group p-6 bg-gradient-to-b from-gray-900/50 to-black/50 border border-gold-500/10 rounded-xl hover:border-gold-500/30 transition-all"
              >
                <summary className="cursor-pointer font-semibold text-lg flex items-center justify-between text-white">
                  {faq.q}
                  <Icon name="ChevronDown" size={20} className="text-gold-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              Начни зарабатывать на музыке
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Загрузи первый трек и выведи своё творчество на новый уровень
          </p>
          
          <a
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg font-semibold text-lg text-black hover:shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105"
          >
            Загрузить трек
            <Icon name="ArrowRight" size={22} />
          </a>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-gold-400" />
              <span>Без скрытых комиссий</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-gold-400" />
              <span>Быстрая модерация</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-gold-400" />
              <span>Поддержка 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold text-gold-400">
              420
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <a href="/blog" className="hover:text-gold-400 transition-colors">Блог</a>
              <a href="/terms" className="hover:text-gold-400 transition-colors">Условия</a>
              <a href="/privacy" className="hover:text-gold-400 transition-colors">Конфиденциальность</a>
              <a href="https://t.me/+QgiLIa1gFRY4Y2Iy" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
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
