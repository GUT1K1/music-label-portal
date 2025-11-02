export default function AnimatedHero() {
  return (
    <div className="relative py-12">
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-[1.1] text-center">
        <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent animate-gradient-x mb-3">
          Выпускай
        </div>
        <br />
        <div className="inline-block bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent animate-gradient-x mb-3" style={{ animationDelay: '0.3s' }}>
          музыку
        </div>
        <br />
        <div className="relative inline-block">
          <span className="bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent animate-gradient-x" style={{ animationDelay: '0.6s' }}>
            на всех площадках
          </span>
          <svg 
            className="absolute -bottom-3 left-0 w-full" 
            height="12" 
            viewBox="0 0 800 12" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0,6 Q200,2 400,6 T800,6" 
              fill="none" 
              stroke="url(#underlineGradient)" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </h1>
      
      <div className="absolute -z-10 inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
      </div>
    </div>
  );
}