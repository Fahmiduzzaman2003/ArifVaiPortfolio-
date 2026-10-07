import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
const publicAdminPaths = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
export async function middleware(request: NextRequest) { if (publicAdminPaths.some((path) => request.nextUrl.pathname.startsWith(path))) return NextResponse.next(); const secret = process.env.SESSION_SECRET; const token = request.cookies.get("research_admin_session")?.value; if (!secret || !token) return NextResponse.redirect(new URL("/admin/login", request.url)); try { await jwtVerify(token, new TextEncoder().encode(secret)); return NextResponse.next(); } catch { const response = NextResponse.redirect(new URL("/admin/login", request.url)); response.cookies.delete("research_admin_session"); return response; } }
export const config = { matcher: ["/admin/:path*"] };
