import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile as fallbackProfile } from "@/lib/placeholder-data";

export function SiteFooter({ profile = fallbackProfile, statement }: { profile?: typeof fallbackProfile; statement?: string }) {
  return <footer className="border-t border-[var(--lab-line)] bg-[#030507] text-white">
    <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="font-serif text-2xl text-white">{profile.name}</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--lab-muted)]">{statement || profile.statement}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-[var(--lab-muted)] md:justify-end">
          <Link href="/" className="hover:text-[var(--lab-cyan)]">Home</Link>
          <Link href="/publications" className="hover:text-[var(--lab-cyan)]">Publications</Link>
          <Link href="/projects" className="hover:text-[var(--lab-cyan)]">Projects</Link>
          <Link href="/experience" className="hover:text-[var(--lab-cyan)]">Experience</Link>
          <Link href="/contact" className="hover:text-[var(--lab-cyan)]">Contact</Link>
          <Link href="/cv" className="hover:text-[var(--lab-cyan)]">CV</Link>
          <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:text-[var(--lab-cyan)]">Email <ArrowUpRight size={11} /></a>
        </div>
      </div>
      <div className="mt-9 flex flex-col gap-3 border-t border-[var(--lab-line)] pt-5 font-mono text-[8px] uppercase tracking-[.14em] text-[var(--lab-muted)] sm:flex-row sm:justify-between">
        <span>Â© {new Date().getFullYear()} {profile.name}</span>
        <Link href="/admin" className="transition hover:text-white">Admin workspace</Link>
      </div>
    </div>
  </footer>;
}

