import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { messagePatchSchema } from "@/lib/validators";
import { ok, notFound, parseBody, handle } from "@/lib/api";
import { withAuth } from "@/lib/auth";
import { audit } from "@/models/AuditLog";

export const runtime = "nodejs";

export const PATCH = withAuth(async (req, { session, params }) =>
  handle(async () => {
    const { id } = (await params) as { id: string };
    const parsed = await parseBody(req, messagePatchSchema);
    if ("error" in parsed) return parsed.error;
    await connectDB();
    const doc = await ContactMessage.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!doc) return notFound();
    await audit({ actorId: session.sub, actorEmail: session.email, action: "update", entity: "ContactMessage", entityId: id, diff: parsed.data });
    return ok(doc.toObject());
  })
);

export const DELETE = withAuth(async (_req, { session, params }) =>
  handle(async () => {
    const { id } = (await params) as { id: string };
    await connectDB();
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) return notFound();
    await audit({ actorId: session.sub, actorEmail: session.email, action: "delete", entity: "ContactMessage", entityId: id });
    return ok({ success: true });
  })
);
