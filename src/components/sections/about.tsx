"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, animate, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { stats } from "@/lib/data";
import { EASE_OUT_EXPO } from "@/lib/motion";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setVal(to);
      return;
    }
    const ctrl = animate(mv, to, { duration: 1.4, ease: EASE_OUT_EXPO });
    const unsub = mv.on("change", (v) => setVal(Math.floor(v)));
    return () => {
      ctrl.stop();
      unsub();
    };
  }, [inView, to, mv, reduced]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      {/* Atmospheric blue wash + numeral watermark. */}
      <div aria-hidden className="section-wash section-wash-blue" />
      <span
        aria-hidden
        className="numeral-stencil absolute -top-8 right-6 md:-top-12 md:right-12"
      >
        01
      </span>

      <div className="container-x relative">
        <SectionHeading
          eyebrow="About"
          title="Engineer by craft. Builder by instinct."
          description="Six years writing software across the stack — from low-latency data pipelines to polished frontends. Lately, I've been deep in the AI layer, building tools that think with you."
        />

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Copy column — 5/12 on lg, becomes a tighter editorial sidebar. */}
          <Reveal className="lg:col-span-5">
            <div className="space-y-6 text-base text-text-muted leading-relaxed body-pretty">
              <p>
                I started writing code at 14, shipped my first paid project at 18, and have been
                hooked on the loop of <span className="text-text">idea → build → ship</span> ever since.
                Today I focus on the intersection of <span className="text-text">product engineering</span> and
                <span className="text-text"> applied AI</span>.
              </p>
              <p>
                I care about systems that are fast, interfaces that feel inevitable, and codebases
                that the next engineer will thank you for. I&apos;ve led rewrites that cut p95 latency by
                85%, shipped AI features used by thousands, and open-sourced libraries that solve
                problems I kept hitting.
              </p>
              <p>
                When I&apos;m not coding, I&apos;m reading papers, brewing pour-overs, or losing chess games to
                people half my rating.
              </p>
            </div>
          </Reveal>

          {/* Stats — 7/12 on lg, stacked vertically as editorial numerals. */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <ul className="flex flex-col">
              {stats.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="group flex items-baseline justify-between gap-6 border-b border-border py-6 first:pt-0 last:border-b-0"
                >
                  <span className="numeral-xl text-gradient">
                    <Counter to={s.value} suffix={s.suffix} />
                  </span>
                  <span className="eyebrow shrink-0 text-right">{s.label}</span>
                </motion.li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
