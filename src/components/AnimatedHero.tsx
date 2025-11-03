export default function AnimatedHero() {
  return (
    <div className="relative px-0.5 rounded-0 py-0" style={{ perspective: '1000px' }}>
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[1.5] text-center tracking-tight" style={{ transformStyle: 'preserve-3d' }}>
        <div className="block mb-2">
          <span 
            className="inline-block bg-gradient-to-r from-red-600 via-orange-500 via-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent animate-magma font-black"
            style={{ 
              paddingBottom: '1.5rem',
              transform: 'rotateX(5deg) translateZ(20px)',
              display: 'inline-block'
            }}
          >
            Выпускай
          </span>
        </div>
        
        <div className="block mb-2">
          <span 
            className="inline-block bg-gradient-to-r from-red-600 via-orange-500 via-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent animate-magma font-black" 
            style={{ 
              animationDelay: '0.3s', 
              paddingBottom: '1.5rem',
              transform: 'rotateX(5deg) translateZ(30px)',
              display: 'inline-block'
            }}
          >
            музыку
          </span>
        </div>
        
        <div className="block relative mb-16">
          <span 
            className="inline-block bg-gradient-to-r from-red-600 via-orange-500 via-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent animate-magma font-black" 
            style={{ 
              animationDelay: '0.6s', 
              paddingBottom: '1.5rem',
              transform: 'rotateX(5deg) translateZ(25px)',
              display: 'inline-block'
            }}
          >
            на всех площадках
          </span>
          <svg 
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-[800px]" 
            height="16" 
            viewBox="0 0 800 16" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ bottom: '-1.5rem' }}
          >
            <path 
              d="M0,8 Q200,4 400,8 T800,8" 
              fill="none" 
              stroke="url(#underlineGradient)" 
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </h1>
      
      <div className="absolute -z-10 inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>
    </div>
  );
}