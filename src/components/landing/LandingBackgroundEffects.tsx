import { useEffect, useState } from "react";

export default function LandingBackgroundEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hue1 = 45 + scrollProgress * 30;
  const hue2 = 25 + scrollProgress * 40;
  const hue3 = 280 - scrollProgress * 50;

  return (
    <>
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, 
            hsl(${hue1}, 70%, 8%) 0%, 
            hsl(0, 0%, 3%) 40%,
            hsl(${hue2}, 60%, 5%) 70%,
            hsl(0, 0%, 2%) 100%)`
        }}
      />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full transition-all duration-[2000ms]"
          style={{
            top: '10%',
            left: '-15%',
            background: `radial-gradient(circle, 
              hsla(${hue1}, 95%, 50%, ${0.20 + scrollProgress * 0.1}) 0%, 
              hsla(${hue1}, 90%, 45%, ${0.12 + scrollProgress * 0.05}) 40%, 
              transparent 70%)`,
            filter: 'blur(140px)',
            animation: 'float-gentle 35s ease-in-out infinite',
            transform: `scale(${1 + scrollProgress * 0.3})`
          }}
        />
        
        <div 
          className="absolute w-[1100px] h-[1100px] rounded-full transition-all duration-[2000ms]"
          style={{
            top: '40%',
            right: '-10%',
            background: `radial-gradient(circle, 
              hsla(${hue2}, 100%, 55%, ${0.18 + scrollProgress * 0.08}) 0%, 
              hsla(${hue2}, 95%, 50%, ${0.10 + scrollProgress * 0.04}) 40%, 
              transparent 70%)`,
            filter: 'blur(150px)',
            animation: 'float-gentle 40s ease-in-out infinite 10s',
            transform: `scale(${1 + scrollProgress * 0.4})`
          }}
        />
        
        <div 
          className="absolute w-[900px] h-[900px] rounded-full transition-all duration-[2000ms]"
          style={{
            bottom: '5%',
            left: '30%',
            background: `radial-gradient(circle, 
              hsla(${hue3}, 80%, 60%, ${0.15 + scrollProgress * 0.1}) 0%, 
              hsla(${hue3}, 75%, 55%, ${0.08 + scrollProgress * 0.05}) 40%, 
              transparent 70%)`,
            filter: 'blur(130px)',
            animation: 'float-gentle 45s ease-in-out infinite 20s',
            transform: `scale(${1 + scrollProgress * 0.35})`
          }}
        />
        
        <div 
          className="absolute w-[800px] h-[800px] rounded-full transition-all duration-[2000ms]"
          style={{
            top: '20%',
            right: '20%',
            background: `radial-gradient(circle, 
              hsla(340, 90%, 60%, ${0.12 + scrollProgress * 0.08}) 0%, 
              hsla(330, 85%, 55%, ${0.06 + scrollProgress * 0.04}) 40%, 
              transparent 70%)`,
            filter: 'blur(120px)',
            animation: 'float-gentle 38s ease-in-out infinite 15s',
            transform: `scale(${1 + scrollProgress * 0.25})`
          }}
        />
        
        <div 
          className="absolute w-[1200px] h-[1200px] rounded-full transition-all duration-[2000ms]"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.5})`,
            background: `radial-gradient(circle, 
              hsla(${hue1}, 100%, 55%, ${0.10 + scrollProgress * 0.12}) 0%, 
              transparent 60%)`,
            filter: 'blur(160px)',
            animation: 'pulse-gentle 25s ease-in-out infinite'
          }}
        />

        <div 
          className="absolute w-[600px] h-[600px] rounded-full transition-all duration-[2000ms]"
          style={{
            top: `${60 + scrollProgress * 20}%`,
            left: `${10 + scrollProgress * 15}%`,
            background: `radial-gradient(circle, 
              hsla(190, 80%, 50%, ${0.10 + scrollProgress * 0.08}) 0%, 
              transparent 70%)`,
            filter: 'blur(100px)',
            animation: 'float-gentle 50s ease-in-out infinite 25s'
          }}
        />
      </div>
      
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, 
              hsla(${hue1}, 100%, 55%, ${0.08 + scrollProgress * 0.05}), 
              transparent 70%)`,
          }}
        />
      </div>

      
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}