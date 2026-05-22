import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

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

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function tooMany(resetAt: number) {
  return NextResponse.json(
    { error: "Too many requests", resetAt },
    { status: 429, headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) } }
  );
}

export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<{ data: T } | { error: Response }> {
  try {
    const json = await req.json();
    const data = schema.parse(json);
    return { data };
  } catch (e) {
    if (e instanceof ZodError) return { error: badRequest("Validation failed", e.flatten()) };
    return { error: badRequest("Invalid JSON body") };
  }
}

export function handle(fn: () => Promise<Response>) {
  return fn().catch((e) => {
    console.error("[api]", e);
    return serverError(e instanceof Error ? e.message : "Unknown error");
  });
}
