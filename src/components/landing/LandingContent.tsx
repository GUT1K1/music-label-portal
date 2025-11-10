import { useEffect, useState } from "react";
import LandingBackgroundEffects from "./LandingBackgroundEffects";
import LandingStatsSection from "./LandingStatsSection";
import LandingFeaturesSection from "./LandingFeaturesSection";
import LandingBottomSections from "./LandingBottomSections";

export default function LandingContent() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  };



  return (
    <>
      <LandingBackgroundEffects scrollY={scrollY} />
      
      <LandingStatsSection 
        scrollY={scrollY} 
        handleMouseMove={handleMouseMove} 
        handleMouseLeave={handleMouseLeave} 
      />
      
      <LandingFeaturesSection 
        scrollY={scrollY} 
        handleMouseMove={handleMouseMove} 
        handleMouseLeave={handleMouseLeave} 
      />
      
      <LandingBottomSections 
        scrollY={scrollY} 
        handleMouseMove={handleMouseMove} 
        handleMouseLeave={handleMouseLeave}
      />
    </>
  );
}