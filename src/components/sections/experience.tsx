"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ExperienceItem } from "@/types";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, DUR_SLOW } from "@/lib/motion";
import { SpineLabel } from "@/components/shared/spine-label";

/** One timeline entry. Each gets its own scroll-coupled rail accent. */
function TimelineRow({ item, index }: { item: ExperienceItem; index: number }) {
  const rowRef = React.useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  // Rail accent draws in as the row enters the viewport.
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 85%", "start 30%"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.li
      ref={rowRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: DUR_SLOW, delay: index * 0.06, ease: EASE_OUT_EXPO }}
      className="relative grid grid-cols-12 gap-6 border-t border-border py-12 md:gap-12 md:py-14"
    >
      {/* Left rail accent — 2px scaleY draw as you scroll into the row. */}
      <motion.span
        aria-hidden
        style={reduced ? { scaleY: 1 } : { scaleY: railScale }}
        className="pointer-events-none absolute left-0 top-0 h-full w-px origin-top bg-accent-gradient"
      />

      {/* Period column */}
      <div className="col-span-12 md:col-span-3">
        <p className="eyebrow text-signal">
          {item.start} — {item.end ?? "Now"}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-text-subtle">
          {item.type === "work" ? <Briefcase className="size-3" /> : <GraduationCap className="size-3" />}
          {item.type === "work" ? "Work" : "Education"}
        </p>
      </div>

      {/* Content column */}
      <div className="col-span-12 md:col-span-9">
        <h3 className="display-xl font-display text-text">{item.company}</h3>
        <p className="mt-2 text-base text-text-muted md:text-lg">
          {item.role}
          {item.location && (
            <>
              {" "}
              <span className="text-text-subtle">·</span>{" "}
              <span className="text-text-subtle">{item.location}</span>
            </>
          )}
        </p>
        <ul className="mt-6 space-y-2.5 text-text-muted body-pretty">
          {item.highlights.map((h, j) => (
            <li key={j} className="flex gap-3">
              <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-accent" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

export function Experience({ experience }: { experience: ExperienceItem[] }) {
  const [tab, setTab] = React.useState<"work" | "education">("work");
  const items = experience.filter((e) => e.type === tab);

  return (
    <section
      id="experience"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden className="section-wash section-wash-purple" />
      <SpineLabel index="04" label="Experience" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've built."
          description="A timeline of roles, companies, and the lessons I carried forward."
        />

        {/* Work / Education toggle — sliding underline matches Skills filter pattern. */}
        <div
          className="mb-12 flex flex-wrap gap-x-7 gap-y-3"
          role="tablist"
          aria-label="Experience type filter"
        >
          {(["work", "education"] as const).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={cn(
                  "relative inline-flex items-center gap-2 pb-2 font-mono text-xs uppercase tracking-[0.32em] transition-colors duration-fast ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-bg",
                  isActive ? "text-text" : "text-text-subtle hover:text-text-muted"
                )}
              >
                {t === "work" ? <Briefcase className="size-3" /> : <GraduationCap className="size-3" />}
                {t}
                {isActive && (
                  <motion.span
                    layoutId="experience-filter-underline"
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-px bg-accent-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <ul className="border-b border-border">
          {items.map((item, i) => (
            <TimelineRow key={`${item.company}-${i}`} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
