import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie, unauthorized } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { ok, parseBody, handle, tooMany } from "@/lib/api";
import { rateLimit, getIp, RATE_POLICIES } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const ip = getIp(req);
    const rl = rateLimit(`login:${ip}`, RATE_POLICIES.login);
    if (!rl.ok) return tooMany(rl.resetAt);

    const { email, password } = await parseBody(req, loginSchema);

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user) return unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return unauthorized("Invalid credentials");

    const token = await signToken({ sub: String(user._id), email: user.email, role: user.role });
    await setAuthCookie(token);

    user.lastLoginAt = new Date();
    await user.save();

    return ok({ user: { id: String(user._id), email: user.email, name: user.name, role: user.role } });
  });
}
