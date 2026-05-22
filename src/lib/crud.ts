import type { HydratedDocument, Model, UpdateQuery } from "mongoose";
import type { NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { connectDB } from "@/lib/db";
import { withAuth, getSession } from "@/lib/auth";
import { audit } from "@/models/AuditLog";
import { ok, created, parseBody, handle, methodNotAllowed, NotFoundError } from "@/lib/api";
import { getRouteParam } from "@/lib/api/params";

/**
 * Options for the generic CRUD factory.
 *
 * Generics:
 *  - `TDoc`     — the document shape stored in MongoDB. Drives `Model<TDoc>`
 *                 so callers get full type inference on `.find`, `.create`, etc.
 *  - `TCreate`  — the validated body shape for POST.
 *  - `TPatch`   — the validated body shape for PATCH.
 */
interface CrudOptions<TDoc, TCreate, TPatch> {
  model: Model<TDoc>;
  entity: string;
  createSchema: ZodSchema<TCreate>;
  patchSchema: ZodSchema<TPatch>;
  /** Filter applied for unauthenticated callers on the public list endpoint. */
  publicFilter?: Record<string, unknown>;
  defaultSort?: Record<string, 1 | -1>;
}

const DEFAULT_SORT: Record<string, 1 | -1> = { order: 1, createdAt: -1 };

export function listHandler<TDoc, TCreate, TPatch>({
  model,
  publicFilter = {},
  defaultSort = DEFAULT_SORT,
}: CrudOptions<TDoc, TCreate, TPatch>) {
  return async (_req: NextRequest) =>
    handle(async () => {
      await connectDB();
      const session = await getSession();
      const filter = session ? {} : publicFilter;
      const docs = await model.find(filter).sort(defaultSort).lean();
      return ok(docs);
    });
}

export function adminListHandler<TDoc, TCreate, TPatch>({
  model,
  defaultSort = DEFAULT_SORT,
}: CrudOptions<TDoc, TCreate, TPatch>) {
  return withAuth(async () =>
    handle(async () => {
      await connectDB();
      const docs = await model.find({}).sort(defaultSort).lean();
      return ok(docs);
    })
  );
}

export function createHandler<TDoc, TCreate, TPatch>({
  model,
  entity,
  createSchema,
}: CrudOptions<TDoc, TCreate, TPatch>) {
  return withAuth(async (req, { session }) =>
    handle(async () => {
      const data = await parseBody(req, createSchema);
      await connectDB();
      const doc = await model.create(data);
      void audit({
        actorId: session.sub,
        actorEmail: session.email,
        action: "create",
        entity,
        entityId: String(doc._id),
      });
      return created(doc.toObject());
    })
  );
}

export function getOneHandler<TDoc, TCreate, TPatch>({ model }: CrudOptions<TDoc, TCreate, TPatch>) {
  return async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) =>
    handle(async () => {
      const id = await getRouteParam(ctx.params, "id");
      await connectDB();
      const doc = await model.findById(id).lean();
      if (!doc) throw NotFoundError();
      return ok(doc);
    });
}

export function patchHandler<TDoc, TCreate, TPatch>({
  model,
  entity,
  patchSchema,
}: CrudOptions<TDoc, TCreate, TPatch>) {
  return withAuth(async (req, { session, params }) =>
    handle(async () => {
      const id = await getRouteParam(params, "id");
      const data = await parseBody(req, patchSchema);
      await connectDB();
      // Zod has already validated `data`; Mongoose's UpdateQuery is structurally
      // a superset of `TPatch` once we drop schema-shaped fields, so we narrow
      // at this boundary rather than leak the cast into the rest of the file.
      const doc = (await model.findByIdAndUpdate(id, data as UpdateQuery<TDoc>, { new: true })) as
        | HydratedDocument<TDoc>
        | null;
      if (!doc) throw NotFoundError();
      void audit({
        actorId: session.sub,
        actorEmail: session.email,
        action: "update",
        entity,
        entityId: id,
        diff: data,
      });
      return ok(doc.toObject());
    })
  );
}

export function deleteHandler<TDoc, TCreate, TPatch>({ model, entity }: CrudOptions<TDoc, TCreate, TPatch>) {
  return withAuth(async (_req, { session, params }) =>
    handle(async () => {
      const id = await getRouteParam(params, "id");
      await connectDB();
      const doc = await model.findByIdAndDelete(id);
      if (!doc) throw NotFoundError();
      void audit({
        actorId: session.sub,
        actorEmail: session.email,
        action: "delete",
        entity,
        entityId: id,
      });
      return ok({ success: true });
    })
  );
}

/** 405 helper with proper `Allow` header. Pass the methods this route supports. */
export function notAllowed(allowed: readonly string[] = ["GET"]) {
  return methodNotAllowed(allowed);
}
