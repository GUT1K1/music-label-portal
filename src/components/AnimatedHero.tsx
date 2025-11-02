export default function AnimatedHero() {
  return (
    <div className="relative py-24 px-4">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[1.5] text-center tracking-tight">
        <div className="block mb-4" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <span 
            className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl"
            style={{ paddingTop: '0.25rem', paddingBottom: '0.25rem' }}
          >
            Выпускай
          </span>
        </div>
        
        <div className="block mb-4" style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
          <span 
            className="inline-block bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl" 
            style={{ animationDelay: '0.3s', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
          >
            музыку
          </span>
        </div>
        
        <div className="block relative mb-16" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <span 
            className="inline-block bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl" 
            style={{ animationDelay: '0.6s', paddingTop: '0.25rem', paddingBottom: '0.25rem' }}
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
