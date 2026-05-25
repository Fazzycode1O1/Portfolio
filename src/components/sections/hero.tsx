"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Magnetic } from "@/components/motion/magnetic";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ROLES = ["Software Engineer", "AI/ML Enthusiast", "Full-Stack Builder"];

const HEADLINE: { word: string; gradient?: boolean }[] = [
  { word: "Exploring" },
  { word: "the" },
  { word: "intersection" },
  { word: "of" },
  { word: "Full Stack Development", gradient: true },
  { word: "and" },
  { word: "AI/ML." },
];

function useTyping(words: string[], speed = 80, pause = 1600) {
  const [i, setI] = React.useState(0);
  const [text, setText] = React.useState("");
  const [del, setDel] = React.useState(false);

  React.useEffect(() => {
    const current = words[i % words.length];
    const t = setTimeout(
      () => {
        if (!del) {
          const next = current.slice(0, text.length + 1);
          setText(next);
          if (next === current) setTimeout(() => setDel(true), pause);
        } else {
          const next = current.slice(0, text.length - 1);
          setText(next);
          if (next === "") {
            setDel(false);
            setI((p) => p + 1);
          }
        }
      },
      del ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
}

/* ────────────────────────── Choreography variants ────────────────────────── */

const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

const headlineGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const headlineWord: Variants = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 0.85, ease: EASE_OUT_EXPO } },
};

/* ──────────────────────────── Soft atmosphere ────────────────────────────
   Replaces the prior 3-orb cluster. One large, very-low-alpha radial that
   drifts mirrored over 18s. Reads as studio lighting, not animated blob. */

function SoftAtmosphere({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={reduced ? undefined : { x: "-2%", y: "-2%" }}
        animate={reduced ? undefined : { x: "2%", y: "2%" }}
        transition={
          reduced
            ? undefined
            : { duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }
        className="absolute inset-[-10%]"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 38%, rgba(107,143,168,0.20), rgba(107,143,168,0.05) 45%, transparent 80%)",
          filter: "blur(80px)",
        }}
      />
      {/* A second very-soft warm pewter accent at the bottom-left — the one
          copper moment per page. Static. */}
      <div
        className="absolute -bottom-[20%] -left-[10%] h-[60vh] w-[60vw]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(184,149,111,0.08), transparent 70%)",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────── NOW card ────────────────────────────────
   Editorial index card replacing the terminal artifact. Reads like a magazine
   back-cover author note. Same `typed` role value drives the ROLE row, so all
   existing content (the ROLES array) is preserved without the dev-cliché
   terminal frame. */

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border px-6 py-5 last:border-b-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-subtle">
        {label}
      </p>
      <div className="mt-2 font-mono text-sm leading-relaxed text-text">{children}</div>
    </div>
  );
}

