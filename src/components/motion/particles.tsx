"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { useIsTouch, useIsMobile } from "@/hooks/use-mobile";

interface Props {
  /** Particle count. Auto-scaled down on mobile. */
  count?: number;
  /** Max link distance in px. */
  linkDistance?: number;
  /** Base particle color (line + dot). Supports rgba. */
  color?: string;
  /** Optional className for wrapper. */
  className?: string;
}

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

/**
 * Canvas-driven particle field with connecting lines.
 * - Pauses when offscreen (IntersectionObserver) and when tab is hidden
 * - Disabled on touch + reduced-motion
 * - DPR-aware for sharp dots
 */
export function Particles({ count = 50, linkDistance = 120, color = "124, 92, 255", className }: Props) {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const isMobile = useIsMobile();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const dotsRef = React.useRef<Dot[]>([]);
  const visibleRef = React.useRef(true);

  const disabled = reduced || isTouch;
  const effectiveCount = isMobile ? Math.floor(count * 0.4) : count;

  React.useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const { clientWidth: w, clientHeight: h } = parent;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    }

    function seed(w: number, h: number) {
      dotsRef.current = Array.from({ length: effectiveCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 0.8 + Math.random() * 1.2,
      }));
    }

    function frame() {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      const dots = dotsRef.current;
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }
      // Lines
      ctx!.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i]; const b = dots[j];
          const dx = a.x - b.x; const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.35;
            ctx!.strokeStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      // Dots
      for (const d of dots) {
        ctx!.fillStyle = `rgba(${color}, 0.8)`;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    resize();
    rafRef.current = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => { visibleRef.current = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [disabled, effectiveCount, linkDistance, color]);

  if (disabled) return null;
  return <canvas ref={canvasRef} aria-hidden className={className ?? "absolute inset-0 -z-10 pointer-events-none"} />;
}
