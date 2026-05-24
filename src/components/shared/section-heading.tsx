"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: Props) {
  return (
    <div className={cn("mb-14 md:mb-20 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <div
            className={cn(
              "eyebrow mb-6 flex items-center gap-3",
              align === "center" && "justify-center"
            )}
          >
            {/* Hairline accent draws in via scaleX after the eyebrow fades in. */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT_EXPO }}
              className="h-px w-8 origin-left bg-accent-gradient"
            />
            <span className="text-gradient">{eyebrow}</span>
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="display-xl font-display text-text [text-wrap:balance]">{title}</h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-6 text-base text-text-muted md:text-lg body-pretty",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
