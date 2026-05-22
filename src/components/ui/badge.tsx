import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gradient" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/[0.05] text-text-muted border border-border",
    gradient: "bg-accent-gradient text-white border-0",
    outline: "border border-border-strong text-text",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-mono",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
