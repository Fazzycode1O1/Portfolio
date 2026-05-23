"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { skills } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/types";
import { Marquee } from "@/components/motion/marquee";

const CATEGORIES: { key: SkillCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "language", label: "Languages" },
  { key: "framework", label: "Frameworks" },
  { key: "ai", label: "AI / ML" },
  { key: "devops", label: "DevOps" },
  { key: "db", label: "Databases" },
  { key: "tool", label: "Tools" },
];

const MARQUEE = ["Next.js", "TypeScript", "Python", "OpenAI", "MongoDB", "Tailwind", "Docker", "AWS", "PyTorch", "Vercel", "LangChain", "Redis"];

export function Skills() {
  const [active, setActive] = React.useState<SkillCategory | "all">("all");
  const filtered = active === "all" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Skills"
          title="The toolbox."
          description="What I reach for, day to day, to ship products and ideas."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={cn(
                "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                active === c.key
                  ? "bg-accent-gradient text-white shadow-glow-violet"
                  : "glass text-text-muted hover:text-text"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group glass relative flex flex-col items-center gap-3 rounded-2xl p-5 text-center transition-all hover:border-border-strong"
            >
              <div className="grid size-12 place-items-center rounded-xl bg-black/[0.04] dark:bg-white/[0.04] text-base font-mono font-semibold text-gradient transition-all group-hover:shadow-glow-violet">
                {skill.name[0]}
              </div>
              <p className="text-sm font-medium text-text">{skill.name}</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 w-3 rounded-full",
                      i < skill.proficiency ? "bg-accent-gradient" : "bg-black/10 dark:bg-white/10"
                    )}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16">
          <Marquee duration={40} fade>
            {MARQUEE.map((t) => (
              <span key={t} className="whitespace-nowrap font-mono text-sm text-text-subtle">/ {t}</span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
