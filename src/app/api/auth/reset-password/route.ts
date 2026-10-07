import argon2 from "argon2";
import { connectDatabase } from "@/lib/database/connect";
import { destroySession } from "@/lib/auth/session";
import { hashToken } from "@/lib/auth/tokens";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { resetSchema } from "@/lib/validation/auth";
import { Admin, PasswordResetToken } from "@/models";
export async function POST(request: Request) { try { const input = resetSchema.parse(await request.json()); await connectDatabase(); const token = await PasswordResetToken.findOne({ tokenHash: hashToken(input.token), usedAt: null, expiresAt: { $gt: new Date() } }); if (!token) return fail("Reset link is invalid or expired", 400); const passwordHash = await argon2.hash(input.password); await Admin.findByIdAndUpdate(token.adminId, { passwordHash, $inc: { sessionVersion: 1 } }); token.usedAt = new Date(); await token.save(); await destroySession(); return ok({ reset: true }); } catch (error) { return handleRouteError(error); } }
