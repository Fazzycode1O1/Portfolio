import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { settingsSchema } from "@/lib/validators";
import { ok, parseBody, handle } from "@/lib/api";
import { withAuth } from "@/lib/auth";
import { audit } from "@/models/AuditLog";

export const runtime = "nodejs";

export async function GET() {
  return handle(async () => {
    await connectDB();
    const doc = await SiteSettings.getSingleton();
    return ok(doc.toObject());
  });
}

export const PATCH = withAuth(async (req: NextRequest, { session }) =>
  handle(async () => {
    const parsed = await parseBody(req, settingsSchema);
    if ("error" in parsed) return parsed.error;
    await connectDB();
    const doc = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $set: parsed.data, $setOnInsert: { key: "default" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await audit({ actorId: session.sub, actorEmail: session.email, action: "update", entity: "SiteSettings", diff: parsed.data });
    return ok(doc.toObject());
  })
);
