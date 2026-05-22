"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { stats } from "@/lib/data";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, to, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
    const unsub = mv.on("change", (v) => setVal(Math.floor(v)));
    return () => { ctrl.stop(); unsub(); };
  }, [inView, to, mv]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="About"
          title="Engineer by craft. Builder by instinct."
          description="Six years writing software across the stack — from low-latency data pipelines to polished frontends. Lately, I've been deep in the AI layer, building tools that think with you."
        />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <div className="space-y-6 text-base text-text-muted leading-relaxed">
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

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="font-display text-4xl font-semibold tracking-tight text-gradient md:text-5xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-text-muted">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
