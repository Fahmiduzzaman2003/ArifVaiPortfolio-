import "server-only";
import { unstable_cache } from "next/cache";
import { connectDatabase } from "@/lib/database/connect";
import { profile as fallbackProfile, projects as fallbackProjects, publications as fallbackPublications, researchInterests as fallbackResearch } from "@/lib/placeholder-data";
import { Achievement, Activity, Education, Profile, ProjectModel, PublicationModel, ResearchInterestModel, SiteSettings, Skill, SkillCategory, WorkExperience } from "@/models";
import type { Project, Publication, PublicationVisualStyle, ResearchInterest } from "@/types/content";
import { isContentSlug } from "@/lib/utils";

const isConfigured = () => Boolean(process.env.MONGODB_URI);
const published = { publishState: "published", visibility: true, deletedAt: null };

export const getPublicProfile = unstable_cache(async () => {
  if (!isConfigured()) return fallbackProfile;
  await connectDatabase();
  const value = await Profile.findOne().lean();
  return value ? { ...fallbackProfile, ...JSON.parse(JSON.stringify(value)) } : fallbackProfile;
}, ["public-profile"], { tags: ["profile"], revalidate: 3600 });

export const getPublications = unstable_cache(async (): Promise<Publication[]> => {
  if (!isConfigured()) return fallbackPublications;
  await connectDatabase();
  const docs = await PublicationModel.find(published).sort({ featured: -1, displayOrder: 1, publicationYear: -1 }).lean();
  return docs.filter((raw) => isContentSlug(raw.slug)).map((raw) => { const p = JSON.parse(JSON.stringify(raw)); return { id: String(p._id), title: p.title, slug: p.slug, authors: p.authors ?? [], authorPosition: p.researcherAuthorPosition ?? "", correspondingAuthor: Boolean(p.correspondingAuthor), visualStyle: (["cnn-pipeline", "attention-fusion", "vision-detection"].includes(p.visualStyle) ? p.visualStyle : "cnn-pipeline") as PublicationVisualStyle, type: p.publicationType ?? "Research output", status: p.publicationStatus ?? "Published", venue: p.venue ?? "", publisher: p.publisher, year: p.publicationYear ?? new Date().getFullYear(), abstract: p.abstract ?? "", summary: p.summary ?? "", problem: p.researchProblem ?? "", gap: p.researchGap ?? "", methodology: p.methodology ?? "", contribution: p.mainContribution ?? "", individualContribution: p.individualContribution ?? "", dataset: p.dataset ?? [], models: p.models ?? [], metrics: p.evaluationMetrics ?? [], results: p.results ?? "", limitations: p.limitations ?? "", futureWork: p.futureWork ?? "", keywords: p.keywords ?? [], researchAreas: p.researchAreas ?? [], links: { ...(p.links ?? {}), doi: p.doi ?? p.links?.doi }, citationText: p.citationText ?? "", bibtex: p.bibtex ?? "", citationCount: p.citationCount, featured: Boolean(p.featured), visibility: true, publishState: "published", displayOrder: p.displayOrder ?? 0 }; });
}, ["public-publications"], { tags: ["publications"], revalidate: 1800 });

export const getResearchInterests = unstable_cache(async (): Promise<ResearchInterest[]> => {
  if (!isConfigured()) return fallbackResearch;
  await connectDatabase(); const docs = await ResearchInterestModel.find(published).sort({ displayOrder: 1 }).lean();
  return docs.filter((raw) => isContentSlug(raw.slug)).map((raw) => { const p = JSON.parse(JSON.stringify(raw)); return { id: String(p._id), title: p.title, slug: p.slug, shortDescription: p.shortDescription ?? "", detail: p.detail ?? "", category: p.category ?? "domain", status: p.researchStatus ?? "current", keywords: p.keywords ?? [], direction: p.direction ?? "", featured: Boolean(p.featured), visibility: true, publishState: "published", displayOrder: p.displayOrder ?? 0 }; });
}, ["public-research"], { tags: ["research-interests"], revalidate: 1800 });

export const getProjects = unstable_cache(async (): Promise<Project[]> => {
  if (!isConfigured()) return fallbackProjects;
  await connectDatabase(); const docs = await ProjectModel.find(published).sort({ featured: -1, displayOrder: 1 }).lean();
  return docs.filter((raw) => isContentSlug(raw.slug)).map((raw) => { const p = JSON.parse(JSON.stringify(raw)); return { id: String(p._id), title: p.title, slug: p.slug, category: p.category ?? "Research", summary: p.summary ?? "", description: p.description ?? "", problem: p.problem ?? "", methodology: p.methodology ?? "", contribution: p.contribution ?? "", role: p.researcherRole ?? "", dataset: p.dataset ?? [], models: p.models ?? [], technologies: p.technologies ?? [], metrics: p.evaluationMetrics ?? [], results: p.results ?? "", status: p.status ?? "", featured: Boolean(p.featured), links: p.links ?? {} }; });
}, ["public-projects"], { tags: ["projects"], revalidate: 1800 });

async function records(Model: typeof WorkExperience) { if (!isConfigured()) return []; await connectDatabase(); return JSON.parse(JSON.stringify(await Model.find(published).sort({ displayOrder: 1, startDate: -1, date: -1 }).lean())); }
export const getExperiences = unstable_cache(() => records(WorkExperience), ["public-experience"], { tags: ["experience"], revalidate: 1800 });
export const getEducation = unstable_cache(() => records(Education), ["public-education"], { tags: ["education"], revalidate: 1800 });
export const getAchievements = unstable_cache(() => records(Achievement), ["public-achievements"], { tags: ["achievements"], revalidate: 1800 });
export const getActivities = unstable_cache(() => records(Activity), ["public-activities"], { tags: ["activities"], revalidate: 1800 });
export const getSkills = unstable_cache(() => records(Skill), ["public-skills"], { tags: ["skills"], revalidate: 1800 });
export const getSkillCategories = unstable_cache(() => records(SkillCategory), ["public-skill-categories"], { tags: ["skill-categories"], revalidate: 1800 });
export const getSiteSettings = unstable_cache(async () => { if (!isConfigured()) return null; await connectDatabase(); return JSON.parse(JSON.stringify(await SiteSettings.findOne({ key: "primary" }).lean())); }, ["public-settings"], { tags: ["settings"], revalidate: 3600 });

