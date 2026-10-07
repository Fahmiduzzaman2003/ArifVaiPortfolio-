import { notFound } from "next/navigation";
import { getProjects } from "@/services/public-content";
import { ProjectStory } from "@/components/projects/project-story";

export async function generateStaticParams() { const projects = await getProjects(); return projects.map((p) => ({ slug: p.slug })); }
export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const projects = await getProjects(); const project = projects.find((p) => p.slug === slug); if (!project) notFound(); return <main><ProjectStory project={project} /></main>; }

