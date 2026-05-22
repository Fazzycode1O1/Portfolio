"use client";

import * as React from "react";
import { useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useIsTouch } from "./use-mobile";

interface Options {
  /** Max rotation in degrees (default 6). */
  max?: number;
  /** Spring stiffness (default 180). */
  stiffness?: number;
  /** Spring damping (default 22). */
  damping?: number;
  /** Enables a glare layer transform (use the returned `glare` style). */
  glare?: boolean;
}

/**
 * 3D tilt hook with spring-back. Returns refs/handlers + ready-to-use style values.
 *
 * Usage:
 *   const { ref, onMouseMove, onMouseLeave, style, glare } = useTilt();
 *   return <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={style}>…</div>;
 */
export function useTilt({ max = 6, stiffness = 180, damping = 22 }: Options = {}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const disabled = reduced || isTouch;

  const x = useMotionValue(0); // normalized -0.5..0.5
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness, damping, mass: 0.5 });
  const sy = useSpring(y, { stiffness, damping, mass: 0.5 });

  const rotateX = useTransform(sy, (v) => -v * max);
  const rotateY = useTransform(sx, (v) => v * max);
  const glareX = useTransform(sx, (v) => `${50 + v * 100}%`);
  const glareY = useTransform(sy, (v) => `${50 + v * 100}%`);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width - 0.5);
      y.set((e.clientY - r.top) / r.height - 0.5);
    },
    [disabled, x, y]
  );

  const onMouseLeave = React.useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    ref,
    onMouseMove,
    onMouseLeave,
    style: disabled ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" as const, perspective: 1000 },
    glare: { background: `radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.18), transparent 50%)`, "--gx": glareX, "--gy": glareY } as React.CSSProperties,
    disabled,
  };
}
