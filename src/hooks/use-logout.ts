"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

/** Returns a `logout()` handler that signs out and bounces to /admin/login. */
export function useLogout() {
  const router = useRouter();
  return async function logout() {
    try {
      await api.post("/api/auth/logout");
      toast.success("Signed out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };
}
