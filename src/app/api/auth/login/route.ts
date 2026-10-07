import argon2 from "argon2";
import { createSession } from "@/lib/auth/session";
import { connectDatabase } from "@/lib/database/connect";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { loginSchema } from "@/lib/validation/auth";
import { Admin } from "@/models";

export async function POST(request: Request) {
  try {
    const ip = clientKey(request);
    if (!rateLimit(`login:${ip}`, Number(process.env.AUTH_RATE_LIMIT_MAX ?? 5), 15 * 60 * 1000).allowed) {
      return fail("Too many attempts. Try again later.", 429);
    }

    const input = loginSchema.parse(await request.json());
    await connectDatabase();
    const admin = await Admin.findOne({ email: input.email, active: true });
    if (!admin || !(await argon2.verify(String(admin.passwordHash), input.password))) {
      return fail("Invalid email or password", 401);
    }

    admin.lastLoginAt = new Date();
    await admin.save();
    await createSession({
      id: String(admin._id),
      sessionVersion: Number(admin.sessionVersion),
      role: String(admin.role),
    });

    return ok({ authenticated: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
