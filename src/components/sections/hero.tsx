"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Magnetic } from "@/components/motion/magnetic";
import { GradientText } from "@/components/motion/gradient-text";

const ROLES = ["Software Engineer", "AI Engineer", "Full-Stack Builder", "Open-Source Author"];

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

export function Hero() {
  const typed = useTyping(ROLES);

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden pt-24">
      <div aria-hidden className="noise -z-10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,91,34,0.04),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,91,34,0.08),transparent_60%)]"
      />

      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 font-mono text-xs"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="text-text-muted">Available for opportunities · 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-[clamp(48px,9vw,112px)] font-semibold leading-[0.95] tracking-[-0.04em]"
        >
          Building the web&apos;s <br />
          <GradientText>intelligent</GradientText> future.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex items-center gap-2 font-mono text-sm text-text-muted md:text-base"
        >
          <span className="text-gradient">$</span>
          <span>whoami →</span>
          <span className="text-text">{typed}</span>
          <span className="inline-block h-5 w-[2px] animate-pulse bg-accent-via" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 max-w-2xl text-base text-text-muted md:text-lg"
        >
          I design and ship modern web products and AI-powered systems — from realtime analytics
          pipelines to agentic LLM workflows. Currently exploring the frontier between developer
          tools and machine intelligence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects <ArrowRight />
              </Link>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild size="lg" variant="secondary">
              <Link href={siteConfig.links.resume}>
                <Download /> Download Resume
              </Link>
            </Button>
          </Magnetic>
          <div className="ml-2 flex items-center gap-2">
            {[
              { href: siteConfig.links.github, icon: Github },
              { href: siteConfig.links.linkedin, icon: Linkedin },
              { href: siteConfig.links.twitter, icon: Twitter },
            ].map(({ href, icon: Icon }, i) => (
              <Link
                key={i}
                href={href}
                className="grid size-10 place-items-center rounded-lg glass transition-all hover:-translate-y-0.5 hover:shadow-glow-violet"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-subtle">
          <span>Scroll</span>
          <div className="relative h-10 w-px overflow-hidden bg-black/10 dark:bg-white/10">
            <motion.div
              className="absolute inset-x-0 top-0 h-4 bg-accent-gradient"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
