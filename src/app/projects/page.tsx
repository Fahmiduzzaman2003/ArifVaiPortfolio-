import type { Metadata } from "next";
import { PageIntro } from "@/components/common/page-intro";
import { ProjectLab } from "@/components/home/project-lab";
import { getProjects } from "@/services/public-content";

export const metadata: Metadata = { title: "Projects" };
export default async function ProjectsPage() { const projects = await getProjects(); return <main className="lab-section"><PageIntro eyebrow="Research & technical projects" title="Case studies, not thumbnail galleries." description="Each project records the motivating problem, research gap, method choices, personal role, evaluation evidence, limitations, and next improvements." ornament="vision" /><ProjectLab projects={projects} /></main>; }

