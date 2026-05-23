import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_TTL_SECONDS, JWT_ISSUER, JWT_AUDIENCE } from "@/lib/constants";
import { serverEnv, allowedOrigins } from "@/lib/env";

function normalizeOrigin(o: string): string {
  return o.trim().replace(/\/+$/, "").toLowerCase();
}

function isLocalhostOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

const COOKIE_NAME = AUTH_COOKIE;
const ACCESS_TTL = AUTH_TTL_SECONDS;

function getSecret() {
  return new TextEncoder().encode(serverEnv().JWT_SECRET);
}

export interface AuthPayload extends JWTPayload {
  sub: string;
  email: string;
  role: "admin" | "owner";
}

export async function signToken(payload: Omit<AuthPayload, "iat" | "exp" | "iss" | "aud">) {
  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(`${ACCESS_TTL}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    // jose enforces alg, exp, iss, and aud — rejecting tokens minted for a
    // different service even if they share the secret.
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    return payload as AuthPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: serverEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TTL,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<AuthPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null;
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

type Handler = (req: NextRequest, ctx: { params: Promise<Record<string, string>>; session: AuthPayload }) => Promise<Response> | Response;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Defense-in-depth CSRF check: for mutating methods, require the `Origin`
 * header to match an allowlisted origin. Combined with SameSite=lax cookies
 * this stops cross-origin requests from drive-by JS even if a subdomain XSS
 * existed.
 */
function isOriginAllowed(req: NextRequest): boolean {
  if (SAFE_METHODS.has(req.method)) return true;
  let origin = req.headers.get("origin");
  if (!origin) {
    // Same-origin form posts may omit Origin in some browsers; fall back to Referer.
    const referer = req.headers.get("referer");
    if (!referer) return false;
    try {
      origin = new URL(referer).origin;
    } catch {
      return false;
    }
  }
  const normalized = normalizeOrigin(origin);
  const list = allowedOrigins();
  if (list.includes(normalized)) return true;
  // In non-production, accept any localhost/127.0.0.1 port so dev on alt ports works.
  if (serverEnv().NODE_ENV !== "production" && isLocalhostOrigin(normalized)) return true;
  return false;
}

export function withAuth(handler: Handler, role: "admin" | "owner" = "admin") {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    if (!isOriginAllowed(req)) return forbidden("Cross-origin request blocked");
    const session = await getSession();
    if (!session) return unauthorized();
    if (role === "owner" && session.role !== "owner") return forbidden();
    return handler(req, { ...ctx, session });
  };
}

export { AUTH_COOKIE } from "@/lib/constants";
