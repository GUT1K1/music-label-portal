import { useEffect, useRef } from 'react';

interface Column {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  chars: string[];
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const chars = ['4', '2', '0'];
    const fontSize = 20;
    const columnCount = Math.floor(canvas.width / fontSize);
    const columns: Column[] = [];

    for (let i = 0; i < columnCount; i++) {
      columns.push({
        x: i * fontSize,
        y: Math.random() * canvas.height - canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3,
        chars: Array(Math.floor(canvas.height / fontSize) + 1)
          .fill(0)
          .map(() => chars[Math.floor(Math.random() * chars.length)])
      });
    }

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      columns.forEach((column) => {
        column.chars.forEach((char, index) => {
          const yPos = column.y + index * fontSize;
          
          if (yPos > -fontSize && yPos < canvas.height) {
            const distanceFromTop = yPos / canvas.height;
            const alpha = column.opacity * (1 - distanceFromTop * 0.5);
            
            const isFirst = index === Math.floor(column.chars.length * 0.1);
            
            if (isFirst) {
              ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
              ctx.shadowBlur = 10;
              ctx.fillStyle = `rgba(234, 179, 8, ${alpha * 1.5})`;
              ctx.font = `bold ${fontSize}px monospace`;
            } else {
              ctx.shadowBlur = 0;
              const colorMix = Math.random() > 0.5 ? 
                `rgba(234, 179, 8, ${alpha})` : 
                `rgba(251, 146, 60, ${alpha})`;
              ctx.fillStyle = colorMix;
              ctx.font = `${fontSize}px monospace`;
            }
            
            ctx.fillText(char, column.x, yPos);
          }
        });

        column.y += column.speed;

        if (column.y > canvas.height) {
          column.y = -canvas.height * Math.random();
          column.speed = 0.5 + Math.random() * 1.5;
          column.opacity = 0.1 + Math.random() * 0.3;
          column.chars = Array(Math.floor(canvas.height / fontSize) + 1)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)]);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      setCanvasSize();
      columns.length = 0;
      const newColumnCount = Math.floor(canvas.width / fontSize);
      for (let i = 0; i < newColumnCount; i++) {
        columns.push({
          x: i * fontSize,
          y: Math.random() * canvas.height - canvas.height,
          speed: 0.5 + Math.random() * 1.5,
          opacity: 0.1 + Math.random() * 0.3,
          chars: Array(Math.floor(canvas.height / fontSize) + 1)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.4,
        mixBlendMode: 'screen'
      }}
    />
  );
}
