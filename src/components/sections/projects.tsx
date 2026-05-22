"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/motion/tilt";

const FILTERS = ["All", "AI", "Full-Stack", "Frontend", "Data", "OSS"];

export function ProjectCard({ project, featured }: { project: (typeof projects)[number]; featured?: boolean }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 24 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(featured && "md:col-span-2")}
    >
    <Tilt max={6} glare className={cn(
      "group relative overflow-hidden rounded-2xl glass border-gradient transition-all hover:shadow-glow-violet"
    )}>
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          {project.featured && (
            <Badge variant="gradient" className="absolute left-4 top-4">Featured</Badge>
          )}
          <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-lg glass-strong opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-1">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight text-text md:text-2xl">{project.title}</h3>
            <span className="font-mono text-xs text-text-subtle">{project.year}</span>
          </div>
          <p className="text-sm text-text-muted">{project.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
            {project.tech.length > 4 && <Badge>+{project.tech.length - 4}</Badge>}
          </div>
        </div>
      </Link>

      {(project.liveUrl || project.repoUrl) && (
        <div className="flex items-center gap-2 border-t border-border px-6 py-3">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text"
            >
              <ExternalLink className="size-3" /> Live
            </Link>
          )}
          {project.repoUrl && (
            <Link
              href={project.repoUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-text"
            >
              <Github className="size-3" /> Code
            </Link>
          )}
        </div>
      )}
    </Tilt>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = React.useState("All");
  const filtered = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects I'm proud of."
          description="A curated slice of recent shipping — full-stack apps, AI tools, and open-source libraries."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
                filter === f
                  ? "bg-accent-gradient text-white shadow-glow-violet"
                  : "glass text-text-muted hover:text-text"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} project={p} featured={i === 0 && filter === "All"} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-text"
          >
            View all projects <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
