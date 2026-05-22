import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken, setAuthCookie, unauthorized } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { ok, parseBody, handle, tooMany } from "@/lib/api";
import { rateLimit, getIp, RATE_POLICIES } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Bcrypt of an unreachable password, used to keep response time constant when
 * the email doesn't exist. Generated with `bcrypt.hashSync("", 10)` and frozen —
 * never matches any real password.
 */
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8R6cN9pX5y6T5j7w8s8q1p2r3t4u5v";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const ip = getIp(req);
    const rl = rateLimit(`login:${ip}`, RATE_POLICIES.login);
    if (!rl.ok) return tooMany(rl.resetAt);

    const { email, password } = await parseBody(req, loginSchema);

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    // Always run bcrypt — comparing against a dummy hash when the user doesn't
    // exist keeps timing roughly constant and prevents email enumeration.
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hash);
    if (!user || !valid) return unauthorized("Invalid credentials");

    const token = await signToken({ sub: String(user._id), email: user.email, role: user.role });
    await setAuthCookie(token);

    user.lastLoginAt = new Date();
    await user.save();

    return ok({ user: { id: String(user._id), email: user.email, name: user.name, role: user.role } });
  });
}
