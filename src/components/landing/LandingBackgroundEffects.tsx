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

  const hue1 = 45 + scrollProgress * 20;
  const hue2 = 30 + scrollProgress * 25;

  return (
    <>
      <div 
        className="fixed inset-0 -z-20 pointer-events-none transition-all duration-1000"
        style={{
          background: `
            radial-gradient(ellipse 150% 100% at 50% 0%, 
              hsla(${hue1}, 85%, 12%, 0.4) 0%, 
              transparent 60%
            ),
            radial-gradient(ellipse 120% 80% at 20% 100%, 
              hsla(${hue2}, 80%, 10%, 0.3) 0%, 
              transparent 50%
            ),
            radial-gradient(ellipse 120% 80% at 80% 100%, 
              hsla(25, 85%, 10%, 0.3) 0%, 
              transparent 50%
            ),
            linear-gradient(180deg, 
              hsl(0, 0%, 2%) 0%, 
              hsl(0, 0%, 1%) 50%,
              hsl(0, 0%, 2%) 100%
            )
          `,
        }}
      />
      
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            top: '5%',
            left: '-10%',
            background: `radial-gradient(circle, 
              hsla(${hue1}, 100%, 50%, 0.25) 0%, 
              transparent 70%)`,
            filter: 'blur(100px)',
            transform: `translate(${scrollProgress * 100}px, ${scrollProgress * 150}px) scale(${1 + scrollProgress * 0.3})`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        <div 
          className="absolute w-[900px] h-[900px] rounded-full opacity-25"
          style={{
            top: '30%',
            right: '-15%',
            background: `radial-gradient(circle, 
              hsla(${hue2}, 95%, 55%, 0.3) 0%, 
              transparent 70%)`,
            filter: 'blur(120px)',
            transform: `translate(${-scrollProgress * 80}px, ${scrollProgress * 100}px) scale(${1 + scrollProgress * 0.4})`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        <div 
          className="absolute w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            bottom: '10%',
            left: '40%',
            background: `radial-gradient(circle, 
              hsla(20, 100%, 60%, 0.25) 0%, 
              transparent 70%)`,
            filter: 'blur(90px)',
            transform: `translate(${scrollProgress * -60}px, ${-scrollProgress * 120}px) scale(${1 + scrollProgress * 0.35})`,
            transition: 'transform 0.3s ease-out',
          }}
        />

        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            top: '60%',
            left: '10%',
            background: `radial-gradient(circle, 
              hsla(35, 95%, 50%, 0.2) 0%, 
              transparent 70%)`,
            filter: 'blur(80px)',
            transform: `translate(${scrollProgress * 50}px, ${-scrollProgress * 80}px) rotate(${scrollProgress * 30}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>
      
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 50% ${40 + scrollProgress * 20}%, 
            hsla(${hue1}, 100%, 50%, ${0.08 + scrollProgress * 0.06}), 
            transparent 70%)`,
          transition: 'background 0.5s ease-out',
        }}
      />

      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
