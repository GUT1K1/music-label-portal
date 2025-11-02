export default function MusicWaves() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#fb923c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
          </linearGradient>

          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          d="M-100,100 Q50,50 200,100 T500,100 T800,100 T1100,100 T1400,100"
          fill="none"
          stroke="url(#waveGradient1)"
          strokeWidth="3"
          filter="url(#waveGlow)"
        >
          <animate
            attributeName="d"
            values="M-100,100 Q50,50 200,100 T500,100 T800,100 T1100,100 T1400,100;
                    M-100,100 Q50,150 200,100 T500,100 T800,100 T1100,100 T1400,100;
                    M-100,100 Q50,50 200,100 T500,100 T800,100 T1100,100 T1400,100"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M-100,200 Q50,150 200,200 T500,200 T800,200 T1100,200 T1400,200"
          fill="none"
          stroke="url(#waveGradient2)"
          strokeWidth="2"
          filter="url(#waveGlow)"
          opacity="0.7"
        >
          <animate
            attributeName="d"
            values="M-100,200 Q50,150 200,200 T500,200 T800,200 T1100,200 T1400,200;
                    M-100,200 Q50,250 200,200 T500,200 T800,200 T1100,200 T1400,200;
                    M-100,200 Q50,150 200,200 T500,200 T800,200 T1100,200 T1400,200"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M-100,300 Q50,250 200,300 T500,300 T800,300 T1100,300 T1400,300"
          fill="none"
          stroke="url(#waveGradient1)"
          strokeWidth="2"
          filter="url(#waveGlow)"
          opacity="0.5"
        >
          <animate
            attributeName="d"
            values="M-100,300 Q50,250 200,300 T500,300 T800,300 T1100,300 T1400,300;
                    M-100,300 Q50,350 200,300 T500,300 T800,300 T1100,300 T1400,300;
                    M-100,300 Q50,250 200,300 T500,300 T800,300 T1100,300 T1400,300"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        {[...Array(12)].map((_, i) => (
          <g key={i}>
            <line
              x1={100 + i * 120}
              y1="450"
              x2={100 + i * 120}
              y2="480"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            >
              <animate
                attributeName="y1"
                values="450; 420; 450"
                dur={`${1 + (i % 3) * 0.3}s`}
                repeatCount="indefinite"
                begin={`${i * 0.1}s`}
              />
            </line>
          </g>
        ))}

        {[...Array(8)].map((_, i) => (
          <circle
            key={`particle-${i}`}
            cx={150 + i * 180}
            cy={550 + Math.sin(i) * 50}
            r="3"
            fill="#fb923c"
            opacity="0.5"
          >
            <animate
              attributeName="cy"
              values={`${550 + Math.sin(i) * 50}; ${520 + Math.sin(i) * 50}; ${550 + Math.sin(i) * 50}`}
              dur={`${2 + (i % 3) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.2}s`}
            />
            <animate
              attributeName="opacity"
              values="0.5; 0.8; 0.5"
              dur={`${2 + (i % 3) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.2}s`}
            />
          </circle>
        ))}

        <g opacity="0.3">
          {[...Array(5)].map((_, i) => (
            <rect
              key={`bar-${i}`}
              x={50 + i * 60}
              y={650}
              width="40"
              height="100"
              fill="url(#waveGradient1)"
              rx="5"
            >
              <animate
                attributeName="height"
                values={`${60 + i * 10}; ${120 + i * 15}; ${60 + i * 10}`}
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values={`${690 - i * 10}; ${630 - i * 15}; ${690 - i * 10}`}
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </g>

        <g transform="translate(1100, 650)" opacity="0.3">
          {[...Array(5)].map((_, i) => (
            <rect
              key={`bar2-${i}`}
              x={i * 60}
              y="0"
              width="40"
              height="100"
              fill="url(#waveGradient2)"
              rx="5"
            >
              <animate
                attributeName="height"
                values={`${80 - i * 10}; ${140 - i * 15}; ${80 - i * 10}`}
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * 0.1}s`}
              />
              <animate
                attributeName="y"
                values={`${40 + i * 10}; ${-20 + i * 15}; ${40 + i * 10}`}
                dur={`${1.5 + i * 0.2}s`}
                repeatCount="indefinite"
                begin={`${i * 0.1}s`}
              />
            </rect>
          ))}
        </g>
      </svg>
    </div>
  );
}
