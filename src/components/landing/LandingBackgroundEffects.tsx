interface LandingBackgroundEffectsProps {
  scrollY: number;
}

export default function LandingBackgroundEffects({ scrollY }: LandingBackgroundEffectsProps) {
  return (
    <>
      {/* Base Gradient - Rich and Deep */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/20 via-transparent to-amber-950/10" />
      </div>
      
      {/* Large Smooth Gradient Clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute rounded-full"
          style={{
            width: '1200px',
            height: '1200px',
            top: '-20%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0.08) 40%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'gentle-drift 40s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: '1000px',
            height: '1000px',
            top: '30%',
            right: '-15%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 40%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'gentle-drift 50s ease-in-out infinite 10s'
          }}
        />
        <div 
          className="absolute rounded-full"
          style={{
            width: '1100px',
            height: '1100px',
            bottom: '-10%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.13) 0%, rgba(251, 191, 36, 0.07) 40%, transparent 70%)',
            filter: 'blur(95px)',
            animation: 'gentle-drift 45s ease-in-out infinite 20s'
          }}
        />
      </div>
      
      {/* Soft Glow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(251, 146, 60, 0.08), transparent 60%)',
            animation: 'soft-pulse 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 70% 60%, rgba(245, 158, 11, 0.06), transparent 50%)',
            animation: 'soft-pulse 25s ease-in-out infinite 8s'
          }}
        />
      </div>
      
      {/* Ambient Particles - Minimal */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '2px',
              height: '2px',
              background: i % 2 === 0 ? 'rgba(251, 146, 60, 0.5)' : 'rgba(251, 191, 36, 0.4)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `slow-twinkle ${8 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 8}s`,
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
      </div>
    </>
  );
}