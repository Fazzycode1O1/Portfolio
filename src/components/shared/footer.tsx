"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Magnetic } from "@/components/motion/magnetic";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-bg">
      {/* Atmospheric purple/blue wash — closes the page on a cool note. */}
      <div aria-hidden className="section-wash section-wash-purple" />

      <div className="container-x relative pt-24 md:pt-32 pb-12">
        {/* ── Mega CTA row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-9">
            <p className="eyebrow">Let&apos;s collaborate · 2026</p>
            <Magnetic strength={10} radius={140}>
              <Link
                href={siteConfig.links.email}
                className="group mt-5 inline-flex items-baseline gap-3 md:gap-5 text-text transition-opacity duration-base ease-out-quart hover:opacity-95"
              >
                <span className="display-xl font-display [text-wrap:balance]">
                  Let&apos;s build something
                </span>
                <span
                  aria-hidden
                  className="relative inline-flex size-12 shrink-0 translate-y-1 items-center justify-center rounded-full bg-accent-gradient text-white shadow-glow-signal transition-transform duration-base ease-out-quart group-hover:translate-x-1 md:size-16"
                >
                  <ArrowUpRight className="size-5 md:size-7" />
                </span>
              </Link>
            </Magnetic>
            <p className="mt-6 max-w-xl text-text-muted body-pretty">
              Open to opportunities, Drop a line —
              average response within 24 hours.
            </p>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="eyebrow">Direct</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link
                  href={siteConfig.links.email}
                  className="inline-flex items-center gap-2 text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  <Mail className="size-3.5" />
                  {siteConfig.author.email}
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.links.resume}
                  className="inline-flex items-center gap-2 text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  <ArrowUpRight className="size-3.5" />
                  Download Résumé
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-text-subtle transition-colors duration-fast ease-out-quart hover:text-text"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Tertiary nav + socials ───────────────────────────────────── */}
        <div className="mt-20 grid grid-cols-12 gap-8 border-t border-border pt-10">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-accent-gradient shadow-elev-1">
                <span className="font-display text-xs font-bold text-white">A</span>
              </span>
              <span className="font-display text-base font-semibold uppercase tracking-[0.18em]">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-text-muted body-pretty">
              {siteConfig.description}
            </p>
          </div>

          <div className="col-span-6 md:col-span-3 lg:col-span-3">
            <p className="eyebrow">Navigate</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-muted transition-colors duration-fast ease-out-quart hover:text-text"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-3 lg:col-span-4">
            <p className="eyebrow">Elsewhere</p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { href: siteConfig.links.github, icon: Github, label: "GitHub" },
                { href: siteConfig.links.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: siteConfig.links.twitter, icon: Twitter, label: "Twitter" },
                { href: siteConfig.links.email, icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <Magnetic key={label} strength={6} radius={70}>
                  <Link
                    href={href}
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-lg glass transition-all duration-base ease-out-quart hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <Icon className="size-4" />
                  </Link>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        {/* ── Hairline + status row ────────────────────────────────────── */}
        <div className="relative mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="font-mono text-xs text-text-subtle">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-text-subtle">
            <span className="relative flex size-[5px]">
              <motion.span
                aria-hidden
                className="absolute inline-flex size-[5px] rounded-full bg-moss"
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative inline-flex size-[5px] rounded-full bg-moss" />
            </span>
            All systems operational
          </div>
        </div>
      </div>

      {/* ── Mega wordmark — full-bleed closing flourish ──────────────────── */}
      <div aria-hidden className="pointer-events-none relative select-none px-4">
        <p
          className="font-display font-bold uppercase leading-none tracking-tighter text-center text-black/[0.05] dark:text-white/[0.04]"
          style={{ fontSize: "clamp(72px, 18vw, 260px)", letterSpacing: "-0.04em" }}
        >
          {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
