import type { Metadata } from "next";
import { RecordPage } from "@/components/common/record-page";
import { getAchievements } from "@/services/public-content";
export const metadata: Metadata = { title: "Achievements" };
export default async function AchievementsPage() { const stored = await getAchievements(); const records = stored.length ? stored.map((item: Record<string, unknown>) => ({ label: String(item.category ?? "Recognition"), title: String(item.title), meta: String(item.organization ?? ""), body: String(item.description ?? "") })) : [{ label: "YOUR_CATEGORY", title: "YOUR_ACHIEVEMENT_TITLE", meta: "YOUR_ORGANIZATION Â· YOUR_DATE", body: "YOUR_VERIFIED_ACHIEVEMENT_DESCRIPTION" }]; return <RecordPage eyebrow="Recognition" title="Verified milestones and academic recognition." description="Awards, scholarships, competition results, and certifications appear with issuing organization, date, evidence, and verification links." records={records} ornament="fusion" />; }

