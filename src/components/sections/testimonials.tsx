"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Stacked-deck testimonials. Up to three cards visible: front in focus,
 * the next two recede behind at decreasing scale + opacity. Nav arrows
 * shuffle the deck. Auto-rotate intentionally disabled — restrained motion.
 */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [i, setI] = React.useState(0);
  const len = testimonials.length;

  const next = React.useCallback(() => setI((p) => (p + 1) % len), [len]);
  const prev = () => setI((p) => (p - 1 + len) % len);

  if (len === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden className="section-wash section-wash-purple" />
      <span
        aria-hidden
        className="numeral-stencil absolute -top-8 left-6 md:-top-12 md:left-12"
      >
        07
      </span>
      <div className="container-x relative">
        <SectionHeading eyebrow="Kind words" title="What collaborators say." align="center" />

        <div className="relative mx-auto max-w-3xl">
          {/* Card stack — fixed height holds the deck. Tuned for 3 lines of quote
              on desktop; mobile cards stretch on tall quotes via min-height. */}
          <div className="relative h-[420px] md:h-[360px]">
            {testimonials.map((t, idx) => {
              const offset = ((idx - i) % len + len) % len;
              const visible = offset < 3;
              const isFront = offset === 0;

              const y = offset === 0 ? 0 : offset === 1 ? 18 : 36;
              const scale = 1 - offset * 0.04;
              const opacity = !visible ? 0 : offset === 0 ? 1 : offset === 1 ? 0.55 : 0.25;

              return (
                <motion.article
                  key={`${t.author}-${idx}`}
                  initial={false}
                  animate={{ y, scale, opacity }}
                  transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                  style={{
                    zIndex: 10 - offset,
                    pointerEvents: isFront ? "auto" : "none",
                  }}
                  aria-hidden={!isFront}
                  className={cn(
                    "card-surface absolute inset-0 rounded-sm p-8 md:p-12",
                    isFront ? "shadow-elev-3" : "shadow-elev-1"
                  )}
                >
                  <Quote
                    aria-hidden
                    className="absolute -top-4 -left-4 size-14 text-gradient opacity-30"
                  />
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} className="size-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="font-display text-2xl leading-snug text-text md:text-3xl [text-wrap:pretty]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="grid size-12 place-items-center rounded-full bg-accent-gradient shadow-glow-blue font-display text-lg font-semibold text-white">
                      {t.author[0]}
                    </div>
                    <div>
                      <p className="font-medium text-text">{t.author}</p>
                      <p className="font-mono text-xs text-text-muted">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Controls — sit below the deck, evenly spaced. */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              type="button"
              disabled={len < 2}
              className="grid size-10 place-items-center rounded-lg glass transition-[border-color,transform] duration-fast ease-out-quart hover:border-border-strong hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Testimonial deck"
            >
              {testimonials.map((_, k) => {
                const isCurrent = k === i;
                return (
                  <button
                    key={k}
                    onClick={() => setI(k)}
                    aria-label={`Show testimonial ${k + 1}`}
                    aria-selected={isCurrent}
                    role="tab"
                    type="button"
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-base ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                      isCurrent
                        ? "w-8 bg-accent-gradient"
                        : "w-1.5 bg-black/15 dark:bg-white/15 hover:bg-black/30 dark:hover:bg-white/30"
                    )}
                  />
                );
              })}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              type="button"
              disabled={len < 2}
              className="grid size-10 place-items-center rounded-lg glass transition-[border-color,transform] duration-fast ease-out-quart hover:border-border-strong hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <p className="mt-6 text-center font-mono text-xs text-text-subtle">
            {String(i + 1).padStart(2, "0")} <span className="text-text-subtle">/</span>{" "}
            {String(len).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
