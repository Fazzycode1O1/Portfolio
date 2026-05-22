"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, Briefcase, MessageSquare, Sparkles, Settings,
  LogOut, Bell, Search, Quote, Code2, Menu, X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/inbox", label: "Inbox", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    try {
      await api.post("/api/auth/logout");
      toast.success("Signed out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  }

  function Nav({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
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
                  ? "bg-white/[0.06] text-text border border-border-strong"
                  : "border border-transparent text-text-muted hover:bg-white/[0.03] hover:text-text"
              )}
            >
              <Icon className="size-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-bg">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface/50 lg:flex lg:flex-col">
        <div className="flex h-14 items-center px-5 border-b border-border">
          <Link href="/" className="font-display text-base font-semibold">
            Alif<span className="text-gradient">.dev</span>
          </Link>
        </div>
        <Nav />
        <div className="border-t border-border p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-white/[0.03] hover:text-text">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 glass-strong flex flex-col">
            <div className="flex h-14 items-center justify-between border-b border-border px-5">
              <Link href="/" className="font-display text-base font-semibold">
                Alif<span className="text-gradient">.dev</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="grid size-8 place-items-center rounded-lg hover:bg-white/[0.05]" aria-label="Close menu"><X className="size-4" /></button>
            </div>
            <Nav onNavigate={() => setMobileOpen(false)} />
            <div className="border-t border-border p-3">
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-white/[0.03] hover:text-text">
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface/50 px-4 md:px-6 backdrop-blur">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="grid size-9 place-items-center rounded-lg glass lg:hidden" aria-label="Open menu"><Menu className="size-4" /></button>
            <span className="font-mono text-xs text-text-subtle">/ admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" />
              <input
                placeholder="Search…"
                className="h-9 w-64 rounded-lg border border-border bg-white/[0.03] pl-9 pr-3 text-sm placeholder:text-text-subtle focus:border-accent-via focus:outline-none focus:ring-2 focus:ring-accent-via/30"
              />
            </div>
            <button className="grid size-9 place-items-center rounded-lg glass" aria-label="Notifications">
              <Bell className="size-4" />
            </button>
            <div className="grid size-9 place-items-center rounded-full bg-accent-gradient font-display text-sm font-semibold text-white">A</div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
