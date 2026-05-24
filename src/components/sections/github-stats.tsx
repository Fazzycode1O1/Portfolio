"use client";

import { motion } from "framer-motion";
import { Github, Star, GitFork, Users, Activity } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { EASE_OUT_EXPO, DUR_SLOW } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SpineLabel } from "@/components/shared/spine-label";

const MOCK = {
  followers: 482,
  stars: 2103,
  repos: 47,
  contributions: 1842,
  topRepos: [
    { name: "neural-notes", desc: "AI second brain", stars: 612, lang: "TypeScript" },
    { name: "lumen-ui", desc: "Motion-first component library", stars: 489, lang: "TypeScript" },
    { name: "agent-forge", desc: "Visual LLM workflow builder", stars: 387, lang: "Python" },
  ],
  languages: [
    { name: "TypeScript", pct: 42, color: "#3178c6" },
    { name: "Python", pct: 28, color: "#3572A5" },
    { name: "Go", pct: 12, color: "#00ADD8" },
    { name: "Rust", pct: 9, color: "#dea584" },
    { name: "Other", pct: 9, color: "#A0A0AE" },
  ],
};

const PROFILE_STATS = [
  { label: "Stars earned", icon: Star, value: MOCK.stars },
  { label: "Followers", icon: Users, value: MOCK.followers },
  { label: "Repositories", icon: GitFork, value: MOCK.repos },
  { label: "Contributions · yr", icon: Activity, value: MOCK.contributions },
];

export function GitHubStats() {
  return (
    <section
      id="github"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden className="section-wash section-wash-blue" />
      <SpineLabel index="06" label="Open Source" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Open source"
          title="Open-source pulse."
          description="A snapshot of what I'm shipping in public — stars, code, and recent commits."
        />

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Profile stats card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DUR_SLOW, ease: EASE_OUT_EXPO }}
            className="card-surface relative overflow-hidden rounded-sm p-7 lg:col-span-1"
          >
            <div className="mb-6 flex items-center gap-2">
              <Github className="size-4 text-text-muted" />
              <span className="eyebrow">Profile</span>
            </div>
            <ul className="space-y-5">
              {PROFILE_STATS.map(({ label, icon: Icon, value }) => (
                <li
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <span className="flex items-center gap-2 text-sm text-text-muted">
                    <Icon className="size-3.5" />
                    {label}
                  </span>
                  <span className="font-mono text-2xl font-medium tabular-nums text-signal">
                    {value.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Top repos + languages */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: DUR_SLOW, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="card-surface relative overflow-hidden rounded-sm p-7 lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="eyebrow">Top repositories</span>
              <span className="eyebrow text-text-subtle">{MOCK.topRepos.length}</span>
            </div>
            <ul className="divide-y divide-border">
              {MOCK.topRepos.map((r, i) => (
                <li
                  key={r.name}
                  className={cn(
                    "group flex items-center justify-between gap-4 py-4 transition-colors duration-fast ease-out-quart hover:bg-text/[0.02]",
                    i === 0 && "pt-0",
                    i === MOCK.topRepos.length - 1 && "pb-0"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-text">{r.name}</p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">{r.desc}</p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="font-mono text-xs text-text-subtle">{r.lang}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text">
                      <Star className="size-3 fill-warning text-warning" /> {r.stars}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="eyebrow mb-4">Languages</p>
              {/* Stacked bar — same proportions as old, refined to read like an
                  Apple-style allocation chart. */}
              <div className="flex h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                {MOCK.languages.map((l) => (
                  <motion.div
                    key={l.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.pct}%` }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT_EXPO }}
                    style={{ background: l.color }}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {MOCK.languages.map((l) => (
                  <span
                    key={l.name}
                    className="inline-flex items-center gap-2 font-mono text-xs text-text-muted"
                  >
                    <span className="size-2 rounded-full" style={{ background: l.color }} />
                    {l.name}{" "}
                    <span className="text-text-subtle tabular-nums">{l.pct}%</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
