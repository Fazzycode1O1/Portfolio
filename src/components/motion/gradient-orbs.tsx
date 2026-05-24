"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Orb {
  color: string;
  size: number;
  x: string;
  y: string;
  delay?: number;
}

const DEFAULT: Orb[] = [
  { color: "rgba(143,169,189,0.32)", size: 520, x: "10%", y: "20%" },
  { color: "rgba(107,143,168,0.28)", size: 420, x: "78%", y: "12%", delay: 2 },
  { color: "rgba(184,149,111,0.22)", size: 460, x: "55%", y: "78%", delay: 4 },
];

/**
 * Slowly drifting blurred color orbs — drop into any container with `position: relative`.
 * Pure CSS transform animation so it's cheap to render even on mid-tier devices.
 */
export function GradientOrbs({ orbs = DEFAULT, className }: { orbs?: Orb[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden -z-10", className)}>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl will-change-transform"
          style={{ width: o.size, height: o.size, left: o.x, top: o.y, background: o.color, translate: "-50% -50%" }}
          animate={reduced ? undefined : { x: [0, 30, -20, 0], y: [0, -25, 15, 0] }}
          transition={{ duration: 24, delay: o.delay ?? 0, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
