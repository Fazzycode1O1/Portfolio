"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  /** Pause animation on hover. */
  pauseOnHover?: boolean;
  /** Reverse direction. */
  reverse?: boolean;
  /** Apply a horizontal fade mask. */
  fade?: boolean;
  className?: string;
}

/**
 * Infinite horizontal marquee. Duplicates children so the loop is seamless.
 * Pure CSS keyframe animation — cheap and respects reduced-motion at the OS level.
 */
export function Marquee({
  children,
  duration = 40,
  pauseOnHover = true,
  reverse = false,
  fade = true,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        fade && "[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]",
        className
      )}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
          className={cn(
            "flex shrink-0 items-center gap-12 px-6 animate-marquee will-change-transform motion-reduce:animate-none",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
