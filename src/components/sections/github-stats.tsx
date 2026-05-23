"use client";

import { motion } from "framer-motion";
import { Github, Star, GitFork, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

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

export function GitHubStats() {
  return (
    <section id="github" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="GitHub"
          title="Open-source pulse."
          description="Live snapshot of what I'm shipping in public."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 lg:col-span-1"
          >
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase text-text-muted">
              <Github className="size-4" /> Profile
            </div>
            <div className="space-y-4">
              {[
                { label: "Stars", icon: Star, value: MOCK.stars },
                { label: "Followers", icon: Users, value: MOCK.followers },
                { label: "Repositories", icon: GitFork, value: MOCK.repos },
                { label: "Contributions (yr)", icon: Star, value: MOCK.contributions },
              ].map(({ label, icon: Icon, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <span className="flex items-center gap-2 text-sm text-text-muted">
                    <Icon className="size-4" /> {label}
                  </span>
                  <span className="font-display text-xl font-semibold text-gradient">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <div className="mb-4 font-mono text-xs uppercase text-text-muted">Top repositories</div>
            <ul className="space-y-3">
              {MOCK.topRepos.map((r) => (
                <li key={r.name} className="flex items-center justify-between rounded-xl bg-black/[0.02] dark:bg-white/[0.02] p-4 transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                  <div>
                    <p className="font-mono text-sm text-text">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-text-muted">{r.lang}</span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-text">
                      <Star className="size-3" /> {r.stars}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <div className="mb-3 font-mono text-xs uppercase text-text-muted">Languages</div>
              <div className="flex h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                {MOCK.languages.map((l) => (
                  <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {MOCK.languages.map((l) => (
                  <span key={l.name} className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                    <span className="size-2 rounded-full" style={{ background: l.color }} />
                    {l.name} <span className="text-text-subtle">{l.pct}%</span>
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
