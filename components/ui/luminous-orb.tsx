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
  const [pointer, setPointer] = useState({ x: 0, y: 0 }); // -1 to 1 normalized
  const [liquidPhase, setLiquidPhase] = useState(0);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-28 h-28",
    lg: "w-40 h-40",
  }[size];

  const colors = {
    thinking: {
      core: "from-indigo-400 via-violet-500 to-purple-600",
      liquid: "rgba(129, 140, 248, 0.45)",
      liquidGlow: "rgba(167, 139, 250, 0.6)",
      glow: "rgba(129, 140, 248, 0.4)",
      ring: "border-indigo-400/40",
      accent: "#818cf8",
    },
    overconfident: {
      core: "from-amber-300 via-amber-500 to-rose-500",
      liquid: "rgba(245, 158, 11, 0.45)",
      liquidGlow: "rgba(251, 113, 133, 0.6)",
      glow: "rgba(245, 158, 11, 0.4)",
      ring: "border-amber-400/40",
      accent: "#f59e0b",
    },
    mastered: {
      core: "from-emerald-300 via-teal-400 to-emerald-600",
      liquid: "rgba(52, 211, 153, 0.45)",
      liquidGlow: "rgba(45, 212, 191, 0.6)",
      glow: "rgba(16, 185, 129, 0.4)",
      ring: "border-emerald-400/40",
      accent: "#34d399",
    },
    calibrated: {
      core: "from-cyan-300 via-sky-500 to-indigo-600",
      liquid: "rgba(56, 189, 248, 0.45)",
      liquidGlow: "rgba(99, 102, 241, 0.6)",
      glow: "rgba(99, 102, 241, 0.4)",
      ring: "border-cyan-400/40",
      accent: "#38bdf8",
    },
  }[state];

  // Fluid physics animation loop
  useEffect(() => {
    let animId: number;
    let phase = 0;

    const loop = () => {
      phase += isHovered ? 0.045 : 0.02;
      setLiquidPhase(phase);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setPointer({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPointer({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  };

  // Organic fluid morphing border radius calculations
  const p = liquidPhase;
  const radiusA = `${48 + Math.sin(p) * 14}% ${52 + Math.cos(p * 0.9) * 12}% ${54 + Math.sin(p * 1.3) * 10}% ${46 + Math.cos(p * 1.1) * 13}% / ${53 + Math.cos(p * 1.2) * 11}% ${47 + Math.sin(p * 0.8) * 13}% ${51 + Math.cos(p * 1.4) * 12}% ${49 + Math.sin(p * 1.1) * 10}%`;
  const radiusB = `${52 + Math.cos(p * 1.1) * 13}% ${48 + Math.sin(p * 1.2) * 14}% ${46 + Math.cos(p * 0.7) * 12}% ${54 + Math.sin(p * 1.4) * 11}% / ${47 + Math.sin(p * 0.9) * 12}% ${53 + Math.cos(p * 1.3) * 11}% ${49 + Math.sin(p * 1.2) * 13}% ${51 + Math.cos(p * 0.8) * 12}%`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: isHovered
          ? `perspective(600px) rotateX(${-pointer.y * 18}deg) rotateY(${pointer.x * 18}deg) scale(1.06)`
          : "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`relative flex items-center justify-center cursor-pointer select-none ${sizeClasses} ${className}`}
    >
      {/* Outer ambient breathing glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: colors.glow,
          transform: isHovered ? "scale(1.35)" : "scale(1)",
          opacity: isHovered ? 0.85 : 0.45,
        }}
      />

      {/* Rotating geometric orbit ring */}
      <div
        className={`absolute inset-[-6px] rounded-full border border-dashed ${colors.ring} pointer-events-none transition-all duration-700`}
        style={{
          animation: "spin 12s linear infinite",
          transform: isHovered ? `scale(1.15) rotate(${pointer.x * 45}deg)` : "scale(1)",
          opacity: isHovered ? 0.75 : 0.4,
        }}
      />

      {/* Outer glass boundary capsule */}
      <div
        className={`relative w-full h-full rounded-full bg-gradient-to-tr ${colors.core} p-0.5 shadow-2xl overflow-hidden transition-all duration-500`}
      >
        {/* Specular glass highlight on rim */}
        <div className="absolute top-1 left-2 w-1/3 h-1/3 rounded-full bg-white/40 blur-[2px] pointer-events-none" />

        {/* Deep caustic shadow reflection */}
        <div className="absolute bottom-1 right-2 w-1/2 h-1/2 rounded-full bg-black/40 blur-[5px] pointer-events-none" />

        {/* Dynamic Specular Lens Flare tracking mouse */}
        <div
          className="absolute w-12 h-12 rounded-full bg-white/40 blur-md pointer-events-none transition-transform duration-100 ease-out"
          style={{
            left: `calc(50% + ${pointer.x * 32}% - 24px)`,
            top: `calc(50% + ${pointer.y * 32}% - 24px)`,
            opacity: isHovered ? 0.9 : 0.2,
          }}
        />

        {/* Central Liquid Sphere Container */}
        <div className="relative w-full h-full rounded-full backdrop-blur-md flex items-center justify-center overflow-hidden">
          {/* Liquid Viscous Layer 1: Primary Undulating Fluid Mass */}
          <div
            className="absolute transition-all duration-300 ease-out"
            style={{
              width: isHovered ? "78%" : "54%",
              height: isHovered ? "78%" : "54%",
              borderRadius: radiusA,
              background: `radial-gradient(circle at ${50 + pointer.x * 25}% ${50 + pointer.y * 25}%, rgba(255, 255, 255, 0.65) 0%, ${colors.liquidGlow} 40%, ${colors.liquid} 85%)`,
              boxShadow: `0 0 25px ${colors.glow}, inset 0 0 15px rgba(255,255,255,0.4)`,
              transform: isHovered
                ? `translate(${pointer.x * 12}px, ${pointer.y * 12}px) scale(${1 + Math.sin(p * 2) * 0.06})`
                : "translate(0px, 0px) scale(1)",
              filter: isHovered ? "blur(0.5px)" : "blur(1.5px)",
            }}
          />

          {/* Liquid Viscous Layer 2: Secondary Organic Blob with counter-morphing */}
          <div
            className="absolute transition-all duration-500 ease-out"
            style={{
              width: isHovered ? "64%" : "44%",
              height: isHovered ? "64%" : "44%",
              borderRadius: radiusB,
              background: `radial-gradient(circle at ${40 - pointer.x * 20}% ${40 - pointer.y * 20}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
              transform: isHovered
                ? `translate(${pointer.x * 18}px, ${pointer.y * 18}px) rotate(${liquidPhase * 30}deg)`
                : `rotate(${liquidPhase * 15}deg)`,
              opacity: isHovered ? 0.8 : 0.4,
            }}
          />

          {/* Central Neural Shimmer: Liquid Droplet Core that responds to hover */}
          <div
            className="relative rounded-full transition-all duration-300 pointer-events-none"
            style={{
              width: isHovered ? "45%" : "50%",
              height: isHovered ? "45%" : "50%",
              background: isHovered
                ? `radial-gradient(circle at 35% 35%, #ffffff 0%, rgba(255,255,255,0.85) 30%, ${colors.accent} 85%)`
                : "rgba(255, 255, 255, 0.25)",
              borderRadius: isHovered ? radiusA : "9999px",
              boxShadow: isHovered
                ? `0 0 20px #ffffff, 0 0 35px ${colors.accent}`
                : "0 0 10px rgba(255,255,255,0.3)",
              transform: isHovered
                ? `translate(${pointer.x * 8}px, ${pointer.y * 8}px) scale(${1.05 + Math.cos(p * 3) * 0.05})`
                : "scale(1)",
              animation: isHovered ? "none" : "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
              opacity: isHovered ? 0.95 : 0.35,
              filter: isHovered ? "none" : "blur(2px)",
            }}
          >
            {/* Specular Liquid Drop Glint */}
            {isHovered && (
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                style={{
                  top: `calc(25% + ${pointer.y * 10}%)`,
                  left: `calc(25% + ${pointer.x * 10}%)`,
                }}
              />
            )}
          </div>

          {/* Liquid Ripple Shockwaves on Click */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full border border-white/60 pointer-events-none animate-ping"
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
