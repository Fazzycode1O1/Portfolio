"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import type { Skill, SkillCategory } from "@/types";
import { Marquee } from "@/components/motion/marquee";
import { EASE_OUT_EXPO } from "@/lib/motion";

const CATEGORIES: { key: SkillCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "language", label: "Languages" },
  { key: "framework", label: "Frameworks" },
  { key: "ai", label: "AI / ML" },
  { key: "devops", label: "DevOps" },
  { key: "db", label: "Databases" },
  { key: "tool", label: "Tools" },
];

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  language: "Lang",
  framework: "Frwk",
  ai: "AI",
  devops: "DevOps",
  db: "DB",
  tool: "Tool",
};

const MARQUEE = [
  "Next.js",
  "TypeScript",
  "Python",
  "OpenAI",
  "MongoDB",
  "Tailwind",
  "Docker",
  "AWS",
  "PyTorch",
  "Vercel",
  "LangChain",
  "Redis",
];

export function Skills({ skills }: { skills: Skill[] }) {
  const [active, setActive] = React.useState<SkillCategory | "all">("all");
  const filtered = active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section
      id="skills"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden className="section-wash section-wash-cyan" />
      <span
        aria-hidden
        className="numeral-stencil absolute -top-8 left-6 md:-top-12 md:left-12"
      >
        02
      </span>

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Skills"
          title="The toolbox."
          description="What I reach for, day to day, to ship products and ideas."
        />

        {/* Filter — text links with a sliding underline (shared layoutId). */}
        <div className="mb-14 flex flex-wrap gap-x-7 gap-y-3" role="tablist" aria-label="Skill category filter">
          {CATEGORIES.map((c) => {
            const isActive = active === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={cn(
                  "relative pb-2 font-mono text-xs uppercase tracking-[0.32em] transition-colors duration-fast ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-bg",
                  isActive ? "text-text" : "text-text-subtle hover:text-text-muted"
                )}
              >
                {c.label}
                {isActive && (
                  <motion.span
                    layoutId="skills-filter-underline"
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px h-px bg-accent-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Skill list — typographic rows, no card chrome. */}
        <motion.ul
          layout
          transition={{ layout: { duration: 0.5, ease: EASE_OUT_EXPO } }}
          className="grid grid-cols-1 gap-x-12 gap-y-1 sm:grid-cols-2"
        >
          {filtered.map((skill, i) => (
            <motion.li
              key={skill.name}
              layout
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: (i % 12) * 0.03, duration: 0.5, ease: EASE_OUT_EXPO }}
              className="group flex items-center justify-between gap-6 border-b border-border py-3.5 transition-colors duration-fast ease-out-quart hover:border-border-strong"
            >
              <div className="flex min-w-0 items-baseline gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-subtle">
                  {CATEGORY_LABEL[skill.category]}
                </span>
                <span className="truncate text-base text-text">{skill.name}</span>
              </div>
              {/* Proficiency — 5-segment bar, last filled segment glows cyan. */}
              <div className="flex shrink-0 items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => {
                  const filled = j < skill.proficiency;
                  const isLastFilled = j === skill.proficiency - 1;
                  return (
                    <span
                      key={j}
                      className={cn(
                        "h-1 w-3.5 rounded-full transition-colors duration-base",
                        filled
                          ? "bg-accent-gradient"
                          : "bg-black/10 dark:bg-white/10",
                        isLastFilled && "shadow-glow-cyan"
                      )}
                    />
                  );
                })}
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-20">
          <Marquee duration={40} fade>
            {MARQUEE.map((t) => (
              <span key={t} className="whitespace-nowrap font-mono text-sm text-text-subtle">
                / {t}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
