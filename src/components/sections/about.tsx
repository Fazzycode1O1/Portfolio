"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { SpineLabel } from "@/components/shared/spine-label";

/**
 * Profile photo frame. Glassmorphism via `card-surface` + a matte 1.5px inset,
 * a soft signal/copper halo behind, and a slow floating animation. Halo and
 * float both respect `prefers-reduced-motion`.
 *
 * Place the source photo at /public/profile.jpg.
 */
function PhotoFrame() {
  const reduced = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-[300px] md:max-w-[340px]">
      {/* Atmospheric halo — signal + copper, blurred into a soft cloud. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10"
        style={{
          background:
            "radial-gradient(closest-side, rgba(107,143,168,0.40), rgba(184,149,111,0.18) 55%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />
      {/* Outer frame — steel surface, subtle matte inset around the image. */}
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="card-surface relative overflow-hidden rounded-2xl border border-border-strong p-1.5 shadow-elev-3"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-steel">
          <Image
            src="/profile.jpg"
            alt="Muhammad Faizan Ali"
            fill
            sizes="(max-width: 768px) 80vw, 340px"
            className="object-cover"
            priority
          />
          {/* Subtle inner gradient — feathers the photo edge into the frame. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, rgba(5,5,5,0.35) 100%)",
            }}
          />
        </div>
      </motion.div>

      {/* Corner ticks — architectural framing detail, four hairline marks. */}
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (corner) => (
          <span
            key={corner}
            aria-hidden
            className={
              "pointer-events-none absolute size-3 border-signal/40 " +
              (corner === "top-left"
                ? "left-[-12px] top-[-12px] border-l border-t"
                : corner === "top-right"
                ? "right-[-12px] top-[-12px] border-r border-t"
                : corner === "bottom-left"
                ? "bottom-[-12px] left-[-12px] border-b border-l"
                : "bottom-[-12px] right-[-12px] border-b border-r")
            }
          />
        )
      )}
    </div>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden className="section-wash section-wash-blue" />
      <SpineLabel index="01" label="About" />

      <div className="container-x relative">
        <SectionHeading
          align="center"
          eyebrow="About"
          title="Get to Know About Me ,Explore my Vision Below."
        />

        {/* Photo — focal point of the section. */}
        <Reveal delay={0.05} className="mt-4">
          <PhotoFrame />
        </Reveal>

        {/* Credit line directly below the photo. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
          className="mt-8 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle"
        >
          <span aria-hidden className="h-px w-6 bg-border-strong" />
          <span>Muhammad Faizan Ali · Pakistan</span>
          <span aria-hidden className="h-px w-6 bg-border-strong" />
        </motion.div>

        {/* Bio — narrow editorial column, left-aligned for readability. */}
        <Reveal delay={0.15} className="mt-12">
          <div className="mx-auto max-w-xl space-y-5 text-base text-text-muted leading-relaxed md:text-lg body-pretty">
            <p>
              I&apos;m currently a 7th semester Software Engineering student with a growing
              interest in Artificial Intelligence and Machine Learning. My goal is to
              strengthen my expertise in AI/ML and combine it with Software Engineering
              to build intelligent, scalable, and impactful systems.
            </p>

            <p>
              Right now, I&apos;m learning Data Visualization and Machine Learning in Python,
              exploring libraries and tools such as{" "}
              <span className="text-text">
                pandas, scikit-learn, XGBoost, and GeoPandas
              </span>
              . I&apos;m particularly interested in understanding how data pipelines,
              machine learning workflows, and real-world datasets can be used to solve
              practical problems.
            </p>

            <p>
              Currently, I&apos;m working on my Final Year Project{" "}
              <span className="text-text">FloodSense Pakistan</span>, an intelligent
              flood early warning and risk assessment platform that focuses on flood data
              training, machine learning pipelines, and geospatial analysis for Pakistan.
            </p>

            <p>
              Alongside AI/ML learning, I also enjoy building modern full-stack web
              applications using{" "}
              <span className="text-text">
                React, Node.js, MongoDB, Tailwind CSS, and TypeScript
              </span>
              . I like creating clean interfaces, scalable backend systems, and products
              that feel intuitive and user-focused.
            </p>

            <p>
              During my university journey, I have developed several mini projects across
              different courses including Data Structures & Algorithms, Mobile Application
              Development, Software Construction, and Machine Learning. These projects
              helped me build strong programming fundamentals and practical development
              experience.
            </p>

            <p>
              Some projects I&apos;ve worked on include a{" "}
              <span className="text-text">Bus Route Finder</span> with shortest path
              algorithms and route visualization, a{" "}
              <span className="text-text">React Native Shopping App</span> with
              authentication and backend API integration, and a{" "}
              <span className="text-text">Car Rental Management System</span> that
              digitizes vehicle booking and management through a centralized web platform.
            </p>

            <p>
              I&apos;m continuously learning, experimenting, and exploring how modern
              software engineering can align with AI/ML to create smarter digital
              solutions for real-world challenges.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
