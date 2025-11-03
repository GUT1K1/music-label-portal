import { useEffect, useRef } from 'react';

export default function Animated420Logo() {
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const pathRef3 = useRef<SVGPathElement>(null);

  useEffect(() => {
    const paths = [pathRef1.current, pathRef2.current, pathRef3.current];
    paths.forEach((path, index) => {
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.animation = `drawPath 1.5s ease-in-out ${index * 0.15}s forwards, glowPulse 4s ease-in-out ${1.5 + index * 0.15}s infinite`;
      }
    });
  }, []);

  return (
    <div className="relative inline-block">
      <style>
        {`
          @keyframes drawPath {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes glowPulse {
            0%, 100% {
              filter: drop-shadow(0 0 12px rgba(251, 146, 60, 0.9)) drop-shadow(0 0 24px rgba(251, 146, 60, 0.5));
            }
            50% {
              filter: drop-shadow(0 0 20px rgba(251, 146, 60, 1)) drop-shadow(0 0 40px rgba(234, 179, 8, 0.8)) drop-shadow(0 0 60px rgba(234, 179, 8, 0.4));
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-8px) scale(1.02); }
          }
        `}
      </style>
      
      {/* Светящийся фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-amber-600/20 blur-3xl animate-pulse" 
        style={{ animationDuration: '3s' }} 
      />
      
      <svg 
        viewBox="0 0 320 100" 
        className="relative w-full max-w-xs md:max-w-md lg:max-w-lg"
        style={{ animation: 'float 5s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="30%" stopColor="#fb923c" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate attributeName="x1" values="-100%;200%" dur="3s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0%;300%" dur="3s" repeatCount="indefinite" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 4 */}
        <path
          ref={pathRef1}
          d="M 45 15 L 45 70 M 45 42 L 15 42 L 15 15 L 45 70"
          stroke="url(#goldGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        />

        {/* 2 */}
        <path
          ref={pathRef2}
          d="M 95 15 Q 130 15 130 33 Q 130 50 95 50 L 130 85 L 95 85"
          stroke="url(#goldGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        />

        {/* 0 */}
        <path
          ref={pathRef3}
          d="M 195 15 Q 230 15 230 50 Q 230 85 195 85 Q 160 85 160 50 Q 160 15 195 15 Z"
          stroke="url(#goldGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#glow)"
        />

        {/* Движущийся блик */}
        <rect x="0" y="0" width="100%" height="100%" fill="url(#shineGradient)" opacity="0.3" />

        {/* Искры */}
        <circle cx="40" cy="25" r="2" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;2.5;1.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="125" cy="30" r="2" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
          <animate attributeName="r" values="1.5;2.5;1.5" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
        </circle>
        <circle cx="200" cy="25" r="2" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
          <animate attributeName="r" values="1.5;2.5;1.5" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
        </circle>
      </svg>
    </div>
  );
}
