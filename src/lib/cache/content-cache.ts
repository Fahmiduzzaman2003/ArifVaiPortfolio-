import { revalidatePath, revalidateTag } from "next/cache";

export const cacheTags = { publications: "publications", projects: "projects", research: "research-interests", profile: "profile", settings: "site-settings", experience: "experience", education: "education", achievements: "achievements", activities: "activities", skills: "skills", skillCategories: "skill-categories" } as const;

const pathsByModule: Record<string, string[]> = {
  publications: ["/", "/publications"], projects: ["/", "/projects"], "research-interests": ["/", "/research"], experience: ["/", "/experience"], education: ["/", "/education"], achievements: ["/", "/achievements"], activities: ["/activities"], skills: ["/skills"], "skill-categories": ["/skills"], sections: ["/"], profile: ["/", "/about", "/contact"], settings: ["/", "/cv"],
};

export function invalidateContent(module: string, slug?: string) {
  revalidateTag(module, "max");
  for (const path of pathsByModule[module] ?? ["/"]) revalidatePath(path);
  if (slug && module === "publications") revalidatePath(`/publications/${slug}`);
  if (slug && module === "projects") revalidatePath(`/projects/${slug}`);
}
