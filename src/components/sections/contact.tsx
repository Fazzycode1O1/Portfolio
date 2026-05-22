"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Send, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SectionHeading } from "@/components/shared/section-heading";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  subject: z.string().min(2, "Subject is required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type Form = z.infer<typeof schema>;
type Errors = Partial<Record<keyof Form, string>>;

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
      result.error.issues.forEach((i) => { errs[i.path[0] as keyof Form] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      toast.success("Message sent — I'll get back to you shortly.");
    } catch {
      toast.error("Something went wrong. Try emailing me directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something."
          description="Have a project in mind, a role to fill, or just want to say hi? Drop a line below."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <p className="mb-4 font-mono text-xs uppercase tracking-wider text-text-muted">Direct</p>
              <Link href={siteConfig.links.email} className="flex items-center gap-3 text-text hover:text-gradient">
                <Mail className="size-4" />
                <span className="text-sm">{siteConfig.author.email}</span>
              </Link>
              <div className="mt-3 flex items-center gap-3 text-text-muted">
                <MapPin className="size-4" />
                <span className="text-sm">Remote · Worldwide</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">Currently</p>
              <p className="text-sm text-text">
                Open to <span className="text-gradient">full-time roles</span>, freelance, and AI consulting engagements.
              </p>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-2xl p-12 text-center"
                >
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-accent-gradient shadow-glow-violet">
                    <Check className="size-6 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">Message sent</h3>
                  <p className="mt-2 text-text-muted">I'll get back to you within 48 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="glass rounded-2xl p-6 md:p-8 space-y-5"
                >
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                      {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
                      {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="What's this about?" />
                    {errors.subject && <p className="text-xs text-danger">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell me about your project, role, or idea…" rows={6} />
                    {errors.message && <p className="text-xs text-danger">{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                    {loading ? "Sending…" : (<>Send message <Send /></>)}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
