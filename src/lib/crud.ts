import type { Model } from "mongoose";
import type { NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { connectDB } from "@/lib/db";
import { withAuth, getSession } from "@/lib/auth";
import { audit } from "@/models/AuditLog";
import { ok, created, notFound, parseBody, handle, badRequest } from "@/lib/api";

interface Opts<TSchema, TPatch> {
  model: Model<any>;
  entity: string;
  createSchema: ZodSchema<TSchema>;
  patchSchema: ZodSchema<TPatch>;
  publicFilter?: Record<string, unknown>;
  defaultSort?: Record<string, 1 | -1>;
}

export function listHandler<S, P>({ model, publicFilter = {}, defaultSort = { order: 1, createdAt: -1 } }: Opts<S, P>) {
  return async (_req: NextRequest) =>
    handle(async () => {
      await connectDB();
      const session = await getSession();
      const filter = session ? {} : publicFilter;
      const docs = await model.find(filter).sort(defaultSort).lean();
      return ok(docs);
    });
}

export function adminListHandler<S, P>({ model, defaultSort = { order: 1, createdAt: -1 } }: Opts<S, P>) {
  return withAuth(async () =>
    handle(async () => {
      await connectDB();
      const docs = await model.find({}).sort(defaultSort).lean();
      return ok(docs);
    })
  );
}

export function createHandler<S, P>({ model, entity, createSchema }: Opts<S, P>) {
  return withAuth(async (req, { session }) =>
    handle(async () => {
      const parsed = await parseBody(req, createSchema);
      if ("error" in parsed) return parsed.error;
      await connectDB();
      const doc = await model.create(parsed.data as Record<string, unknown>);
      await audit({ actorId: session.sub, actorEmail: session.email, action: "create", entity, entityId: String(doc._id) });
      return created(doc.toObject());
    })
  );
}

export function getOneHandler<S, P>({ model }: Opts<S, P>) {
  return async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) =>
    handle(async () => {
      const { id } = await ctx.params;
      await connectDB();
      const doc = await model.findById(id).lean();
      if (!doc) return notFound();
      return ok(doc);
    });
}

export function patchHandler<S, P>({ model, entity, patchSchema }: Opts<S, P>) {
  return withAuth(async (req, { session, params }) =>
    handle(async () => {
      const { id } = (await params) as { id: string };
      const parsed = await parseBody(req, patchSchema);
      if ("error" in parsed) return parsed.error;
      await connectDB();
      const doc = await model.findByIdAndUpdate(id, parsed.data as Record<string, unknown>, { new: true });
      if (!doc) return notFound();
      await audit({ actorId: session.sub, actorEmail: session.email, action: "update", entity, entityId: id, diff: parsed.data });
      return ok(doc.toObject());
    })
  );
}

export function deleteHandler<S, P>({ model, entity }: Opts<S, P>) {
  return withAuth(async (_req, { session, params }) =>
    handle(async () => {
      const { id } = (await params) as { id: string };
      await connectDB();
      const doc = await model.findByIdAndDelete(id);
      if (!doc) return notFound();
      await audit({ actorId: session.sub, actorEmail: session.email, action: "delete", entity, entityId: id });
      return ok({ success: true });
    })
  );
}

export function notAllowed() {
  return badRequest("Method not allowed");
}
