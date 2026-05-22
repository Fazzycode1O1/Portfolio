"use client";

import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";

interface Settings {
  heroHeadline?: string;
  heroSub?: string;
  resumeUrl?: string;
  social?: { github?: string; linkedin?: string; twitter?: string; email?: string };
  seoDefaults?: { title?: string; description?: string; ogImage?: string };
}

const emptySettings: Settings = {
  heroHeadline: "",
  heroSub: "",
  resumeUrl: "",
  social: { github: "", linkedin: "", twitter: "", email: "" },
  seoDefaults: { title: "", description: "", ogImage: "" },
};

export default function AdminSettings() {
  const { data, mutate, isLoading } = useSWR<Settings>("/api/settings", fetcher);
  const [form, setForm] = React.useState<Settings>(emptySettings);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (data) setForm({
      ...emptySettings,
      ...data,
      social: { ...emptySettings.social, ...data.social },
      seoDefaults: { ...emptySettings.seoDefaults, ...data.seoDefaults },
    });
  }, [data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // strip empty strings so zod URL validators don't reject
      const clean = JSON.parse(JSON.stringify(form, (_k, v) => (v === "" ? undefined : v)));
      await api.patch("/api/settings", clean);
      toast.success("Settings saved");
      mutate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Site-wide content, links, and SEO defaults." />
      {isLoading && <p className="text-text-muted text-sm">Loading…</p>}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Hero</h2>
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" value={form.heroHeadline ?? ""} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub">Sub-headline / bio</Label>
            <Textarea id="sub" rows={3} value={form.heroSub ?? ""} onChange={(e) => setForm({ ...form, heroSub: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume URL</Label>
            <Input id="resume" type="url" value={form.resumeUrl ?? ""} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
          </div>
        </section>

        <section className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Social links</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {(["github", "linkedin", "twitter"] as const).map((k) => (
              <div key={k} className="space-y-2">
                <Label htmlFor={k}>{k}</Label>
                <Input
                  id={k}
                  type="url"
                  value={form.social?.[k] ?? ""}
                  onChange={(e) => setForm({ ...form, social: { ...form.social, [k]: e.target.value } })}
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                value={form.social?.email ?? ""}
                onChange={(e) => setForm({ ...form, social: { ...form.social, email: e.target.value } })}
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">SEO defaults</h2>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Title</Label>
            <Input id="seoTitle" value={form.seoDefaults?.title ?? ""} onChange={(e) => setForm({ ...form, seoDefaults: { ...form.seoDefaults, title: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Description</Label>
            <Textarea id="seoDesc" rows={2} value={form.seoDefaults?.description ?? ""} onChange={(e) => setForm({ ...form, seoDefaults: { ...form.seoDefaults, description: e.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoOg">OG image URL</Label>
            <Input id="seoOg" type="url" value={form.seoDefaults?.ogImage ?? ""} onChange={(e) => setForm({ ...form, seoDefaults: { ...form.seoDefaults, ogImage: e.target.value } })} />
          </div>
        </section>

        <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-bg/80 backdrop-blur py-4 -mx-2 px-2 border-t border-border">
          <Button variant="ghost" type="button" onClick={() => data && setForm(data)}>Reset</Button>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>
    </div>
  );
}
