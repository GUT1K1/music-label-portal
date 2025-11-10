export default function LandingStyles() {
  return (
    <style>{`
      @keyframes float-slow {
        0%, 100% { 
          transform: translate(0, 0) scale(1);
        }
        33% { 
          transform: translate(40px, 50px) scale(1.05);
        }
        66% { 
          transform: translate(-30px, -40px) scale(0.95);
        }
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
