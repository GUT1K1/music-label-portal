import { useEffect, useState, useRef } from "react";
import Icon from "@/components/ui/icon";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fullText = "УСПЕШНОЙ РАБОТЫ";

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
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
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-up {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.6), 0 0 60px rgba(251, 146, 60, 0.4); }
        }
        
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .gradient-animated {
          background: linear-gradient(270deg, #f97316, #fb923c, #f59e0b, #fb923c, #f97316);
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .glow-on-hover {
          position: relative;
          overflow: hidden;
        }
        
        .glow-on-hover::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.5s;
        }
        
        .glow-on-hover:hover::before {
          opacity: 1;
        }
      `}</style>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
          style={{ 
            animation: 'float-up 20s ease-in-out infinite',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
          style={{ 
            animation: 'float-up 25s ease-in-out infinite reverse',
            transform: `translate(-${scrollY * 0.08}px, -${scrollY * 0.12}px)`
          }}
        />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-2xl border-b border-orange-500/20 shadow-lg shadow-orange-500/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="text-2xl font-bold gradient-animated bg-clip-text text-transparent">
              420.рф
            </a>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
                Возможности
              </a>
              <a href="#platforms" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
                Площадки
              </a>
              <a href="/blog" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
                Блог
              </a>
              <a href="#faq" className="text-sm font-medium text-gray-400 hover:text-orange-400 transition-all duration-300 hover:scale-110">
                FAQ
              </a>
              <a
                href="/app"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg font-semibold text-sm hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
                style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
              >
                Войти
              </a>
            </nav>

            <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
              <Icon name="Menu" size={24} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block animate-slideIn opacity-0" style={{ animation: 'slide-in-up 0.8s 0.2s forwards' }}>
            <span className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400 font-medium backdrop-blur-sm">
              420
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
            <span className="block opacity-0 animate-slideIn" style={{ animation: 'slide-in-up 0.8s 0.4s forwards' }}>
              ВСЁ, ЧТО НУЖНО
            </span>
            <span className="block opacity-0 animate-slideIn" style={{ animation: 'slide-in-up 0.8s 0.6s forwards' }}>
              АРТИСТУ ДЛЯ
            </span>
            <span className={`block gradient-animated bg-clip-text text-transparent opacity-0 ${!isTypingComplete ? 'typing-cursor' : ''}`} style={{ animation: 'slide-in-up 0.8s 0.8s forwards' }}>
              {typedText}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light opacity-0" style={{ animation: 'slide-in-up 0.8s 1.5s forwards' }}>
            Дистрибуция музыки на все площадки мира. Промо в плейлисты. Детальная аналитика. Честные выплаты.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0" style={{ animation: 'slide-in-up 0.8s 1.8s forwards' }}>
            <a
              href="/app"
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
            >
              Выпустить релиз
              <Icon name="ArrowRight" className="inline ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </a>
            
            <a
              href="#features"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-orange-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-950 to-black relative">
        <div className="max-w-6xl mx-auto">
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
                <div className="text-6xl font-bold gradient-animated bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-500">
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
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="max-w-6xl mx-auto relative">
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
      <section id="platforms" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
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
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative scroll-animate">
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
            <div className="text-2xl font-bold gradient-animated bg-clip-text text-transparent">
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
    </div>
  );
}
