import Link from "next/link";
import { ArrowUpRight, Atom, Binary, Dna, Leaf, ScanSearch } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import type { Project, Publication, ResearchInterest } from "@/types/content";

const icons = [Atom, Dna, Leaf, Binary, ScanSearch];

export function ResearchWorld({ interests, publications, projects }: { interests: ResearchInterest[]; publications: Publication[]; projects: Project[] }) {
  return <section id="research-world" className="lab-section border-b border-[var(--lab-line)] px-4 py-20 md:px-8 md:py-24">
    <div className="mx-auto max-w-[1280px]">
      <Reveal className="grid gap-7 md:grid-cols-[.8fr_1.2fr] md:items-end"><div><p className="lab-kicker">Research directions</p><h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-[-.035em] text-white md:text-5xl">Focused questions,<br /><span className="text-[var(--lab-cyan)]">clear research context.</span></h2></div><div className="md:justify-self-end"><p className="max-w-xl text-sm leading-7 text-[var(--lab-muted)]">Each direction is managed from the admin panel and connects the research question, current focus, and supporting work without visual noise.</p><p className="mt-4 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--lab-muted)]">{interests.length} directions Â· {publications.length} publications Â· {projects.length} projects</p></div></Reveal>

      {interests.length ? <div className="mt-12 grid gap-4 md:grid-cols-2">{interests.slice(0, 6).map((interest, index) => { const Icon = icons[index % icons.length]; return <Reveal key={interest.id} delay={index * .04}><Link href={`/research#${interest.slug}`} className="research-card group block min-h-full rounded-2xl border border-[var(--lab-line)] bg-[var(--lab-panel)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--lab-cyan)]/45 hover:bg-[var(--lab-panel-raised)]"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[var(--lab-cyan-soft)] text-[var(--lab-cyan)]"><Icon size={18} /></span><span className="font-mono text-[9px] uppercase tracking-[.16em] text-[var(--lab-muted)]">{interest.category} / {interest.status}</span></div><h3 className="mt-7 font-serif text-2xl leading-tight text-white md:text-3xl">{interest.title}</h3><p className="mt-4 text-sm leading-7 text-[var(--lab-muted)]">{interest.shortDescription || interest.detail}</p>{interest.direction && <p className="mt-6 border-l border-[var(--lab-cyan)] pl-3 text-xs leading-6 text-[var(--lab-text)]">{interest.direction}</p>}<div className="mt-6 flex items-center justify-between gap-4"><div className="flex flex-wrap gap-2">{interest.keywords.slice(0, 3).map((keyword) => <span key={keyword} className="lab-chip">{keyword}</span>)}</div><ArrowUpRight size={16} className="shrink-0 text-[var(--lab-muted)] transition group-hover:text-[var(--lab-cyan)]" /></div></Link></Reveal>; })}</div> : <Reveal><div className="mt-12 rounded-2xl border border-dashed border-[var(--lab-line-strong)] p-10 text-center text-sm text-[var(--lab-muted)]">Research directions will appear here after they are published from the admin panel.</div></Reveal>}
    </div>
  </section>;
}

