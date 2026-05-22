import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE, JWT_AUDIENCE, JWT_ISSUER } from "@/lib/constants";

const COOKIE_NAME = AUTH_COOKIE;

async function isValid(token: string | undefined) {
  if (!token) return false;
  try {
    // Middleware runs on Edge — can't import the Node-only `serverEnv`. Read
    // JWT_SECRET directly. Missing secret = no valid session (fail-closed).
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const valid = await isValid(token);

  // Protect /admin/* (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    // Only same-origin admin paths flow into the `from` query — the login
    // page additionally re-validates this to prevent open redirects.
    if (pathname.startsWith("/admin")) url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Bounce signed-in users away from the login screen
  if (pathname === "/admin/login" && valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, static assets, and the favicon so the JWT verify
  // doesn't run on every prefetch.
  matcher: ["/admin/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js)$).*)"],
};
