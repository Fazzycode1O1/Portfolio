"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

/**
 * Full-bleed cover with parallax scale + a gradient scrim that fades into the
 * page background. Title + tagline sit anchored at the bottom-left. Lives in
 * its own client file so the surrounding /projects/[slug] page can stay a
 * server component (for generateStaticParams + generateMetadata).
 */
export function ProjectHero({ project }: { project: Project }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-15%"]);

  return (
    <div
      ref={ref}
      className="relative h-[80vh] min-h-[520px] w-full overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={reduced ? undefined : { scale, y }}
        className="absolute inset-0"
      >
        <Image
          src={project.cover}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Scrim — keeps the title readable and feathers cover into page bg. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/10"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 110%, rgba(107,143,168,0.20), transparent 70%)",
        }}
      />

      {/* Back link — top-left, on top of the cover. */}
      <div className="absolute inset-x-0 top-0 z-10">
        <div className="container-x pt-28 md:pt-32">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.32em] text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
          >
            <ArrowLeft className="size-3 transition-transform duration-base ease-out-quart group-hover:-translate-x-0.5" />
            Back to projects
          </Link>
        </div>
      </div>

      {/* Title block — bottom-left, scroll-coupled fade out. */}
      <motion.div
        style={reduced ? undefined : { opacity: titleOpacity, y: titleY }}
        className="absolute inset-x-0 bottom-0 z-10 pb-12 md:pb-16"
      >
        <div className="container-x">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <p className="eyebrow text-signal">{project.year}</p>
              {project.featured && (
                <>
                  <span aria-hidden className="h-px w-6 bg-border-strong" />
                  <Badge variant="gradient">Featured</Badge>
                </>
              )}
            </div>
            <h1 className="display-2xl font-display mt-5 [text-wrap:balance]">
              {project.title}
            </h1>
            <p className="mt-5 text-xl text-text-muted body-pretty md:text-2xl">
              {project.tagline}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
