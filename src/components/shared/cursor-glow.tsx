"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Subtle cursor-following glow. Mounts only on fine pointers and respects
 * prefers-reduced-motion. Uses screen blend over the cool accent stack so it
 * brightens dark surfaces without tinting light ones.
 */
export function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 140, damping: 24, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 24, mass: 0.5 });
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 140);
      y.set(e.clientY - 140);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, reduced]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[280px] w-[280px] rounded-full opacity-40 mix-blend-screen blur-3xl"
    >
      <div className="size-full rounded-full bg-[radial-gradient(circle,rgba(107,143,168,0.55),rgba(184,149,111,0.25)_45%,transparent_70%)]" />
    </motion.div>
  );
}
