import { useEffect, useState } from "react";

export default function LandingBackgroundEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = window.scrollY / totalHeight;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const hue = 45 + scrollProgress * 15;

  return (
    <>
      {/* Базовый чистый черный фон */}
      <div 
        className="fixed inset-0 -z-30 pointer-events-none"
        style={{
          background: '#000000',
        }}
      />
      
      {/* Основной мягкий градиент сверху */}
      <div 
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 0%, 
            hsla(${hue}, 70%, 8%, 0.6) 0%, 
            hsla(${hue}, 60%, 5%, 0.4) 40%,
            transparent 70%
          )`,
          transition: 'background 1s ease-out',
        }}
      />
      
      {/* Тонкий нижний градиент */}
      <div 
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 50% 100%, 
            hsla(${hue + 10}, 65%, 6%, 0.4) 0%, 
            transparent 60%
          )`,
          transition: 'background 1s ease-out',
        }}
      />

      {/* Мягкие светящиеся сферы с большим blur */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Левая верхняя сфера */}
        <div 
          className="absolute rounded-full will-change-transform"
          style={{
            top: '5%',
            left: '-10%',
            width: '1000px',
            height: '1000px',
            background: `radial-gradient(circle, 
              hsla(${hue}, 100%, 50%, 0.12) 0%, 
              hsla(${hue}, 95%, 45%, 0.06) 30%,
              transparent 65%)`,
            filter: 'blur(140px)',
            transform: `translate(${scrollProgress * 80}px, ${scrollProgress * 120}px) scale(${1 + scrollProgress * 0.2})`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* Правая сфера */}
        <div 
          className="absolute rounded-full will-change-transform"
          style={{
            top: '25%',
            right: '-12%',
            width: '1100px',
            height: '1100px',
            background: `radial-gradient(circle, 
              hsla(${hue + 15}, 95%, 55%, 0.1) 0%, 
              hsla(${hue + 10}, 90%, 50%, 0.05) 30%,
              transparent 65%)`,
            filter: 'blur(150px)',
            transform: `translate(${-scrollProgress * 60}px, ${scrollProgress * 100}px) scale(${1 + scrollProgress * 0.25})`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        
        {/* Центральная нижняя сфера */}
        <div 
          className="absolute rounded-full will-change-transform"
          style={{
            bottom: '5%',
            left: '35%',
            width: '900px',
            height: '900px',
            background: `radial-gradient(circle, 
              hsla(30, 100%, 55%, 0.08) 0%, 
              hsla(35, 95%, 50%, 0.04) 30%,
              transparent 65%)`,
            filter: 'blur(130px)',
            transform: `translate(${scrollProgress * -50}px, ${-scrollProgress * 90}px) scale(${1 + scrollProgress * 0.2})`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Очень тонкий grain для текстуры (почти незаметный) */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
