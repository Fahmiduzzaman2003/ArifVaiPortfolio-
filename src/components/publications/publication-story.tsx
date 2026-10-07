"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Copy, Database, FileText, GitBranch } from "lucide-react";
import { useRef, useState } from "react";
import { PublicationVisualBanner } from "@/components/publications/publication-visual-banner";
import { spring } from "@/lib/motion";
import { safeExternalHref } from "@/lib/utils";
import type { Publication } from "@/types/content";

export function PublicationStory({ paper }: { paper: Publication }) {
  const articleRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState<"citation" | "bibtex" | null>(null);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, spring.gentle);

  async function copy(kind: "citation" | "bibtex", value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1500);
  }

  const story = ([
    ["01", "Research problem", paper.problem], ["02", "Research gap", paper.gap],
    ["03", "Proposed methodology", paper.methodology], ["04", "Main contribution", paper.contribution],
    ["05", "My individual contribution", paper.individualContribution], ["06", "Results & evidence", paper.results],
    ["07", "Limitations", paper.limitations], ["08", "Future work", paper.futureWork],
  ] as const).filter((entry) => entry[2]?.trim());
  const links = [["Paper PDF", paper.links.pdf, FileText], ["Code", paper.links.code, GitBranch], ["Dataset", paper.links.dataset, Database], ["Publisher", paper.links.publisher, ArrowUpRight]] as const;
  const contextTags = [...new Set([...paper.researchAreas, ...paper.keywords])].filter(Boolean).slice(0, 6);
  const facts = [["Type", paper.type], ["Status", paper.status], ["Year", String(paper.year)], ["Venue", paper.venue || paper.publisher]].filter((entry): entry is string[] => Boolean(entry[1]));
  const doiValue = paper.links.doi?.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
  const doiHref = doiValue && !doiValue.startsWith("YOUR_") ? safeExternalHref(`https://doi.org/${doiValue}`) : undefined;
  const evidence = [["Datasets", paper.dataset], ["Models", paper.models]].filter((entry) => (entry[1] as string[]).length > 0) as Array<[string, string[]]>;
  const methodSteps = ["Input", ...paper.models.slice(0, 2), "Evaluation", "Evidence"];

  return <article ref={articleRef} className="lab-section">
    <motion.div aria-hidden="true" className="fixed bottom-0 left-0 z-[65] h-px w-full origin-left bg-[var(--lab-violet)]" style={{ scaleX: progress }} />
    <header className="publication-compact-hero lab-noise relative overflow-hidden border-b border-[var(--lab-line)]">
      <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-28 md:px-8 md:pb-14 md:pt-32">
        <Link href="/publications" className="lab-meta-link"><ArrowLeft size={12} /> All publications</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="relative z-10">
            <p className="lab-kicker">{paper.type} Â· {paper.status} Â· {paper.year}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.94] tracking-[-.05em] text-white md:text-7xl">{paper.title}</h1>
            {paper.summary && <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--lab-text)]">{paper.summary}</p>}
            {paper.authors.length > 0 && <p className="mt-5 font-mono text-[9px] uppercase leading-6 tracking-[.13em] text-[var(--lab-muted)]">{paper.authors.join(" Â· ")}{paper.authorPosition && <span className="text-[var(--lab-violet)]"> / {paper.authorPosition}</span>}</p>}
            <div className="mt-7 flex flex-wrap gap-2">
              {links.map(([label, href, Icon]) => safeExternalHref(href) && <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="lab-action"><Icon size={14} /> {label}</a>)}
              {paper.citationText && <button onClick={() => copy("citation", paper.citationText)} className="lab-action lab-action-quiet">{copied === "citation" ? <Check size={14} /> : <Copy size={14} />} Citation</button>}
              {paper.bibtex && <button onClick={() => copy("bibtex", paper.bibtex)} className="lab-action lab-action-quiet">{copied === "bibtex" ? <Check size={14} /> : <BookOpen size={14} />} BibTeX</button>}
            </div>
          </div>
          <aside className="publication-facts" aria-label="Publication details">
            <div className="publication-facts-heading"><span>Publication record</span><span>{paper.slug.toUpperCase()}</span></div>
            <dl>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            <div className="publication-fact-doi">
              <span>DOI</span>
              {doiHref ? <a href={doiHref} target="_blank" rel="noopener noreferrer" title={`Open DOI ${doiValue}`}><span>{doiValue}</span><ArrowUpRight size={13} /></a> : <p>DOI pending</p>}
            </div>
            {contextTags.length > 0 && <div className="publication-fact-tags">{contextTags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
          </aside>
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(19rem,.72fr)_minmax(0,1.28fr)]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <PublicationVisualBanner variant={paper.visualStyle} />
        {evidence.length > 0 && <dl className={`mt-4 grid gap-px overflow-hidden border border-[var(--lab-line)] bg-[var(--lab-line)] text-xs ${evidence.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>{evidence.map(([label, values]) => <div key={label} className="bg-[var(--lab-panel)] p-4"><dt className="font-mono text-[8px] uppercase tracking-wider text-[var(--lab-muted)]">{label}</dt><dd className="mt-2 leading-5 text-white">{values.join(", ")}</dd></div>)}</dl>}
        {story.length > 0 && <nav className="publication-outline" aria-label="Publication sections"><p>On this page</p><ol>{story.map(([number, title]) => <li key={number}><a href={`#section-${number}`}><span>{number}</span>{title}</a></li>)}</ol></nav>}
      </aside>

      <div className="publication-story-copy">
        {(paper.abstract || paper.summary) && <section className="publication-abstract border-b border-[var(--lab-line)] pb-10"><p className="lab-kicker">Abstract</p><p className="mt-5 text-lg leading-8 text-[var(--lab-text)] md:text-xl md:leading-9">{paper.abstract || paper.summary}</p></section>}
        {story.map(([number, title, content]) => <motion.section id={`section-${number}`} key={title} initial={reduced ? false : { opacity: .45, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} className="publication-story-section scroll-mt-28 border-b border-[var(--lab-line)] py-9 md:py-10">
          <div className="grid gap-4 md:grid-cols-[48px_1fr]"><span className="font-mono text-[9px] text-[var(--lab-violet)]">{number}</span><div><h2 className="font-serif text-3xl text-white md:text-[2.2rem]">{title}</h2><p className="mt-4 text-base leading-8 text-[var(--lab-muted)]">{content}</p>
            {number === "03" && <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">{methodSteps.map((step, index) => <div key={`${step}-${index}`} className="flex shrink-0 items-center gap-2"><span className="border border-[var(--lab-line-strong)] bg-[var(--lab-panel)] px-3 py-2.5 font-mono text-[8px] uppercase tracking-wider text-white">{step}</span>{index < methodSteps.length - 1 && <span className="h-px w-4 bg-[var(--lab-violet)]" />}</div>)}</div>}
            {number === "06" && paper.metrics.length > 0 && <div className="mt-6 grid gap-3 sm:grid-cols-2">{paper.metrics.map((metric) => <div key={metric.label} className="border-l border-[var(--lab-amber)] bg-[var(--lab-panel)] p-4"><strong className="font-serif text-3xl text-[var(--lab-amber)]">{metric.value}</strong><p className="mt-2 font-mono text-[8px] uppercase tracking-wider text-[var(--lab-muted)]">{metric.label}</p></div>)}</div>}
          </div></div>
        </motion.section>)}
      </div>
    </div>
  </article>;
}

