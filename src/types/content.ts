export type PublishState = "draft" | "published" | "archived";
export type ResearchStatus = "current" | "future" | "established";
export type PublicationVisualStyle = "cnn-pipeline" | "attention-fusion" | "vision-detection";

export interface LinkSet {
  doi?: string;
  publisher?: string;
  pdf?: string;
  code?: string;
  dataset?: string;
  project?: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  authors: string[];
  authorPosition: string;
  correspondingAuthor: boolean;
  visualStyle: PublicationVisualStyle;
  type: string;
  status: string;
  venue: string;
  publisher?: string;
  year: number;
  abstract: string;
  summary: string;
  problem: string;
  gap: string;
  methodology: string;
  contribution: string;
  individualContribution: string;
  dataset: string[];
  models: string[];
  metrics: Array<{ label: string; value: string }>;
  results: string;
  limitations: string;
  futureWork: string;
  keywords: string[];
  researchAreas: string[];
  links: LinkSet;
  citationText: string;
  bibtex: string;
  citationCount?: number;
  featured: boolean;
  visibility: boolean;
  publishState: PublishState;
  displayOrder: number;
}

export interface ResearchInterest {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  detail: string;
  category: "vision" | "domain" | "method" | "goal";
  status: ResearchStatus;
  keywords: string[];
  direction: string;
  featured: boolean;
  visibility: boolean;
  publishState: PublishState;
  displayOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  problem: string;
  methodology: string;
  contribution: string;
  role: string;
  dataset: string[];
  models: string[];
  technologies: string[];
  metrics: Array<{ label: string; value: string }>;
  results: string;
  status: string;
  featured: boolean;
  links?: { github?: string; demo?: string; paper?: string; doi?: string; dataset?: string; documentation?: string };
}

