"use client";

import * as React from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";

interface Service {
  _id: string;
  title: string;
  icon: string;
  summary: string;
  deliverables: string[];
  priceRange?: string;
  order: number;
}

const empty: Omit<Service, "_id"> = {
  title: "", icon: "layers", summary: "", deliverables: [], priceRange: "", order: 0,
};

export default function AdminServices() {
  const { data, isLoading, mutate } = useSWR<Service[]>("/api/services", fetcher);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Service | null>(null);

  async function onDelete() {
    if (!deleting) return;
    await api.delete(`/api/services/${deleting._id}`);
    mutate();
    toast.success("Deleted");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description={data ? `${data.length} offerings` : undefined}
        actions={<Button onClick={() => setCreating(true)}><Plus /> New service</Button>}
      />

      {isLoading && <p className="text-text-muted text-sm">Loading…</p>}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((s) => (
          <div key={s._id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(s)}><Pencil /></Button>
                <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(s)}><Trash2 /></Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-text-muted">{s.summary}</p>
            {s.priceRange && <p className="mt-3 font-mono text-xs text-gradient">{s.priceRange}</p>}
          </div>
        ))}
        {!isLoading && data?.length === 0 && (
          <div className="glass col-span-full rounded-2xl p-12 text-center text-text-muted">No services yet.</div>
        )}
      </div>

      <ServiceForm open={creating} onOpenChange={setCreating} initial={empty} mode="create" onSaved={() => mutate()} />
      <ServiceForm open={!!editing} onOpenChange={(v) => !v && setEditing(null)} initial={editing ?? empty} id={editing?._id} mode="edit" onSaved={() => mutate()} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete service?"
        description={`Removes "${deleting?.title}" from the public site.`}
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </div>
  );
}

function ServiceForm({
  open, onOpenChange, initial, id, mode, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Omit<Service, "_id">;
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
      const payload = { ...form, priceRange: form.priceRange || undefined };
      if (mode === "create") await api.post("/api/services", payload);
      else await api.patch(`/api/services/${id}`, payload);
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
          <DialogTitle>{mode === "create" ? "New service" : "Edit service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <select
                id="icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="h-12 w-full rounded-lg border border-border bg-white/[0.03] px-3 text-sm focus:border-accent-via focus:outline-none focus:ring-2 focus:ring-accent-via/30"
              >
                {["layers", "sparkles", "compass"].map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliverables">Deliverables (one per line)</Label>
            <Textarea
              id="deliverables"
              rows={4}
              value={form.deliverables.join("\n")}
              onChange={(e) => setForm({ ...form, deliverables: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceRange">Price range (optional)</Label>
            <Input id="priceRange" value={form.priceRange ?? ""} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} placeholder="From $5k · 2-week sprints" />
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
