"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileDown, Menu, MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profile as fallbackProfile } from "@/lib/placeholder-data";
import { motionDurations, motionEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

const nav = [["Home", "/"], ["Publications", "/publications"], ["Projects", "/projects"], ["Experience", "/experience"]] as const;

export function SiteHeader({ profile = fallbackProfile }: { profile?: typeof fallbackProfile }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 md:px-6 md:pt-5">
    <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between rounded-full border border-white/10 bg-[#090d12]/82 px-3 shadow-[0_16px_50px_rgba(0,0,0,.28)] backdrop-blur-xl md:px-4">
      <Link href="/" className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lab-cyan)]">
        <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-[var(--lab-cyan)]/50 font-mono text-[9px] text-[var(--lab-cyan)]"><span className="absolute inset-1 rounded-full border border-[var(--lab-cyan)]/15" />RF</span>
        <span className="hidden min-w-0 sm:block"><strong className="block truncate text-xs font-semibold tracking-wide text-white">{profile.name}</strong><span className="block font-mono text-[8px] uppercase tracking-[.18em] text-[var(--lab-muted)]">Research field</span></span>
      </Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">{nav.map(([label, href]) => { const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("relative rounded-full px-3 py-2 text-xs transition-colors", active ? "text-white" : "text-[var(--lab-muted)] hover:text-white")}>{label}{active && <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-1 h-px bg-[var(--lab-cyan)]" />}</Link>; })}</nav>
      <div className="flex items-center gap-1.5"><Link href="/cv" className="hidden min-h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:border-[var(--lab-cyan)] md:inline-flex"><FileDown size={13} /> CV</Link><Link href="/contact" className="hidden min-h-10 items-center gap-2 rounded-full bg-[var(--lab-cyan)] px-4 text-[10px] font-bold uppercase tracking-wider text-[#061316] transition hover:bg-white md:inline-flex"><MessageCircle size={13} /> Contact</Link><button onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav" className="grid size-10 place-items-center rounded-full border border-white/10 text-white lg:hidden" aria-label="Toggle navigation">{open ? <X size={17} /> : <Menu size={17} />}</button></div>
    </div>
    <AnimatePresence>{open && <motion.nav id="mobile-nav" initial={reduced ? false : { opacity: 0, y: -10, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: -8, scale: .98 }} transition={{ duration: motionDurations.micro, ease: motionEase }} className="mx-auto mt-2 grid max-w-[720px] grid-cols-2 gap-1 rounded-[1.35rem] border border-white/10 bg-[#090d12]/96 p-3 shadow-2xl backdrop-blur-xl lg:hidden">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-[var(--lab-text)] hover:bg-white/5 hover:text-white">{label}</Link>)}<Link href="/cv" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-[var(--lab-text)] hover:bg-white/5">View CV</Link><Link href="/contact" onClick={() => setOpen(false)} className="rounded-xl bg-[var(--lab-cyan)] px-4 py-3 text-sm font-semibold text-[#061316]">Contact</Link></motion.nav>}</AnimatePresence>
  </header>;
}

