"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="relative flex min-h-screen bg-bg">
      <AdminSidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <AdminSidebar variant="mobile" onClose={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <AdminTopbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
