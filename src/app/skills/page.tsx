import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { SkillExplorer, type SkillCategoryView, type SkillView } from "@/components/skills/skill-explorer";
import { defaultSkillCategories } from "@/config/skill-categories";
import { getSkillCategories, getSkills } from "@/services/public-content";

export const metadata: Metadata = { title: "Research capabilities" };

function keyOf(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function legacyCategory(value: unknown) {
  const category = keyOf(value);
  if (/vision|image|agricultural|explainable|xai/.test(category)) return "computer-vision";
  if (/data|database|analysis|statistic|sql/.test(category)) return "data-analysis";
  if (/machine|deep-learning|bioml|nlp|rag|model/.test(category)) return "machine-learning";
  return "problem-solving";
}

export default async function SkillsPage() {
  const [storedSkills, storedCategories] = await Promise.all([getSkills(), getSkillCategories()]);
  const configured = (storedCategories as Array<Record<string, unknown>>).map((item) => ({
    key: keyOf(item.key || item.title),
    title: String(item.title || "Capability area"),
    description: String(item.description || ""),
    visualStyle: String(item.visualStyle || "tool-stack"),
  })).filter((item) => item.key);
  const categories: SkillCategoryView[] = configured.length ? configured : defaultSkillCategories;
  const categoryKeys = new Set(categories.map((category) => category.key));
  const skills: SkillView[] = (storedSkills as Array<Record<string, unknown>>).map((item, index) => {
    const storedCategory = keyOf(item.category);
    const category = categoryKeys.has(storedCategory) ? storedCategory : legacyCategory(item.category);
    return {
      id: String(item._id || `skill-${index}`),
      name: String(item.name || "Untitled capability"),
      category: categoryKeys.has(category) ? category : categories[0]?.key,
      level: String(item.level || ""),
      evidence: String(item.evidence || ""),
    };
  });

  return <main className="skills-page">
    <section className="skills-compact-hero">
      <div>
        <p className="lab-kicker">Research capability</p>
        <h1>Focused skills,<br /><span>grouped by practice.</span></h1>
      </div>
      <div className="skills-hero-note">
        <SlidersHorizontal size={17} />
        <p>Explore one area at a time. Every skill is qualified by practical useâ€”not arbitrary percentages.</p>
        <Link href="/projects">See the work <ArrowUpRight size={13} /></Link>
      </div>
    </section>

    <div className="skills-explorer-wrap">
      <SkillExplorer categories={categories} skills={skills} />
    </div>
  </main>;
}

