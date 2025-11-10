export default function LandingStyles() {
  return (
    <style>{`
      @keyframes float-gentle {
        0%, 100% { 
          transform: translate(0, 0) scale(1);
        }
        33% { 
          transform: translate(60px, 80px) scale(1.08);
        }
        66% { 
          transform: translate(-50px, -60px) scale(0.92);
        }
      }
      
      @keyframes pulse-gentle {
        0%, 100% { 
          opacity: 0.5;
          transform: translate(-50%, -50%) scale(1);
        }
        50% { 
          opacity: 0.8;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }
      
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
      }
      
      .animate-shimmer {
        animation: shimmer 3s ease-in-out infinite;
      }
      
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .scroll-animate.animate-in {
        animation: slide-up 1s ease-out forwards;
      }
      
      @keyframes scroll-infinite {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .animate-scroll-infinite {
        animation: scroll-infinite 30s linear infinite;
      }
      
      .animate-scroll-infinite:hover {
        animation-play-state: paused;
      }
      
      .mask-gradient {
        -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      }
      
      @keyframes twinkle-slow {
        0%, 100% { 
          opacity: 0.2;
          transform: scale(1);
        }
        50% { 
          opacity: 0.8;
          transform: scale(1.5);
        }
      }
      
      .typing-cursor::after {
        content: '|';
        animation: blink 1s step-end infinite;
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      details summary::-webkit-details-marker {
        display: none;
      }
    `}</style>
  );
}