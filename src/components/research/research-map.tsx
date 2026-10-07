"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Dna, Leaf, ScanSearch, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ResearchInterest } from "@/types/content";
import { cn } from "@/lib/utils";

const icons = [ScanSearch, Dna, Leaf, Sparkles];

export function ResearchMap({ interests }: { interests: ResearchInterest[] }) {
  const [active, setActive] = useState(interests[0]?.id);
  const reduced = useReducedMotion();
  const current = interests.find((item) => item.id === active) ?? interests[0];

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[var(--ink)] p-5 text-white shadow-[0_30px_80px_rgba(16,37,45,.18)] md:p-10">
      <div className="fine-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <svg className="pointer-events-none absolute inset-0 size-full opacity-40" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
        <path d="M500 280 C390 150 270 150 145 120 M500 280 C610 140 740 160 865 105 M500 280 C390 400 260 390 120 455 M500 280 C625 415 765 380 900 460" fill="none" stroke="#7ed2c7" strokeWidth="1" strokeDasharray="5 7" />
      </svg>
      <div className="relative grid min-h-[540px] gap-8 lg:grid-cols-[1fr_1.12fr]">
        <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/[.045] p-6 md:p-8">
          <div>
            <p className="eyebrow !text-[var(--teal-light)]">Connected research ecosystem</p>
            <motion.div key={current?.id} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
              <p className="text-xs uppercase tracking-[.18em] text-white/45">{current?.category} · {current?.status}</p>
              <h3 className="mt-3 max-w-lg font-serif text-4xl leading-[1.05] md:text-5xl">{current?.title}</h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 md:text-base">{current?.shortDescription}</p>
              <div className="mt-6 flex flex-wrap gap-2">{current?.keywords.map((tag) => <span key={tag} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">{tag}</span>)}</div>
            </motion.div>
          </div>
          <Link href={`/research#${current?.slug}`} className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal-light)]">Trace related work <ArrowUpRight size={16} /></Link>
        </div>
        <div className="relative grid content-center gap-3 py-4" role="list" aria-label="Research domains">
          {interests.map((interest, index) => {
            const Icon = icons[index % icons.length];
            const isActive = interest.id === active;
            return (
              <button key={interest.id} onMouseEnter={() => setActive(interest.id)} onFocus={() => setActive(interest.id)} onClick={() => setActive(interest.id)} className={cn("group relative flex min-h-24 w-full items-center gap-5 rounded-2xl border p-4 text-left transition md:p-5", isActive ? "border-[var(--teal-light)] bg-[var(--teal)]/18" : "border-white/10 bg-black/10 hover:border-white/30")} role="listitem">
                <span className={cn("grid size-12 shrink-0 place-items-center rounded-full border transition", isActive ? "border-[var(--teal-light)] bg-[var(--teal)] text-white" : "border-white/15 bg-white/5 text-white/55")}><Icon size={20} /></span>
                <span className="min-w-0 flex-1"><span className="block text-[10px] uppercase tracking-[.2em] text-white/40">0{index + 1} / {interest.category}</span><span className="mt-1 block font-serif text-xl md:text-2xl">{interest.title}</span></span>
                <ArrowUpRight size={17} className="text-white/30 transition group-hover:text-white" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
