"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top-of-page gradient progress bar tied to scroll position.
 * Uses a spring for smooth tracking. Cheap (transform-only).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent-gradient"
      style={{ scaleX }}
    />
  );
}
