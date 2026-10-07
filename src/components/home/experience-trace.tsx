"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, ChevronDown, MapPin, Sparkles, Wrench } from "lucide-react";
import { safeExternalHref } from "@/lib/utils";

type ExperienceEntry = Record<string, unknown> & {
  _id?: string;
  role?: string;
  organization?: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  summary?: string;
  responsibilities?: string[];
  researchContribution?: string;
  technicalContribution?: string;
  tools?: string[];
  organizationUrl?: string;
};

type Filter = "all" | "current" | "previous";

function formatDate(value?: string) {
  if (!value) return "Not specified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not specified";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function asList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

export function ExperienceTrace({ entries }: { entries: Array<Record<string, unknown>> }) {
  const reduced = useReducedMotion();
  const records = entries as ExperienceEntry[];
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(() => records[0]?._id ?? null);
  const organizations = new Set(records.map((entry) => entry.organization).filter(Boolean)).size;
  const current = records.filter((entry) => entry.current).length;
  const filtered = useMemo(() => records.filter((entry) => filter === "all" || (filter === "current" ? entry.current : !entry.current)), [filter, records]);

  if (!records.length) return <section className="lab-section px-4 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-[1180px] rounded-3xl border border-dashed border-[var(--lab-line-strong)] bg-[var(--lab-panel)] p-10 text-center"><BriefcaseBusiness className="mx-auto text-[var(--lab-amber)]" /><h2 className="mt-5 font-serif text-3xl text-white">Experience record coming soon.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--lab-muted)]">Published roles from the admin workspace will appear here with responsibilities, contributions, tools, dates, and organization links.</p></div></section>;

  return <section className="lab-section px-4 py-20 md:px-8 md:py-28"><div className="mx-auto max-w-[1280px]">
    <div className="grid gap-4 sm:grid-cols-3">{[
      { value: String(records.length).padStart(2, "0"), label: "Roles documented", Icon: BriefcaseBusiness },
      { value: String(organizations).padStart(2, "0"), label: "Organizations", Icon: Building2 },
      { value: String(current).padStart(2, "0"), label: "Current positions", Icon: Sparkles },
    ].map(({ value, label, Icon }) => <div key={label} className="relative overflow-hidden rounded-2xl border border-[var(--lab-line)] bg-[var(--lab-panel)] p-5"><Icon size={18} className="text-[var(--lab-amber)]" /><strong className="mt-6 block font-serif text-4xl font-normal text-white">{value}</strong><span className="mt-1 block font-mono text-[9px] uppercase tracking-[.15em] text-[var(--lab-muted)]">{label}</span><i className="absolute -bottom-10 -right-10 size-28 rounded-full border border-[var(--lab-amber)]/10" /></div>)}</div>

    <div className="mt-14 flex flex-col gap-5 border-b border-[var(--lab-line)] pb-6 md:flex-row md:items-end md:justify-between"><div><p className="lab-kicker !text-[var(--lab-amber)]">Professional timeline</p><h2 className="mt-4 font-serif text-3xl text-white md:text-4xl">Work, responsibility, and contribution.</h2></div><div className="flex rounded-full border border-[var(--lab-line)] bg-[var(--lab-panel)] p-1" aria-label="Filter experience">{(["all", "current", "previous"] as const).map((option) => <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)} className={`min-h-10 rounded-full px-4 font-mono text-[9px] uppercase tracking-[.13em] transition ${filter === option ? "bg-[var(--lab-amber)] text-[#181005]" : "text-[var(--lab-muted)] hover:text-white"}`}>{option}</button>)}</div></div>

    <div className="relative mt-10 md:pl-16"><motion.div initial={reduced ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: .8 }} className="absolute bottom-0 left-5 top-0 hidden w-px origin-top bg-gradient-to-b from-[var(--lab-amber)] via-[var(--lab-violet)] to-transparent md:block" />
      <AnimatePresence mode="popLayout">{filtered.map((entry, index) => { const id = String(entry._id ?? `${entry.role}-${index}`); const isOpen = expanded === id; const url = safeExternalHref(entry.organizationUrl); const responsibilities = asList(entry.responsibilities); const tools = asList(entry.tools); return <motion.article layout key={id} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .28 }} className="relative mb-5 overflow-hidden rounded-2xl border border-[var(--lab-line)] bg-[var(--lab-panel)]">
        <span className="absolute -left-[3.8rem] top-8 hidden size-10 place-items-center rounded-full border border-[var(--lab-amber)]/45 bg-[var(--lab-bg)] font-mono text-[9px] text-[var(--lab-amber)] md:grid">{String(index + 1).padStart(2, "0")}</span>
        <button type="button" onClick={() => setExpanded(isOpen ? null : id)} aria-expanded={isOpen} className="grid w-full gap-5 p-5 text-left sm:grid-cols-[1fr_auto] sm:items-start md:p-7"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[var(--lab-amber)]/30 bg-[var(--lab-amber)]/5 px-3 py-1 font-mono text-[8px] uppercase tracking-[.14em] text-[var(--lab-amber)]">{entry.current ? "Current" : "Completed"}</span>{entry.employmentType && <span className="rounded-full border border-[var(--lab-line)] px-3 py-1 font-mono text-[8px] uppercase tracking-[.12em] text-[var(--lab-muted)]">{entry.employmentType}</span>}</div><h3 className="mt-5 font-serif text-3xl text-white md:text-4xl">{entry.role || "Experience role"}</h3><p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--lab-text)]"><span className="inline-flex items-center gap-2"><Building2 size={14} className="text-[var(--lab-cyan)]" />{entry.organization || "Organization"}</span>{entry.location && <span className="inline-flex items-center gap-2 text-[var(--lab-muted)]"><MapPin size={13} />{entry.location}</span>}</p></div><div className="flex items-center justify-between gap-5 sm:justify-end"><span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[.12em] text-[var(--lab-muted)]"><CalendarDays size={13} />{formatDate(entry.startDate)} — {entry.current ? "Present" : formatDate(entry.endDate)}</span><ChevronDown size={18} className={`shrink-0 text-[var(--lab-amber)] transition ${isOpen ? "rotate-180" : ""}`} /></div></button>
        <AnimatePresence initial={false}>{isOpen && <motion.div initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduced ? undefined : { height: 0, opacity: 0 }} transition={{ duration: .3 }} className="overflow-hidden"><div className="border-t border-[var(--lab-line)] px-5 pb-7 pt-6 md:px-7">
          {entry.summary && <p className="max-w-4xl text-sm leading-7 text-[var(--lab-text)]">{entry.summary}</p>}
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[var(--lab-line)] bg-[var(--lab-line)] md:grid-cols-2">{entry.researchContribution && <div className="bg-[var(--lab-bg)] p-5"><p className="font-mono text-[8px] uppercase tracking-[.15em] text-[var(--lab-cyan)]">Research contribution</p><p className="mt-3 text-sm leading-7 text-[var(--lab-muted)]">{entry.researchContribution}</p></div>}{entry.technicalContribution && <div className="bg-[var(--lab-bg)] p-5"><p className="font-mono text-[8px] uppercase tracking-[.15em] text-[var(--lab-violet)]">Technical contribution</p><p className="mt-3 text-sm leading-7 text-[var(--lab-muted)]">{entry.technicalContribution}</p></div>}</div>
          {responsibilities.length > 0 && <div className="mt-7"><p className="font-mono text-[8px] uppercase tracking-[.15em] text-[var(--lab-muted)]">Responsibilities & outcomes</p><ul className="mt-4 grid gap-3 md:grid-cols-2">{responsibilities.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--lab-text)]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--lab-amber)]" />{item}</li>)}</ul></div>}
          <div className="mt-7 flex flex-col gap-5 border-t border-[var(--lab-line)] pt-5 sm:flex-row sm:items-center sm:justify-between">{tools.length > 0 ? <div className="flex flex-wrap items-center gap-2"><Wrench size={14} className="mr-1 text-[var(--lab-green)]" />{tools.map((tool) => <span key={tool} className="lab-chip">{tool}</span>)}</div> : <span />}{url && <a href={url} target="_blank" rel="noopener noreferrer" className="lab-action w-fit">Visit organization <ArrowUpRight size={14} /></a>}</div>
        </div></motion.div>}</AnimatePresence>
      </motion.article>; })}</AnimatePresence>
      {!filtered.length && <div className="rounded-2xl border border-dashed border-[var(--lab-line-strong)] p-8 text-center text-sm text-[var(--lab-muted)]">No experience records match this filter.</div>}
    </div>
  </div></section>;
}
