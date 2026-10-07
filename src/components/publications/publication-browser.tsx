import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Publication } from "@/types/content";

export function PublicationBrowser({ publications }: { publications: Publication[] }) {
  const records = [...publications].sort((a, b) => b.year - a.year);

  return (
    <section id="publication-records" className="mx-auto max-w-[1480px] scroll-mt-24 px-4 py-12 md:px-8 md:py-16">
      <header className="mb-2 flex items-end justify-between gap-6 border-b border-[var(--lab-line)] pb-5">
        <div>
          <p className="lab-kicker">Complete index</p>
          <h2 className="mt-3 font-serif text-3xl leading-none tracking-[-.03em] text-white md:text-4xl">All research outputs.</h2>
        </div>
        <p className="shrink-0 font-mono text-[8px] uppercase tracking-[.16em] text-[var(--lab-muted)]">
          {String(records.length).padStart(2, "0")} {records.length === 1 ? "record" : "records"}
        </p>
      </header>

      {records.length ? <div>{records.map((paper, index) => <article key={paper.id} className="group grid border-b border-[var(--lab-line)] py-7 transition md:grid-cols-[100px_1fr_auto] md:items-center"><div className="hidden font-serif text-5xl text-white/10 md:block">{String(index + 1).padStart(2, "0")}</div><div><div className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--lab-cyan)]"><span>{paper.type}</span><span>Â·</span><span>{paper.status}</span><span>Â·</span><span>{paper.year}</span></div><h3 className="mt-3 max-w-4xl font-serif text-2xl leading-tight text-white md:text-4xl"><Link href={`/publications/${paper.slug}`} className="transition group-hover:text-[var(--lab-cyan)]">{paper.title}</Link></h3><p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--lab-muted)]">{paper.summary}</p><div className="mt-4 flex flex-wrap gap-2">{paper.keywords.slice(0, 4).map((keyword) => <span key={keyword} className="lab-chip">{keyword}</span>)}</div></div><Link href={`/publications/${paper.slug}`} className="mt-5 grid size-11 place-items-center rounded-full border border-[var(--lab-line-strong)] transition group-hover:border-[var(--lab-cyan)] group-hover:text-[var(--lab-cyan)] md:ml-5 md:mt-0" aria-label={`Open ${paper.title}`}><ArrowUpRight size={17} /></Link></article>)}</div> : <div className="border-b border-[var(--lab-line)] py-16 text-center"><p className="font-serif text-3xl text-white">No publications yet.</p><p className="mt-3 text-sm text-[var(--lab-muted)]">Published papers will appear here automatically.</p></div>}
    </section>
  );
}

