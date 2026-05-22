"use client";

import * as React from "react";
import useSWR from "swr";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";

type Category = "language" | "framework" | "ai" | "devops" | "db" | "tool";
const CATEGORIES: Category[] = ["language", "framework", "ai", "devops", "db", "tool"];

interface Skill {
  _id: string;
  name: string;
  category: Category;
  proficiency: 1 | 2 | 3 | 4 | 5;
  order: number;
}

const empty: Omit<Skill, "_id"> = { name: "", category: "language", proficiency: 3, order: 0 };

export default function AdminSkills() {
  const { data, isLoading, mutate } = useSWR<Skill[]>("/api/skills", fetcher);
  const [editing, setEditing] = React.useState<Skill | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Skill | null>(null);

  const grouped = React.useMemo(() => {
    const g: Record<Category, Skill[]> = { language: [], framework: [], ai: [], devops: [], db: [], tool: [] };
    (data ?? []).forEach((s) => g[s.category].push(s));
    return g;
  }, [data]);

  async function onDelete() {
    if (!deleting) return;
    await api.delete(`/api/skills/${deleting._id}`);
    toast.success("Skill deleted");
    mutate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills"
        description={data ? `${data.length} skills across ${CATEGORIES.length} categories` : undefined}
        actions={<Button onClick={() => setCreating(true)}><Plus /> New skill</Button>}
      />

      {isLoading && <p className="text-text-muted text-sm">Loading…</p>}

      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const items = grouped[cat] ?? [];
          if (!items.length) return null;
          return (
            <section key={cat}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-text-muted">{cat}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <div key={s._id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{s.name}</p>
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`h-1 w-3 rounded-full ${i < s.proficiency ? "bg-accent-gradient" : "bg-white/10"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(s)}><Pencil /></Button>
                      <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(s)}><Trash2 /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {!isLoading && data?.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-text-muted">
            No skills yet. <button onClick={() => setCreating(true)} className="text-gradient">Add the first one</button>.
          </div>
        )}
      </div>

      <SkillForm open={creating} onOpenChange={setCreating} initial={empty} mode="create" onSaved={() => mutate()} />
      <SkillForm open={!!editing} onOpenChange={(v) => !v && setEditing(null)} initial={editing ?? empty} id={editing?._id} mode="edit" onSaved={() => mutate()} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete skill?"
        description={`This removes "${deleting?.name}" from the public site.`}
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </div>
  );
}

function SkillForm({
  open, onOpenChange, initial, id, mode, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Omit<Skill, "_id">;
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
      if (mode === "create") await api.post("/api/skills", form);
      else await api.patch(`/api/skills/${id}`, form);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New skill" : "Edit skill"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="h-12 w-full rounded-lg border border-border bg-white/[0.03] px-3 text-sm focus:border-accent-via focus:outline-none focus:ring-2 focus:ring-accent-via/30"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proficiency">Proficiency (1–5)</Label>
              <Input id="proficiency" type="number" min={1} max={5} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Math.max(1, Math.min(5, Number(e.target.value))) as Skill["proficiency"] })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input id="order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
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
