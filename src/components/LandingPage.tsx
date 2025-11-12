import { useEffect, useState, useRef, lazy, Suspense } from "react";
import LandingStyles from "@/components/landing/LandingStyles";
import LandingBackgroundEffects from "@/components/landing/LandingBackgroundEffects";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";

const LandingContent = lazy(() => import("@/components/landing/LandingContent"));

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fullText = "ТВОРИ СВОБОДНО";

  // Оптимизированный скролл с throttle через requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsTypingComplete(true);
  }, []);

  // Intersection Observer для анимаций при скролле - оптимизирован для мобильных
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            // Отключаем наблюдение после анимации для экономии ресурсов
            if (isMobile) {
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { 
        threshold: isMobile ? 0.05 : 0.1, // Меньший порог для мобильных
        rootMargin: isMobile ? "0px" : "0px 0px -100px 0px" // Упрощаем для мобильных
      }
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <LandingStyles />
      <LandingBackgroundEffects />
      <LandingHeader isScrolled={isScrolled} />
      <LandingHero 
        scrollY={scrollY}
        typedText={typedText}
        isTypingComplete={isTypingComplete}
      />
      <Suspense fallback={<div className="min-h-screen" />}>
        <LandingContent />
      </Suspense>
    </div>
  );
}