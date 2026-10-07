import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth/session";
export default async function AdminLayout({ children }: { children: React.ReactNode }) { const session = await getSession(); return session ? <AdminShell>{children}</AdminShell> : children; }
