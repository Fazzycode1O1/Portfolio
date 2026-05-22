"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  const [i, setI] = React.useState(0);
  const next = () => setI((p) => (p + 1) % testimonials.length);
  const prev = () => setI((p) => (p - 1 + testimonials.length) % testimonials.length);

  React.useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[i];

  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Kind words"
          title="What collaborators say."
          align="center"
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="relative glass rounded-2xl p-8 md:p-12">
            <Quote className="absolute -top-4 -left-4 size-16 text-gradient opacity-30" />
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Star key={k} className="size-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="font-display text-2xl leading-snug text-text md:text-3xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="grid size-12 place-items-center rounded-full bg-accent-gradient font-display text-lg font-semibold text-white">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-medium">{t.author}</p>
                    <p className="font-mono text-xs text-text-muted">{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={prev} aria-label="Previous" className="grid size-10 place-items-center rounded-lg glass hover:border-border-strong">
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`Slide ${k + 1}`}
                  className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-accent-gradient" : "w-1.5 bg-white/15"}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next" className="grid size-10 place-items-center rounded-lg glass hover:border-border-strong">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
