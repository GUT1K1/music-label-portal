interface LandingBackgroundEffectsProps {
  scrollY: number;
}

export default function LandingBackgroundEffects({ scrollY }: LandingBackgroundEffectsProps) {
  return (
    <>
      {/* Deep Space Gradient Base */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black pointer-events-none" />
      
      {/* Flowing Wave Lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div 
          className="absolute w-full h-[2px]"
          style={{
            top: '20%',
            background: 'linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.6), transparent)',
            animation: 'wave-flow 8s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(251, 146, 60, 0.8)'
          }}
        />
        <div 
          className="absolute w-full h-[2px]"
          style={{
            top: '45%',
            background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent)',
            animation: 'wave-flow 10s ease-in-out infinite 2s',
            boxShadow: '0 0 15px rgba(251, 191, 36, 0.6)'
          }}
        />
        <div 
          className="absolute w-full h-[2px]"
          style={{
            top: '70%',
            background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.6), transparent)',
            animation: 'wave-flow 12s ease-in-out infinite 4s',
            boxShadow: '0 0 18px rgba(245, 158, 11, 0.7)'
          }}
        />
      </div>
      
      {/* Pulsating Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div 
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            top: '0%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0.2) 30%, transparent 60%)',
            filter: 'blur(80px)',
            animation: 'pulse-glow 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            top: '40%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(245, 158, 11, 0.18) 30%, transparent 60%)',
            filter: 'blur(70px)',
            animation: 'pulse-glow 10s ease-in-out infinite 3s'
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.15) 30%, transparent 60%)',
            filter: 'blur(90px)',
            animation: 'pulse-glow 12s ease-in-out infinite 6s'
          }}
        />
      </div>
      
      {/* Diagonal Light Rays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-15">
        <div 
          className="absolute w-[300px] h-full origin-top"
          style={{
            left: '20%',
            background: 'linear-gradient(to bottom, rgba(251, 146, 60, 0.3), transparent)',
            filter: 'blur(50px)',
            transform: 'rotate(15deg)',
            animation: 'light-ray 15s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[250px] h-full origin-top"
          style={{
            right: '25%',
            background: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.25), transparent)',
            filter: 'blur(45px)',
            transform: 'rotate(-20deg)',
            animation: 'light-ray 18s ease-in-out infinite 5s'
          }}
        />
      </div>
      
      {/* Soft Energy Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 5 === 0 ? '4px' : '2px',
              height: i % 5 === 0 ? '4px' : '2px',
              background: i % 3 === 0 
                ? 'rgba(251, 146, 60, 0.7)' 
                : i % 3 === 1 
                ? 'rgba(251, 191, 36, 0.6)' 
                : 'rgba(245, 158, 11, 0.6)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `energy-float ${5 + Math.random() * 8}s ease-in-out infinite ${Math.random() * 5}s`,
              boxShadow: '0 0 12px currentColor',
              opacity: 0.5 + Math.random() * 0.5
            }}
          />
        ))}
      </div>
      
      {/* Subtle Animated Grid */}
      <div className="fixed inset-0 animated-grid opacity-5 pointer-events-none" />
    </>
  );
}