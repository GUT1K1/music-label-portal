interface LandingBackgroundEffectsProps {
  scrollY: number;
}

export default function LandingBackgroundEffects({ scrollY }: LandingBackgroundEffectsProps) {
  return (
    <>
      {/* Smooth Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 pointer-events-none" />
      
      {/* Aurora Effect - Smooth and Continuous */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{
            top: '10%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3), rgba(251, 191, 36, 0.2), transparent)',
            animation: 'float-orb 25s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            top: '50%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25), rgba(251, 146, 60, 0.15), transparent)',
            animation: 'float-orb 30s ease-in-out infinite 5s'
          }}
        />
        <div 
          className="absolute w-[700px] h-[700px] rounded-full blur-[110px]"
          style={{
            bottom: '15%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.15), transparent)',
            animation: 'float-orb 35s ease-in-out infinite 10s'
          }}
        />
      </div>
      
      {/* Animated Grid - Subtle */}
      <div className="fixed inset-0 animated-grid opacity-10 pointer-events-none" />
      
      {/* Soft Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 4 === 0 ? '3px' : '2px',
              height: i % 4 === 0 ? '3px' : '2px',
              background: i % 3 === 0 
                ? 'rgba(251, 146, 60, 0.6)' 
                : i % 3 === 1 
                ? 'rgba(251, 191, 36, 0.5)' 
                : 'rgba(245, 158, 11, 0.5)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${4 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 4}s`,
              boxShadow: '0 0 8px currentColor'
            }}
          />
        ))}
      </div>
      
      {/* Smooth Gradient Overlay Waves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(251, 146, 60, 0.15) 60%, transparent 80%)',
            animation: 'wave 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-full h-full"
          style={{
            background: 'linear-gradient(225deg, transparent 30%, rgba(245, 158, 11, 0.1) 50%, transparent 70%)',
            animation: 'wave 25s ease-in-out infinite 5s'
          }}
        />
      </div>
    </>
  );
}
