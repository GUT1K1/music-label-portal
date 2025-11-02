import { useState, useEffect, lazy, Suspense } from 'react';
import MatrixRain from '@/components/MatrixRain';

const LandingPage = lazy(() => import('@/components/LandingPage'));

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const loaded = sessionStorage.getItem('homePageLoaded');
      if (loaded) {
        setShowLoader(false);
        setHasLoaded(true);
      }
    } catch (err) {
      console.error('SessionStorage error:', err);
      setShowLoader(false);
      setHasLoaded(true);
    }
  }, []);

  const handleLoadComplete = () => {
    try {
      sessionStorage.setItem('homePageLoaded', 'true');
    } catch (err) {
      console.error('SessionStorage error:', err);
    }
    setShowLoader(false);
    setTimeout(() => setHasLoaded(true), 100);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Произошла ошибка</h1>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (showLoader && !hasLoaded) {
    return <MatrixRain onComplete={handleLoadComplete} duration={3500} />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    }>
      <LandingPage />
    </Suspense>
  );
}