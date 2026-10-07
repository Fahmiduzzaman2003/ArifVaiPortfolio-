"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Boxes, Database, Layers3 } from "lucide-react";
import type { MouseEvent } from "react";
import { spring } from "@/lib/motion";
import type { Project } from "@/types/content";

function ProjectPreview({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(.5); const my = useMotionValue(.5);
  const sx = useSpring(mx, spring.responsive); const sy = useSpring(my, spring.responsive);
  const rotateX = useTransform(sy, [0, 1], [2.5, -2.5]); const rotateY = useTransform(sx, [0, 1], [-3.5, 3.5]);
  function move(event: MouseEvent<HTMLElement>) { if (reduced) return; const rect = event.currentTarget.getBoundingClientRect(); mx.set((event.clientX - rect.left) / rect.width); my.set((event.clientY - rect.top) / rect.height); }
  return <motion.article onMouseMove={move} onMouseLeave={() => { mx.set(.5); my.set(.5); }} style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }} className={`project-lab-item ${index === 0 ? "is-featured" : ""}`}>
    <div className="project-lab-visual" aria-hidden="true"><span className="project-bbox" /><div className="project-feature-grid">{Array.from({ length: 20 }).map((_, i) => <i key={i} className={i % (index + 3) === 0 ? "active" : ""} />)}</div><span className="absolute bottom-4 left-4 font-mono text-[8px] tracking-[.16em] text-[var(--lab-muted)]">CASE / {String(index + 1).padStart(2, "0")}</span></div>
    <div className="p-5 md:p-7"><div className="flex items-center justify-between"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-[var(--lab-green)]">{project.category}</p><span className="font-mono text-[8px] uppercase tracking-wider text-[var(--lab-muted)]">{project.status}</span></div><h3 className="mt-6 max-w-xl font-serif text-3xl leading-tight text-white md:text-4xl">{project.title}</h3><p className="mt-4 max-w-xl text-sm leading-7 text-[var(--lab-muted)]">{project.summary}</p><div className="mt-7 grid gap-4 border-y border-[var(--lab-line)] py-5 sm:grid-cols-2"><div><p className="font-mono text-[8px] uppercase tracking-wider text-[var(--lab-muted)]">Method trace</p><p className="mt-2 text-xs leading-5 text-[var(--lab-text)]">{project.methodology}</p></div><div><p className="font-mono text-[8px] uppercase tracking-wider text-[var(--lab-muted)]">Research contribution</p><p className="mt-2 text-xs leading-5 text-[var(--lab-text)]">{project.contribution}</p></div></div><div className="mt-6 flex items-center justify-between gap-4"><div className="flex flex-wrap gap-2">{project.technologies.slice(0, 3).map((tag) => <span className="lab-chip" key={tag}>{tag}</span>)}</div><Link href={`/projects/${project.slug}`} className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--lab-line-strong)] text-white transition hover:border-[var(--lab-green)] hover:text-[var(--lab-green)]" aria-label={`Open ${project.title}`}><ArrowUpRight size={16} /></Link></div></div>
  </motion.article>;
}

export function ProjectLab({ projects }: { projects: Project[] }) {
  return <section className="lab-section border-y border-[var(--lab-line)] py-24 md:py-32"><div className="mx-auto max-w-[1480px] px-4 md:px-8"><div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="lab-kicker !text-[var(--lab-green)]">03 / Applied research lab</p><h2 className="lab-heading mt-5">Questions turned into<br /><span className="text-[var(--lab-green)]">working systems.</span></h2></div><div className="grid grid-cols-3 gap-3 lg:justify-self-end"><span className="lab-signal"><Boxes size={15} /> Model systems</span><span className="lab-signal"><Database size={15} /> Datasets</span><span className="lab-signal"><Layers3 size={15} /> Evaluation</span></div></div><div className="mt-14 grid gap-5 lg:grid-cols-2">{projects.map((project, index) => <ProjectPreview project={project} index={index} key={project.id} />)}</div><Link href="/projects" className="lab-action mt-8">Explore all projects <ArrowUpRight size={15} /></Link></div></section>;
}

