"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Pick the nav item that best matches the current pathname.
 *   - Exact route matches (e.g. /projects, /contact) win.
 *   - Hash-anchor items (/#about, /#skills) don't match any route, so they
 *     stay "inactive" by default — the hover pill still highlights them.
 */
function useActiveNav() {
  const pathname = usePathname();
  return React.useMemo(() => {
    const match = siteConfig.nav.find((n) => {
      if (n.href.includes("#")) return false;
      return pathname === n.href || pathname.startsWith(`${n.href}/`);
    });
    return match?.href ?? null;
  }, [pathname]);
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 80], [72, 56]);
  const activeHref = useActiveNav();
  const indicatorHref = hovered ?? activeHref;

  React.useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 12));
    return () => unsub();
  }, [scrollY]);

  return (
    <>
      <motion.header
        style={{ height }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-base ease-out-quart",
          scrolled ? "glass border-b border-border" : "bg-transparent"
        )}
      >
        <div className="container-x flex h-full items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-opacity duration-fast ease-out-quart hover:opacity-90"
          >
            <div className="relative size-8 overflow-hidden rounded-lg bg-accent-gradient shadow-elev-1 transition-transform duration-base ease-out-quart group-hover:scale-105">
              <div className="absolute inset-0 grid place-items-center font-display text-sm font-bold text-white">
                A
              </div>
            </div>
            <span className="font-display text-base font-semibold uppercase tracking-[0.18em]">
              {siteConfig.name}
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 md:flex"
            onMouseLeave={() => setHovered(null)}
            onBlur={(e) => {
              // Only clear when focus leaves the nav entirely (not when moving
              // between adjacent nav links).
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setHovered(null);
              }
            }}
            aria-label="Primary"
          >
            {siteConfig.nav.map((item) => {
              const isIndicator = item.href === indicatorHref;
              const isActive = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm transition-colors duration-fast ease-out-quart",
                    isActive ? "text-text" : "text-text-muted hover:text-text"
                  )}
                >
                  {isIndicator && (
                    <motion.span
                      layoutId="nav-indicator"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-md bg-black/[0.05] dark:bg-white/[0.06]"
                      transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={siteConfig.links.resume}
              className="group inline-flex items-center gap-2 rounded-sm border border-border-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-text-muted transition-colors duration-fast ease-out-quart hover:border-signal hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span aria-hidden className="size-1 rounded-full bg-signal" />
              Résumé
            </Link>
          </div>

          <button
            className="md:hidden inline-flex size-10 items-center justify-center rounded-sm border border-border-strong"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 glass-strong md:hidden"
          >
            {/* Soft aurora behind the mobile menu */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full blur-[100px] opacity-50"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(107,143,168,0.42), rgba(184,149,111,0.22) 55%, transparent 80%)",
              }}
            />
            <div className="container-x relative flex h-full flex-col items-center justify-center gap-6 pt-20">
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "font-display text-3xl font-semibold transition-colors duration-fast ease-out-quart",
                      item.href === activeHref ? "text-text" : "text-text-muted hover:text-text"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.08 + siteConfig.nav.length * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <Link
                  href={siteConfig.links.resume}
                  onClick={() => setOpen(false)}
                  className="group mt-8 inline-flex items-center gap-3 border border-border-strong px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-text transition-colors duration-fast ease-out-quart hover:border-signal hover:text-signal-bright"
                >
                  <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                  Download Résumé
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
