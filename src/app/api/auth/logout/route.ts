import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  await clearAuthCookie();
  return ok({ success: true });
}
