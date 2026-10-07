import type { Metadata } from "next";
import { PublicationBrowser } from "@/components/publications/publication-browser";
import { PublicationIndexHero } from "@/components/publications/publication-index-hero";
import { getPublications } from "@/services/public-content";

export const metadata: Metadata = { title: "Publications" };
export default async function PublicationsPage() {
  const publications = await getPublications();
  return <main className="lab-section"><PublicationIndexHero publications={publications} /><PublicationBrowser publications={publications} /></main>;
}
