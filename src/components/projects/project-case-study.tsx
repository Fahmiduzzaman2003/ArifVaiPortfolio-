import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/content";

export function ProjectCaseStudy({ project, index }: { project: Project; index: number }) {
  return (
    <article className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white/45 lg:grid-cols-[.64fr_1.36fr]">
      <div className="relative min-h-64 overflow-hidden bg-[var(--paper-deep)] p-7">
        <div className="paper-grid absolute inset-0 opacity-50" />
        <div className="relative flex h-full flex-col justify-between">
          <span className="font-serif text-6xl text-[var(--ink)]/10">0{index + 1}</span>
          <div><p className="eyebrow">{project.category}</p><p className="mt-2 text-sm text-[var(--muted)]">{project.status}</p></div>
        </div>
        <div className="absolute right-8 top-12 size-32 rounded-full border border-[var(--green)]/30"><div className="absolute inset-5 rounded-full border border-[var(--green)]/40" /></div>
      </div>
      <div className="p-7 md:p-10">
        <h3 className="font-serif text-3xl leading-tight md:text-4xl">{project.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">{project.summary}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2"><div><p className="eyebrow">Research question</p><p className="mt-2 text-sm leading-6">{project.problem}</p></div><div><p className="eyebrow">Contribution</p><p className="mt-2 text-sm leading-6">{project.contribution}</p></div></div>
        <div className="mt-8 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5"><div className="flex flex-wrap gap-2">{project.technologies.map((tag) => <span key={tag} className="rounded-full bg-[var(--paper-deep)] px-3 py-1.5 text-xs">{tag}</span>)}</div><Link href={`/projects/${project.slug}`} className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-white" aria-label={`View ${project.title}`}><ArrowUpRight size={17} /></Link></div>
      </div>
    </article>
  );
}
