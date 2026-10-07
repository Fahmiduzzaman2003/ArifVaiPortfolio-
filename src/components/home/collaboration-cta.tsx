import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";

export function CollaborationCta() {
  return <section className="lab-section px-4 py-16 md:px-8 md:py-20">
    <div className="collaboration-field mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-[var(--lab-line-strong)] px-6 py-10 md:px-10 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="lab-kicker">Open to collaboration</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-[-.035em] text-white md:text-5xl">Have a research question worth pursuing?</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--lab-muted)]">Start a focused conversation about PhD supervision, research collaboration, or applied research systems.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href="/contact" className="lab-action lab-action-primary">Contact <ArrowUpRight size={15} /></Link>
          <Link href="/cv" className="lab-action"><Download size={14} /> View CV</Link>
        </div>
      </div>
    </div>
  </section>;
}

