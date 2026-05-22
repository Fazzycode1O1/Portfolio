"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 80], [72, 56]);

  React.useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 12));
    return () => unsub();
  }, [scrollY]);

  return (
    <>
      <motion.header
        style={{ height }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled ? "glass border-b border-border" : "bg-transparent"
        )}
      >
        <div className="container-x flex h-full items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative size-8 overflow-hidden rounded-lg bg-accent-gradient">
              <div className="absolute inset-0 grid place-items-center font-display text-sm font-bold text-white">
                A
              </div>
            </div>
            <span className="font-display text-base font-semibold tracking-tight">
              {siteConfig.name}
              <span className="text-gradient">.dev</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button asChild size="sm" variant="primary">
              <Link href={siteConfig.links.resume}>Resume</Link>
            </Button>
          </div>

          <button
            className="md:hidden inline-flex size-10 items-center justify-center rounded-lg glass"
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
            className="fixed inset-0 z-40 glass-strong md:hidden"
          >
            <div className="container-x flex h-full flex-col items-center justify-center gap-6 pt-20">
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl font-semibold text-text"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Button asChild size="lg" className="mt-6" onClick={() => setOpen(false)}>
                <Link href={siteConfig.links.resume}>Download Resume</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
