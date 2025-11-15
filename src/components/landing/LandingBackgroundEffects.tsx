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
    if (isMobile) {
      setScrollProgress(0);
      return;
    }
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(window.scrollY / totalHeight, 1);
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

      {/* Мягкие светящиеся сферы - упрощенные для мобильных */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Левая верхняя сфера */}
        <div 
          className="absolute rounded-full"
          style={{
            top: '5%',
            left: '-10%',
            width: isMobile ? '400px' : '1000px',
            height: isMobile ? '400px' : '1000px',
            background: `radial-gradient(circle, 
              hsla(${hue}, 100%, 50%, ${isMobile ? 0.08 : 0.12}) 0%, 
              hsla(${hue}, 95%, 45%, ${isMobile ? 0.04 : 0.06}) 30%,
              transparent 65%)`,
            filter: isMobile ? 'blur(60px)' : 'blur(140px)',
            transform: isMobile ? 'none' : `translate(${scrollProgress * 80}px, ${scrollProgress * 120}px) scale(${1 + scrollProgress * 0.2})`,
            transition: isMobile ? 'none' : 'transform 0.3s ease-out',
          }}
        />
        
        {/* Правая сфера */}
        <div 
          className="absolute rounded-full"
          style={{
            top: '25%',
            right: '-12%',
            width: isMobile ? '350px' : '1100px',
            height: isMobile ? '350px' : '1100px',
            background: `radial-gradient(circle, 
              hsla(${hue + 15}, 95%, 55%, ${isMobile ? 0.06 : 0.1}) 0%, 
              hsla(${hue + 10}, 90%, 50%, ${isMobile ? 0.03 : 0.05}) 30%,
              transparent 65%)`,
            filter: isMobile ? 'blur(60px)' : 'blur(150px)',
            transform: isMobile ? 'none' : `translate(${-scrollProgress * 60}px, ${scrollProgress * 100}px) scale(${1 + scrollProgress * 0.25})`,
            transition: isMobile ? 'none' : 'transform 0.3s ease-out',
          }}
        />
        
        {/* Центральная нижняя сфера */}
        <div 
          className="absolute rounded-full"
          style={{
            bottom: '5%',
            left: '35%',
            width: isMobile ? '300px' : '900px',
            height: isMobile ? '300px' : '900px',
            background: `radial-gradient(circle, 
              hsla(30, 100%, 55%, ${isMobile ? 0.05 : 0.08}) 0%, 
              hsla(35, 95%, 50%, ${isMobile ? 0.025 : 0.04}) 30%,
              transparent 65%)`,
            filter: isMobile ? 'blur(50px)' : 'blur(130px)',
            transform: isMobile ? 'none' : `translate(${scrollProgress * -50}px, ${-scrollProgress * 90}px) scale(${1 + scrollProgress * 0.2})`,
            transition: isMobile ? 'none' : 'transform 0.3s ease-out',
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