import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Atelier mark. Replaces the old filled pill `Badge` from the SaaS era.
 *
 * Variants:
 *   default  — hairline-bordered mono cell, no fill, sharp corners. The
 *              architectural-index look. Use for tech / category lists.
 *   gradient — small-caps mono with an em-dash prefix in the signal color.
 *              Pure type, no chrome. Use for "FEATURED" / "NEW" markers.
 *   outline  — bottom-hairline only, no border on sides. Use when the mark
 *              sits inside a denser table-like layout where full borders
 *              would compete with row dividers.
 *
 * The component name and variant keys stay identical to the historical
 * `Badge` so every call site keeps working with only a visual delta.
 */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gradient" | "outline";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  if (variant === "gradient") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-signal",
          className
        )}
        {...props}
      >
        <span aria-hidden>—</span>
        <span>{children}</span>
      </span>
    );
  }

  if (variant === "outline") {
    return (
      <span
        className={cn(
          "inline-flex items-center border-b border-border pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border px-2 py-[3px] font-mono text-[11px] text-text-muted transition-colors duration-fast ease-out-quart hover:border-border-strong",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
