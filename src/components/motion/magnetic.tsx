"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/use-magnetic";

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

/**
 * Wrap anything (button, icon) to make it drift toward the cursor.
 * Auto-disabled on touch / reduced-motion.
 */
export function Magnetic({ children, className, strength, radius }: Props) {
  const { ref, style } = useMagnetic({ strength, radius });
  return (
    <motion.div ref={ref as React.RefObject<HTMLDivElement>} style={style} className={className}>
      {children}
    </motion.div>
  );
}
