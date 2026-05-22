"use client";

import * as React from "react";
import useSWR from "swr";
import { Archive, Trash2, MailOpen, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { api, fetcher } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
}

const FILTERS = ["all", "new", "read", "archived"] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminInbox() {
  const { data, isLoading, mutate } = useSWR<Message[]>("/api/contact", fetcher);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [open, setOpen] = React.useState<Message | null>(null);
  const [deleting, setDeleting] = React.useState<Message | null>(null);

  const filtered = (data ?? []).filter((m) => (filter === "all" ? true : m.status === filter));

  async function setStatus(m: Message, status: Message["status"]) {
    await api.patch(`/api/contact/${m._id}`, { status });
    mutate();
    toast.success(`Marked as ${status}`);
  }

  async function onDelete() {
    if (!deleting) return;
    await api.delete(`/api/contact/${deleting._id}`);
    mutate();
    setOpen(null);
    toast.success("Deleted");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        description={data ? `${data.filter((m) => m.status === "new").length} unread of ${data.length} total` : undefined}
      />

      <div className="inline-flex rounded-full glass p-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all",
              filter === f ? "bg-accent-gradient text-white" : "text-text-muted hover:text-text"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-text-muted text-sm">Loading…</p>}

      <div className="space-y-3">
        {filtered.map((m) => (
          <button
            key={m._id}
            onClick={() => { setOpen(m); if (m.status === "new") setStatus(m, "read"); }}
            className="w-full text-left glass rounded-2xl p-5 transition-all hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-medium text-text">{m.name}</p>
                  {m.status === "new" && <Badge variant="gradient">New</Badge>}
                  {m.status === "archived" && <Badge>Archived</Badge>}
                  <span className="font-mono text-xs text-text-subtle">· {m.email}</span>
                </div>
                <p className="text-sm font-medium text-text">{m.subject}</p>
                <p className="mt-1 line-clamp-1 text-sm text-text-muted">{m.message}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-text-subtle">{new Date(m.createdAt).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-text-muted">No messages in this view.</div>
        )}
      </div>

      {open && (
        <MessageDrawer
          message={open}
          onClose={() => setOpen(null)}
          onAction={async (action) => {
            if (action === "archive") await setStatus(open, "archived");
            else if (action === "read") await setStatus(open, "read");
            else if (action === "unread") await setStatus(open, "new");
            else if (action === "delete") setDeleting(open);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete message?"
        description="This permanently deletes the message from your inbox."
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </div>
  );
}

function MessageDrawer({
  message,
  onClose,
  onAction,
}: {
  message: Message;
  onClose: () => void;
  onAction: (a: "archive" | "delete" | "read" | "unread") => void;
}) {
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl glass-strong p-6 overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <Badge>{message.status}</Badge>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" aria-label={message.status === "new" ? "Mark read" : "Mark unread"} onClick={() => onAction(message.status === "new" ? "read" : "unread")}>
              {message.status === "new" ? <MailOpen /> : <Mail />}
            </Button>
            <Button size="icon" variant="ghost" aria-label="Archive" onClick={() => onAction("archive")}><Archive /></Button>
            <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => onAction("delete")}><Trash2 /></Button>
          </div>
        </div>
        <h2 className="font-display text-2xl font-semibold">{message.subject}</h2>
        <p className="mt-1 font-mono text-xs text-text-muted">
          From <a href={`mailto:${message.email}`} className="text-text hover:text-gradient">{message.name} &lt;{message.email}&gt;</a> · {new Date(message.createdAt).toLocaleString()}
        </p>
        <div className="mt-6 whitespace-pre-wrap rounded-2xl glass p-5 text-sm text-text-muted leading-relaxed">
          {message.message}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </aside>
    </div>
  );
}
