import Icon from "@/components/ui/icon";
import BlogCarousel from "./BlogCarousel";
import { useState, useRef } from "react";

interface LandingBottomSectionsProps {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingBottomSections({ 
  handleMouseMove, 
  handleMouseLeave
}: LandingBottomSectionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentScroll, setCurrentScroll] = useState<HTMLDivElement | null>(null);
  const [isPaused1, setIsPaused1] = useState(false);
  const [isPaused2, setIsPaused2] = useState(false);
  const animationRef1 = useRef<number | null>(null);
  const animationRef2 = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement>, setPaused: (val: boolean) => void) => {
    if (!ref.current) return;
    setIsDragging(true);
    setCurrentScroll(ref.current);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    setPaused(true);
    ref.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = (setPaused?: (val: boolean) => void) => {
    setIsDragging(false);
    if (currentScroll) {
      currentScroll.style.cursor = 'grab';
    }
    if (setPaused) {
      setTimeout(() => setPaused(false), 1000);
    }
  };

  const handleMouseMoveScroll = (e: React.MouseEvent) => {
    if (!isDragging || !currentScroll) return;
    e.preventDefault();
    const x = e.pageX - currentScroll.offsetLeft;
    const walk = (x - startX) * 2;
    currentScroll.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent, ref: React.RefObject<HTMLDivElement>, setPaused: (val: boolean) => void) => {
    if (!ref.current) return;
    setCurrentScroll(ref.current);
    setStartX(e.touches[0].pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
    setPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!currentScroll) return;
    const x = e.touches[0].pageX - currentScroll.offsetLeft;
    const walk = (x - startX) * 2;
    currentScroll.scrollLeft = scrollLeft - walk;
  };

  // Автопрокрутка
  useState(() => {
    const scroll1 = () => {
      if (!scrollRef1.current || isPaused1 || isDragging) return;
      scrollRef1.current.scrollLeft += 0.5;
      if (scrollRef1.current.scrollLeft >= scrollRef1.current.scrollWidth / 3) {
        scrollRef1.current.scrollLeft = 0;
      }
      animationRef1.current = requestAnimationFrame(scroll1);
    };

    const scroll2 = () => {
      if (!scrollRef2.current || isPaused2 || isDragging) return;
      scrollRef2.current.scrollLeft -= 0.5;
      if (scrollRef2.current.scrollLeft <= 0) {
        scrollRef2.current.scrollLeft = scrollRef2.current.scrollWidth / 3;
      }
      animationRef2.current = requestAnimationFrame(scroll2);
    };

    animationRef1.current = requestAnimationFrame(scroll1);
    animationRef2.current = requestAnimationFrame(scroll2);

    return () => {
      if (animationRef1.current) cancelAnimationFrame(animationRef1.current);
      if (animationRef2.current) cancelAnimationFrame(animationRef2.current);
    };
  });

  const platforms1 = [
    { name: "Spotify", icon: "Music", color: "from-green-500 to-emerald-500" },
    { name: "Apple Music", icon: "Music2", color: "from-pink-500 to-rose-500" },
    { name: "Яндекс.Музыка", icon: "Music3", color: "from-yellow-500 to-orange-500" },
    { name: "VK Музыка", icon: "Music4", color: "from-blue-500 to-indigo-500" },
    { name: "YouTube Music", icon: "Youtube", color: "from-red-500 to-pink-500" },
    { name: "Deezer", icon: "Disc3", color: "from-orange-500 to-red-500" },
  ];

  const platforms2 = [
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
              <span className="bg-gradient-to-r from-purple-200 via-pink-400 to-purple-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">170+ музыкальных платформ</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Твоя музыка будет доступна миллионам слушателей по всему миру
            </p>
          </div>
          
          <div className="relative space-y-6">
            <div 
              ref={scrollRef1}
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, scrollRef1, setIsPaused1)}
              onMouseUp={() => handleMouseUp(setIsPaused1)}
              onMouseLeave={() => handleMouseUp(setIsPaused1)}
              onMouseMove={handleMouseMoveScroll}
              onMouseEnter={() => setIsPaused1(true)}
              onTouchStart={(e) => handleTouchStart(e, scrollRef1, setIsPaused1)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleMouseUp(setIsPaused1)}
            >
              <div className="flex gap-8 py-2" style={{ width: 'max-content' }}>
                {[...platforms1, ...platforms1, ...platforms1].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 relative select-none"
                  >
                    <div className={`absolute -inset-2 bg-gradient-to-br ${platform.color} rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                    
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center group-hover:scale-125 transition-all duration-300 shadow-lg`}>
                      <Icon name={platform.icon as any} size={32} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              ref={scrollRef2}
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, scrollRef2, setIsPaused2)}
              onMouseUp={() => handleMouseUp(setIsPaused2)}
              onMouseLeave={() => handleMouseUp(setIsPaused2)}
              onMouseMove={handleMouseMoveScroll}
              onMouseEnter={() => setIsPaused2(true)}
              onTouchStart={(e) => handleTouchStart(e, scrollRef2, setIsPaused2)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleMouseUp(setIsPaused2)}
            >
              <div className="flex gap-8 py-2" style={{ width: 'max-content' }}>
                {[...platforms2, ...platforms2, ...platforms2].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 relative select-none"
                  >
                    <div className={`absolute -inset-2 bg-gradient-to-br ${platform.color} rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                    
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center group-hover:scale-125 transition-all duration-300 shadow-lg`}>
                      <Icon name={platform.icon as any} size={32} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-full">
              <Icon name="Plus" size={16} className="text-purple-400" />
              <span className="text-gray-400 text-sm font-semibold">+ 158 музыкальных сервисов по всему миру</span>
            </div>
          </div>
        </div>
      </section>

      <BlogCarousel />

      <section id="faq" className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/10 to-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-orange-500/10 to-gold-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        </div>
        
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-gold-400/10 rounded-[32px] rotate-12 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-orange-400/10 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl" />
            
            <div className="inline-block px-8 py-3 bg-gradient-to-r from-gold-500/30 to-orange-500/30 border-2 border-gold-400/40 rounded-full mb-8 shadow-2xl shadow-gold-500/20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-orange-400/20 rounded-full blur-xl" />
              <span className="text-gold-200 font-black text-sm uppercase tracking-wider relative z-10">Ответы на вопросы</span>
            </div>
            
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                Популярные вопросы
              </span>
            </h2>
            
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-gold-400 to-transparent rounded-full" />
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="group relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: 'perspective(2000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r from-gold-600/40 via-orange-600/40 to-gold-600/40 rounded-[28px] blur-xl opacity-0 transition-all duration-700 ${openIndex === i ? 'opacity-100 animate-gradient-x' : ''}`} />
                
                <div className={`relative bg-black/70 backdrop-blur-xl border-2 rounded-3xl transition-all duration-500 overflow-hidden ${openIndex === i ? 'border-gold-500/80 shadow-2xl shadow-gold-500/30 -translate-y-2' : 'border-gold-500/30 group-hover:border-gold-500/50 group-hover:-translate-y-1'}`}>
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold-500/20 to-transparent rounded-full blur-3xl opacity-0 transition-opacity duration-700 ${openIndex === i ? 'opacity-100' : ''}`} />
                  <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl opacity-opacity-0 transition-opacity duration-700 ${openIndex === i ? 'opacity-100' : ''}`} />
                  
                  <div className={`absolute top-8 right-8 w-32 h-32 border-2 border-gold-400/20 rounded-[24px] rotate-12 transition-all duration-700 ${openIndex === i ? 'scale-150' : 'group-hover:rotate-45'}`} />
                  <div className={`absolute bottom-8 left-8 w-24 h-24 border-2 border-orange-400/20 rounded-full -rotate-12 transition-all duration-700 ${openIndex === i ? 'scale-150' : 'group-hover:-rotate-45'}`} />
                  
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full p-10 flex items-center justify-between cursor-pointer group/button text-left"
                  >
                    <span className="flex items-center gap-5 flex-1 pr-4">
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl blur-lg opacity-60 transition-all duration-500 ${openIndex === i ? 'scale-125' : ''}`} />
                        <div className={`relative w-16 h-16 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 transition-all duration-500 ${openIndex === i ? 'scale-125' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                          <span className="text-black font-black text-2xl">{i + 1}</span>
                        </div>
                      </div>
                      
                      <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${openIndex === i ? 'text-gold-100' : 'text-white group-hover:text-gold-200'}`}>
                        {faq.q}
                      </h3>
                    </span>
                    
                    <div className="relative flex-shrink-0 group-hover/button:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gold-500/40 rounded-2xl blur-2xl opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 border-2 border-gold-300/50">
                        <Icon name="ChevronDown" size={32} className={`text-black font-bold transition-all duration-500 ${openIndex === i ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>
                  
                  {openIndex === i && (
                    <div className="px-10 pb-10 animate-fade-in-up">
                      <div className="pl-[76px] relative">
                        <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gold-500/50 via-gold-500/30 to-transparent rounded-full" />
                        
                        <div className="relative bg-gradient-to-br from-gold-500/10 to-orange-500/10 backdrop-blur-sm border-2 border-gold-400/30 rounded-2xl p-8 shadow-xl">
                          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-gold-400/30 to-transparent rounded-tl-2xl" />
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-orange-400/30 to-transparent rounded-br-2xl" />
                          
                          <p className="text-gray-100 leading-relaxed text-lg md:text-xl relative z-10">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-orange-500 to-gold-500 transition-opacity duration-500 ${openIndex === i ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
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
              <p className="text-gray-400 text-base leading-relaxed">Дистрибуция музыки на 170+ платформ. Зарабатывай на своём творчестве, сохраняя все права.</p>
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
                  <span className="font-semibold">GUT1K@MAIL.RU</span>
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
            <p className="text-center text-gray-500 text-sm">© 2025 420.РФ Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
}