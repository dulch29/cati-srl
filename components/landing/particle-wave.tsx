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
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      mouseSpeed = Math.min(
        40,
        Math.hypot(targetMouseX - prevMouseX, targetMouseY - prevMouseY)
      );
      prevMouseX = targetMouseX;
      prevMouseY = targetMouseY;
    };

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.75,
        strength: 55,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Floating Interactive Cosmic Dust Motes
    const dustCount = 45;
    const dustMotes = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      step += 0.016;

      // Update shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 6.5;
        r.strength *= 0.96;
        if (r.radius > r.maxRadius || r.strength < 0.2) {
          ripples.splice(i, 1);
        }
      }

      // Camera & Perspective Settings
      const fov = 420;
      const cameraY = -80;
      const cameraZ = -140;

      // Render 3D Undulating Particle Grid (Blue & Sapphire Theme)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Normalized Coordinates (-1 to 1)
          const nx = (c / (cols - 1)) * 2 - 1;
          const nz = (r / (rows - 1)) * 2 - 1;

          // World space positions
          const worldX = nx * (width * 0.85);
          const worldZ = (nz + 1) * 350 + 40; // Depth distance from camera

          // Compound Multi-Harmonic Wave Equation
          const distFromCenter = Math.hypot(nx * 1.2, nz);
          let worldY =
            Math.sin(nx * 4.5 + step * 1.2) * 22 +
            Math.cos(nz * 3.8 + step * 0.9) * 20 +
            Math.sin((nx + nz) * 3.0 + step * 1.6) * 14 +
            Math.sin(distFromCenter * 6 - step * 1.8) * 12;

          // Mouse Fluid Repulsion & Gravitational Deflection
          const screenApproxX = width / 2 + (worldX / (worldZ + cameraZ)) * fov;
          const screenApproxY = height * 0.55 + ((worldY - cameraY) / (worldZ + cameraZ)) * fov;

          const dxMouse = screenApproxX - mouseX;
          const dyMouse = screenApproxY - mouseY;
          const distMouse = Math.hypot(dxMouse, dyMouse);

          if (distMouse < 220) {
            const influence = Math.pow(1 - distMouse / 220, 2);
            // Repel upwards and outwards dynamically based on cursor velocity
            worldY -= influence * (35 + mouseSpeed * 1.2);
          }

          // Apply Shockwave Ripples
          for (const ripple of ripples) {
            const dR = Math.hypot(screenApproxX - ripple.x, screenApproxY - ripple.y);
            const deltaR = Math.abs(dR - ripple.radius);
            if (deltaR < 60) {
              const waveFactor = Math.cos((deltaR / 60) * Math.PI * 0.5);
              worldY += waveFactor * ripple.strength * Math.sin(deltaR * 0.1);
            }
          }

          // 3D Perspective Projection
          const zProjected = worldZ + cameraZ;
          if (zProjected <= 10) continue;

          const scale = fov / zProjected;
          const projX = width / 2 + worldX * scale;
          const projY = height * 0.55 + (worldY - cameraY) * scale;

          if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) {
            continue;
          }

          // Depth-based Alpha & Radius
          const depthFactor = Math.max(0.05, Math.min(1, 1 - (worldZ - 40) / 700));
          const pointRadius = Math.max(0.6, (1.8 + Math.sin(step + nx * 5) * 0.4) * scale * 1.3);

          // Deep Sapphire, Azure, and Sky Blue Color Palette
          const colorInterpolation = Math.sin(nx * 2 + step) * 0.5 + 0.5;
          let rVal = 59 + colorInterpolation * 37;
          let gVal = 130 + colorInterpolation * 35;
          let bVal = 246 + colorInterpolation * 9;

          // Height highlight: crests glow brighter azure/sky
          const heightHighlight = Math.max(0, (worldY + 40) / 80);
          rVal = Math.min(255, rVal + heightHighlight * 60);
          gVal = Math.min(255, gVal + heightHighlight * 70);
          bVal = Math.min(255, bVal + heightHighlight * 10);

          const alpha = depthFactor * (0.35 + heightHighlight * 0.45);

          ctx.beginPath();
          ctx.arc(projX, projY, pointRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(rVal)}, ${Math.round(gVal)}, ${Math.round(bVal)}, ${alpha.toFixed(3)})`;
          ctx.fill();

          // Subtle connect horizontal adjacent particles in foreground for cyber grid mesh
          if (c > 0 && r % 4 === 0 && depthFactor > 0.4) {
            ctx.strokeStyle = `rgba(${Math.round(rVal)}, ${Math.round(gVal)}, ${Math.round(bVal)}, ${(alpha * 0.25).toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Render Floating Dust Motes
      for (const mote of dustMotes) {
        mote.x += mote.vx;
        mote.y += mote.vy;
        mote.phase += 0.03;

        // Screen wrap
        if (mote.x < 0) mote.x = width;
        if (mote.x > width) mote.x = 0;
        if (mote.y < 0) mote.y = height;
        if (mote.y > height) mote.y = 0;

        const pulseAlpha = mote.baseAlpha * (0.6 + Math.sin(mote.phase) * 0.4);
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${pulseAlpha.toFixed(3)})`;
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full opacity-75" />
      {/* Seamless radial and vertical edge fade overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,transparent_30%,#060913_90%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060913]/20 to-[#060913]/80 pointer-events-none" />
    </div>
  );
}
