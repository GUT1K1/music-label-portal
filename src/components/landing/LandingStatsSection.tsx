import { useEffect, useRef, useState } from "react";

interface LandingStatsSectionProps {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingStatsSection({ 
  handleMouseMove, 
  handleMouseLeave 
}: LandingStatsSectionProps) {
  const [counts, setCounts] = useState({ stat0: 0, stat1: 0, stat2: 0 });
  const [isVisible, setIsVisible] = useState({ stat0: false, stat1: false, stat2: false });
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { value: 50, suffix: "+", label: "Музыкальных площадок по всему миру", highlight: "Spotify, Apple Music, Яндекс" },
    { value: 100, suffix: "%", label: "Ты сохраняешь все права на музыку", highlight: "Полный контроль" },
    { value: 0, suffix: "₽", label: "За выпуск релиза — без скрытых плат", highlight: "Бесплатный старт" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setIsVisible((prev) => ({ ...prev, [`stat${index}`]: true }));
          }
        });
      },
      { threshold: 0.5 }
    );

    const statElements = document.querySelectorAll(".stat-card");
    statElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    stats.forEach((stat, index) => {
      if (isVisible[`stat${index}` as keyof typeof isVisible]) {
        const duration = 2000;
        const steps = 60;
        const increment = stat.value / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            setCounts((prev) => ({ ...prev, [`stat${index}`]: stat.value }));
            clearInterval(timer);
          } else {
            setCounts((prev) => ({ ...prev, [`stat${index}`]: Math.floor(current) }));
          }
        }, duration / steps);

        return () => clearInterval(timer);
      }
    });
  }, [isVisible]);

  return (
    <section className="py-32 px-6 lg:px-12 relative">
      <div className="max-w-7xl mx-auto" ref={statsRef}>
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent">
              Почему 420 Music?
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Простые условия, честные выплаты, полный контроль
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              data-index={i}
              className="stat-card group p-8 bg-gradient-to-b from-gray-900/50 to-black/50 border border-gold-500/10 rounded-2xl hover:border-gold-500/30 transition-all duration-300"
            >
              <div className="text-6xl font-bold text-gold-400 mb-4">
                {counts[`stat${i}` as keyof typeof counts]}{stat.suffix}
              </div>
              <p className="text-sm text-gold-400/80 mb-2 font-semibold">
                {stat.highlight}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
