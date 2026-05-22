"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}

/**
 * Spring-based 3D tilt wrapper. Pointer-aware, touch-safe, reduced-motion-safe.
 */
export function Tilt({ children, className, max, glare = false }: Props) {
  const { ref, onMouseMove, onMouseLeave, style, glare: glareStyle, disabled } = useTilt({ max });
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className={cn("relative", className)}
    >
      {children}
      {glare && !disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-overlay"
          style={glareStyle}
        />
      )}
    </motion.div>
  );
}
