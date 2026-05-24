"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  // Validate `from` is a same-origin admin path. Reject protocol-relative URLs
  // (//evil.com), absolute URLs, and anything outside /admin to prevent
  // open-redirect after sign-in.
  const fromRaw = params.get("from") ?? "/admin";
  const from = /^\/admin(\/|$)/.test(fromRaw) && !fromRaw.startsWith("//") ? fromRaw : "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/login", { email, password });
      toast.success("Signed in");
      router.push(from);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden p-6">
      <div aria-hidden className="absolute inset-0 -z-10 aurora-bg opacity-60" />
      <div aria-hidden className="noise -z-10" />
      <Link href="/" className="absolute left-6 top-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text">
        <ArrowLeft className="size-3" /> Back to site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass rounded-2xl p-8"
      >
        <div className="mb-8">
          <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-accent-gradient shadow-elev-2">
            <Lock className="size-5 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-text-muted">Authenticate to manage portfolio content.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
              <Input id="email" type="email" required placeholder="you@domain.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
              <Input id="password" type="password" required placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : (<>Sign in <ArrowRight /></>)}
          </Button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-text-subtle">
          Seed an owner with <code className="rounded bg-black/[0.05] dark:bg-white/[0.05] px-1 py-0.5">npm run seed</code>
        </p>
      </motion.div>
    </div>
  );
}
