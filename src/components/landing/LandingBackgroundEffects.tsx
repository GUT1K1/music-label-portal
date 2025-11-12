import { useEffect, useState } from "react";

export default function LandingBackgroundEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Отключаем скролл-эффекты на мобильных
    
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
  }, [isMobile]);

  const hue = 280 + scrollProgress * 60;

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

      {/* Яркие цветные сферы */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Фиолетовая сфера */}
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            top: '10%',
            left: '-10%',
            width: isMobile ? '500px' : '1200px',
            height: isMobile ? '500px' : '1200px',
            background: `radial-gradient(circle, 
              rgba(168, 85, 247, ${isMobile ? 0.15 : 0.25}) 0%, 
              rgba(147, 51, 234, ${isMobile ? 0.08 : 0.15}) 30%,
              transparent 70%)`,
            filter: isMobile ? 'blur(80px)' : 'blur(150px)',
            transform: isMobile ? 'none' : `translate(${scrollProgress * 80}px, ${scrollProgress * 120}px) scale(${1 + scrollProgress * 0.3})`,
            transition: isMobile ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDuration: '4s'
          }}
        />
        
        {/* Розовая сфера */}
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            top: '30%',
            right: '-15%',
            width: isMobile ? '450px' : '1300px',
            height: isMobile ? '450px' : '1300px',
            background: `radial-gradient(circle, 
              rgba(236, 72, 153, ${isMobile ? 0.12 : 0.2}) 0%, 
              rgba(219, 39, 119, ${isMobile ? 0.06 : 0.12}) 30%,
              transparent 70%)`,
            filter: isMobile ? 'blur(80px)' : 'blur(160px)',
            transform: isMobile ? 'none' : `translate(${-scrollProgress * 60}px, ${scrollProgress * 100}px) scale(${1 + scrollProgress * 0.3})`,
            transition: isMobile ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDuration: '5s',
            animationDelay: '1s'
          }}
        />
        
        {/* Голубая сфера */}
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            bottom: '10%',
            left: '30%',
            width: isMobile ? '400px' : '1000px',
            height: isMobile ? '400px' : '1000px',
            background: `radial-gradient(circle, 
              rgba(6, 182, 212, ${isMobile ? 0.1 : 0.18}) 0%, 
              rgba(8, 145, 178, ${isMobile ? 0.05 : 0.1}) 30%,
              transparent 70%)`,
            filter: isMobile ? 'blur(70px)' : 'blur(140px)',
            transform: isMobile ? 'none' : `translate(${scrollProgress * -50}px, ${-scrollProgress * 90}px) scale(${1 + scrollProgress * 0.25})`,
            transition: isMobile ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDuration: '6s',
            animationDelay: '2s'
          }}
        />
        
        {/* Оранжевая сфера */}
        <div 
          className="absolute rounded-full animate-pulse"
          style={{
            top: '50%',
            right: '20%',
            width: isMobile ? '350px' : '900px',
            height: isMobile ? '350px' : '900px',
            background: `radial-gradient(circle, 
              rgba(251, 146, 60, ${isMobile ? 0.08 : 0.15}) 0%, 
              rgba(249, 115, 22, ${isMobile ? 0.04 : 0.08}) 30%,
              transparent 70%)`,
            filter: isMobile ? 'blur(60px)' : 'blur(130px)',
            transform: isMobile ? 'none' : `translate(${scrollProgress * 40}px, ${-scrollProgress * 70}px)`,
            transition: isMobile ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            animationDuration: '5.5s',
            animationDelay: '0.5s'
          }}
        />
      </div>

      {/* Grain текстура - отключена на мобильных */}
      {!isMobile && (
        <div 
          className="fixed inset-0 -z-10 pointer-events-none mix-blend-overlay"
          style={{
            opacity: 0.015,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </>
  );
}