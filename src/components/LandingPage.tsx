import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import AnimatedHero from "@/components/AnimatedHero";
import BurgerMenu from "@/components/BurgerMenu";
import Animated420Logo from "@/components/Animated420Logo";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let lastScrollY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setScrollY(lastScrollY);
          rafId = 0;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setMousePosition({ x: lastMouseX, y: lastMouseY });
          rafId = 0;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const services = [
    {
      icon: "Music",
      title: "Дистрибуция",
      description:
        "Выпускай релизы на всех площадках: Яндекс Музыка, VK Музыка, Apple Music, Spotify",
      features: [
        "Быстрая модерация 24ч",
        "Без комиссий за выпуск",
        "Выплаты от 500₽",
      ],
      gradient: "from-yellow-500 via-orange-500 to-amber-600",
      glowColor: "violet",
    },
    {
      icon: "TrendingUp",
      title: "Промо и питчинг",
      description: "Продвигаем треки в плейлисты и помогаем набрать аудиторию",
      features: [
        "Редакционные плейлисты",
        "Таргетированная реклама",
        "SMM продвижение",
      ],
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      glowColor: "cyan",
    },
    {
      icon: "BarChart3",
      title: "Аналитика и отчёты",
      description: "Отслеживай статистику прослушиваний и зарабатывай больше",
      features: [
        "Детальная аналитика",
        "Прозрачные выплаты",
        "Еженедельные отчёты",
      ],
      gradient: "from-amber-400 via-orange-500 to-red-600",
      glowColor: "orange",
    },
  ];

  const platforms = [
    {
      name: "Яндекс Музыка",
      logo: "🎵",
      gradient: "from-yellow-400 to-red-500",
    },
    { name: "VK Музыка", logo: "🎧", gradient: "from-blue-500 to-purple-600" },
    { name: "Apple Music", logo: "🍎", gradient: "from-pink-500 to-rose-600" },
    { name: "Spotify", logo: "🎶", gradient: "from-green-400 to-emerald-600" },
    {
      name: "YouTube Music",
      logo: "▶️",
      gradient: "from-red-500 to-orange-500",
    },
    {
      name: "SoundCloud",
      logo: "☁️",
      gradient: "from-orange-400 to-amber-500",
    },
  ];

  const stats = [
    {
      value: "10+",
      label: "лет опыта",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      value: "500+",
      label: "релизов",
      gradient: "from-amber-500 to-yellow-600",
    },
    {
      value: "50+",
      label: "артистов",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      value: "24/7",
      label: "поддержка",
      gradient: "from-yellow-600 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-float"
          style={{
            background: "linear-gradient(45deg, #eab308, #fb923c)",
            top: "10%",
            left: "5%",
            animationDuration: "25s",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-10 animate-float"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
            bottom: "10%",
            right: "10%",
            animationDuration: "30s",
            animationDelay: "5s",
          }}
        />
      </div>

      {/* Burger Menu */}
      <BurgerMenu />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251, 146, 60, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Компактный блок 420 + Hero */}
            <div
              className="mb-6 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="">
                {/* Подпись лейбла */}
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight py-0 px-0 my-0 mx-[110px]">420</h2>
                  <p className="text-base md:text-lg text-gray-400 font-black">Зайди и сравни с другими сервисами </p>
                </div>
              </div>
            </div>

            {/* Hero текст */}
            <div className="mb-8">
              <AnimatedHero />
            </div>

            <p
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Дистрибуция, продвижение и аналитика для артистов.
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold">
                {" "}
                Без скрытых комиссий
              </span>{" "}
              и сложных договоров.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 animate-fade-in px-4"
              style={{ animationDelay: "0.8s" }}
            >
              <Button
                onClick={() => navigate("/app")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 hover:shadow-2xl hover:shadow-yellow-500/50 text-black font-bold text-base md:text-lg px-8 md:px-10 py-5 md:py-7 border-0 group transition-all duration-500 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Начать бесплатно
                  <Icon
                    name="ArrowRight"
                    className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
              <Button
                size="lg"
                className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 text-white font-semibold text-base md:text-lg px-8 md:px-10 py-5 md:py-7 group transition-all duration-500 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Узнать больше
                  <Icon
                    name="PlayCircle"
                    className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform"
                  />
                </span>
              </Button>
            </div>

            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto animate-fade-in px-2"
              style={{ animationDelay: "1s" }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="relative group">
                  <div
                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    }}
                  />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-6 hover:border-white/20 transition-all duration-500 group-hover:scale-105">
                    <div
                      className={`text-3xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 md:mb-2`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon
            name="ChevronDown"
            className="w-8 h-8 text-yellow-500 opacity-50"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="услуги" className="relative py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-block mb-3 md:mb-4">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Наши услуги
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent px-4">
              Что мы предлагаем
            </h2>
            <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto px-4">
              Полный комплекс услуг для развития твоей музыкальной карьеры
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${service.gradient} rounded-2xl md:rounded-3xl blur-2xl opacity-0 group-hover:opacity-75 transition-all duration-700`}
                />
                <Card className="relative bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:scale-105 p-5 md:p-8 rounded-2xl md:rounded-3xl h-full">
                  <div
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <Icon
                      name={service.icon as any}
                      className="w-7 h-7 md:w-10 md:h-10 text-white"
                    />
                  </div>
                  <h3
                    className={`text-xl md:text-3xl font-black mb-3 md:mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                  >
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    {service.description}
                  </p>
                  <ul className="space-y-2 md:space-y-3">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 group-hover:text-gray-300 transition-colors"
                      >
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon
                            name="Check"
                            className="w-2.5 h-2.5 md:w-3 md:h-3 text-white"
                          />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section
        id="площадки"
        className="relative py-16 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-950/20 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-block mb-3 md:mb-4">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Интеграции
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 px-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Все площадки
              </span>
              <br />
              <span className="text-white">в одном месте</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
            {platforms.map((platform, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${platform.gradient} rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}
                />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl md:rounded-3xl p-5 md:p-8 transition-all duration-500 group-hover:scale-110 h-full flex flex-col items-center justify-center">
                  <div className="text-3xl md:text-5xl mb-2 md:mb-4 group-hover:scale-125 transition-transform duration-500">
                    {platform.logo}
                  </div>
                  <div className="text-[10px] md:text-xs font-bold text-center text-gray-400 group-hover:text-white transition-colors">
                    {platform.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-amber-600/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-8xl font-black mb-6 md:mb-8 leading-tight px-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Готов выпустить
              </span>
              <br />
              <span className="text-white">свою музыку?</span>
            </h2>
            <p className="text-base md:text-2xl text-gray-300 mb-8 md:mb-12 leading-relaxed px-4">
              Присоединяйся к{" "}
              <span className="font-bold text-yellow-400">420</span> и выведи
              свою карьеру на новый уровень
            </p>
            <Button
              onClick={() => navigate("/app")}
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 hover:shadow-2xl hover:shadow-yellow-500/50 text-black font-black text-base md:text-2xl px-8 md:px-16 py-5 md:py-8 border-0 group transition-all duration-500 rounded-xl md:rounded-2xl w-full md:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2 md:gap-3 justify-center">
                Начать сейчас
                <Icon
                  name="Rocket"
                  className="w-5 h-5 md:w-7 md:h-7 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="контакты"
        className="relative border-t border-white/10 py-8 md:py-16"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                <img
                  src="https://cdn.poehali.dev/files/89837016-5bd9-4196-8bef-fad51c37ba4e.jpg"
                  alt="420"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl"
                />
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  420
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                Независимый музыкальный лейбл полного цикла
              </p>
            </div>

            {[
              {
                title: "Услуги",
                items: ["Дистрибуция", "Продвижение", "Аналитика"],
              },
              { title: "Компания", items: ["О нас", "Блог", "Контакты"] },
              { title: "Поддержка", items: ["Помощь", "FAQ", "Документация"] },
            ].map((column, i) => (
              <div key={i} className="text-center md:text-left">
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.items.map((item, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-xs md:text-sm text-gray-500 hover:text-yellow-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
              © 2025 420. Все права защищены.
            </p>
            <div className="flex gap-3 md:gap-4">
              {["Mail", "Send", "Music"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-orange-600 border border-white/10 hover:border-transparent flex items-center justify-center transition-all duration-300 group"
                >
                  <Icon
                    name={icon as any}
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}