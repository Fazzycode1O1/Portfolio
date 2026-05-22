"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-via focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-gradient text-white shadow-glow-violet hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,92,255,0.5)] active:translate-y-0",
        secondary:
          "glass text-text hover:border-border-strong hover:-translate-y-0.5",
        ghost:
          "text-text-muted hover:text-text hover:bg-white/5",
        outline:
          "border border-border text-text hover:border-border-strong hover:bg-white/[0.03]",
        destructive:
          "border border-danger/40 text-danger hover:bg-danger/10",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-sm",
        md: "h-10 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-base",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
