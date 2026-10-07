import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowUpRight, BookOpen, FileEdit, FilePlus2, Microscope, Shapes } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { connectDatabase } from "@/lib/database/connect";
import { contentModels, ProjectModel, PublicationModel } from "@/models";

type RecentItem = { _id: unknown; title?: string; name?: string; role?: string; activity?: string; degree?: string; heading?: string; alt?: string; updatedAt?: Date; module: string };

export default async function AdminDashboard() {
  const session = await getSession({ checkDatabase: true });
  if (!session) redirect("/admin/login");
  await connectDatabase();

  const base = { deletedAt: null };
  const [publishedPapers, ongoingResearch, projects, draftCounts, recentGroups] = await Promise.all([
    PublicationModel.countDocuments({ ...base, publishState: "published" }),
    PublicationModel.countDocuments({ ...base, $or: [{ publicationType: "Ongoing Research" }, { publicationStatus: { $regex: "ongoing|under review", $options: "i" } }] }),
    ProjectModel.countDocuments(base),
    Promise.all(Object.values(contentModels).map((Model) => Model.countDocuments({ ...base, publishState: "draft" }))),
    Promise.all(Object.entries(contentModels).map(async ([module, Model]) => {
      const rows = await Model.find(base).sort({ updatedAt: -1 }).limit(2).select("title name role activity degree heading alt updatedAt").lean();
      return rows.map((row: Record<string, unknown>) => ({ ...row, module })) as RecentItem[];
    })),
  ]);
  const draftContent = draftCounts.reduce((sum, count) => sum + count, 0);
  const recent = recentGroups.flat().sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()).slice(0, 6);
  const stats = [["Published papers", publishedPapers, BookOpen], ["Ongoing research", ongoingResearch, Microscope], ["Research projects", projects, Shapes], ["Draft content", draftContent, FileEdit]] as const;
  const recordTitle = (item: RecentItem) => item.title || item.name || item.role || item.activity || item.degree || item.heading || item.alt || "Untitled";

  return <div>
    <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-7 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Admin dashboard</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">Research content at a glance.</h1><p className="mt-3 text-sm text-[var(--muted)]">Manage the complete public record without editing source code.</p></div><span className="text-xs text-[var(--muted)]">Secure session active</span></div>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, Icon]) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-white p-5"><div className="flex items-start justify-between"><Icon size={18} className="text-[var(--teal-deep)]" /><span className="font-serif text-4xl">{value}</span></div><p className="mt-7 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{label}</p></div>)}</div>
    <div className="mt-7 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <section className="rounded-2xl border border-[var(--line)] bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Quick add</h2><FilePlus2 size={18} /></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Publication", "/admin/publications"], ["Project", "/admin/projects"], ["Achievement", "/admin/achievements"]].map(([label, href]) => <Link key={label} href={href} className="group rounded-xl border border-[var(--line)] p-4 text-sm font-semibold hover:border-[var(--teal)]">{label}<ArrowUpRight className="mt-6 text-[var(--muted)] transition group-hover:text-[var(--teal)]" size={16} /></Link>)}</div>
        <h2 className="mt-8 font-serif text-2xl">Recently edited</h2><div className="mt-4 grid gap-2">{recent.length ? recent.map((item) => <Link key={`${item.module}-${String(item._id)}`} href={`/admin/${item.module}`} className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3 text-sm hover:border-[var(--teal)]"><span><strong>{recordTitle(item)}</strong><span className="ml-2 text-xs capitalize text-[var(--muted)]">{item.module.replace("-", " ")}</span></span><span className="text-xs text-[var(--muted)]">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ""}</span></Link>) : <div className="rounded-xl border border-dashed border-[var(--line-strong)] p-8 text-center text-sm text-[var(--muted)]">No content has been added yet.</div>}</div>
      </section>
      <aside className="rounded-2xl border border-[var(--line)] bg-white p-6"><div className="flex items-center gap-2"><AlertTriangle size={17} className="text-[var(--signal)]" /><h2 className="font-serif text-2xl">Launch checklist</h2></div><div className="mt-6 grid gap-3 text-sm">{["Replace all YOUR_* placeholders", "Upload an active CV", "Add portrait alt text", "Verify external research links", "Publish at least one research interest"].map((warning) => <div key={warning} className="rounded-xl bg-[var(--paper)] p-3">{warning}</div>)}</div></aside>
    </div>
  </div>;
}
