"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Magnetic } from "@/components/motion/magnetic";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ROLES = ["Software Engineer", "AI Engineer", "Full-Stack Builder", "Open-Source Author"];

/** Headline split into words. `gradient: true` marks the highlighted token. */
const HEADLINE: { word: string; gradient?: boolean }[] = [
  { word: "Building" },
  { word: "the" },
  { word: "web’s" },
  { word: "intelligent", gradient: true },
  { word: "future." },
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

/* ────────────────────────── Ambient orb cluster ────────────────────────── */

interface OrbProps {
  scrollYProgress: MotionValue<number>;
  reduced: boolean;
}

function HeroOrbs({ scrollYProgress, reduced }: OrbProps) {
  // Each orb drifts at its own rate so the cluster doesn't move as one slab.
  const cyanY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const blueY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const purpY = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);

  const staticOrb = (cls: string, style: React.CSSProperties) => (
    <div aria-hidden className={cls} style={style} />
  );
  const animatedOrb = (
    y: MotionValue<string>,
    cls: string,
    style: React.CSSProperties
  ) => <motion.div aria-hidden style={{ ...style, y }} className={cls} />;

  // Atelier orb cluster — three tonal variants of the signal palette plus one
  // copper accent in the corner. No rainbow, just atmospheric depth.
  const cyanStyle = {
    background:
      "radial-gradient(closest-side, rgba(143,169,189,0.50), rgba(143,169,189,0.14) 50%, transparent 75%)",
  };
  const blueStyle = {
    background:
      "radial-gradient(closest-side, rgba(107,143,168,0.55), rgba(107,143,168,0.18) 50%, transparent 75%)",
  };
  const purpStyle = {
    background:
      "radial-gradient(closest-side, rgba(184,149,111,0.38), rgba(184,149,111,0.10) 50%, transparent 75%)",
  };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {reduced ? (
        <>
          {staticOrb(
            "absolute left-[8%] top-[14%] h-[420px] w-[420px] rounded-full blur-[140px] opacity-50 dark:opacity-60",
            cyanStyle
          )}
          {staticOrb(
            "absolute right-[6%] top-[28%] h-[520px] w-[520px] rounded-full blur-[160px] opacity-55 dark:opacity-65",
            blueStyle
          )}
          {staticOrb(
            "absolute left-[38%] bottom-[6%] h-[460px] w-[460px] rounded-full blur-[150px] opacity-45 dark:opacity-55",
            purpStyle
          )}
        </>
      ) : (
        <>
          {animatedOrb(
            cyanY,
            "absolute left-[8%] top-[14%] h-[420px] w-[420px] rounded-full blur-[140px] opacity-50 dark:opacity-60",
            cyanStyle
          )}
          {animatedOrb(
            blueY,
            "absolute right-[6%] top-[28%] h-[520px] w-[520px] rounded-full blur-[160px] opacity-55 dark:opacity-65",
            blueStyle
          )}
          {animatedOrb(
            purpY,
            "absolute left-[38%] bottom-[6%] h-[460px] w-[460px] rounded-full blur-[150px] opacity-45 dark:opacity-55",
            purpStyle
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── Terminal artifact ─────────────────────────── */

function TerminalArtifact({ typed }: { typed: string }) {
  return (
    <motion.div
      // Subtle perspective lean — reads as a tilted product mock without
      // committing to a full Tilt component (which would conflict with the
      // headline parallax).
      initial={{ rotate: 0 }}
      animate={{ rotate: 0 }}
      whileHover={{ rotate: -0.6 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="card-surface relative overflow-hidden rounded-2xl shadow-elev-3"
      style={{ transformPerspective: 1200 }}
      aria-hidden
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-signal-bright/80" />
          <span className="size-2.5 rounded-full bg-signal/80" />
          <span className="size-2.5 rounded-full bg-copper/80" />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-subtle">
          ~/portfolio/whoami
        </span>
        <span className="size-2.5 rounded-full bg-success shadow-glow-cyan motion-reduce:shadow-none" />
      </div>

      {/* Body */}
      <div className="space-y-5 px-6 py-7 font-mono text-sm leading-relaxed">
        <div>
          <p className="text-text-subtle">
            <span className="text-text-muted">$</span> whoami
          </p>
          <p className="mt-1 text-text">
            <span className="text-[color:var(--accent)]">{"› "}</span>
            {typed}
            <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-blink bg-[color:var(--accent)] align-middle motion-reduce:animate-none" />
          </p>
        </div>

        <div>
          <p className="text-text-subtle">
            <span className="text-text-muted">$</span> status
          </p>
          <p className="mt-1 text-text-muted">
            <span className="text-[color:var(--accent)]">{"› "}</span>
            available <span className="text-text-subtle">·</span> open to opportunities
          </p>
        </div>

        <div>
          <p className="text-text-subtle">
            <span className="text-text-muted">$</span> stack
          </p>
          <p className="mt-1 text-text-muted">
            <span className="text-[color:var(--accent)]">{"› "}</span>
            Next <span className="text-text-subtle">·</span> TypeScript{" "}
            <span className="text-text-subtle">·</span> MongoDB{" "}
            <span className="text-text-subtle">·</span> AI
          </p>
        </div>
      </div>

      {/* Decorative inner halo, bottom-right — ties terminal to the orbs behind. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(107,143,168,0.32), rgba(184,149,111,0.16) 60%, transparent 80%)",
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

  // Scroll-coupled exit choreography. Applied to the outer wrapper so the
  // entire hero (text + terminal + orbs scale-out together) feels cinematic.
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <div aria-hidden className="noise -z-10" />
      <HeroOrbs scrollYProgress={scrollYProgress} reduced={reduced} />

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
            {/* Inline status notation — no pill chrome. Reads as editorial annotation. */}
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

            {/* Word-by-word headline reveal. Each word lives in an overflow-hidden
                wrapper so the y-translate reads as a mask reveal, not a slide.
                The accented word ("intelligent") gets italic + a hairline marker
                stroke drawn underneath — replaces the old rainbow gradient. */}
            <motion.h1
              variants={headlineGroup}
              className="display-3xl font-display mt-8 [text-wrap:balance]"
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
                        className="absolute left-1 right-1 -bottom-1 h-[2px] origin-left bg-signal"
                      />
                    )}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* Mobile-only inline whoami line — the terminal artifact is hidden < md. */}
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
              I design and ship modern web products and AI-powered systems — from realtime
              analytics pipelines to agentic LLM workflows. Currently exploring the frontier
              between developer tools and machine intelligence.
            </motion.p>

            {/* Bare text-link CTAs — chrome lives only in the trailing arrow.
                Filled buttons are now reserved for the footer mega-CTA. */}
            <motion.div variants={heroItem} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Magnetic strength={8} radius={90}>
                <Link
                  href="/projects"
                  className="group/cta inline-flex items-baseline gap-3 text-text transition-colors duration-fast ease-out-quart hover:text-signal-bright"
                >
                  <span aria-hidden className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle transition-colors duration-fast group-hover/cta:text-signal">
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
                  <span aria-hidden className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-subtle transition-colors duration-fast group-hover/cta:text-signal">
                    02
                  </span>
                  <span className="text-base md:text-lg">Download résumé</span>
                  <Download className="size-4 translate-y-0.5 transition-transform duration-base ease-out-quart group-hover/cta:-translate-y-0" />
                </Link>
              </Magnetic>
              {/* Social row — bare icons separated by hairlines, no card chrome. */}
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

          {/* Right column — terminal artifact (desktop only). Slides + scales
              in slightly after the headline starts cascading. */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, x: 24, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.95, ease: EASE_OUT_EXPO }}
            className="hidden md:col-span-5 md:block md:mt-2"
          >
            <TerminalArtifact typed={typed} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
