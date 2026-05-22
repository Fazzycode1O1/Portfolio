import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "auth_token";
const ACCESS_TTL = 60 * 60 * 24 * 2; // 2 days

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(s);
}

export interface AuthPayload extends JWTPayload {
  sub: string;
  email: string;
  role: "admin" | "owner";
}

export async function signToken(payload: Omit<AuthPayload, "iat" | "exp">) {
  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AuthPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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

export function withAuth(handler: Handler, role: "admin" | "owner" = "admin") {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    const session = await getSession();
    if (!session) return unauthorized();
    if (role === "owner" && session.role !== "owner") return forbidden();
    return handler(req, { ...ctx, session });
  };
}

export const AUTH_COOKIE = COOKIE_NAME;
