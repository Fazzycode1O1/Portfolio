import { getSession, unauthorized } from "@/lib/auth";
import { ok } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  return ok({ user: { id: session.sub, email: session.email, role: session.role } });
}
