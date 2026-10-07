import type { Metadata } from "next";
import { PageIntro } from "@/components/common/page-intro";
import { ResearchWorld } from "@/components/home/research-world";
import { getProjects, getPublications, getResearchInterests } from "@/services/public-content";

export const metadata: Metadata = { title: "Research" };
export default async function ResearchPage() {
  const [researchInterests, publications, projects] = await Promise.all([getResearchInterests(), getPublications(), getProjects()]);
  return <main className="lab-section"><PageIntro eyebrow="Research agenda" title="Questions connected across health, biology, and agriculture." description="The agenda begins with application constraints and works backward toward reliable methods, interpretable evidence, and realistic deployment." ornament="fusion" /><ResearchWorld interests={researchInterests} publications={publications} projects={projects} /><section className="mx-auto max-w-[1480px] px-4 py-20 md:px-8 md:py-28"><div className="border-t border-[var(--lab-line)]">{researchInterests.map((item, i) => <article id={item.slug} key={item.id} className="grid scroll-mt-28 gap-5 border-b border-[var(--lab-line)] py-9 md:grid-cols-[100px_.75fr_1.25fr]"><span className="font-serif text-4xl text-white/10">0{i + 1}</span><div><p className="lab-kicker">{item.status} Â· {item.category}</p><h2 className="mt-4 font-serif text-3xl text-white">{item.title}</h2></div><div><p className="text-sm leading-7 text-[var(--lab-muted)]">{item.detail}</p><div className="mt-5 border-l border-[var(--lab-amber)] pl-4"><p className="font-mono text-[8px] uppercase tracking-widest text-[var(--lab-muted)]">Direction</p><p className="mt-2 text-sm text-white">{item.direction}</p></div></div></article>)}</div></section></main>;
}

