export default function LandingStyles() {
  return (
    <style>{`
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes float-up {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes glow-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.3); }
        50% { box-shadow: 0 0 40px rgba(251, 146, 60, 0.6), 0 0 60px rgba(251, 146, 60, 0.4); }
      }
      
      @keyframes slide-in-up {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .scroll-animate {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .scroll-animate.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      .gradient-animated {
        background: linear-gradient(270deg, #f97316, #fb923c, #f59e0b, #fb923c, #f97316);
        background-size: 400% 400%;
        animation: gradient-shift 8s ease infinite;
      }
      
      .typing-cursor::after {
        content: '|';
        animation: blink 1s step-end infinite;
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      .card-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .card-hover:hover {
        transform: translateY(-8px) scale(1.02);
      }
      
      .glow-on-hover {
        position: relative;
        overflow: hidden;
      }
      
      .glow-on-hover::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.5s;
      }
      
      .glow-on-hover:hover::before {
        opacity: 1;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      
      .shimmer {
        background: linear-gradient(90deg, transparent, rgba(251, 146, 60, 0.3), transparent);
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
      }
      
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-rotate {
        animation: rotate 20s linear infinite;
      }
      
      @keyframes ripple {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      
      .button-ripple {
        position: relative;
        overflow: hidden;
      }
      
      .button-ripple::before,
      .button-ripple::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background: linear-gradient(45deg, #f97316, #fb923c);
        z-index: -1;
        animation: ripple 2s ease-out infinite;
      }
      
      .button-ripple::after {
        animation-delay: 1s;
      }
      
      @keyframes wave {
        0%, 100% { transform: translateX(0) translateY(0); }
        25% { transform: translateX(-10px) translateY(-10px); }
        50% { transform: translateX(-20px) translateY(0); }
        75% { transform: translateX(-10px) translateY(10px); }
      }
      
      .wave-animate {
        animation: wave 3s ease-in-out infinite;
      }
      
      .glassmorphism {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .neomorphism {
        background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
        box-shadow: 
          8px 8px 16px rgba(0, 0, 0, 0.4),
          -8px -8px 16px rgba(40, 40, 40, 0.1);
      }
      
      .neomorphism:hover {
        box-shadow: 
          12px 12px 24px rgba(0, 0, 0, 0.5),
          -12px -12px 24px rgba(40, 40, 40, 0.15),
          inset 2px 2px 4px rgba(251, 146, 60, 0.1);
      }
      
      .card-3d {
        transform-style: preserve-3d;
        transition: transform 0.3s ease;
      }
      
      .card-3d:hover {
        transform: perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
      }
      
      @keyframes grid-flow {
        0% { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
      }
      
      .animated-grid {
        background-image: 
          linear-gradient(rgba(251, 146, 60, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: grid-flow 20s linear infinite;
      }
      
      @keyframes progress-fill {
        from { width: 0%; }
        to { width: var(--progress-width, 100%); }
      }
      
      .progress-bar {
        animation: progress-fill 2s ease-out forwards;
      }
      
      @keyframes icon-morph {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(180deg); }
      }
      
      .icon-morph {
        animation: icon-morph 3s ease-in-out infinite;
      }
      
      @keyframes wave-enter {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .wave-enter {
        animation: wave-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
      .color-shift {
        transition: all 0.5s ease;
      }
      
      .color-shift:hover {
        background: linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(245, 158, 11, 0.2));
        border-color: rgba(251, 146, 60, 0.8);
      }
    `}</style>
  );
}