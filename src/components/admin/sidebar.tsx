"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-logout";
import { ADMIN_NAV } from "@/components/admin/nav-items";

interface SidebarProps {
  /** When set, renders the mobile drawer chrome and wires close on item click. */
  variant?: "desktop" | "mobile";
  onClose?: () => void;
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 p-3">
      {ADMIN_NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              active
                ? "bg-black/[0.06] dark:bg-white/[0.06] text-text border border-border-strong"
                : "border border-transparent text-text-muted hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-text"
            )}
          >
            <Icon className="size-4" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="font-display text-base font-semibold">
      Muhammad Faizan Ali<span className="text-gradient">.dev</span>
    </Link>
  );
}

export function AdminSidebar({ variant = "desktop", onClose }: SidebarProps) {
  const logout = useLogout();

  if (variant === "mobile") {
    return (
      <aside className="absolute left-0 top-0 h-full w-64 glass-strong flex flex-col">
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <Brand />
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>
        <NavList onNavigate={onClose} />
        <div className="border-t border-border p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-text"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface/50 lg:flex lg:flex-col">
      <div className="flex h-14 items-center px-5 border-b border-border">
        <Brand />
      </div>
      <NavList />
      <div className="border-t border-border p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-text"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
