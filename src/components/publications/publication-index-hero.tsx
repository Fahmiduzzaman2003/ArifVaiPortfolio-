import Link from "next/link";
import { ArrowDown, ArrowUpRight, BookOpenText, CalendarDays, Layers3, Route, ScanSearch, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { ResearchOrnament, type ResearchOrnamentVariant } from "@/components/common/research-ornament";
import type { Publication } from "@/types/content";

const fallbackTopics = ["Computer vision", "Deep learning", "Applied AI"];

export function PublicationIndexHero({ publications }: { publications: Publication[] }) {
  const featured = publications.find((paper) => paper.featured) ?? publications[0];
  const types = new Set(publications.map((paper) => paper.type).filter(Boolean));
  const years = publications.map((paper) => paper.year).filter(Number.isFinite);
  const latestYear = years.length ? Math.max(...years) : "â€”";
  const featuredVariant: ResearchOrnamentVariant = featured?.visualStyle === "vision-detection" ? "vision" : featured?.visualStyle === "attention-fusion" ? "fusion" : "neural";
  const indexedTopics = [...new Set(publications.flatMap((paper) => [...paper.keywords, ...paper.researchAreas, ...paper.models]).filter(Boolean))];
  const topics = (indexedTopics.length ? indexedTopics : fallbackTopics).slice(0, 6);
  const featuredNumber = featured ? Math.max(1, publications.findIndex((paper) => paper.id === featured.id) + 1) : 0;
  const metrics = [
    { label: "Papers", value: publications.length, Icon: BookOpenText },
    { label: "Output types", value: types.size, Icon: Layers3 },
    { label: "Latest year", value: latestYear, Icon: CalendarDays },
    { label: "Featured", value: featured ? "01" : "â€”", Icon: Star },
  ];
  const process = [
    { label: "Question", detail: "Frame the gap", Icon: ScanSearch },
    { label: "Model", detail: "Build the method", Icon: Route },
    { label: "Evidence", detail: "Report the result", Icon: ShieldCheck },
  ];

  return <section className="publication-index-hero lab-section relative overflow-hidden border-b border-[var(--lab-line)]">
    <div className="lab-noise absolute inset-0 opacity-60" />
    <div className="publication-hero-glow" aria-hidden="true" />
    <div className="publication-hero-shell relative mx-auto max-w-[1480px] px-4 md:px-8">
      <Reveal className="publication-hero-rail">
        <span><i /> Research publication archive</span>
        <div><span>{String(publications.length).padStart(2, "0")} peer-facing records</span><span>Living index / {latestYear}</span></div>
      </Reveal>

      <div className="publication-hero-grid">
        <Reveal className="publication-hero-copy">
          <p className="lab-kicker">Publication record / Evidence ledger</p>
          <h1>Research that moves<br /><span>from question</span><br />to evidence.</h1>
          <p className="publication-hero-intro">A focused archive of papers with the reasoning left inâ€”why each problem matters, how the model was built, and what the results actually support.</p>

          <div className="publication-process" aria-label="Research publication process">
            {process.map(({ label, detail, Icon }, index) => <div key={label}><span><Icon size={14} /></span><div><code>0{index + 1}</code><strong>{label}</strong><p>{detail}</p></div></div>)}
          </div>

          <div className="publication-topic-row">
            <div><p>Indexed topics</p><div>{topics.map((topic) => <span key={topic}>{topic}</span>)}</div></div>
            <a href="#publication-records" className="publication-record-link">Explore the index <ArrowDown size={15} /></a>
          </div>
        </Reveal>

        <Reveal delay={.08} className="publication-feature-wrap">
          <div className="publication-feature-shadow" aria-hidden="true" />
          <article className="publication-feature-card">
            <header><span><Sparkles size={13} /> Featured record</span><div><i /> Curated selection <b>{String(featuredNumber).padStart(2, "0")} / {String(publications.length).padStart(2, "0")}</b></div></header>
            {featured ? <Link href={`/publications/${featured.slug}`} className="publication-feature-link">
              <div className="publication-feature-main">
                <div className="publication-feature-copy">
                  <p>{featured.type}<span>Â·</span>{featured.status}<span>Â·</span>{featured.year}</p>
                  <h2>{featured.title}</h2>
                  <div className="publication-feature-rule"><i /></div>
                  <p className="publication-feature-summary">{featured.summary || featured.contribution || featured.abstract || "A complete research record connecting the problem, method, contribution, evidence, and next direction."}</p>
                  <div className="publication-feature-topics">{(featured.keywords.length ? featured.keywords : topics).slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}</div>
                </div>
                <div className="publication-feature-visual"><div className="publication-visual-label"><span>Model trace</span><code>LIVE / 01</code></div><ResearchOrnament compact variant={featuredVariant} /></div>
              </div>
              <div className="publication-feature-footer"><div><span>Published in</span><strong>{featured.venue || "Research publication"}</strong></div><div><span>Complete record</span><strong>Problem Â· Method Â· Evidence</strong></div><b>Open paper <ArrowUpRight size={15} /></b></div>
            </Link> : <div className="publication-feature-empty"><h2>The publication record is ready.</h2><p>Publish a paper from the admin workspace to feature it here automatically.</p></div>}
            <div className="publication-metric-grid">{metrics.map(({ label, value, Icon }) => <div key={label}><Icon size={14} /><strong>{value}</strong><span>{label}</span></div>)}</div>
          </article>
        </Reveal>
      </div>
    </div>
  </section>;
}

