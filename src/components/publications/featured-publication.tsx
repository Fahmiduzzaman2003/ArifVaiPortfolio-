"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Copy, ExternalLink, FileText, GitBranch } from "lucide-react";
import type { Publication } from "@/types/content";
import { Button } from "@/components/ui/button";
import { safeExternalHref } from "@/lib/utils";

export function FeaturedPublication({ publication }: { publication: Publication }) {
  const [copied, setCopied] = useState<"citation" | "bibtex" | null>(null);
  async function copy(kind: "citation" | "bibtex", value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  }
  const doi = publication.links.doi && !publication.links.doi.startsWith("YOUR_") ? `https://doi.org/${publication.links.doi.replace(/^https?:\/\/doi.org\//, "")}` : undefined;
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[var(--line-strong)] bg-[#faf9f4] shadow-[0_24px_70px_rgba(16,37,45,.09)]">
      <div className="grid lg:grid-cols-[.86fr_1.4fr]">
        <div className="relative min-h-[350px] overflow-hidden bg-[var(--ink)] p-7 text-white md:p-10 lg:min-h-full">
          <div className="paper-grid absolute inset-0 opacity-10" aria-hidden="true" />
          <div className="absolute -right-20 top-14 size-72 rounded-[45%_55%_55%_45%] border border-[var(--teal-light)]/30" aria-hidden="true" />
          <div className="absolute -right-8 top-28 grid grid-cols-4 gap-1 opacity-50" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <span key={i} className="size-6 border border-white/15" style={{ background: i % 5 === 0 ? "rgba(126,210,199,.25)" : "transparent" }} />)}</div>
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.2em] text-white/50"><span>Featured paper</span><span>{publication.year}</span></div>
            <div className="my-16">
              <p className="text-xs uppercase tracking-[.16em] text-[var(--teal-light)]">Graphical abstract / placeholder</p>
              <div className="mt-5 max-w-xs border-l border-[var(--signal)] pl-4 text-sm leading-6 text-white/65">Problem → evidence-aware method → validated outcome</div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">{publication.researchAreas.map((area) => <span key={area} className="rounded-full border border-white/15 px-3 py-1.5">{area}</span>)}</div>
          </div>
        </div>
        <div className="p-7 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--muted)]"><span>{publication.type}</span><span className="size-1 rounded-full bg-[var(--signal)]" /><span>{publication.venue}</span><span className="size-1 rounded-full bg-[var(--signal)]" /><span>{publication.status}</span></div>
          <h3 className="mt-6 max-w-4xl font-serif text-3xl leading-[1.05] tracking-tight md:text-5xl">{publication.title}</h3>
          <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{publication.authors.join(" · ")} · {publication.authorPosition}</p>
          <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {[['Research problem', publication.problem], ['Contribution', publication.contribution], ['My role', publication.individualContribution]].map(([label, value]) => (
              <div key={label} className="bg-[#faf9f4] p-5"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--teal-deep)]">{label}</p><p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{value}</p></div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">{publication.metrics.map((metric) => <div key={metric.label} className="min-w-32 border-l-2 border-[var(--green)] pl-3"><p className="font-serif text-2xl">{metric.value}</p><p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{metric.label}</p></div>)}</div>
          <div className="mt-9 flex flex-wrap gap-2">
            <Button asChild><Link href={`/publications/${publication.slug}`}>Read research story <ArrowRight size={16} /></Link></Button>
            {doi && <Button asChild variant="secondary"><a href={doi} target="_blank" rel="noopener noreferrer">DOI <ExternalLink size={14} /></a></Button>}
            {safeExternalHref(publication.links.pdf) && <Button asChild variant="secondary"><a href={publication.links.pdf} target="_blank" rel="noopener noreferrer"><FileText size={15} /> PDF</a></Button>}
            {safeExternalHref(publication.links.code) && <Button asChild variant="secondary"><a href={publication.links.code} target="_blank" rel="noopener noreferrer"><GitBranch size={15} /> Code</a></Button>}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-[var(--muted)]">
            <button onClick={() => copy("citation", publication.citationText)} className="inline-flex items-center gap-1.5 hover:text-[var(--ink)]">{copied === "citation" ? <Check size={14} /> : <Copy size={14} />} Copy citation</button>
            <button onClick={() => copy("bibtex", publication.bibtex)} className="inline-flex items-center gap-1.5 hover:text-[var(--ink)]">{copied === "bibtex" ? <Check size={14} /> : <BookOpen size={14} />} BibTeX</button>
          </div>
        </div>
      </div>
    </article>
  );
}
