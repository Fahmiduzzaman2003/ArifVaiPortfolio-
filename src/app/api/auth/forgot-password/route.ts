import { connectDatabase } from "@/lib/database/connect";
import { getEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { generateResetToken, hashToken } from "@/lib/auth/tokens";
import { handleRouteError, ok } from "@/lib/api/response";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { forgotSchema } from "@/lib/validation/auth";
import { Admin, PasswordResetToken } from "@/models";
export async function POST(request: Request) { const generic = { message: "If an account exists, a reset link has been sent." }; try { if (!rateLimit(`forgot:${clientKey(request)}`, 3, 60 * 60 * 1000).allowed) return ok(generic); const { email } = forgotSchema.parse(await request.json()); await connectDatabase(); const admin = await Admin.findOne({ email, active: true }).lean(); if (admin) { await PasswordResetToken.updateMany({ adminId: admin._id, usedAt: null }, { $set: { usedAt: new Date() } }); const raw = generateResetToken(); await PasswordResetToken.create({ adminId: admin._id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 30 * 60 * 1000) }); const url = `${getEnv().NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${encodeURIComponent(raw)}`; await sendEmail({ to: email, subject: "Reset your portfolio admin password", html: `<p>This link expires in 30 minutes and can be used once.</p><p><a href="${url}">Reset password</a></p>` }); } return ok(generic); } catch (error) { return handleRouteError(error); } }
