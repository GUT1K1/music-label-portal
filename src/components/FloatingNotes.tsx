export default function FloatingNotes() {
  const notes = [
    { x: '10%', delay: 0, duration: 8, size: 40 },
    { x: '25%', delay: 2, duration: 10, size: 35 },
    { x: '45%', delay: 1, duration: 9, size: 45 },
    { x: '65%', delay: 3, duration: 11, size: 38 },
    { x: '80%', delay: 1.5, duration: 9.5, size: 42 },
    { x: '90%', delay: 2.5, duration: 10.5, size: 36 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {notes.map((note, index) => (
        <div
          key={index}
          className="absolute bottom-0"
          style={{
            left: note.x,
            animation: `floatUp ${note.duration}s ease-in-out ${note.delay}s infinite`
          }}
        >
          <svg
            width={note.size}
            height={note.size}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-20"
          >
            <defs>
              <linearGradient id={`noteGradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              
              <filter id={`noteGlow${index}`}>
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {index % 3 === 0 ? (
              <g fill={`url(#noteGradient${index})`} filter={`url(#noteGlow${index})`}>
                <ellipse cx="35" cy="65" rx="18" ry="14" transform="rotate(-20 35 65)" />
                <rect x="50" y="25" width="4" height="40" rx="2" />
                <path d="M54,25 Q64,20 64,15 Q64,10 54,15" />
                <animate
                  attributeName="opacity"
                  values="0.4; 0.7; 0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </g>
            ) : index % 3 === 1 ? (
              <g fill={`url(#noteGradient${index})`} filter={`url(#noteGlow${index})`}>
                <ellipse cx="35" cy="65" rx="18" ry="14" transform="rotate(-20 35 65)" />
                <rect x="50" y="30" width="4" height="35" rx="2" />
                <animate
                  attributeName="opacity"
                  values="0.5; 0.8; 0.5"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </g>
            ) : (
              <g fill={`url(#noteGradient${index})`} filter={`url(#noteGlow${index})`}>
                <ellipse cx="25" cy="70" rx="16" ry="12" transform="rotate(-20 25 70)" />
                <rect x="38" y="35" width="4" height="35" rx="2" />
                <ellipse cx="45" cy="55" rx="16" ry="12" transform="rotate(-20 45 55)" />
                <rect x="58" y="20" width="4" height="35" rx="2" />
                <path d="M42,35 L62,20" stroke={`url(#noteGradient${index})`} strokeWidth="4" />
                <animate
                  attributeName="opacity"
                  values="0.3; 0.6; 0.3"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </g>
            )}
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
