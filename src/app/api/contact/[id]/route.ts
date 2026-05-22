import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { messagePatchSchema } from "@/lib/validators";
import { ok, parseBody, handle, NotFoundError } from "@/lib/api";
import { getRouteParam } from "@/lib/api/params";
import { withAuth } from "@/lib/auth";
import { audit } from "@/models/AuditLog";

export const runtime = "nodejs";

export const PATCH = withAuth(async (req, { session, params }) =>
  handle(async () => {
    const id = await getRouteParam(params, "id");
    const data = await parseBody(req, messagePatchSchema);
    await connectDB();
    const doc = await ContactMessage.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw NotFoundError();
    void audit({
      actorId: session.sub,
      actorEmail: session.email,
      action: "update",
      entity: "ContactMessage",
      entityId: id,
      diff: data,
    });
    return ok(doc.toObject());
  })
);

export const DELETE = withAuth(async (_req, { session, params }) =>
  handle(async () => {
    const id = await getRouteParam(params, "id");
    await connectDB();
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) throw NotFoundError();
    void audit({
      actorId: session.sub,
      actorEmail: session.email,
      action: "delete",
      entity: "ContactMessage",
      entityId: id,
    });
    return ok({ success: true });
  })
);
