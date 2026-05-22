"use client";

import * as React from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useIsTouch } from "@/hooks/use-mobile";

interface Options {
  /** Max translation in px (default 10). */
  strength?: number;
  /** Activation radius around the element in px (default 80). */
  radius?: number;
  stiffness?: number;
  damping?: number;
}

/**
 * Returns ref + motion-value style for a button/icon that drifts toward the cursor.
 *
 *   const { ref, style } = useMagnetic();
 *   <motion.button ref={ref} style={style} />
 */
export function useMagnetic({ strength = 10, radius = 80, stiffness = 220, damping = 18 }: Options = {}) {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const disabled = reduced || isTouch;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness, damping });
  const sy = useSpring(y, { stiffness, damping });

  React.useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        x.set(0);
        y.set(0);
        return;
      }
      const factor = 1 - dist / radius;
      x.set((dx / radius) * strength * factor);
      y.set((dy / radius) * strength * factor);
    }
    function onLeave() {
      x.set(0);
      y.set(0);
    }

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [disabled, x, y, radius, strength]);

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    style: disabled ? {} : { x: sx, y: sy },
    disabled,
  };
}
