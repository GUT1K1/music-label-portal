function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="sparkle"
      style={{
        left: x,
        top: y,
      }}
    />
  );
}

interface LandingBackgroundEffectsProps {
  scrollY: number;
  cursorPosition: { x: number; y: number };
  sparkles: Array<{ id: number; x: number; y: number }>;
}

export default function LandingBackgroundEffects({ 
  scrollY, 
  cursorPosition, 
  sparkles 
}: LandingBackgroundEffectsProps) {
  return (
    <>
      {/* Custom Cursor Glow */}
      <div 
        className="fixed w-32 h-32 rounded-full pointer-events-none z-50 transition-transform duration-200 ease-out"
        style={{
          left: cursorPosition.x - 64,
          top: cursorPosition.y - 64,
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      
      {/* Aurora Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-effect" />
      </div>
      
      {/* Spotlights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="spotlight" style={{ top: '-200px', left: '-50px', animationDelay: '0s' }} />
        <div className="spotlight" style={{ top: '-200px', right: '-50px', animationDelay: '2s' }} />
      </div>
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 animated-grid opacity-20 pointer-events-none" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
      
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
      ))}

      {/* Floating Colored Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${150 + Math.random() * 200}px`,
              height: `${150 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(251, 146, 60, 0.4), transparent)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent)'
                : 'radial-gradient(circle, rgba(245, 158, 11, 0.35), transparent)',
              animation: `float-orb ${10 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`,
              transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`
            }}
          />
        ))}
      </div>
      
      {/* Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? '2px' : '1px',
              height: i % 3 === 0 ? '2px' : '1px',
              background: i % 3 === 0 
                ? '#fb923c' 
                : i % 3 === 1 
                ? '#fbbf24' 
                : '#f97316',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 4}s infinite ${Math.random() * 3}s`,
              transform: `translateY(${scrollY * (0.05 + Math.random() * 0.1)}px)`,
              boxShadow: '0 0 4px currentColor'
            }}
          />
        ))}
      </div>
    </>
  );
}
