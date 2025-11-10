export default function LandingBackgroundEffects() {
  return (
    <>
      {/* Base black background */}
      <div className="fixed inset-0 bg-black pointer-events-none" />
      
      {/* Subtle animated golden glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            top: '10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, transparent 70%)',
            filter: 'blur(120px)',
            animation: 'float-slow 30s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            bottom: '20%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(202, 138, 4, 0.25) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'float-slow 40s ease-in-out infinite 10s'
          }}
        />
      </div>
      
      {/* Minimal particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle-slow ${10 + Math.random() * 15}s ease-in-out infinite ${Math.random() * 10}s`,
              boxShadow: '0 0 8px rgba(234, 179, 8, 0.8)'
            }}
          />
        ))}
      </div>
    </>
  );
}
