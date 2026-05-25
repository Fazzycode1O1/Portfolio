"use client";

import { motion } from "framer-motion";
import { Layers, Sparkles, Compass, Check } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Service } from "@/types";
import { EASE_OUT_EXPO, EASE_OUT_QUART, DUR_SLOW } from "@/lib/motion";
import { SpineLabel } from "@/components/shared/spine-label";

const ICONS = { layers: Layers, sparkles: Sparkles, compass: Compass } as const;
const SCOPES = ["4–8 wk engagement", "6–12 wk engagement", "≈ 2 wk per audit"] as const;

export function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden py-28 md:py-36"
    >
      <div aria-hidden className="section-wash section-wash-cyan" />
      <SpineLabel index="05" label="Services" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Services"
          title="I have Hand on Full-Stack."
          description="Learn More about my services and how I can help you to build your next project or idea ."
        />

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Layers;
            const scope = SCOPES[i] ?? "Custom scope";
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: DUR_SLOW, delay: i * 0.1, ease: EASE_OUT_EXPO }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE_OUT_QUART } }}
                className="group card-surface relative overflow-hidden rounded-sm p-8 transition-[border-color,box-shadow] duration-base ease-out-quart hover:border-border-strong hover:shadow-elev-3"
              >
                {/* Icon — larger and squared with a strong-tier shadow. */}
                <div className="mb-7 grid size-14 place-items-center rounded-md bg-accent-gradient shadow-glow-signal">
                  <Icon className="size-6 text-white" />
                </div>
                <p className="eyebrow mb-3">{scope}</p>
                <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-text-muted body-pretty md:text-base">
                  {s.summary}
                </p>
                <ul className="mt-7 space-y-2.5">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-text-muted">
                      <Check className="mt-0.5 size-4 text-signal shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative corner halo — intensifies on hover. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-24 -right-24 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-slow ease-out-quart group-hover:opacity-30"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(107,143,168,0.50), rgba(184,149,111,0.22) 60%, transparent 80%)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
