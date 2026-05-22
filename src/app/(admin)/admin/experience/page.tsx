"use client";

import * as React from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";

interface Experience {
  _id: string;
  company: string;
  role: string;
  type: "work" | "education";
  start: string;
  end: string | null;
  location: string;
  highlights: string[];
  order: number;
}

const empty: Omit<Experience, "_id"> = {
  company: "", role: "", type: "work", start: String(new Date().getFullYear()),
  end: null, location: "", highlights: [], order: 0,
};

export default function AdminExperience() {
  const { data, isLoading, mutate } = useSWR<Experience[]>("/api/experience", fetcher);
  const [editing, setEditing] = React.useState<Experience | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Experience | null>(null);

  async function onDelete() {
    if (!deleting) return;
    await api.delete(`/api/experience/${deleting._id}`);
    mutate();
    toast.success("Deleted");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Experience"
        description={data ? `${data.length} entries` : undefined}
        actions={<Button onClick={() => setCreating(true)}><Plus /> New entry</Button>}
      />

      {isLoading && <p className="text-text-muted text-sm">Loading…</p>}

      <div className="space-y-3">
        {data?.map((e) => (
          <div key={e._id} className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium">{e.role}</p>
                <Badge>{e.type}</Badge>
              </div>
              <p className="font-mono text-xs text-text-subtle">{e.company} · {e.start} – {e.end ?? "Present"} · {e.location}</p>
              {e.highlights.length > 0 && <p className="mt-2 line-clamp-1 text-sm text-text-muted">{e.highlights[0]}</p>}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(e)}><Pencil /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(e)}><Trash2 /></Button>
            </div>
          </div>
        ))}
        {!isLoading && data?.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-text-muted">No experience entries yet.</div>
        )}
      </div>

      <ExperienceForm open={creating} onOpenChange={setCreating} initial={empty} mode="create" onSaved={() => mutate()} />
      <ExperienceForm open={!!editing} onOpenChange={(v) => !v && setEditing(null)} initial={editing ?? empty} id={editing?._id} mode="edit" onSaved={() => mutate()} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete experience?"
        description={`Removes "${deleting?.role} at ${deleting?.company}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </div>
  );
}

function ExperienceForm({
  open, onOpenChange, initial, id, mode, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Omit<Experience, "_id">;
  id?: string;
  mode: "create" | "edit";
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => { setForm(initial); }, [initial, open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, end: form.end === "" ? null : form.end };
      if (mode === "create") await api.post("/api/experience", payload);
      else await api.patch(`/api/experience/${id}`, payload);
      toast.success("Saved");
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
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New entry" : "Edit entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company / institution</Label>
              <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / title</Label>
              <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "work" | "education" })}
                className="h-12 w-full rounded-lg border border-border bg-white/[0.03] px-3 text-sm focus:border-accent-via focus:outline-none focus:ring-2 focus:ring-accent-via/30"
              >
                <option value="work">work</option>
                <option value="education">education</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Start (YYYY or YYYY-MM)</Label>
              <Input id="start" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End (blank = Present)</Label>
              <Input id="end" value={form.end ?? ""} onChange={(e) => setForm({ ...form, end: e.target.value || null })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="highlights">Highlights (one per line)</Label>
            <Textarea
              id="highlights"
              rows={5}
              value={form.highlights.join("\n")}
              onChange={(e) => setForm({ ...form, highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
              placeholder="Led the rewrite that cut p95 latency 85%"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
