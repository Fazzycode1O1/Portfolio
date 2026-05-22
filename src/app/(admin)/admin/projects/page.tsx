"use client";

import * as React from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";

interface ProjectRow {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  tech: string[];
  categories: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: "draft" | "published";
  year: number;
}

const empty: Omit<ProjectRow, "_id"> = {
  slug: "", title: "", tagline: "", description: "", cover: "",
  tech: [], categories: [], liveUrl: "", repoUrl: "", featured: false,
  status: "draft", year: new Date().getFullYear(),
};

export default function AdminProjects() {
  const { data, isLoading, mutate } = useSWR<ProjectRow[]>("/api/projects", fetcher);

  const [editing, setEditing] = React.useState<ProjectRow | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<ProjectRow | null>(null);

  async function onDelete() {
    if (!deleting) return;
    await api.delete(`/api/projects/${deleting._id}`);
    toast.success(`Deleted ${deleting.title}`);
    mutate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description={data ? `${data.length} total · ${data.filter((p) => p.featured).length} featured · ${data.filter((p) => p.status === "draft").length} drafts` : undefined}
        actions={<Button onClick={() => setCreating(true)}><Plus /> New project</Button>}
      />

      <div className="overflow-hidden rounded-2xl glass">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-white/[0.02] text-left font-mono text-xs uppercase text-text-subtle">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 hidden md:table-cell">Tech</th>
              <th className="px-4 py-3 hidden sm:table-cell">Year</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">Loading…</td></tr>
            )}
            {!isLoading && (data?.length ?? 0) === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No projects yet.</td></tr>
            )}
            {data?.map((p) => (
              <tr key={p._id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <p className="font-medium text-text">{p.title}</p>
                  <p className="font-mono text-xs text-text-subtle">{p.slug}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.tech.slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                    {p.tech.length > 3 && <Badge>+{p.tech.length - 3}</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted hidden sm:table-cell">{p.year}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.featured && <Badge variant="gradient">Featured</Badge>}
                    <Badge variant={p.status === "published" ? "outline" : "default"}>{p.status}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded-lg text-text-muted hover:bg-white/[0.05] hover:text-text" aria-label="Open live">
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(p)}><Pencil /></Button>
                    <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(p)}><Trash2 /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProjectForm
        open={creating}
        onOpenChange={setCreating}
        initial={empty}
        onSaved={() => mutate()}
        mode="create"
      />
      <ProjectForm
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        initial={editing ?? empty}
        id={editing?._id}
        onSaved={() => mutate()}
        mode="edit"
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete project?"
        description={`This permanently deletes "${deleting?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </div>
  );
}

function ProjectForm({
  open, onOpenChange, initial, id, onSaved, mode,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Omit<ProjectRow, "_id">;
  id?: string;
  onSaved: () => void;
  mode: "create" | "edit";
}) {
  const [form, setForm] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => { setForm(initial); }, [initial, open]);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, liveUrl: form.liveUrl || undefined, repoUrl: form.repoUrl || undefined };
      if (mode === "create") await api.post("/api/projects", payload);
      else await api.patch(`/api/projects/${id}`, payload);
      toast.success(mode === "create" ? "Project created" : "Project saved");
      onSaved();
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New project" : "Edit project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => update("title", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="my-project" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={6} value={form.description} onChange={(e) => update("description", e.target.value)} required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input id="liveUrl" type="url" value={form.liveUrl ?? ""} onChange={(e) => update("liveUrl", e.target.value)} placeholder="https://…" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repoUrl">Repo URL</Label>
                  <Input id="repoUrl" type="url" value={form.repoUrl ?? ""} onChange={(e) => update("repoUrl", e.target.value)} placeholder="https://github.com/…" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tech">Tech (comma-separated)</Label>
                  <Input id="tech" value={form.tech.join(", ")} onChange={(e) => update("tech", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categories">Categories (comma-separated)</Label>
                  <Input id="categories" value={form.categories.join(", ")} onChange={(e) => update("categories", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Cover image</Label>
                <ImageUpload value={form.cover} onChange={(url) => update("cover", url)} />
                <Input value={form.cover} onChange={(e) => update("cover", e.target.value)} placeholder="Or paste URL…" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" value={form.year} onChange={(e) => update("year", Number(e.target.value))} min={2000} max={2100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update("status", e.target.value as "draft" | "published")}
                    className="h-12 w-full rounded-lg border border-border bg-white/[0.03] px-3 text-sm text-text focus:border-accent-via focus:outline-none focus:ring-2 focus:ring-accent-via/30"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="size-4 accent-accent-via" />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
