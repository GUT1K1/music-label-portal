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
      
      @keyframes wave-in {
        0% {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
        }
        60% {
          opacity: 1;
          transform: translateY(-10px) scale(1.02);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .scroll-animate.animate-in {
        animation: wave-in 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
      .scroll-animate.animate-in:nth-child(1) { animation-delay: 0s; }
      .scroll-animate.animate-in:nth-child(2) { animation-delay: 0.1s; }
      .scroll-animate.animate-in:nth-child(3) { animation-delay: 0.2s; }
      .scroll-animate.animate-in:nth-child(4) { animation-delay: 0.3s; }
      
      @keyframes morph-glow {
        0%, 100% {
          filter: blur(20px) brightness(1);
          transform: scale(1) rotate(0deg);
          opacity: 0.3;
        }
        25% {
          filter: blur(25px) brightness(1.3);
          transform: scale(1.15) rotate(2deg);
          opacity: 0.5;
        }
        50% {
          filter: blur(30px) brightness(1.5);
          transform: scale(1.25) rotate(-2deg);
          opacity: 0.4;
        }
        75% {
          filter: blur(25px) brightness(1.2);
          transform: scale(1.1) rotate(1deg);
          opacity: 0.45;
        }
      }
      
      .animate-morph-glow {
        animation: morph-glow 6s ease-in-out infinite;
      }
      
      @keyframes draw-line {
        0% {
          transform: translateX(-50%) scaleY(0);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) scaleY(1);
          opacity: 0.6;
        }
      }
      
      .animate-draw-line {
        transform-origin: top center;
        animation: draw-line 1.5s ease-out forwards;
      }
      
      @keyframes holographic {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 200% 50%;
        }
      }
      
      .holographic-effect {
        position: relative;
      }
      
      .holographic-effect::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 0, 255, 0.3),
          rgba(0, 255, 255, 0.3),
          rgba(255, 255, 0, 0.3),
          rgba(255, 0, 255, 0.3),
          transparent
        );
        background-size: 200% 100%;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
        animation: holographic 3s linear infinite;
      }
      
      .holographic-effect:hover::before {
        opacity: 1;
      }
    `}</style>
  );
}