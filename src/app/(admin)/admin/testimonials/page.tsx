"use client";

import * as React from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2, Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";

interface Testimonial {
  _id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  approved: boolean;
  avatarUrl?: string;
}

const empty: Omit<Testimonial, "_id"> = {
  author: "", role: "", company: "", quote: "", rating: 5, approved: false, avatarUrl: "",
};

export default function AdminTestimonials() {
  const { data, isLoading, mutate } = useSWR<Testimonial[]>("/api/testimonials", fetcher);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Testimonial | null>(null);

  async function toggleApproved(t: Testimonial) {
    await api.patch(`/api/testimonials/${t._id}`, { approved: !t.approved });
    mutate();
    toast.success(t.approved ? "Unapproved" : "Approved");
  }

  async function onDelete() {
    if (!deleting) return;
    await api.delete(`/api/testimonials/${deleting._id}`);
    mutate();
    toast.success("Deleted");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description={data ? `${data.length} total · ${data.filter((t) => t.approved).length} approved` : undefined}
        actions={<Button onClick={() => setCreating(true)}><Plus /> New testimonial</Button>}
      />

      {isLoading && <p className="text-text-muted text-sm">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((t) => (
          <div key={t._id} className="glass rounded-2xl p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-medium">{t.author}</p>
                <Badge variant={t.approved ? "gradient" : "default"}>{t.approved ? "approved" : "pending"}</Badge>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="size-3.5 fill-warning text-warning" />)}
              </div>
            </div>
            <p className="text-xs font-mono text-text-subtle">{t.role} · {t.company}</p>
            <p className="mt-3 line-clamp-3 text-sm text-text-muted">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 flex items-center justify-end gap-1">
              <Button size="icon" variant="ghost" aria-label={t.approved ? "Unapprove" : "Approve"} onClick={() => toggleApproved(t)}>
                {t.approved ? <X /> : <Check />}
              </Button>
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(t)}><Pencil /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(t)}><Trash2 /></Button>
            </div>
          </div>
        ))}
        {!isLoading && data?.length === 0 && (
          <div className="glass col-span-full rounded-2xl p-12 text-center text-text-muted">No testimonials yet.</div>
        )}
      </div>

      <TestimonialForm open={creating} onOpenChange={setCreating} initial={empty} mode="create" onSaved={() => mutate()} />
      <TestimonialForm open={!!editing} onOpenChange={(v) => !v && setEditing(null)} initial={editing ?? empty} id={editing?._id} mode="edit" onSaved={() => mutate()} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete testimonial?"
        description={`This permanently deletes the testimonial from ${deleting?.author}.`}
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </div>
  );
}

function TestimonialForm({
  open, onOpenChange, initial, id, mode, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Omit<Testimonial, "_id">;
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
      const payload = { ...form, avatarUrl: form.avatarUrl || undefined };
      if (mode === "create") await api.post("/api/testimonials", payload);
      else await api.patch(`/api/testimonials/${id}`, payload);
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
          <DialogTitle>{mode === "create" ? "New testimonial" : "Edit testimonial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1–5)</Label>
              <Input id="rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Math.max(1, Math.min(5, Number(e.target.value))) as Testimonial["rating"] })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input id="avatarUrl" type="url" value={form.avatarUrl ?? ""} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" rows={4} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
            <input type="checkbox" checked={form.approved} onChange={(e) => setForm({ ...form, approved: e.target.checked })} className="size-4 accent-accent-via" />
            <span className="text-sm">Approved (visible on public site)</span>
          </label>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
