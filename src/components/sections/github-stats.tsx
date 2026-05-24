"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Users, Activity } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { EASE_OUT_EXPO, DUR_SLOW } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SpineLabel } from "@/components/shared/spine-label";
import { fetcher } from "@/lib/api-client";

/** Shape of the /api/github/stats response. Mirrors the route in
 *  src/app/api/github/stats/route.ts. */
interface GithubStats {
  username: string;
  followers: number;
  repos: number;
  stars: number;
  forks: number;
  topRepos: { name: string; desc: string | null; stars: number; lang: string | null; url: string }[];
  languages: { name: string; pct: number }[];
}

/** Fallback while loading or when the API errors (offline, rate-limited, etc.).
 *  Keeps the section visually filled instead of rendering empty zeros. */
const FALLBACK: GithubStats = {
  username: "Fazzycode1O1",
  followers: 0,
  repos: 0,
  stars: 0,
  forks: 0,
  topRepos: [],
  languages: [],
};

/** Color swatches for the most-common languages — applied client-side because
 *  the API endpoint returns name+pct only. Unknown languages fall back to the
 *  "Other" swatch. */
const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};
const LANG_FALLBACK_COLOR = "#A0A0AE";

export function GitHubStats() {
  // SWR with a 60s deduping window — UI feels fresh, edge route still bears
  // the cost only every 1h (route-level revalidate).
  const { data, isLoading } = useSWR<GithubStats>("/api/github/stats", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
    fallbackData: FALLBACK,
  });

  const stats = data ?? FALLBACK;
  const profileStats = [
    { label: "Stars earned", icon: Star, value: stats.stars },
    { label: "Followers", icon: Users, value: stats.followers },
    { label: "Repositories", icon: GitFork, value: stats.repos },
    { label: "Forks · earned", icon: Activity, value: stats.forks },
  ];
  const languages = stats.languages.map((l) => ({
    ...l,
    color: LANG_COLOR[l.name] ?? LANG_FALLBACK_COLOR,
  }));

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
            <div className="mb-6 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Github className="size-4 text-text-muted" />
                <span className="eyebrow">Profile</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-subtle">
                @{stats.username}
              </span>
            </div>
            <ul className="space-y-5">
              {profileStats.map(({ label, icon: Icon, value }) => (
                <li
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <span className="flex items-center gap-2 text-sm text-text-muted">
                    <Icon className="size-3.5" />
                    {label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-2xl font-medium tabular-nums text-signal transition-opacity duration-base",
                      isLoading && "opacity-50"
                    )}
                  >
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
              <span className="eyebrow text-text-subtle">{stats.topRepos.length}</span>
            </div>

            {stats.topRepos.length === 0 ? (
              <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.28em] text-text-subtle">
                {isLoading ? "Loading repositories…" : "No repositories to show"}
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {stats.topRepos.map((r, i) => (
                  <li
                    key={r.name}
                    className={cn(
                      "group flex items-center justify-between gap-4 py-4 transition-colors duration-fast ease-out-quart hover:bg-text/[0.02]",
                      i === 0 && "pt-0",
                      i === stats.topRepos.length - 1 && "pb-0"
                    )}
                  >
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1"
                    >
                      <p className="truncate font-mono text-sm text-text transition-colors duration-fast group-hover:text-signal-bright">
                        {r.name}
                      </p>
                      {r.desc && (
                        <p className="mt-0.5 truncate text-xs text-text-muted">{r.desc}</p>
                      )}
                    </a>
                    <div className="flex shrink-0 items-center gap-5">
                      {r.lang && (
                        <span className="font-mono text-xs text-text-subtle">{r.lang}</span>
                      )}
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text">
                        <Star className="size-3 fill-warning text-warning" /> {r.stars}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {languages.length > 0 && (
              <div className="mt-8">
                <p className="eyebrow mb-4">Languages</p>
                <div className="flex h-1.5 overflow-hidden rounded-full bg-white/5">
                  {languages.map((l) => (
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
                  {languages.map((l) => (
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
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
