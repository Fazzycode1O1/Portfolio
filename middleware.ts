import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/lib/constants";

const COOKIE_NAME = AUTH_COOKIE;

async function isValid(token: string | undefined) {
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    await jwtVerify(token, new TextEncoder().encode(secret));
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
    url.searchParams.set("from", pathname);
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
  matcher: ["/admin/:path*"],
};
