import { useEffect, useState, useRef } from "react";
import BurgerMenu from "@/components/BurgerMenu";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import PlatformsSection from "@/components/landing/PlatformsSection";
import BlogCarousel from "@/components/landing/BlogCarousel";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

export default function LandingPage() {
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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

      <BurgerMenu />
      <HeroSection scrollY={scrollY} heroRef={heroRef} />
      <ServicesSection services={services} />
      <PlatformsSection platforms={platforms} />
      <BlogCarousel />
      <CTASection />
      <FooterSection />
    </div>
  );
}