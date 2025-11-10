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
      
      .scroll-animate {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .scroll-animate.animate-in {
        opacity: 1;
        transform: translateY(0);
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
      
      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.3), 0 0 40px rgba(234, 179, 8, 0.1);
        }
        50% {
          box-shadow: 0 0 30px rgba(234, 179, 8, 0.5), 0 0 60px rgba(234, 179, 8, 0.2);
        }
      }
      
      .animate-pulse-glow {
        animation: pulse-glow 3s ease-in-out infinite;
      }
      
      @keyframes gradient-x {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
      
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 3s ease infinite;
      }
      
      details summary::-webkit-details-marker {
        display: none;
      }
    `}</style>
  );
}