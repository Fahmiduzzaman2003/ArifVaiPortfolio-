import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublications } from "@/services/public-content";
import { PublicationStory } from "@/components/publications/publication-story";

export async function generateStaticParams() { const publications = await getPublications(); return publications.map((paper) => ({ slug: paper.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const publications = await getPublications(); return { title: publications.find((p) => p.slug === slug)?.title ?? "Publication" }; }

export default async function PublicationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const publications = await getPublications();
  const paper = publications.find((p) => p.slug === slug);
  if (!paper) notFound();
  return <main><PublicationStory paper={paper} /></main>;
}

