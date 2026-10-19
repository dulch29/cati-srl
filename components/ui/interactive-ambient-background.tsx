"use client";

import React, { useEffect, useRef, useState } from "react";

export function InteractiveAmbientBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const loop = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMousePos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Fluid Interactive Cursor Spotlight Glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-300 pointer-events-none"
        style={{
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.07) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 75%)",
        }}
      />

      {/* 2. Interactive Flashlight Reveal of Micro-Dot Lattice */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 320px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
        }}
      />

      {/* 3. Subtle Static Cartesian Dot Grid for Base Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 4. Click Shockwave Liquid Ripples (Circular.wave aesthetic) */}
      {ripples.map((rip) => (
        <span
          key={rip.id}
          className="absolute rounded-full border border-[#34D399]/40 pointer-events-none animate-ping"
          style={{
            left: rip.x - 75,
            top: rip.y - 75,
            width: 150,
            height: 150,
            animationDuration: "1.1s",
          }}
        />
      ))}
    </div>
  );
}
