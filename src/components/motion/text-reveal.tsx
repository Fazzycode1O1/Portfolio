"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: React.ElementType;
}

/**
 * Word-by-word reveal with a subtle blur unfurl. Lazily triggers in-view.
 */
export function TextReveal({ text, className, delay = 0, stagger = 0.07, as: Tag = "span" }: Props) {
  const reduced = useReducedMotion();
  const words = React.useMemo(() => text.split(" "), [text]);

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline">
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
