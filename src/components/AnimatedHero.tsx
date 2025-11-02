export default function AnimatedHero() {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 1200 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24">
              <animate attributeName="stop-color" values="#fbbf24; #f59e0b; #fb923c; #fbbf24" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#f59e0b">
              <animate attributeName="stop-color" values="#f59e0b; #fb923c; #fbbf24; #f59e0b" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#fb923c">
              <animate attributeName="stop-color" values="#fb923c; #fbbf24; #f59e0b; #fb923c" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c">
              <animate attributeName="stop-color" values="#fb923c; #f59e0b; #fbbf24; #fb923c" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#fbbf24">
              <animate attributeName="stop-color" values="#fbbf24; #fb923c; #f59e0b; #fbbf24" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#f59e0b">
              <animate attributeName="stop-color" values="#f59e0b; #fbbf24; #fb923c; #f59e0b" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b">
              <animate attributeName="stop-color" values="#f59e0b; #fbbf24; #fb923c; #f59e0b" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#fb923c">
              <animate attributeName="stop-color" values="#fb923c; #f59e0b; #fbbf24; #fb923c" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#fbbf24">
              <animate attributeName="stop-color" values="#fbbf24; #fb923c; #f59e0b; #fbbf24" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#fb923c" floodOpacity="0.6"/>
          </filter>

          <pattern id="musicWaves" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
            <path d="M0,20 Q25,10 50,20 T100,20" fill="none" stroke="url(#goldGradient1)" strokeWidth="2" opacity="0.3">
              <animate attributeName="d" values="M0,20 Q25,10 50,20 T100,20; M0,20 Q25,30 50,20 T100,20; M0,20 Q25,10 50,20 T100,20" dur="2s" repeatCount="indefinite" />
            </path>
          </pattern>
        </defs>

        <text
          x="50%"
          y="80"
          textAnchor="middle"
          fontSize="90"
          fontWeight="900"
          fill="url(#goldGradient1)"
          filter="url(#glow)"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          Выпускай
          <animate attributeName="y" values="80; 75; 80" dur="2s" repeatCount="indefinite" />
        </text>

        <g opacity="0">
          <text
            x="50%"
            y="200"
            textAnchor="middle"
            fontSize="100"
            fontWeight="900"
            fill="url(#goldGradient2)"
            filter="url(#shadow)"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            музыку
          </text>
          <animate attributeName="opacity" values="0; 1" dur="0.6s" begin="0.3s" fill="freeze" />
          <animateTransform
            attributeName="transform"
            type="scale"
            from="0.8"
            to="1"
            dur="0.6s"
            begin="0.3s"
            additive="sum"
            fill="freeze"
          />
        </g>

        <g opacity="0">
          <text
            x="50%"
            y="300"
            textAnchor="middle"
            fontSize="72"
            fontWeight="900"
            fill="url(#goldGradient3)"
            filter="url(#glow)"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            на всех площадках
          </text>
          <animate attributeName="opacity" values="0; 1" dur="0.6s" begin="0.6s" fill="freeze" />
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 30"
            to="0 0"
            dur="0.6s"
            begin="0.6s"
            fill="freeze"
          />
        </g>

        <circle cx="200" cy="100" r="6" fill="#fbbf24" opacity="0.8">
          <animate attributeName="r" values="6; 10; 6" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8; 0.3; 0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>

        <circle cx="1000" cy="150" r="8" fill="#fb923c" opacity="0.6">
          <animate attributeName="r" values="8; 12; 8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6; 0.2; 0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        <circle cx="150" cy="280" r="5" fill="#f59e0b" opacity="0.7">
          <animate attributeName="r" values="5; 9; 5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7; 0.3; 0.7" dur="1.8s" repeatCount="indefinite" />
        </circle>

        <circle cx="1050" cy="280" r="7" fill="#fbbf24" opacity="0.5">
          <animate attributeName="r" values="7; 11; 7" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5; 0.2; 0.5" dur="2.2s" repeatCount="indefinite" />
        </circle>

        <path d="M100,350 Q200,330 300,350 T500,350" fill="none" stroke="url(#goldGradient1)" strokeWidth="2" opacity="0.4">
          <animate attributeName="d" values="M100,350 Q200,330 300,350 T500,350; M100,350 Q200,370 300,350 T500,350; M100,350 Q200,330 300,350 T500,350" dur="3s" repeatCount="indefinite" />
        </path>

        <path d="M700,350 Q800,330 900,350 T1100,350" fill="none" stroke="url(#goldGradient2)" strokeWidth="2" opacity="0.4">
          <animate attributeName="d" values="M700,350 Q800,330 900,350 T1100,350; M700,350 Q800,370 900,350 T1100,350; M700,350 Q800,330 900,350 T1100,350" dur="3s" repeatCount="indefinite" />
        </path>

        <g opacity="0.6">
          <path d="M400,120 L420,100 M420,120 L440,100" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="0.8s" repeatCount="indefinite" />
          </path>
        </g>

        <g opacity="0.6">
          <circle cx="850" cy="200" r="15" fill="none" stroke="#fb923c" strokeWidth="3">
            <animate attributeName="r" values="15; 20; 15" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6; 0.2; 0.6" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[15%] w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-32 right-[20%] w-40 h-40 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-[25%] w-36 h-36 bg-amber-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
      </div>
    </div>
  );
}
