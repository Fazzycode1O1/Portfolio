"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { EASE_OUT_EXPO, DUR_BASE } from "@/lib/motion";

/**
 * Wraps page content so route changes get a soft fade + lift.
 * Keyed by pathname so AnimatePresence sees a new child on navigation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: DUR_BASE, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
