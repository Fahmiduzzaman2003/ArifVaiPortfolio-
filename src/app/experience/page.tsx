import type { Metadata } from "next";
import { PageIntro } from "@/components/common/page-intro";
import { getExperiences } from "@/services/public-content";
import { ExperienceTrace } from "@/components/home/experience-trace";
export const metadata: Metadata = { title: "Experience" };
export default async function ExperiencePage() { const entries = await getExperiences(); return <main className="lab-section"><PageIntro eyebrow="Experience" title="A professional record built around contribution." description="Explore academic, laboratory, internship, and industry roles with their dates, responsibilities, tools, and concrete research or technical contributions. Every entry is maintained from the admin workspace." ornament="fusion" /><ExperienceTrace entries={entries} /></main>; }

