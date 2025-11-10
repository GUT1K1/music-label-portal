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
    `}</style>
  );
}
