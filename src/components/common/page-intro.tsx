import type { ReactNode } from "react";
import { ResearchOrnament, type ResearchOrnamentVariant } from "@/components/common/research-ornament";

export function PageIntro({ eyebrow, title, description, aside, ornament = "neural" }: { eyebrow: string; title: string; description: string; aside?: ReactNode; ornament?: ResearchOrnamentVariant }) {
  return (
    <section className="lab-section relative overflow-hidden border-b border-[var(--lab-line)] pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="lab-noise absolute inset-0 opacity-70" />
      <div className="mx-auto grid max-w-[1480px] gap-8 px-4 md:px-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
        <div className="relative"><p className="lab-kicker">{eyebrow}</p><h1 className="lab-heading mt-5 max-w-5xl">{title}</h1><p className="mt-7 max-w-3xl text-base leading-8 text-[var(--lab-muted)] md:text-lg">{description}</p></div>
        <div className="w-full lg:max-w-[32rem] lg:justify-self-end">{aside ?? <ResearchOrnament variant={ornament} />}</div>
      </div>
    </section>
  );
}

