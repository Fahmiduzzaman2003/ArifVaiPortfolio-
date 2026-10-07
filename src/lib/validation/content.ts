import { z } from "zod";
import { isContentSlug } from "@/lib/utils";

type ContentRecord = Record<string, unknown>;

const forbiddenKeys = new Set(["__proto__", "prototype", "constructor"]);

function hasUnsafeKey(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasUnsafeKey);
  return Object.entries(value).some(
    ([key, child]) => key.startsWith("$") || key.includes(".") || forbiddenKeys.has(key) || hasUnsafeKey(child),
  );
}

export const contentInputSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => !hasUnsafeKey(value), "Invalid field name");

export const reorderInputSchema = z.object({
  action: z.literal("reorder"),
  ids: z.array(z.string().min(1)).max(100).refine((ids) => new Set(ids).size === ids.length, "Duplicate record IDs are not allowed"),
});

export const duplicateInputSchema = z.object({ action: z.literal("duplicate"), id: z.string().min(1) });

const requiredFields: Record<string, string[]> = {
  publications: ["title", "slug"],
  "research-interests": ["title", "slug"],
  projects: ["title", "slug"],
  experience: ["role"],
  education: ["degree"],
  achievements: ["title"],
  activities: ["activity"],
  skills: ["name", "category"],
  "skill-categories": ["key", "title"],
  sections: ["key", "heading"],
  media: ["url", "publicId"],
};

const urlPaths: Record<string, string[]> = {
  profile: ["portrait.url", "social.scholar", "social.orcid", "social.researchGate", "social.github", "social.linkedIn", "social.facebook", "social.whatsApp"],
  publications: ["links.pdf", "links.publisher", "links.code", "links.dataset", "links.project"],
  projects: ["links.github", "links.demo", "links.paper", "links.doi", "links.dataset", "links.documentation"],
  experience: ["organizationUrl"],
  achievements: ["verificationUrl"],
  media: ["url"],
};

function trimStrings(value: unknown): unknown {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(trimStrings);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, trimStrings(child)]));
  }
  return value;
}

function readPath(data: ContentRecord, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (value, key) => value && typeof value === "object" ? (value as ContentRecord)[key] : undefined,
    data,
  );
}

function writePath(data: ContentRecord, path: string, value: unknown) {
  const keys = path.split(".");
  let cursor = data;
  for (const key of keys.slice(0, -1)) {
    const child = cursor[key];
    cursor[key] = child && typeof child === "object" && !Array.isArray(child) ? child : {};
    cursor = cursor[key] as ContentRecord;
  }
  cursor[keys.at(-1)!] = value;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function asHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function removeEmpty(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(removeEmpty).filter((item) => item !== undefined);
  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, child]) => [key, removeEmpty(child)] as const)
      .filter(([, child]) => child !== undefined && (!(child && typeof child === "object") || Object.keys(child).length > 0));
    return entries.length ? Object.fromEntries(entries) : undefined;
  }
  return value;
}

export function normalizeContentInput(module: string, raw: unknown, options: { creating?: boolean } = {}) {
  const parsed = contentInputSchema.parse(raw);
  const data = trimStrings(parsed) as ContentRecord;

  if ("action" in data || "id" in data || "_id" in data || "deletedAt" in data) {
    throw new z.ZodError([{ code: "custom", path: [], message: "Reserved fields cannot be changed" }]);
  }

  if (typeof data.slug === "string") {
    const legacyUrl = asHttpUrl(data.slug);
    if (legacyUrl) {
      if (module === "publications" && !readPath(data, "links.pdf")) writePath(data, "links.pdf", legacyUrl);
      data.slug = slugify(String(data.title ?? ""));
    } else {
      data.slug = slugify(data.slug || String(data.title ?? ""));
    }
  } else if (options.creating && ["publications", "research-interests", "projects"].includes(module)) {
    data.slug = slugify(String(data.title ?? ""));
  }

  if (module === "skill-categories") {
    data.key = slugify(String(data.key || data.title || ""));
  }

  if (typeof data.doi === "string") {
    data.doi = data.doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").trim();
  }

  if (data.publishState !== undefined && !["draft", "published", "archived"].includes(String(data.publishState))) {
    throw new z.ZodError([{ code: "custom", path: ["publishState"], message: "Choose a valid publishing state" }]);
  }
  for (const field of ["visibility", "featured"]) {
    if (data[field] !== undefined && typeof data[field] !== "boolean") {
      throw new z.ZodError([{ code: "custom", path: [field], message: "Must be true or false" }]);
    }
  }
  if (data.slug !== undefined && !isContentSlug(data.slug)) {
    throw new z.ZodError([{ code: "custom", path: ["slug"], message: "Use lowercase letters, numbers, and hyphens" }]);
  }
  if (typeof data.publicationYear === "number" && (data.publicationYear < 1900 || data.publicationYear > 2100)) {
    throw new z.ZodError([{ code: "custom", path: ["publicationYear"], message: "Enter a year between 1900 and 2100" }]);
  }
  for (const path of urlPaths[module] ?? []) {
    const value = readPath(data, path);
    if (typeof value === "string" && value && !asHttpUrl(value)) {
      throw new z.ZodError([{ code: "custom", path: path.split("."), message: "Enter a complete http:// or https:// URL" }]);
    }
  }

  if (options.creating) {
    const cleaned = (removeEmpty(data) ?? {}) as ContentRecord;
    for (const field of requiredFields[module] ?? []) {
      if (!readPath(cleaned, field)) {
        throw new z.ZodError([{ code: "custom", path: field.split("."), message: "This field is required" }]);
      }
    }
    return cleaned;
  }

  return data;
}

export function contentUpdate(input: ContentRecord) {
  const set: ContentRecord = {};
  const unset: ContentRecord = {};

  function visit(value: unknown, path: string) {
    if (value === "" || value === null || value === undefined) {
      if (path) unset[path] = 1;
      return;
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const entries = Object.entries(value);
      if (!entries.length && path) unset[path] = 1;
      else for (const [key, child] of entries) visit(child, path ? `${path}.${key}` : key);
      return;
    }
    if (path) set[path] = value;
  }

  visit(input, "");
  return { ...(Object.keys(set).length ? { $set: set } : {}), ...(Object.keys(unset).length ? { $unset: unset } : {}) };
}
