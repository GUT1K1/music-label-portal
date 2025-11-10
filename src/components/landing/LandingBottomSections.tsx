import { useState, useEffect } from "react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const platforms = [
    { name: "Spotify", icon: "Music", color: "from-green-500/20 to-green-600/10" },
    { name: "Apple Music", icon: "Music2", color: "from-pink-500/20 to-red-600/10" },
    { name: "Яндекс Музыка", icon: "Music3", color: "from-yellow-500/20 to-yellow-600/10" },
    { name: "VK Музыка", icon: "Music4", color: "from-blue-500/20 to-blue-600/10" },
    { name: "YouTube Music", icon: "Youtube", color: "from-red-500/20 to-red-600/10" },
    { name: "Deezer", icon: "Disc3", color: "from-purple-500/20 to-purple-600/10" },
    { name: "SoundCloud", icon: "Cloud", color: "from-orange-500/20 to-orange-600/10" },
    { name: "Tidal", icon: "Waves", color: "from-cyan-500/20 to-cyan-600/10" },
    { name: "Amazon Music", icon: "ShoppingCart", color: "from-blue-400/20 to-blue-500/10" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(platforms.length / 3));
    }, 3000);
    return () => clearInterval(interval);
  }, [platforms.length]);

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
      <section id="platforms" className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
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
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(platforms.length / 3) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                    {platforms.slice(slideIndex * 3, slideIndex * 3 + 3).map((platform, i) => (
                      <div
                        key={i}
                        className={`group relative p-10 bg-gradient-to-br ${platform.color} border border-gold-400/30 rounded-3xl hover:border-gold-400/60 transition-all duration-500 flex flex-col items-center justify-center text-center hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/20 overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Icon name={platform.icon as any} size={48} className="text-gold-200 mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10" />
                        <div className="text-xl font-bold text-white relative z-10 group-hover:text-gold-100 transition-colors">
                          {platform.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(platforms.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === i 
                      ? 'bg-gold-400 w-8' 
                      : 'bg-gold-400/30 hover:bg-gold-400/50'
                  }`}
                />
              ))}
            </div>
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