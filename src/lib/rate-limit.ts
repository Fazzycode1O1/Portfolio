interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitPolicy {
  /** Max requests per window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
}

/**
 * Canonical policies. Routes reference these by name so tuning happens in one
 * place. Add a new entry here when introducing a new abuse surface.
 */
export const RATE_POLICIES = {
  login:   { limit: 5, windowMs: 15 * 60_000 },
  contact: { limit: 3, windowMs: 60 * 60_000 },
} as const satisfies Record<string, RateLimitPolicy>;

export type RateLimitName = keyof typeof RATE_POLICIES;

export function rateLimit(key: string, policy: RateLimitPolicy = { limit: 5, windowMs: 60_000 }): RateLimitResult {
  const { limit, windowMs } = policy;
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, remaining: 0, resetAt: b.resetAt };
  return { ok: true, remaining: limit - b.count, resetAt: b.resetAt };
}

export function getIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
