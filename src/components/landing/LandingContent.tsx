import { useEffect, useState } from "react";
import LandingBackgroundEffects from "./LandingBackgroundEffects";
import LandingStatsSection from "./LandingStatsSection";
import LandingFeaturesSection from "./LandingFeaturesSection";
import LandingBottomSections from "./LandingBottomSections";

export default function LandingContent() {
  const [scrollY, setScrollY] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
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

  const createSparkle = (e: React.MouseEvent) => {
    const newSparkle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setSparkles((prev) => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1500);
  };

  return (
    <>
      <LandingBackgroundEffects 
        scrollY={scrollY} 
        cursorPosition={cursorPosition} 
        sparkles={sparkles} 
      />
      
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
        createSparkle={createSparkle}
      />
    </>
  );
}
