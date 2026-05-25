"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { SpineLabel } from "@/components/shared/spine-label";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  subject: z.string().min(2, "Subject is required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type Form = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Form, string>>;

/* ───────────────────── Hairline form primitives ─────────────────────────
   Apple-style minimal inputs: no card chrome, only a hairline bottom border
   that thickens + tints on focus. Defined locally so the shared Input
   (still used by admin dialogs) keeps its boxed look. */

const HAIRLINE_FIELD = cn(
  "block w-full bg-transparent text-base text-text placeholder:text-text-subtle",
  "border-0 border-b border-border px-0 py-3.5",
  "transition-[border-color,box-shadow] duration-base ease-out-quart",
  "focus:border-[color:var(--accent)] focus:outline-none focus:ring-0",
  "focus:shadow-[0_1px_0_0_var(--accent)]"
);

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="eyebrow block">
      {children}
    </label>
  );
}

export function Contact() {
  const [form, setForm] = React.useState<Form>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  function update<K extends keyof Form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((i) => {
        errs[i.path[0] as keyof Form] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: "" }), // honeypot stays empty
      });

      if (res.status === 429) {
        toast.error("Too many requests. Try again in a few minutes.");
        return;
      }
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const msg =
          data && typeof data === "object" && "error" in data && typeof data.error === "string"
            ? data.error
            : "Send failed. Try emailing me directly.";
        toast.error(msg);
        return;
      }

      setSent(true);
      toast.success("Message sent — I'll get back to you shortly.");
    } catch {
      toast.error("Network error. Try emailing me directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-32 md:py-44"
    >
      <div aria-hidden className="section-wash section-wash-blue" />
      <SpineLabel index="07" label="Contact" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Contact · ~24h response"
          title="Open to Internship ."
          description="Interested in Internship Opportunities and gain Experiences , Contact me below."
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Side info — bare hairline-divided list, not cards. */}
          <div>
            <ul>
              <li className="border-t border-border py-6">
                <p className="eyebrow">Direct</p>
                <Link
                  href={siteConfig.links.email}
                  className="mt-3 inline-flex items-center gap-3 text-text transition-colors duration-fast ease-out-quart hover:text-signal-bright"
                >
                  <Mail className="size-4" />
                  <span>{siteConfig.author.email}</span>
                </Link>
              </li>
              <li className="border-t border-border py-6">
                <p className="eyebrow">Based</p>
                <p className="mt-3 inline-flex items-center gap-3 text-text-muted">
                  <MapPin className="size-4" />
                  Remote · Worldwide
                </p>
              </li>
              <li className="border-t border-b border-border py-6">
                <p className="eyebrow">Currently</p>
                <p className="mt-3 text-text body-pretty">
                  Open to <span className="text-signal">full-time roles</span>, freelance, and AI
                  consulting engagements.
                </p>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-surface rounded-sm p-12 text-center"
                >
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-accent-gradient shadow-glow-signal">
                    <Check className="size-6 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">Message sent</h3>
                  <p className="mt-2 text-text-muted">I&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="space-y-7"
                >
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                  />
                  <div className="grid gap-7 md:grid-cols-2">
                    <div className="space-y-2">
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        className={HAIRLINE_FIELD}
                      />
                      {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@company.com"
                        className={HAIRLINE_FIELD}
                      />
                      {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <input
                      id="subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      placeholder="What's this about?"
                      className={HAIRLINE_FIELD}
                    />
                    {errors.subject && <p className="text-xs text-danger">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell me about your project, role, or idea…"
                      rows={5}
                      className={cn(HAIRLINE_FIELD, "resize-y")}
                    />
                    {errors.message && <p className="text-xs text-danger">{errors.message}</p>}
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="font-mono text-xs text-text-subtle">
                      I never share your email. Promise.
                    </p>
                    <Button type="submit" size="lg" disabled={loading}>
                      {loading ? (
                        "Sending…"
                      ) : (
                        <>
                          Send message <Send />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
