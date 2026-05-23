"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ExperienceItem } from "@/types";
import { cn } from "@/lib/utils";

export function Experience({ experience }: { experience: ExperienceItem[] }) {
  const [tab, setTab] = React.useState<"work" | "education">("work");
  const items = experience.filter((e) => e.type === tab);

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've built."
          description="A timeline of roles, companies, and the lessons I carried forward."
        />

        <div className="mb-10 inline-flex rounded-full glass p-1">
          {(["work", "education"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                tab === t ? "bg-accent-gradient text-white" : "text-text-muted hover:text-text"
              )}
            >
              {t === "work" ? <Briefcase className="size-3" /> : <GraduationCap className="size-3" />}
              {t}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-accent-from via-accent-via to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {items.map((item, i) => (
              <motion.div
                key={`${item.company}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={cn(
                  "relative grid gap-4 md:grid-cols-2 md:gap-12",
                  i % 2 === 0 ? "" : "md:[&>div:first-child]:order-2"
                )}
              >
                <div
                  className={cn(
                    "absolute left-4 top-6 size-3 -translate-x-1/2 rounded-full bg-accent-gradient shadow-glow-violet md:left-1/2"
                  )}
                />

                <div className={cn("pl-12 md:pl-0", i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12")}>
                  <div className="font-mono text-xs uppercase tracking-wider text-gradient">
                    {item.start} — {item.end ?? "Present"}
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{item.role}</h3>
                  <p className="mt-1 text-text-muted">{item.company} · {item.location}</p>
                </div>

                <div className={cn("pl-12 md:pl-0", i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right")}>
                  <div className="glass rounded-2xl p-6">
                    <ul className={cn("space-y-2 text-sm text-text-muted", i % 2 !== 0 && "md:text-right")}>
                      {item.highlights.map((h, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-gradient">→</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
