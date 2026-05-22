"use client";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Animate the gradient hue shifting horizontally. */
  animate?: boolean;
}

/**
 * Premium gradient text — optional infinite horizontal sweep.
 */
export function GradientText({ children, className, animate = true }: Props) {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-[linear-gradient(110deg,#7C5CFF,#4F8BFF,#4FE0FF,#7C5CFF)] [background-size:200%_100%]",
        animate && "animate-gradient-shift motion-reduce:animate-none",
        className
      )}
    >
      {children}
    </span>
  );
}
