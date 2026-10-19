"use client";

import React, { useEffect, useRef, useState } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function InteractiveAmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number; radius: number; opacity: number }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [
        ...prev.slice(-3),
        { id, x: e.clientX, y: e.clientY, radius: 10, opacity: 0.9 },
      ]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // 25 Drifting Interactive Constellation Nodes
    const nodes: NodePoint[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1,
    }));

    const render = () => {
      // Smooth cursor interpolation
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      setMousePos({ x: currentX, y: currentY });

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Expanding Liquid Shockwaves on Click
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 8;
        rip.opacity *= 0.96;

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${rip.opacity * 0.75})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Secondary echoing ring
        if (rip.radius > 35) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.radius - 25, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${rip.opacity * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        if (rip.opacity < 0.02 || rip.radius > 600) {
          ripples.splice(i, 1);
        }
      }

      // 2. Draw Interactive Constellation Nodes & Connecting Filaments
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Screen wrap
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Distance to mouse
        const distToCursor = Math.hypot(node.x - currentX, node.y - currentY);

        // Magnetic repulsion/attraction to cursor
        if (distToCursor < 160) {
          const angle = Math.atan2(node.y - currentY, node.x - currentX);
          node.x += Math.cos(angle) * 1.8;
          node.y += Math.sin(angle) * 1.8;

          // Filament line to cursor
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = `rgba(96, 165, 250, ${(1 - distToCursor / 160) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (distToCursor < 160 ? 1 : 0), 0, Math.PI * 2);
        ctx.fillStyle =
          distToCursor < 160 ? "rgba(147, 197, 253, 0.9)" : "rgba(96, 165, 250, 0.35)";
        ctx.shadowColor = distToCursor < 160 ? "#60a5fa" : "transparent";
        ctx.shadowBlur = distToCursor < 160 ? 8 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, [ripples]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Dynamic Canvas for Ripple Shockwaves & Constellations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 1. High-Noticeability Cursor Spotlight Glow (Deep Blue) */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[110px] transition-opacity duration-300 pointer-events-none"
        style={{
          left: mousePos.x - 340,
          top: mousePos.y - 340,
          background:
            "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(96, 165, 250, 0.12) 40%, rgba(15, 23, 42, 0.05) 70%, transparent 85%)",
        }}
      />

      {/* 2. Flashlight Reveal of Micro-Dot Matrix */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(96, 165, 250, 0.28) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px, black 15%, transparent 100%)`,
        }}
      />

      {/* 3. Base High-Tech Grid Structure */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(96, 165, 250, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(96, 165, 250, 0.2) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
