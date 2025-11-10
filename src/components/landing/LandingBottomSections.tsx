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
    { name: "Яндекс.Музыка", icon: "Music3" },
    { name: "VK Музыка", icon: "Music4" },
    { name: "YouTube Music", icon: "Youtube" },
    { name: "Deezer", icon: "Disc3" },
    { name: "SoundCloud", icon: "Cloud" },
    { name: "Tidal", icon: "Waves" },
    { name: "Amazon Music", icon: "ShoppingCart" },
    { name: "Shazam", icon: "Radio" },
    { name: "Pandora", icon: "Music" },
    { name: "TikTok", icon: "Video" },
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
      <section id="platforms" className="py-20 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                50+ музыкальных платформ
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Твоя музыка будет доступна миллионам слушателей
            </p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden mask-gradient">
              <div className="flex gap-6 animate-scroll-infinite">
                {[...platforms, ...platforms].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 w-[280px] p-8 bg-gradient-to-br from-gray-900/40 to-black/40 border border-gold-400/20 rounded-2xl hover:border-gold-400/50 hover:bg-gradient-to-br hover:from-gray-900/60 hover:to-black/60 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 hover:shadow-xl hover:shadow-gold-500/10"
                  >
                    <Icon name={platform.icon as any} size={40} className="text-gold-300 mb-4 group-hover:scale-110 group-hover:text-gold-200 transition-all duration-300" />
                    <div className="text-base font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {platform.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">+ ещё 40 музыкальных сервисов по всему миру</p>
          </div>
        </div>
      </section>

      <BlogCarousel />

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 lg:px-12 relative scroll-animate">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
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
      <section className="py-20 px-6 lg:px-12 relative scroll-animate">
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
      <footer className="relative py-16 px-6 lg:px-12 border-t border-gold-500/20 bg-gradient-to-b from-transparent to-black/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="text-4xl font-black mb-4 bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                420
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Дистрибуция музыки на 50+ платформ. Зарабатывай на своём творчестве, сохраняя все права.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Навигация</h3>
              <div className="flex flex-col gap-3">
                <a href="#features" className="text-gray-400 hover:text-gold-300 transition-colors text-sm group flex items-center gap-2">
                  <Icon name="ChevronRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Возможности
                </a>
                <a href="#platforms" className="text-gray-400 hover:text-gold-300 transition-colors text-sm group flex items-center gap-2">
                  <Icon name="ChevronRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Платформы
                </a>
                <a href="#faq" className="text-gray-400 hover:text-gold-300 transition-colors text-sm group flex items-center gap-2">
                  <Icon name="ChevronRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Вопросы
                </a>
                <a href="/blog" className="text-gray-400 hover:text-gold-300 transition-colors text-sm group flex items-center gap-2">
                  <Icon name="ChevronRight" size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  Блог
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Контакты</h3>
              <div className="flex flex-col gap-3">
                <a 
                  href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-gold-300 transition-colors text-sm flex items-center gap-2 group"
                >
                  <Icon name="MessageCircle" size={16} className="text-gold-400" />
                  <span>Telegram сообщество</span>
                </a>
                <a href="/terms" className="text-gray-400 hover:text-gold-300 transition-colors text-sm">
                  Условия использования
                </a>
                <a href="/privacy" className="text-gray-400 hover:text-gold-300 transition-colors text-sm">
                  Политика конфиденциальности
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gold-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2024 420 Music. Все права защищены.
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://t.me/+QgiLIa1gFRY4Y2Iy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-orange-500/10 border border-gold-400/30 flex items-center justify-center hover:border-gold-400/60 hover:bg-gradient-to-br hover:from-gold-500/30 hover:to-orange-500/20 transition-all duration-300 hover:scale-110"
              >
                <Icon name="MessageCircle" size={18} className="text-gold-300" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}