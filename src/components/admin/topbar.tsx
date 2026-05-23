"use client";

import { Bell, Menu, Search } from "lucide-react";

interface TopbarProps {
  onOpenMenu: () => void;
}

export function AdminTopbar({ onOpenMenu }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface/50 px-4 md:px-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMenu}
          className="grid size-9 place-items-center rounded-lg glass lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-4" />
        </button>
        <span className="font-mono text-xs text-text-subtle">/ admin</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
          <input
            placeholder="Search…"
            className="h-9 w-64 rounded-lg border border-border bg-black/[0.03] dark:bg-white/[0.03] pl-9 pr-3 text-sm placeholder:text-text-subtle focus:border-accent-via focus:outline-none focus:ring-2 focus:ring-accent-via/30"
          />
        </div>
        <button className="grid size-9 place-items-center rounded-lg glass" aria-label="Notifications">
          <Bell className="size-4" />
        </button>
        <div className="grid size-9 place-items-center rounded-full bg-accent-gradient font-display text-sm font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}
