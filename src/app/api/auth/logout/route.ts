import { destroySession, getSession } from "@/lib/auth/session";
import { connectDatabase } from "@/lib/database/connect";
import { ok } from "@/lib/api/response";
import { Admin } from "@/models";
export async function POST(request: Request) { const session = await getSession(); const all = new URL(request.url).searchParams.get("all") === "true"; if (all && session) { await connectDatabase(); await Admin.findByIdAndUpdate(session.adminId, { $inc: { sessionVersion: 1 } }); } await destroySession(); return ok({ loggedOut: true }); }
