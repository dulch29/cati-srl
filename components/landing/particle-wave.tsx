"use client";

import React, { useEffect, useRef } from "react";

interface WaveRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
}

export function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 750);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 750;
    };

    window.addEventListener("resize", handleResize);

    // Grid configuration for 3D undulating wave
    const rows = 48;
    const cols = 95;
    let step = 0;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let mouseSpeed = 0;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;

    const ripples: WaveRipple[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      mouseSpeed = Math.min(
        40,
        Math.hypot(targetMouseX - prevMouseX, targetMouseY - prevMouseY)
      );
      prevMouseX = targetMouseX;
      prevMouseY = targetMouseY;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.7,
        strength: 55,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Floating Interactive Cosmic Dust Motes
    const dustCount = 45;
    const dustMotes = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      step += 0.016;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update interactive ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 5.5;
        rip.strength *= 0.985;

        // Draw crisp sapphire ripple ring
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${Math.max(0, (rip.strength / 55) * 0.65)})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (rip.radius > rip.maxRadius || rip.strength < 0.5) {
          ripples.splice(i, 1);
        }
      }

      // 2. Draw 3D undulating particle wave grid
      const cellW = (width * 1.35) / cols;
      const startX = -width * 0.17;
      const baseY = height * 0.54;

      for (let r = 0; r < rows; r++) {
        const depthPercent = r / rows; // 0 = back, 1 = front
        const yOffset = (r - rows / 2) * 8.5;
        const perspective = 0.52 + depthPercent * 0.7;

        // Mouse influence factor
        const mouseDistY = (mouseY - baseY) * 0.18 * (1 - depthPercent);

        for (let c = 0; c < cols; c++) {
          const x = startX + c * cellW;

          // Harmonic wave frequencies
          const wave1 = Math.sin(c * 0.085 + step + r * 0.12) * 48;
          const wave2 = Math.cos(c * 0.052 - step * 0.75 + r * 0.08) * 32;
          const wave3 = Math.sin(r * 0.18 + step * 1.15) * 22;

          // Interactive Mouse Vortex & Lift
          const distToMouse = Math.hypot(x - mouseX, baseY + yOffset - mouseY);
          const mouseLift = Math.max(0, (300 - distToMouse) / 300) * (45 + mouseSpeed * 0.5);

          // Apply ripple displacement
          let rippleDisplacement = 0;
          for (let k = 0; k < ripples.length; k++) {
            const rip = ripples[k];
            const distToRip = Math.hypot(x - rip.x, baseY + yOffset - rip.y);
            const ripDiff = Math.abs(distToRip - rip.radius);
            if (ripDiff < 60) {
              rippleDisplacement += Math.cos((ripDiff / 60) * Math.PI) * rip.strength;
            }
          }

          const y =
            baseY +
            (wave1 + wave2 + wave3 + mouseDistY - mouseLift + rippleDisplacement) * perspective +
            yOffset;

          // Particle sizing & opacity based on proximity & depth
          const isNearMouse = distToMouse < 220;
          const mouseGlowBonus = isNearMouse ? (1 - distToMouse / 220) * 0.6 : 0;
          const baseRadius = (0.75 + depthPercent * 1.45 + (isNearMouse ? 0.6 : 0)) * perspective;
          const alpha = Math.min(
            1,
            Math.max(
              0.04,
              (0.14 + depthPercent * 0.68 + mouseGlowBonus) *
                (1 - Math.abs(c - cols / 2) / (cols * 0.56))
            )
          );

          ctx.beginPath();
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2);

          // Interactive Color Modulation:
          // Near mouse: glows with vibrant sapphire & ice blue highlights
          if (isNearMouse && c % 3 === 0) {
            ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`; // ice highlight
          } else if (c % 7 === 0 && depthPercent > 0.4) {
            ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.95})`; // royal sapphire
          } else if (c % 11 === 0 && depthPercent > 0.5) {
            ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.9})`; // sky azure
          } else if (c % 13 === 0 && depthPercent > 0.6) {
            ctx.fillStyle = `rgba(37, 99, 235, ${alpha * 0.85})`; // deep cobalt
          } else {
            ctx.fillStyle = `rgba(240, 244, 250, ${alpha})`;
          }
          ctx.fill();
        }
      }

      // 3. Draw & update interactive cosmic dust motes
      for (let i = 0; i < dustMotes.length; i++) {
        const mote = dustMotes[i];
        mote.x += mote.vx;
        mote.y += mote.vy;
        mote.phase += 0.02;

        // Mouse magnetic attraction / deflection
        const dMouse = Math.hypot(mote.x - mouseX, mote.y - mouseY);
        if (dMouse < 160) {
          const angle = Math.atan2(mote.y - mouseY, mote.x - mouseX);
          mote.x += Math.cos(angle) * 1.5;
          mote.y += Math.sin(angle) * 1.5;
        }

        // Screen wrap
        if (mote.x < 0) mote.x = width;
        if (mote.x > width) mote.x = 0;
        if (mote.y < 0) mote.y = height;
        if (mote.y > height) mote.y = 0;

        const pulseAlpha = mote.baseAlpha * (0.6 + Math.sin(mote.phase) * 0.4);
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-auto overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full opacity-90 cursor-default" />
      {/* Seamless edge fade overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-transparent to-[#000000] pointer-events-none" />
    </div>
  );
}
