import { useState, useEffect } from "react";
import LandingBackgroundEffects from "./LandingBackgroundEffects";
import LandingFeaturesSection from "./LandingFeaturesSection";
import WhySection from "./WhySection";
import LandingBottomSections from "./LandingBottomSections";

export default function LandingContent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Отключаем 3D эффекты на мобильных для производительности
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Пропускаем на мобильных
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Пропускаем на мобильных
    
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <>
      <LandingBackgroundEffects />
      
      <LandingFeaturesSection 
        handleMouseMove={handleMouseMove} 
        handleMouseLeave={handleMouseLeave} 
      />
      
      <WhySection />
      
      <LandingBottomSections 
        handleMouseMove={handleMouseMove} 
        handleMouseLeave={handleMouseLeave}
      />
    </>
  );
}
