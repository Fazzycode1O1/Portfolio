"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";
import { EASE_OUT_EXPO, DUR_SLOW } from "@/lib/motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR_SLOW, ease: EASE_OUT_EXPO } },
};

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = variants;
