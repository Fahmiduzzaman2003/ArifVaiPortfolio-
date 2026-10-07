import { redirect } from "next/navigation";
import { AuthPage } from "@/components/admin/auth-page";
import { getSession } from "@/lib/auth/session";
export default async function LoginPage() { if (await getSession()) redirect("/admin"); return <AuthPage mode="login" title="Welcome back." description="Sign in with your admin email and password." />; }
