import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import MatrixRain from '@/components/MatrixRain';

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const loaded = sessionStorage.getItem('homePageLoaded');
    if (loaded) {
      setShowLoader(false);
      setHasLoaded(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem('homePageLoaded', 'true');
    setShowLoader(false);
    setTimeout(() => setHasLoaded(true), 100);
  };

  if (showLoader && !hasLoaded) {
    return <MatrixRain onComplete={handleLoadComplete} duration={3500} />;
  }

  return <LandingPage />;
}
