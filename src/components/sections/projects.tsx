"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/motion/tilt";
import { EASE_OUT_EXPO } from "@/lib/motion";

const FILTERS = ["All", "AI", "Full-Stack", "Frontend", "Data", "OSS"];

/* ─────────────────────────── Standard project card ────────────────────────── */

function ProjectCardBase({ project }: { project: Project }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 24 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
    >
      <Tilt max={5} glare className="h-full">
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          className={cn(
            "group relative h-full overflow-hidden rounded-sm card-surface transition-[box-shadow,border-color] duration-base ease-out-quart",
            "hover:border-border-strong hover:shadow-elev-3"
          )}
        >
          <Link href={`/projects/${project.slug}`} className="block">
            <div className="relative aspect-[16/10] overflow-hidden">
              <motion.div
                variants={{ rest: { scale: 1 }, hover: { scale: 1.045 } }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                className="absolute inset-0"
              >
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                aria-hidden
                variants={{ rest: { opacity: 1 }, hover: { opacity: 0.78 } }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent"
              />

              <motion.div
                aria-hidden
                variants={{ rest: { opacity: 0 }, hover: { opacity: 0.55 } }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="pointer-events-none absolute -inset-px rounded-sm"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 100%, rgba(107,143,168,0.20), transparent 70%)",
                }}
              />

              <motion.div
                variants={{ rest: { opacity: 0, y: 6 }, hover: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="absolute right-4 top-4 grid size-10 place-items-center rounded-lg glass-strong"
              >
                <ArrowUpRight className="size-4" />
              </motion.div>
            </div>

            <div className="p-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <motion.h3
                  variants={{ rest: { x: 0 }, hover: { x: 2 } }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                  className="font-display text-xl font-semibold tracking-tight text-text md:text-2xl"
                >
                  {project.title}
                </motion.h3>
                <span className="font-mono text-xs text-text-subtle">{project.year}</span>
              </div>
              <p className="text-sm text-text-muted [text-wrap:pretty]">{project.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.slice(0, 3).map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
                {project.tech.length > 3 && <Badge>+{project.tech.length - 3}</Badge>}
              </div>
            </div>
          </Link>

          {(project.liveUrl || project.repoUrl) && (
            <div className="flex items-center gap-4 border-t border-border px-6 py-3">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  className="group/link relative inline-flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  <ExternalLink className="size-3" /> Live
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-5 right-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover/link:scale-x-100"
                  />
                </Link>
              )}
              {project.repoUrl && (
                <Link
                  href={project.repoUrl}
                  target="_blank"
                  className="group/link relative inline-flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  <Github className="size-3" /> Code
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-5 right-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover/link:scale-x-100"
                  />
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </Tilt>
    </motion.div>
  );
}

export const ProjectCard = React.memo(ProjectCardBase);
ProjectCard.displayName = "ProjectCard";

/* ─────────────────────────── Featured project panel ───────────────────────── */
/* Side-by-side asymmetric: cover left, content right. Cover parallax-scales as
   the section moves through the viewport. */

function FeaturedProjectPanel({ project }: { project: Project }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const coverScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const coverY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      className="grid grid-cols-12 items-center gap-8 md:gap-12 lg:gap-16"
    >
      {/* Cover */}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Open ${project.title}`}
        className="group relative col-span-12 overflow-hidden rounded-sm md:col-span-7"
      >
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[4/5]">
          <motion.div
            style={reduced ? undefined : { scale: coverScale, y: coverY }}
            className="absolute inset-0"
          >
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width:768px) 100vw, 60vw"
              className="object-cover transition-transform duration-slow ease-out-quart group-hover:scale-[1.03]"
              priority
            />
          </motion.div>

          {/* Accent halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-slow group-hover:opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 100%, rgba(107,143,168,0.32), transparent 75%)",
            }}
          />

          {/* Featured marker is rendered in the right-column eyebrow — kept off
              the cover for a cleaner editorial composition. */}
          <div className="absolute right-5 top-5 grid size-11 place-items-center border border-border-strong bg-bg/40 backdrop-blur-sm opacity-0 transition-all duration-base ease-out-quart group-hover:opacity-100 group-hover:-translate-y-0.5">
            <ArrowUpRight className="size-5" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="col-span-12 flex flex-col justify-center md:col-span-5">
        <div className="flex items-center gap-4">
          <p className="eyebrow text-signal">{project.year}</p>
          <span aria-hidden className="h-px w-6 bg-border-strong" />
          <Badge variant="gradient">Featured</Badge>
        </div>
        <h3 className="display-xl font-display mt-5 [text-wrap:balance]">
          {project.title}
        </h3>
        <p className="mt-6 text-lg text-text-muted body-pretty md:text-xl">
          {project.tagline}
        </p>
        <p className="mt-6 text-text-muted body-pretty">{project.description}</p>

        <div className="mt-8 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/projects/${project.slug}`}
            className="group/cta inline-flex items-center gap-2 font-mono text-sm font-medium text-text transition-colors duration-fast ease-out-quart hover:text-gradient"
          >
            View case study
            <ArrowUpRight className="size-4 transition-transform duration-base ease-out-quart group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </Link>
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="group/link relative inline-flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
            >
              <ExternalLink className="size-3" /> Live
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-5 right-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover/link:scale-x-100"
              />
            </Link>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              className="group/link relative inline-flex items-center gap-1.5 font-mono text-xs text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
            >
              <Github className="size-3" /> Code
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-5 right-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-base ease-out-quart group-hover/link:scale-x-100"
              />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────── Section ──────────────────────────────── */

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = React.useState("All");
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  // Featured panel only appears under the "All" filter — when the user filters,
  // it would be jarring to keep an unrelated project at the top.
  const featured = filter === "All" && filtered[0]?.featured ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <section id="projects" className="relative isolate overflow-hidden py-28 md:py-36">
      <div aria-hidden className="section-wash section-wash-blue" />
      <span
        aria-hidden
        className="numeral-stencil absolute -top-8 right-6 md:-top-12 md:right-12"
      >
        03
      </span>
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects I'm proud of."
          description="A curated slice of recent shipping — full-stack apps, AI tools, and open-source libraries."
        />

        {/* Filter pill rail */}
        <div className="mb-12 flex flex-wrap gap-1">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-fast ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  active ? "text-white" : "text-text-muted hover:text-text"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-accent-gradient shadow-elev-1"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            );
          })}
        </div>

        {featured && (
          <div className="mb-16 md:mb-24">
            <FeaturedProjectPanel project={featured} />
          </div>
        )}

        <motion.div
          layout
          transition={{ layout: { duration: 0.5, ease: EASE_OUT_EXPO } }}
          className={cn(
            "grid gap-6",
            featured
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {rest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-sm text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
          >
            View all projects
            <ArrowUpRight className="size-4 transition-transform duration-base ease-out-quart group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
