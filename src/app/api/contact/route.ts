import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { contactSchema } from "@/lib/validators";
import { ok, created, parseBody, handle, badRequest, tooMany } from "@/lib/api";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { withAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const ip = getIp(req);
    const rl = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 60 * 60_000 });
    if (!rl.ok) return tooMany(rl.resetAt);

    const parsed = await parseBody(req, contactSchema);
    if ("error" in parsed) return parsed.error;
    if (parsed.data.company) return badRequest("Spam detected"); // honeypot

    await connectDB();
    const doc = await ContactMessage.create({
      ...parsed.data,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    // Email pipeline (e.g. Resend) would go here.
    return created({ id: String(doc._id) });
  });
}

export const GET = withAuth(async () =>
  handle(async () => {
    await connectDB();
    const docs = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    return ok(docs);
  })
);