function NowCard({ typed }: { typed: string }) {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      whileHover={{ rotate: -0.4 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="card-surface relative overflow-hidden rounded-sm shadow-elev-3"
      style={{ transformPerspective: 1200 }}
      aria-label="What I'm doing now"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle">
          § NOW
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-moss">
          <span
            aria-hidden
            className="size-[5px] rounded-full bg-moss animate-pulse-glow motion-reduce:animate-none"
          />
          open to Internship opportunities
        </span>
      </div>

      {/* Body */}
      <div>
        <MetaRow label="Role">
          <span>{typed}</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-blink bg-signal align-middle motion-reduce:animate-none"
          />
        </MetaRow>
        <MetaRow label="Location">
          Remote and Hybrid <span className="text-text-subtle">·</span> Pakistan
        </MetaRow>
        <MetaRow label="Open to">
          Full-time <span className="text-text-subtle">·</span> Full-Stack{" "}
          <span className="text-text-subtle">·</span> AI/ML learning
        </MetaRow>
        <MetaRow label="Stack">
          Next <span className="text-text-subtle">·</span> TypeScript{" "}
          <span className="text-text-subtle">·</span> MongoDB{" "}
          <span className="text-text-subtle">·</span> AI/ML frameworks and tools learning
        </MetaRow>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-subtle">
          § · 2026
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-subtle">
          Updated · now
        </span>
      </div>

      {/* Atmospheric inner halo — ties card to the section atmosphere. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(107,143,168,0.30), rgba(184,149,111,0.16) 60%, transparent 80%)",
        }}
      />
    </motion.div>
  );
}

/* ───────────────────────────────── Hero ───────────────────────────────── */

export function Hero() {
  const typed = useTyping(ROLES);
  const reduced = useReducedMotion() ?? false;
  const sectionRef = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <div aria-hidden className="noise -z-10" />
      <SoftAtmosphere reduced={reduced} />

      <motion.div
        style={reduced ? undefined : { scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="container-x"
      >
        <div className="grid grid-cols-12 items-start gap-10 md:gap-12 lg:gap-16">
          <motion.div
            variants={heroContainer}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
            className="col-span-12 md:col-span-7"
          >
            <motion.div
              variants={heroItem}
              className="inline-flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-text-muted"
            >
              <span aria-hidden className="text-text-subtle">§ 01</span>
              <span className="inline-flex items-center gap-2">
                <span className="relative flex size-[5px]">
                  <motion.span
                    aria-hidden
                    className="absolute inline-flex size-[5px] rounded-full bg-moss"
                    animate={reduced ? undefined : { scale: [1, 2.2, 1], opacity: [0.65, 0, 0.65] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                  />
                  <span className="relative inline-flex size-[5px] rounded-full bg-moss" />
                </span>
                Available · 2026
              </span>
            </motion.div>

            {/* Headline. Base weight is light — only the accented "intelligent"
                word reads heavier, italic, and gets a hand-drawn underline.
                Editorial composition, not a SaaS hero. */}
            <motion.h1
              variants={headlineGroup}
              className="display-xl font-display font-light mt-6 [text-wrap:balance]"
            >
              {HEADLINE.map((w, idx) => (
                <span
                  key={idx}
                  className="inline-block overflow-hidden align-baseline pr-[0.18em]"
                >
                  <motion.span
                    variants={headlineWord}
                    className={cn(
                      "inline-block",
                      w.gradient && "relative italic font-medium text-signal-bright"
                    )}
                  >
                    {w.word}
                    {w.gradient && (
                      <motion.span
                        aria-hidden
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-30%" }}
                        transition={{ duration: 0.9, delay: 1.1, ease: EASE_OUT_EXPO }}
                        className="absolute left-0.5 right-0.5 -bottom-0.5 h-px origin-left bg-signal"
                      />
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* Mobile-only inline whoami line — NOW card is hidden < md. */}
            <motion.div
              variants={heroItem}
              className="mt-8 flex items-center gap-2 font-mono text-sm text-text-muted md:hidden"
            >
              <span className="text-signal">$</span>
              <span>whoami →</span>
              <span className="text-text">{typed}</span>
              <span className="inline-block h-5 w-[2px] animate-blink bg-signal motion-reduce:animate-none" />
            </motion.div>

            <motion.p
              variants={heroItem}
              className="mt-8 text-base text-text-muted md:text-lg body-pretty"
            >
             I build modern full-stack web applications while exploring AI/ML and intelligent systems. Currently focused on learning data-driven technologies, machine learning workflows, and developing FloodSense Pakistan — an AI-powered flood risk assessment and early warning platform..
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Magnetic strength={8} radius={90}>
                <Link
                  href="/projects"
                  className="group/cta inline-flex items-baseline gap-3 text-text transition-colors duration-fast ease-out-quart hover:text-signal-bright"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle transition-colors duration-fast group-hover/cta:text-signal"
                  >
                    01
                  </span>
                  <span className="text-base md:text-lg">View selected work</span>
                  <ArrowRight className="size-4 translate-y-0.5 transition-transform duration-base ease-out-quart group-hover/cta:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic strength={8} radius={90}>
                <Link
                  href={siteConfig.links.resume}
                  className="group/cta inline-flex items-baseline gap-3 text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle transition-colors duration-fast group-hover/cta:text-signal"
                  >
                    02
                  </span>
                  <span className="text-base md:text-lg">Download resume</span>
                  <Download className="size-4 translate-y-0.5 transition-transform duration-base ease-out-quart group-hover/cta:-translate-y-0" />
                </Link>
              </Magnetic>
              <div className="ml-auto flex items-center divide-x divide-border">
                {[
                  { href: siteConfig.links.github, icon: Github, label: "GitHub" },
                  { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
                  { href: siteConfig.links.twitter, icon: Twitter, label: "Twitter" },
                ].map(({ href, icon: Icon, label }) => (
                  <Magnetic key={label} strength={5} radius={60}>
                    <Link
                      href={href}
                      aria-label={label}
                      className="group/icn grid size-10 place-items-center text-text-subtle transition-colors duration-fast ease-out-quart hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      <Icon className="size-4 transition-transform duration-base ease-out-quart group-hover/icn:-translate-y-0.5" />
                    </Link>
                  </Magnetic>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* NOW card — desktop only. Slides + scales in after the headline starts. */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, x: 24, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.95, ease: EASE_OUT_EXPO }}
            className="hidden md:col-span-5 md:block md:mt-2"
          >
            <NowCard typed={typed} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
