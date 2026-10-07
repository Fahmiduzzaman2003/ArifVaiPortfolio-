"use client";

import Image from "next/image";
import { Activity as ActivityIcon, BookOpen, BookOpenCheck, Braces, Camera, Check, Coffee, Compass, Cpu, FileCode2, GraduationCap, Headphones, ImageIcon, Sparkles, Target, Telescope, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { safeExternalHref } from "@/lib/utils";

type ProfileShowcaseProps = {
  name: string;
  identityHighlights?: string;
  leisureInterests?: string;
  portrait?: { url?: string; alt?: string };
  focusLabels?: string[];
};

const defaultHighlights = [
  ["Curious mind", "Finds energy in difficult questions and unfamiliar ideas."],
  ["Persistent builder", "Turns complexity into steady, thoughtful progress."],
  ["Teacher at heart", "Enjoys making technical ideas clear and useful to others."],
  ["PhD-bound", "Motivated by deep inquiry, mentorship, and long-term impact."],
] as const;

const defaultLeisure = ["Reading", "Photography", "Exploring new places", "Creative technology"];
const highlightIcons = [Telescope, Target, BookOpenCheck, GraduationCap] as const;
const leisureIconRules: Array<[RegExp, LucideIcon]> = [
  [/read|book|write/i, BookOpen],
  [/photo|camera|visual/i, Camera],
  [/travel|explor|place|hiking/i, Compass],
  [/tech|code|creative|design/i, Cpu],
  [/music|audio|song/i, Headphones],
  [/sport|fitness|game|run/i, ActivityIcon],
];

function leisureIcon(value: string) {
  return leisureIconRules.find(([pattern]) => pattern.test(value))?.[1] ?? Sparkles;
}

function portraitUrl(value?: string) {
  const safe = safeExternalHref(value);
  if (!safe) return undefined;
  try { return new URL(safe).hostname === "res.cloudinary.com" ? safe : undefined; } catch { return undefined; }
}

function parseHighlights(value?: string) {
  const custom = (value || "").split(/\r?\n/).map((line) => {
    const [title, ...description] = line.split("|");
    return { title: title?.trim(), description: description.join("|").trim() };
  }).filter((item) => item.title && !item.title.startsWith("YOUR_"));
  const legacyTitles = ["researcher", "dedicated practitioner", "educator", "phd aspirant"];
  const isLegacySet = custom.length === legacyTitles.length && custom.every((item, index) => item.title?.toLowerCase() === legacyTitles[index]);
  return (custom.length && !isLegacySet ? custom : defaultHighlights.map(([title, description]) => ({ title, description }))).slice(0, 4);
}

function parseLeisure(value?: string) {
  const custom = (value || "").split(/[\n,]/).map((item) => item.trim()).filter((item) => item && !item.startsWith("YOUR_"));
  return (custom.length ? custom : defaultLeisure).slice(0, 6);
}

export function ProfileShowcase({ name, identityHighlights, leisureInterests, portrait: portraitData, focusLabels = [] }: ProfileShowcaseProps) {
  const reduced = useReducedMotion();
  const [side, setSide] = useState<"portrait" | "profile">("portrait");
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const portrait = portraitUrl(portraitData?.url);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
  const highlights = useMemo(() => parseHighlights(identityHighlights), [identityHighlights]);
  const leisure = useMemo(() => parseLeisure(leisureInterests), [leisureInterests]);

  useEffect(() => {
    if (reduced || !autoRotate) return;
    let cycle: number | undefined;
    const firstFlip = window.setTimeout(() => {
      setSide("profile");
      cycle = window.setInterval(() => setSide((current) => current === "portrait" ? "profile" : "portrait"), 7000);
    }, 4200);
    return () => { window.clearTimeout(firstFlip); if (cycle) window.clearInterval(cycle); };
  }, [autoRotate, reduced]);

  function selectSide(next: "portrait" | "profile") {
    setAutoRotate(false);
    setSide(next);
  }

  function selectHighlight(index: number) {
    setAutoRotate(false);
    setActiveHighlight(index);
  }

  return <div className="profile-visual relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
    <div className="profile-frame-mark" aria-hidden="true" />
    <div className="profile-flip-stage">
      <div className={`profile-flip-card ${side === "profile" ? "is-flipped" : ""}`}>
        <figure className="profile-flip-face profile-flip-front profile-portrait" aria-hidden={side === "profile"}>
          <div className="relative size-full overflow-hidden rounded-[1.55rem] bg-[radial-gradient(circle_at_45%_25%,rgba(72,224,208,.12),transparent_34%),linear-gradient(145deg,#111a24,#070a0f)]">
            {portrait ? <Image src={portrait} alt={portraitData?.alt || `Portrait of ${name}`} fill preload sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 500px" className="profile-portrait-image object-cover" /> : <div className="grid size-full place-items-center"><div className="grid size-36 place-items-center rounded-full border border-[var(--lab-cyan)]/35 bg-[var(--lab-cyan)]/[.06] font-serif text-6xl text-[var(--lab-cyan)]">{initials || "RF"}</div></div>}
            <div className="profile-portrait-reticle" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="profile-portrait-index" aria-hidden="true"><span>CV / PROFILE</span><b>01</b></div>
            <figcaption className="profile-portrait-caption">
              <span><i /> Research profile</span>
              <strong>{name}</strong>
              {focusLabels.length > 0 && <p>{focusLabels.slice(0, 2).join(" / ")}</p>}
            </figcaption>
          </div>
        </figure>

        <section className="profile-flip-face profile-flip-back" aria-label={`self.py — about ${name}`} aria-hidden={side === "portrait"} inert={side === "portrait"}>
          <div className="selfpy-windowbar"><span className="selfpy-window-dots" aria-hidden="true"><i /><i /><i /></span><code><FileCode2 size={11} /> ~/identity/self.py</code><span className="selfpy-running"><i /> running</span></div>

          <header className="profile-personal-heading">
            <div>
              <span><Braces size={12} /> Beyond the résumé</span>
              <h2>self<span>.py</span></h2>
              <p>Curious, grounded, and always becoming.</p>
            </div>
            <div className="selfpy-signal" aria-hidden="true"><span /><span /><span /><span /><i /></div>
          </header>

          <div className="selfpy-section-heading"><span>Core traits</span><small>Choose one to explore</small></div>
          <div className="profile-identity-grid">
            {highlights.map((item, index) => {
              const Icon = highlightIcons[index] ?? UserRound;
              const active = activeHighlight === index;
              return <button key={`${item.title}-${index}`} type="button" className={`profile-identity-card ${active ? "is-active" : ""}`} aria-pressed={active} onClick={() => selectHighlight(index)}>
                <span className="selfpy-trait-icon"><Icon size={15} /></span>
                <span><code>{String(index + 1).padStart(2, "0")}</code><strong>{item.title}</strong></span>
                <Check className="selfpy-trait-check" size={13} aria-hidden="true" />
              </button>;
            })}
          </div>

          <div key={activeHighlight} className="selfpy-trait-detail" aria-live="polite">
            <div><span>Trait {String(activeHighlight + 1).padStart(2, "0")}</span><strong>{highlights[activeHighlight]?.title}</strong></div>
            <p>{highlights[activeHighlight]?.description}</p>
            <code><Cpu size={11} /><span>north_star</span> = “useful work, built with care”</code>
          </div>

          <footer className="profile-leisure">
            <div className="profile-leisure-heading"><Coffee size={14} /><div><span>Off-screen energy</span><p>The things that keep me curious.</p></div><code>{String(leisure.length).padStart(2, "0")}</code></div>
            <div className="profile-leisure-tags">{leisure.map((item) => { const Icon = leisureIcon(item); return <span key={item}><Icon size={11} />{item}</span>; })}</div>
          </footer>
        </section>
      </div>
    </div>

    <div className="profile-showcase-controls" aria-label="Profile showcase view">
      <button type="button" onClick={() => selectSide("portrait")} className={side === "portrait" ? "is-active" : ""} aria-pressed={side === "portrait"}><ImageIcon size={13} /> Portrait</button>
      <button type="button" onClick={() => selectSide("profile")} className={side === "profile" ? "is-active" : ""} aria-pressed={side === "profile"}><FileCode2 size={13} /> self.py</button>
    </div>
  </div>;
}
