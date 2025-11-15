import { useEffect, useState, useRef, lazy, Suspense } from "react";
import LandingStyles from "@/components/landing/LandingStyles";
import LandingBackgroundEffects from "@/components/landing/LandingBackgroundEffects";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";

const LandingContent = lazy(() => import("@/components/landing/LandingContent"));

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
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
    const isMobile = window.innerWidth < 768;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: isMobile ? 0.05 : 0.1,
        rootMargin: isMobile ? "0px" : "0px 0px -50px 0px"
      }
    );

    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(".scroll-animate:not(.animate-in)");
      elements.forEach((el) => observerRef.current?.observe(el));
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <LandingStyles />
      <LandingBackgroundEffects />
      <LandingHeader isScrolled={isScrolled} />
      <LandingHero />
      <Suspense fallback={<div className="min-h-screen" />}>
        <LandingContent />
      </Suspense>
    </div>
  );
}