import React, { useEffect, useRef } from "react";

const GridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const gridSize = 80;
    const lineWidth = 0.5;
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const drawGrid = (timestamp: number) => {
      if (timestamp - lastTime < interval) {
        animationFrameId = requestAnimationFrame(drawGrid);
        return;
      }
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = lineWidth;

      const fadeHeight = canvas.height * 0.7;
      const fadeWidth = canvas.width * 0.9;

      const gradient = ctx.createLinearGradient(0, 0, fadeWidth, fadeHeight);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)");
      gradient.addColorStop(1, "rgba(147, 197, 253, 0.05)");

      for (let x = 0; x <= canvas.width; x += gridSize) {
        const alpha = Math.max(0, 1 - x / fadeWidth);
        const yOffset = Math.sin(x * 0.02 + timestamp * 0.0005) * 3;
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.03 * alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, fadeHeight + yOffset);
        ctx.stroke();
      }

      for (let y = 0; y <= fadeHeight; y += gridSize) {
        const alpha = Math.max(0, 1 - y / fadeHeight);
        const xOffset = Math.sin(y * 0.02 + timestamp * 0.0005) * 3;
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.03 * alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(fadeWidth + xOffset, y);
        ctx.stroke();
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    const handleResize = () => {
      setCanvasSize();
      drawGrid(0);
    };

    setCanvasSize();
    window.addEventListener("resize", handleResize);
    animationFrameId = requestAnimationFrame(drawGrid);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-50"
        style={{
          filter: "blur(0.5px)",
          transform: "scale(1.02)",
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent"
        style={{ backdropFilter: "blur(2px)" }}
      />
    </div>
  );
};

export default GridBackground;