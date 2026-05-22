import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validators";
import { ok, created, parseBody, handle, badRequest, tooMany } from "@/lib/api";
import { rateLimit, getIp, RATE_POLICIES } from "@/lib/rate-limit";
import { withAuth } from "@/lib/auth";
import { createContactMessage, listContactMessages } from "@/lib/services/contact";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const ip = getIp(req);
    const rl = rateLimit(`contact:${ip}`, RATE_POLICIES.contact);
    if (!rl.ok) return tooMany(rl.resetAt);

    const body = await parseBody(req, contactSchema);
    if (body.company) return badRequest("Spam detected"); // honeypot

    const { company: _honeypot, ...payload } = body;
    const result = await createContactMessage({
      ...payload,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    return created(result);
  });
}

export const GET = withAuth(async () =>
  handle(async () => ok(await listContactMessages()))
);
