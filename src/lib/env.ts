/**
 * Centralized, validated access to environment variables.
 *
 * Import `env` (not `process.env`) from server code. Missing or malformed
 * values fail at first server-side access with a clear error, instead of
 * surfacing as cryptic runtime crashes (bcrypt against undefined, jwt
 * signing with empty secret, etc.).
 *
 * NEVER import this file from a client component or middleware (Edge runtime
 * cannot access most of these). Use the explicit `serverEnv` accessor below.
 */

import { z } from "zod";

const ServerEnvSchema = z.object({
  MONGODB_URI: z.string().url("MONGODB_URI must be a valid URL"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Optional integrations — only validated when present.
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_USERNAME: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Comma-separated list of allowed origins for CSRF protection on writes.
  // Defaults to NEXT_PUBLIC_SITE_URL when unset.
  ALLOWED_ORIGINS: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Vercel sets these automatically on every deployment.
  VERCEL_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

let cached: ServerEnv | null = null;

/**
 * Lazy accessor — first call validates and caches. Throws on missing/invalid
 * required vars so misconfigured deployments fail loudly rather than serve
 * broken responses.
 */
export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = ServerEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid server environment:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** Allowed origins for CSRF same-origin checks. Normalized (no trailing slash). */
export function allowedOrigins(): string[] {
  const env = serverEnv();
  const raw: string[] = [];
  if (env.ALLOWED_ORIGINS) raw.push(...env.ALLOWED_ORIGINS.split(","));
  if (env.NEXT_PUBLIC_SITE_URL) raw.push(env.NEXT_PUBLIC_SITE_URL);
  // VERCEL_URL is the deployment URL without protocol (e.g. "myapp-abc.vercel.app").
  if (env.VERCEL_URL) raw.push(`https://${env.VERCEL_URL}`);
  if (env.VERCEL_PROJECT_PRODUCTION_URL) raw.push(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (env.NODE_ENV !== "production") {
    raw.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  return raw
    .map((s) => s.trim().replace(/\/+$/, "").toLowerCase())
    .filter(Boolean);
}
