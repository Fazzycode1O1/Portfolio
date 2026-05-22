import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-border bg-white/[0.03] px-4 text-sm text-text placeholder:text-text-subtle transition-all duration-200",
        "focus:border-accent-via focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-accent-via/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-border bg-white/[0.03] px-4 py-3 text-sm text-text placeholder:text-text-subtle transition-all duration-200 resize-y",
        "focus:border-accent-via focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-accent-via/30",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-xs font-mono uppercase tracking-wider text-text-muted", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
