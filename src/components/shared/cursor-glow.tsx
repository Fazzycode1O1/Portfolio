"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.4 });

  React.useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 120);
      y.set(e.clientY - 120);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[240px] w-[240px] rounded-full opacity-60 mix-blend-screen blur-3xl"
    >
      <div className="size-full rounded-full bg-accent-gradient" />
    </motion.div>
  );
}
