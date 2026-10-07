import { notFound, redirect } from "next/navigation";
import { ContentManager } from "@/components/admin/content-manager";
import { SkillsWorkspace } from "@/components/admin/skills-workspace";
import { adminModules } from "@/config/admin-modules";
import { getSession } from "@/lib/auth/session";
export default async function AdminModulePage({ params }: { params: Promise<{ module: string }> }) {
  if (!(await getSession())) redirect("/admin/login");
  const { module: key } = await params;
  if (key === "skill-categories") redirect("/admin/skills");
  if (key === "skills") return <SkillsWorkspace />;
  const moduleConfig = adminModules[key];
  if (!moduleConfig) notFound();
  return <ContentManager module={moduleConfig} />;
}
