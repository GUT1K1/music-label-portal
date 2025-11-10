import { useEffect, useRef, useState } from "react";

interface LandingStatsSectionProps {
  scrollY: number;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingStatsSection({ 
  scrollY, 
  handleMouseMove, 
  handleMouseLeave 
}: LandingStatsSectionProps) {
  const [counts, setCounts] = useState({ stat0: 0, stat1: 0, stat2: 0 });
  const [isVisible, setIsVisible] = useState({ stat0: false, stat1: false, stat2: false });
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { value: 90, suffix: "%", label: "Музыкантов достигают топ-100 в первый месяц" },
    { value: 24, suffix: "ч", label: "Средняя скорость модерации релизов" },
    { value: 50, suffix: "+", label: "Платформ для распространения музыки" },
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10" ref={statsRef}>
        <div className="text-center mb-16 scroll-animate">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Откуда мы знаем, что работаем хорошо?
          </h2>
          <p className="text-gray-300 text-lg font-light">
            Результаты наших артистов говорят сами за себя
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              data-index={i}
              className="stat-card scroll-animate group p-8 neomorphism glassmorphism rounded-3xl glow-border transition-all duration-500 card-3d wave-enter color-shift"
              style={{ 
                transitionDelay: `${i * 100}ms`,
                animationDelay: `${i * 150}ms`
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="text-6xl font-bold text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                {counts[`stat${i}` as keyof typeof counts]}{stat.suffix}
              </div>
              <p className="text-gray-200 text-lg leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}