"use client";

import { BrainCircuit, ChartNoAxesCombined, ChevronRight, Eye, Layers3, Route, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

export type SkillCategoryView = {
  key: string;
  title: string;
  description: string;
  visualStyle: string;
};

export type SkillView = {
  id: string;
  name: string;
  category: string;
  level: string;
  evidence: string;
};

const visualIcons: Record<string, LucideIcon> = {
  "vision-grid": Eye,
  "data-plot": ChartNoAxesCombined,
  "neural-network": BrainCircuit,
  "logic-path": Route,
  "tool-stack": Layers3,
};

function CategoryVisual({ style }: { style: string }) {
  if (style === "vision-grid") return <svg viewBox="0 0 320 210" role="presentation">
    <path className="skill-visual-grid" d="M40 32H280M40 72H280M40 112H280M40 152H280M80 20V188M130 20V188M180 20V188M230 20V188" />
    <rect className="skill-visual-box" x="87" y="50" width="126" height="104" rx="5" />
    <path className="skill-visual-accent" d="M87 78V50h28M185 50h28v28M87 126v28h28M185 154h28v-28" />
    <circle className="skill-visual-node" cx="150" cy="101" r="20" /><path className="skill-visual-line" d="M150 72v58M121 101h58" />
  </svg>;

  if (style === "data-plot") return <svg viewBox="0 0 320 210" role="presentation">
    <path className="skill-visual-grid" d="M45 40H282M45 82H282M45 124H282M45 166H282" />
    <path className="skill-visual-bars" d="M64 160v-32h24v32M104 160V94h24v66M144 160v-48h24v48M184 160V68h24v92M224 160v-77h24v77" />
    <path className="skill-visual-accent" d="m64 119 52-34 40 13 40-47 52 18" />
    <circle className="skill-visual-node" cx="196" cy="51" r="5" />
  </svg>;

  if (style === "neural-network") return <svg viewBox="0 0 320 210" role="presentation">
    <g className="skill-visual-line"><path d="M65 58 151 42 248 70M65 58l86 54 97-42M65 105l86-63 97 91M65 105l86 7 97-42M65 152l86-40 97 21M65 152l86 18 97-37" /></g>
    <g className="skill-visual-nodes"><circle cx="65" cy="58" r="8" /><circle cx="65" cy="105" r="8" /><circle cx="65" cy="152" r="8" /><circle cx="151" cy="42" r="9" /><circle cx="151" cy="112" r="9" /><circle cx="151" cy="170" r="9" /><circle cx="248" cy="70" r="10" /><circle cx="248" cy="133" r="10" /></g>
    <path className="skill-visual-accent" d="M65 105 151 112 248 70" />
  </svg>;

  if (style === "logic-path") return <svg viewBox="0 0 320 210" role="presentation">
    <path className="skill-visual-grid" d="M48 44H272V166H48zM104 44v38H48M160 44v76h54V82h58M104 166v-46H78M214 166v-26h58" />
    <path className="skill-visual-accent" d="M48 101h56v19h56V82h54v58h58" />
    <g className="skill-visual-nodes"><circle cx="48" cy="101" r="7" /><circle cx="104" cy="120" r="7" /><circle cx="160" cy="82" r="7" /><circle cx="214" cy="140" r="7" /><circle cx="272" cy="140" r="9" /></g>
  </svg>;

  return <svg viewBox="0 0 320 210" role="presentation">
    <path className="skill-visual-box" d="m68 71 92-42 92 42-92 42zM68 105l92 42 92-42M68 139l92 42 92-42" />
    <path className="skill-visual-accent" d="m68 71 92 42 92-42" />
    <circle className="skill-visual-node" cx="160" cy="113" r="7" />
  </svg>;
}

export function SkillExplorer({ categories, skills }: { categories: SkillCategoryView[]; skills: SkillView[] }) {
  const [activeKey, setActiveKey] = useState(categories[0]?.key ?? "");
  const [activeSkill, setActiveSkill] = useState(0);
  const activeCategory = categories.find((category) => category.key === activeKey) ?? categories[0];
  const categorySkills = useMemo(() => skills.filter((skill) => skill.category === activeCategory?.key), [activeCategory?.key, skills]);
  const selectedSkill = categorySkills[activeSkill] ?? categorySkills[0];

  function selectCategory(key: string) {
    setActiveKey(key);
    setActiveSkill(0);
  }

  if (!activeCategory) return null;

  return <section className="skill-explorer" aria-label="Capability areas">
    <div className="skill-category-tabs" aria-label="Skill categories">
      {categories.map((category) => {
        const Icon = visualIcons[category.visualStyle] ?? Layers3;
        const active = category.key === activeCategory.key;
        const count = skills.filter((skill) => skill.category === category.key).length;
        return <button key={category.key} type="button" id={`skill-tab-${category.key}`} aria-controls={`skill-panel-${category.key}`} aria-pressed={active} className={active ? "is-active" : ""} onClick={() => selectCategory(category.key)}>
          <span><Icon size={15} /></span>
          <strong>{category.title}</strong>
          <small>{String(count).padStart(2, "0")}</small>
        </button>;
      })}
    </div>

    <article className="skill-focus-panel" id={`skill-panel-${activeCategory.key}`} role="region" aria-labelledby={`skill-tab-${activeCategory.key}`}>
      <div className="skill-focus-copy">
        <span className="skill-focus-index">Area {String(categories.indexOf(activeCategory) + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}</span>
        <h2>{activeCategory.title}</h2>
        <p>{activeCategory.description}</p>

        {categorySkills.length ? <>
          <div className="skill-pills" aria-label={`${activeCategory.title} skills`}>
            {categorySkills.map((skill, index) => <button key={skill.id} type="button" aria-pressed={selectedSkill?.id === skill.id} className={selectedSkill?.id === skill.id ? "is-active" : ""} onClick={() => setActiveSkill(index)}>{skill.name}</button>)}
          </div>
          {selectedSkill && <div key={selectedSkill.id} className="skill-evidence">
            <div><span>Selected capability</span><strong>{selectedSkill.name}</strong></div>
            <span className="skill-level">{selectedSkill.level || "Practised"}</span>
            {selectedSkill.evidence && <p>{selectedSkill.evidence}</p>}
          </div>}
        </> : <p className="skill-empty">This area is ready for its first published capability.</p>}
      </div>

      <div className={`skill-context-visual skill-context-${activeCategory.visualStyle}`} aria-hidden="true">
        <div className="skill-visual-topline"><span>{activeCategory.key.replaceAll("-", " / ")}</span><i /></div>
        <CategoryVisual style={activeCategory.visualStyle} />
        <div className="skill-visual-footer"><span>Context map</span><ChevronRight size={12} /></div>
      </div>
    </article>
  </section>;
}
