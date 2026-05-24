"use client";

import * as React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Top-of-page gradient progress bar tied to scroll position.
 *
 * - Hidden until the page has scrolled a few px (avoids a flash at the top).
 * - Spring-smoothed so it doesn't jitter on small scrolls / momentum.
 * - Subtle vertical glow underneath for that premium "the page knows where I am" feel.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });
  // Fade in only after we've actually moved — no permanent 1px line at the top.
  const opacity = useTransform(scrollYProgress, [0, 0.01, 1], [0, 1, 1]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
    >
      <motion.div
        className="h-full origin-left bg-accent-gradient shadow-[0_0_12px_rgba(107,143,168,0.45)]"
        style={{ scaleX }}
      />
    </motion.div>
  );
}
