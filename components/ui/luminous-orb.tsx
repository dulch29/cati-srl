"use client";

import React, { useState, useRef, useEffect } from "react";

interface LuminousOrbProps {
  state?: "thinking" | "overconfident" | "mastered" | "calibrated";
  size?: "sm" | "md" | "lg";
  className?: string;
  interactive?: boolean;
}

export function LuminousOrb({
  state = "calibrated",
  size = "md",
  className = "",
  interactive = true,
}: LuminousOrbProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 }); // -1 to 1 normalized tracking across window
  const [liquidPhase, setLiquidPhase] = useState(0);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-28 h-28",
    lg: "w-40 h-40",
  }[size];

  // Deep Royal Blue & Sapphire Color Spectrum (No Neon)
  const colors = {
    thinking: {
      core: "from-blue-600 via-indigo-600 to-slate-900",
      liquid: "rgba(59, 130, 246, 0.45)",
      liquidGlow: "rgba(96, 165, 250, 0.7)",
      glow: "rgba(37, 99, 235, 0.5)",
      bloom: "rgba(96, 165, 250, 0.8)",
      ring: "border-blue-400/40",
      accent: "#3b82f6",
      pupil: "#60a5fa",
    },
    overconfident: {
      core: "from-amber-600 via-blue-700 to-slate-900",
      liquid: "rgba(245, 158, 11, 0.45)",
      liquidGlow: "rgba(59, 130, 246, 0.65)",
      glow: "rgba(217, 119, 6, 0.45)",
      bloom: "rgba(251, 191, 36, 0.8)",
      ring: "border-amber-400/40",
      accent: "#f59e0b",
      pupil: "#fbbf24",
    },
    mastered: {
      core: "from-sky-400 via-blue-600 to-indigo-950",
      liquid: "rgba(56, 189, 248, 0.5)",
      liquidGlow: "rgba(147, 197, 253, 0.8)",
      glow: "rgba(56, 189, 248, 0.5)",
      bloom: "rgba(186, 230, 253, 0.9)",
      ring: "border-sky-400/50",
      accent: "#38bdf8",
      pupil: "#bae6fd",
    },
    calibrated: {
      core: "from-blue-500 via-blue-700 to-slate-950",
      liquid: "rgba(37, 99, 235, 0.5)",
      liquidGlow: "rgba(96, 165, 250, 0.75)",
      glow: "rgba(37, 99, 235, 0.5)",
      bloom: "rgba(147, 197, 253, 0.85)",
      ring: "border-blue-400/40",
      accent: "#60a5fa",
      pupil: "#93c5fd",
    },
  }[state];

  // 1. Global Window Cursor Tracking: Lens ALWAYS Stares at User's Cursor
  useEffect(() => {
    if (!interactive) return;

    let targetGazeX = 0;
    let targetGazeY = 0;
    let currentGazeX = 0;
    let currentGazeY = 0;
    let animId: number;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Maximum deflection within viewport
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.75;
      const intensity = Math.min(1, dist / maxDistance);
      const angle = Math.atan2(dy, dx);

      targetGazeX = Math.cos(angle) * Math.pow(intensity, 0.75);
      targetGazeY = Math.sin(angle) * Math.pow(intensity, 0.75);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);

    // Smooth spring physics interpolation towards target gaze
    const loop = () => {
      currentGazeX += (targetGazeX - currentGazeX) * 0.08;
      currentGazeY += (targetGazeY - currentGazeY) * 0.08;
      setGaze({ x: currentGazeX, y: currentGazeY });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [interactive]);

  // 2. Liquid Phase Animation Loop
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const loop = () => {
      phase += isHovered ? 0.05 : 0.02;
      setLiquidPhase(phase);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  };

  // Organic liquid morphing border radius
  const p = liquidPhase;
  const radiusA = `${48 + Math.sin(p) * 14}% ${52 + Math.cos(p * 0.9) * 12}% ${54 + Math.sin(p * 1.3) * 10}% ${46 + Math.cos(p * 1.1) * 13}% / ${53 + Math.cos(p * 1.2) * 11}% ${47 + Math.sin(p * 0.8) * 13}% ${51 + Math.cos(p * 1.4) * 12}% ${49 + Math.sin(p * 1.1) * 10}%`;
  const radiusB = `${52 + Math.cos(p * 1.1) * 13}% ${48 + Math.sin(p * 1.2) * 14}% ${46 + Math.cos(p * 0.7) * 12}% ${54 + Math.sin(p * 1.4) * 11}% / ${47 + Math.sin(p * 0.9) * 12}% ${53 + Math.cos(p * 1.3) * 11}% ${49 + Math.sin(p * 1.2) * 13}% ${51 + Math.cos(p * 0.8) * 12}%`;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        transform: `perspective(600px) rotateX(${-gaze.y * (isHovered ? 26 : 18)}deg) rotateY(${gaze.x * (isHovered ? 26 : 18)}deg) scale(${isHovered ? 1.12 : 1})`,
        transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`relative flex items-center justify-center cursor-pointer select-none ${sizeClasses} ${className}`}
    >
      {/* 1. Supernova Luminous Bloom on Hover */}
      <div
        className="absolute inset-[-12px] rounded-full blur-3xl transition-all duration-500 pointer-events-none"
        style={{
          backgroundColor: isHovered ? colors.bloom : colors.glow,
          transform: isHovered ? "scale(1.5)" : "scale(1)",
          opacity: isHovered ? 0.95 : 0.45,
          boxShadow: isHovered
            ? `0 0 60px ${colors.bloom}, 0 0 100px ${colors.glow}`
            : "none",
        }}
      />

      {/* 2. Rotating Sentient Orbit Rings */}
      <div
        className={`absolute inset-[-8px] rounded-full border border-dashed ${colors.ring} pointer-events-none transition-all duration-500`}
        style={{
          animation: isHovered ? "spin 4s linear infinite" : "spin 14s linear infinite",
          transform: `scale(${isHovered ? 1.2 : 1}) rotate(${gaze.x * 35}deg)`,
          opacity: isHovered ? 0.85 : 0.35,
          boxShadow: isHovered ? `0 0 15px ${colors.accent}` : "none",
        }}
      />

      {/* 3. Outer Glass Lens Capsule */}
      <div
        className={`relative w-full h-full rounded-full bg-gradient-to-tr ${colors.core} p-0.5 shadow-2xl overflow-hidden transition-all duration-500 border border-white/20`}
        style={{
          boxShadow: isHovered
            ? `0 0 35px ${colors.accent}, inset 0 0 20px rgba(255,255,255,0.4)`
            : "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        {/* Specular Glint on Top Rim */}
        <div className="absolute top-1 left-2 w-1/3 h-1/3 rounded-full bg-white/40 blur-[2px] pointer-events-none" />

        {/* Deep Caustic Back Shadow */}
        <div className="absolute bottom-1 right-2 w-1/2 h-1/2 rounded-full bg-black/50 blur-[5px] pointer-events-none" />

        {/* Dynamic Specular Lens Flare ALWAYS Staring at Cursor */}
        <div
          className="absolute w-14 h-14 rounded-full bg-white/60 blur-md pointer-events-none transition-all duration-100 ease-out"
          style={{
            left: `calc(50% + ${gaze.x * 38}% - 28px)`,
            top: `calc(50% + ${gaze.y * 38}% - 28px)`,
            opacity: isHovered ? 1 : 0.45,
            transform: isHovered ? "scale(1.3)" : "scale(1)",
          }}
        />

        {/* 4. Inside the Lens: The Sentient Staring Pupil & Liquid Droplet Core */}
        <div className="relative w-full h-full rounded-full backdrop-blur-md flex items-center justify-center overflow-hidden">
          {/* Layer A: Viscous Blue Fluid Mass Staring at Cursor */}
          <div
            className="absolute transition-all duration-300 ease-out"
            style={{
              width: isHovered ? "80%" : "60%",
              height: isHovered ? "80%" : "60%",
              borderRadius: radiusA,
              background: `radial-gradient(circle at ${50 + gaze.x * 30}% ${50 + gaze.y * 30}%, rgba(255, 255, 255, 0.9) 0%, ${colors.liquidGlow} 45%, ${colors.liquid} 85%)`,
              boxShadow: `0 0 30px ${colors.glow}, inset 0 0 15px rgba(255,255,255,0.5)`,
              transform: `translate(${gaze.x * (isHovered ? 16 : 10)}px, ${gaze.y * (isHovered ? 16 : 10)}px)`,
              filter: isHovered ? "blur(0.5px)" : "blur(1.5px)",
            }}
          />

          {/* Layer B: Counter-Rotating Fluid Distortion */}
          <div
            className="absolute transition-all duration-500 ease-out"
            style={{
              width: isHovered ? "65%" : "48%",
              height: isHovered ? "65%" : "48%",
              borderRadius: radiusB,
              background: `radial-gradient(circle at ${45 - gaze.x * 25}% ${45 - gaze.y * 25}%, rgba(255, 255, 255, 0.8) 0%, rgba(96, 165, 250, 0.4) 50%, transparent 100%)`,
              transform: `translate(${gaze.x * 12}px, ${gaze.y * 12}px) rotate(${liquidPhase * 25}deg)`,
              opacity: isHovered ? 0.9 : 0.45,
            }}
          />

          {/* Layer C: Staring Lens Pupil / Core that Tracks the Eye of the User */}
          <div
            className="relative rounded-full transition-all duration-200 pointer-events-none flex items-center justify-center"
            style={{
              width: isHovered ? "45%" : "38%",
              height: isHovered ? "45%" : "38%",
              background: isHovered
                ? `radial-gradient(circle at 35% 35%, #ffffff 0%, #93c5fd 40%, ${colors.accent} 100%)`
                : `radial-gradient(circle at 40% 40%, #ffffff 0%, ${colors.pupil} 50%, ${colors.accent} 100%)`,
              borderRadius: isHovered ? radiusA : "9999px",
              boxShadow: isHovered
                ? `0 0 25px #ffffff, 0 0 45px ${colors.accent}`
                : `0 0 15px ${colors.accent}`,
              transform: `translate(${gaze.x * 14}px, ${gaze.y * 14}px)`,
              filter: isHovered ? "none" : "blur(0.5px)",
            }}
          >
            {/* The Staring Pupil Highlight */}
            <div
              className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] transition-all duration-100"
              style={{
                transform: `translate(${gaze.x * 4}px, ${gaze.y * 4}px) scale(${isHovered ? 1.4 : 1})`,
              }}
            />
          </div>

          {/* Click Concentric Shockwaves */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full border border-sky-300 pointer-events-none animate-ping"
              style={{
                left: ripple.x - 20,
                top: ripple.y - 20,
                width: 40,
                height: 40,
                animationDuration: "0.85s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
