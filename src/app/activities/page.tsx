import type { Metadata } from "next";
import { RecordPage } from "@/components/common/record-page";
import { getActivities } from "@/services/public-content";
export const metadata: Metadata = { title: "Activities" };
export default async function ActivitiesPage() { const stored = await getActivities(); const records = stored.length ? stored.map((item: Record<string, unknown>) => ({ label: String(item.category ?? "Activity"), title: String(item.activity), meta: `${String(item.position ?? "")} Â· ${String(item.organization ?? "")}`, body: String(item.description ?? "") })) : [{ label: "YOUR_CATEGORY", title: "YOUR_ACTIVITY", meta: "YOUR_POSITION Â· YOUR_ORGANIZATION Â· YOUR_DATE", body: "YOUR_ACTIVITY_DESCRIPTION" }]; return <RecordPage eyebrow="Co-curricular record" title="Leadership, service, and communities of practice." description="Selected activities show role, organization, contribution, date, category, and supporting evidence." records={records} ornament="vision" />; }

