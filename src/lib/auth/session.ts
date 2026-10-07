import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { connectDatabase } from "@/lib/database/connect";
import { requireEnv } from "@/lib/env";
import { Admin } from "@/models";

const SESSION_COOKIE = "research_admin_session";
const key = () => new TextEncoder().encode(requireEnv("SESSION_SECRET"));

export async function createSession(admin: { id: string; sessionVersion: number; role: string }) { const token = await new SignJWT({ sessionVersion: admin.sessionVersion, role: admin.role }).setProtectedHeader({ alg: "HS256" }).setSubject(admin.id).setIssuedAt().setExpirationTime("8h").sign(key()); const store = await cookies(); store.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 }); }
export async function destroySession() { const store = await cookies(); store.delete(SESSION_COOKIE); }
export async function getSession(options: { checkDatabase?: boolean } = {}) { const token = (await cookies()).get(SESSION_COOKIE)?.value; if (!token) return null; try { const { payload } = await jwtVerify(token, key()); if (!payload.sub) return null; if (options.checkDatabase) { await connectDatabase(); const admin = await Admin.findById(payload.sub).select("active sessionVersion role email name").lean(); if (!admin || !admin.active || admin.sessionVersion !== payload.sessionVersion) return null; return { adminId: payload.sub, role: admin.role, email: admin.email, name: admin.name }; } return { adminId: payload.sub, role: String(payload.role ?? "editor") }; } catch { return null; } }
export { SESSION_COOKIE };
