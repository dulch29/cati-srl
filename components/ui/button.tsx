"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "white";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      disabled,
      magnetic = true,
      children,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      if (magnetic) {
        // Micro 3D tilt calculation
        const normX = (x / rect.width) * 2 - 1; // -1 to 1
        const normY = (y / rect.height) * 2 - 1;
        setTilt({ x: normX * 8, y: -normY * 8 });
      }

      onMouseMove?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      setTilt({ x: 0, y: 0 });
      onMouseLeave?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = buttonRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples((prev) => [...prev.slice(-2), { id, x, y }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
      onClick?.(e);
    };

    const baseStyles =
      "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer overflow-hidden select-none active:scale-[0.97]";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-indigo-400/30",
      white:
        "bg-white text-black hover:bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] border border-white",
      secondary:
        "bg-white/[0.04] text-slate-100 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-md shadow-lg",
      outline:
        "border border-white/20 bg-transparent text-slate-200 hover:bg-white/[0.06] hover:border-white/40 backdrop-blur-sm",
      ghost:
        "text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent hover:border-white/10",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/25 border border-rose-400/30",
    };

    const sizeStyles = {
      default: "h-10 px-5 py-2",
      sm: "h-8 rounded-lg px-3.5 text-xs",
      lg: "h-12 rounded-xl px-7 text-base",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        disabled={disabled || isLoading}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          transform: isHovered
            ? `perspective(400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.025)`
            : "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)",
          transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease",
        }}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Interactive Magnetic Specular Light Spotlight */}
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background:
              variant === "white"
                ? `radial-gradient(circle 80px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.08), transparent 75%)`
                : `radial-gradient(circle 80px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.28), transparent 75%)`,
          }}
        />

        {/* Diagonal Shimmer Laser Beam on Hover */}
        <span
          className="pointer-events-none absolute -inset-full w-[300%] h-[300%] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
            transform: isHovered ? "translateX(25%)" : "translateX(-50%)",
            transition: "transform 0.75s ease-out, opacity 0.3s ease",
          }}
        />

        {/* Click Shockwave Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full bg-white/30 animate-ping"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
              animationDuration: "0.55s",
            }}
          />
        ))}

        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
