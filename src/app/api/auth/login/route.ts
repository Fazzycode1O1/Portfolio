import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { ok, parseBody, handle, badRequest, tooMany } from "@/lib/api";
import { rateLimit, getIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const ip = getIp(req);
    const rl = rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
    if (!rl.ok) return tooMany(rl.resetAt);

    const parsed = await parseBody(req, loginSchema);
    if ("error" in parsed) return parsed.error;

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (!user) return badRequest("Invalid credentials");

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) return badRequest("Invalid credentials");

    const token = await signToken({ sub: String(user._id), email: user.email, role: user.role });
    await setAuthCookie(token);

    user.lastLoginAt = new Date();
    await user.save();

    return ok({ user: { id: String(user._id), email: user.email, name: user.name, role: user.role } });
  });
}
