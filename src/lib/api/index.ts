import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

/* ---------------------------------------------------------------- responses */

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function methodNotAllowed(allowed: readonly string[]) {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: allowed.join(", ") } }
  );
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function tooMany(resetAt: number) {
  return NextResponse.json(
    { error: "Too many requests", resetAt },
    { status: 429, headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) } }
  );
}

/* ---------------------------------------------------------------- errors */

/**
 * Thrown by `parseBody` (and callable directly) so route handlers can stop
 * juggling discriminated-union return shapes. `handle()` catches these and
 * renders the appropriate response.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;
  constructor(message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const NotFoundError = (message = "Not found") => new ApiError(message, 404);
export const ValidationError = (details?: unknown) => new ApiError("Validation failed", 400, details);

/* ---------------------------------------------------------------- helpers */

/** Hard cap on JSON request bodies. Anything larger is almost certainly abuse. */
const MAX_BODY_BYTES = 100 * 1024; // 100 KB

/**
 * Parse + validate a JSON request body. Throws `ApiError(400)` on schema
 * failure and `ApiError(413)` on oversized payloads — let `handle()` render.
 */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    throw new ApiError("Payload too large", 413);
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
  try {
    return schema.parse(json);
  } catch (e) {
    if (e instanceof ZodError) throw ValidationError(e.flatten());
    throw e;
  }
}

/**
 * Central error trap. Renders known `ApiError`s with their declared status;
 * logs everything else and returns a generic 500 (no internal-message leak).
 */
export function handle(fn: () => Promise<Response>) {
  return fn().catch((e) => {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: e.message, details: e.details }, { status: e.status });
    }
    console.error("[api]", e);
    return serverError();
  });
}
