"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Copy, Database, FileText, GitBranch } from "lucide-react";
import { useState } from "react";
import { motionDurations, motionEase } from "@/lib/motion";
import { safeExternalHref } from "@/lib/utils";
import type { Publication } from "@/types/content";

export function FeaturedPublicationStage({ publications }: { publications: Publication[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState<"citation" | "bibtex" | null>(null);
  const reduced = useReducedMotion();
  const paper = publications[activeIndex] ?? publications[0];
  if (!paper) return null;
  async function copy(kind: "citation" | "bibtex", value: string) { if (!value) return; await navigator.clipboard.writeText(value); setCopied(kind); window.setTimeout(() => setCopied(null), 1500); }
  const links = [["PDF", paper.links.pdf, FileText], ["Code", paper.links.code, GitBranch], ["Dataset", paper.links.dataset, Database], ["Publisher", paper.links.publisher, ArrowUpRight]] as const;

  return <section className="lab-section py-24 md:py-32">
    <div className="mx-auto max-w-[1480px] px-4 md:px-8">
      <div className="flex flex-col gap-7 border-b border-[var(--lab-line)] pb-9 md:flex-row md:items-end md:justify-between"><div><p className="lab-kicker">02 / Publication exhibition</p><h2 className="lab-heading mt-5">Research, staged as<br /><span className="text-[var(--lab-violet)]">an evidence trail.</span></h2></div><Link href="/publications" className="lab-action w-fit">Complete record <ArrowRight size={15} /></Link></div>
      <div className="grid lg:grid-cols-[240px_1fr]">
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--lab-line)] py-5 lg:flex-col lg:border-b-0 lg:border-r lg:py-10 lg:pr-5" role="tablist" aria-label="Featured publications">{publications.map((item, index) => <button key={item.id} role="tab" aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)} className={`publication-tab ${index === activeIndex ? "is-active" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><span className="line-clamp-2">{item.title}</span></button>)}</div>
        <AnimatePresence mode="wait"><motion.article key={paper.id} initial={reduced ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0, x: -12 }} transition={{ duration: motionDurations.component, ease: motionEase }} className="publication-stage lg:pl-10">
          <div className="publication-visual" aria-hidden="true"><div className="publication-patch-grid">{Array.from({ length: 36 }).map((_, index) => <span key={index} className={index % 7 === 0 || index === activeIndex + 3 ? "active" : ""} />)}</div><div className="publication-contour"><span /><span /><span /></div><p>FEATURE MAP / {paper.year}</p></div>
          <div className="py-10 lg:py-14">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-[.18em] text-[var(--lab-cyan)]"><span>{paper.type}</span><span className="size-1 rounded-full bg-[var(--lab-amber)]" /><span>{paper.status}</span><span className="size-1 rounded-full bg-[var(--lab-amber)]" /><span>{paper.venue}</span></div>
            <h3 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.04] text-white md:text-6xl">{paper.title}</h3>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--lab-muted)]">{paper.authors.join(" · ")} / {paper.authorPosition}</p>
            <div className="mt-10 grid gap-px overflow-hidden border border-[var(--lab-line)] bg-[var(--lab-line)] md:grid-cols-3">{[["Problem", paper.problem], ["Main contribution", paper.contribution], ["Researcher role", paper.individualContribution]].map(([label, content]) => <div key={label} className="bg-[var(--lab-bg)] p-5"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-[var(--lab-muted)]">{label}</p><p className="mt-4 text-sm leading-7 text-[var(--lab-text)]">{content}</p></div>)}</div>
            <div className="mt-7 flex flex-wrap gap-6">{paper.metrics.map((metric) => <div key={metric.label}><strong className="font-serif text-3xl text-[var(--lab-amber)]">{metric.value}</strong><span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-[var(--lab-muted)]">{metric.label}</span></div>)}</div>
            <div className="mt-9 flex flex-wrap gap-2"><Link href={`/publications/${paper.slug}`} className="lab-action lab-action-primary">Open research story <ArrowUpRight size={15} /></Link>{links.map(([label, href, Icon]) => safeExternalHref(href) && <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="lab-action lab-action-quiet"><Icon size={14} />{label}</a>)}</div>
            <div className="mt-5 flex gap-5 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--lab-muted)]"><button onClick={() => copy("citation", paper.citationText)} className="inline-flex items-center gap-2 hover:text-white">{copied === "citation" ? <Check size={13} /> : <Copy size={13} />} Citation</button><button onClick={() => copy("bibtex", paper.bibtex)} className="inline-flex items-center gap-2 hover:text-white">{copied === "bibtex" ? <Check size={13} /> : <BookOpen size={13} />} BibTeX</button></div>
          </div>
        </motion.article></AnimatePresence>
      </div>
      <div className="flex items-center gap-3 border-t border-[var(--lab-line)] pt-5"><div className="h-px flex-1 bg-[var(--lab-line)]"><motion.div className="h-px origin-left bg-[var(--lab-violet)]" animate={{ scaleX: (activeIndex + 1) / publications.length }} /></div><span className="font-mono text-[9px] text-[var(--lab-muted)]">{String(activeIndex + 1).padStart(2, "0")} / {String(publications.length).padStart(2, "0")}</span></div>
    </div>
  </section>;
}
