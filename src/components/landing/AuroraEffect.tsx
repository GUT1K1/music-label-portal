import { useEffect, useRef } from 'react';

export default function AuroraEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight / 2;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const waves: Array<{
      amplitude: number;
      frequency: number;
      speed: number;
      offset: number;
      color: string;
    }> = [
      { amplitude: 40, frequency: 0.003, speed: 0.002, offset: 0, color: 'rgba(234, 179, 8, 0.15)' },
      { amplitude: 50, frequency: 0.002, speed: 0.0015, offset: 50, color: 'rgba(251, 146, 60, 0.12)' },
      { amplitude: 35, frequency: 0.0025, speed: 0.0018, offset: 100, color: 'rgba(168, 85, 247, 0.1)' },
      { amplitude: 45, frequency: 0.0035, speed: 0.0022, offset: 150, color: 'rgba(234, 179, 8, 0.08)' },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 2) {
          const y = 
            canvas.height / 2 +
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.5 - time * wave.speed * 0.8) * wave.amplitude * 0.5;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-5"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
