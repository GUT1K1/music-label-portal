export default function AnimatedLogo() {
  return (
    <div className="relative">
      <div className="relative z-10 text-3xl font-black tracking-tight">
        <span className="inline-block animated-logo-text">420</span>
      </div>
      
      {/* Flame particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: '-5px',
              background: i % 3 === 0 
                ? '#f97316' 
                : i % 3 === 1 
                ? '#fb923c' 
                : '#fbbf24',
              animation: `flame-rise ${1 + Math.random() * 1.5}s ease-out infinite ${Math.random() * 0.5}s`,
              boxShadow: '0 0 4px currentColor'
            }}
          />
        ))}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-xl opacity-60"
        style={{
          background: 'linear-gradient(to top, rgba(251, 146, 60, 0.6), rgba(251, 191, 36, 0.3), transparent)',
          animation: 'flame-glow 2s ease-in-out infinite'
        }}
      />
      
      <style>{`
        @keyframes flame-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes flame-glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes text-flicker {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(251, 146, 60, 0.8),
              0 0 20px rgba(251, 146, 60, 0.6),
              0 0 30px rgba(251, 146, 60, 0.4);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(251, 191, 36, 1),
              0 0 30px rgba(251, 146, 60, 0.8),
              0 0 45px rgba(249, 115, 22, 0.6);
          }
        }
        
        .animated-logo-text {
          background: linear-gradient(to top, #f97316, #fbbf24, #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-flicker 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
