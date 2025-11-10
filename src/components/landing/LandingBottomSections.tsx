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
    { name: "Spotify", icon: "Music", color: "from-green-500 to-emerald-500" },
    { name: "Apple Music", icon: "Music2", color: "from-pink-500 to-rose-500" },
    { name: "Яндекс.Музыка", icon: "Music3", color: "from-yellow-500 to-orange-500" },
    { name: "VK Музыка", icon: "Music4", color: "from-blue-500 to-indigo-500" },
    { name: "YouTube Music", icon: "Youtube", color: "from-red-500 to-pink-500" },
    { name: "Deezer", icon: "Disc3", color: "from-orange-500 to-red-500" },
    { name: "SoundCloud", icon: "Cloud", color: "from-orange-400 to-red-400" },
    { name: "Tidal", icon: "Waves", color: "from-cyan-500 to-blue-500" },
    { name: "Amazon Music", icon: "ShoppingCart", color: "from-blue-400 to-cyan-400" },
    { name: "Shazam", icon: "Radio", color: "from-blue-600 to-purple-600" },
    { name: "Pandora", icon: "Music", color: "from-blue-500 to-indigo-500" },
    { name: "TikTok", icon: "Video", color: "from-cyan-400 to-pink-400" },
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
      <section id="platforms" className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full mb-6">
              <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">Везде где ты слушаешь</span>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-200 via-pink-400 to-purple-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                50+ музыкальных платформ
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Твоя музыка будет доступна миллионам слушателей по всему миру
            </p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden mask-gradient py-4">
              <div className="flex gap-6 animate-scroll-infinite">
                {[...platforms, ...platforms].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 w-[280px] relative"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-br ${platform.color} rounded-2xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                    
                    <div className="relative p-8 bg-black/70 backdrop-blur-sm border-2 border-white/10 rounded-2xl group-hover:border-white/30 transition-all duration-500 flex flex-col items-center justify-center text-center group-hover:scale-105 group-hover:shadow-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full" />
                      
                      <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                        <Icon name={platform.icon as any} size={32} className="text-white" />
                      </div>
                      
                      <div className="text-lg font-bold text-white mb-1">
                        {platform.name}
                      </div>
                      
                      <div className={`h-1 w-16 bg-gradient-to-r ${platform.color} rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-full">
              <Icon name="Plus" size={16} className="text-purple-400" />
              <span className="text-gray-400 text-sm font-semibold">ещё 40 музыкальных сервисов по всему миру</span>
            </div>
          </div>
        </div>
      </section>

      <BlogCarousel />

      <section id="faq" className="py-32 px-6 lg:px-12 relative scroll-animate">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-gold-500/5 to-orange-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-500/20 to-orange-500/20 border border-gold-400/30 rounded-full mb-6">
              <span className="text-gold-300 font-bold text-sm uppercase tracking-wider">Ответы на вопросы</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
                Популярные вопросы
              </span>
            </h2>
          </div>
          
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-600/30 to-orange-600/30 rounded-2xl blur-md opacity-0 group-open:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 bg-black/60 backdrop-blur-sm border-2 border-gold-500/20 rounded-2xl group-hover:border-gold-500/40 group-open:border-gold-500/60 transition-all overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-500/10 to-transparent rounded-full opacity-0 group-open:opacity-100 transition-opacity duration-500" />
                  
                  <summary className="cursor-pointer font-bold text-xl flex items-center justify-between text-white group-hover:text-gold-200 transition-colors">
                    <span className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-orange-500 rounded-lg flex items-center justify-center text-black font-black text-sm">
                        {i + 1}
                      </div>
                      {faq.q}
                    </span>
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="ChevronDown" size={24} className="text-gold-400 group-open:rotate-180 transition-transform duration-500" />
                    </div>
                  </summary>
                  
                  <div className="mt-6 pl-11">
                    <div className="h-px bg-gradient-to-r from-gold-500/50 to-transparent mb-6" />
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/20 to-orange-500/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute -top-20 left-1/4 w-32 h-32 border-4 border-gold-400/20 rounded-full" />
          <div className="absolute -bottom-20 right-1/4 w-24 h-24 border-4 border-orange-400/20 rounded-full" />
          
          <div className="mb-12">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-500/30 to-orange-500/30 border-2 border-gold-400/50 rounded-full mb-8 shadow-2xl shadow-gold-500/20">
              <span className="text-gold-200 font-black text-sm uppercase tracking-wider">Начни сейчас</span>
            </div>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8">
            <span className="bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent">
              Начни зарабатывать
            </span>
            <br />
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              на музыке
            </span>
          </h2>
          
          <p className="text-gray-300 text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">
            Загрузи первый трек и выведи своё творчество на новый уровень
          </p>
          
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-gold-600 via-orange-600 to-gold-600 rounded-2xl blur-2xl opacity-70 animate-pulse" />
            
            <a
              href="/app"
              className="relative group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-gold-500 via-orange-500 to-gold-500 rounded-2xl font-black text-2xl text-black shadow-2xl hover:shadow-gold-500/50 transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-gold-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Загрузить трек</span>
              <Icon name="ArrowRight" size={28} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
          
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-base">
            {[
              { icon: "Check", text: "Без скрытых комиссий" },
              { icon: "Check", text: "Быстрая модерация" },
              { icon: "Check", text: "Поддержка 24/7" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name={item.icon as any} size={20} className="text-black font-bold" />
                </div>
                <span className="text-gray-300 font-semibold group-hover:text-white transition-colors">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative py-20 px-6 lg:px-12 border-t border-gold-500/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div>
              <div className="text-5xl font-black mb-6 bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                420
              </div>
              <p className="text-gray-400 text-base leading-relaxed">
                Дистрибуция музыки на 50+ платформ. Зарабатывай на своём творчестве, сохраняя все права.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-black mb-6 text-sm uppercase tracking-wider">Навигация</h3>
              <div className="flex flex-col gap-4">
                {[
                  { href: "#features", text: "Возможности" },
                  { href: "#platforms", text: "Платформы" },
                  { href: "#faq", text: "Вопросы" }
                ].map((link, i) => (
                  <a key={i} href={link.href} className="group flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors">
                    <div className="w-6 h-6 bg-gold-500/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="ChevronRight" size={14} className="text-gold-400" />
                    </div>
                    <span className="font-semibold">{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-black mb-6 text-sm uppercase tracking-wider">Контакты</h3>
              <div className="flex flex-col gap-4">
                <a href="mailto:support@420music.ru" className="group flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Mail" size={18} className="text-gold-400" />
                  </div>
                  <span className="font-semibold">support@420music.ru</span>
                </a>
                <a href="https://t.me/music420support" className="group flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="MessageCircle" size={18} className="text-gold-400" />
                  </div>
                  <span className="font-semibold">Telegram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gold-500/20">
            <p className="text-center text-gray-500 text-sm">
              © 2024 420 Music. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
