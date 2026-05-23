"use client";

import { motion } from "framer-motion";
import { Layers, Sparkles, Compass, Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Service } from "@/types";

const ICONS = { layers: Layers, sparkles: Sparkles, compass: Compass } as const;

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Services"
          title="How I can help."
          description="Three ways I work with teams and founders — pick the one that fits."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Layers;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl glass p-8 transition-all hover:border-border-strong hover:shadow-glow-violet"
              >
                <div className="mb-6 grid size-12 place-items-center rounded-xl bg-accent-gradient shadow-glow-violet">
                  <Icon className="size-5 text-white" />
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{s.summary}</p>
                <ul className="mt-6 space-y-2">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-text-muted">
                      <Check className="mt-0.5 size-4 text-gradient shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-20 -right-20 size-40 rounded-full bg-accent-gradient opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
