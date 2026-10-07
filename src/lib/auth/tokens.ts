import { createHmac, randomBytes } from "node:crypto";
import { requireEnv } from "@/lib/env";
export function generateResetToken() { return randomBytes(32).toString("base64url"); }
export function hashToken(token: string) { return createHmac("sha256", requireEnv("SESSION_SECRET")).update(token).digest("hex"); }
