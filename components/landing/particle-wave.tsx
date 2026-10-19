"use client";

import React, { useEffect, useRef } from "react";

export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 600;
    };

    window.addEventListener("resize", handleResize);

    // Grid configuration for 3D undulating wave
    const rows = 45;
    const cols = 90;
    let step = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      step += 0.018;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cellW = (width * 1.3) / cols;
      const startX = -width * 0.15;
      const baseY = height * 0.52;

      // Draw rows from back to front for pseudo-depth
      for (let r = 0; r < rows; r++) {
        const depthPercent = r / rows; // 0 = back, 1 = front
        const yOffset = (r - rows / 2) * 8;
        const perspective = 0.55 + depthPercent * 0.65;

        // Mouse influence factor
        const mouseDistY = (mouseY - baseY) * 0.15 * (1 - depthPercent);

        for (let c = 0; c < cols; c++) {
          const x = startX + c * cellW;
          
          // Combine multiple wave frequencies for natural organic undulation
          const wave1 = Math.sin(c * 0.09 + step + r * 0.12) * 45;
          const wave2 = Math.cos(c * 0.05 - step * 0.8 + r * 0.08) * 30;
          const wave3 = Math.sin(r * 0.18 + step * 1.2) * 20;

          // Mouse warp curve
          const distToMouse = Math.hypot(x - mouseX, baseY + yOffset - mouseY);
          const mouseLift = Math.max(0, (260 - distToMouse) / 260) * 35;

          const y = baseY + (wave1 + wave2 + wave3 + mouseDistY - mouseLift) * perspective + yOffset;

          // Particle sizing and opacity based on depth
          const baseRadius = (0.7 + depthPercent * 1.4) * perspective;
          const alpha = Math.min(1, Math.max(0.04, (0.15 + depthPercent * 0.65) * (1 - Math.abs(c - cols / 2) / (cols * 0.58))));

          ctx.beginPath();
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2);

          // Subtle gradient from silvery white to emerald/lime luminescence
          if (c % 7 === 0 && depthPercent > 0.4) {
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 0.85})`; // emerald accent
          } else if (c % 11 === 0 && depthPercent > 0.5) {
            ctx.fillStyle = `rgba(163, 230, 53, ${alpha * 0.8})`; // lime spark
          } else {
            ctx.fillStyle = `rgba(240, 244, 250, ${alpha})`;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-85"
      />
      {/* Seamless edge fade overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-[#000000]" />
    </div>
  );
}
