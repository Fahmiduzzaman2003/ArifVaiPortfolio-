import mongoose from "mongoose";
import { ProjectModel, PublicationModel, ResearchInterestModel } from "../src/models";

const apply = process.argv.includes("--apply");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

function httpUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.toString() : undefined; } catch { return undefined; }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI before repairing content.");
  await mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5000 });
  let candidates = 0;
  let repaired = 0;

  for (const [module, Model] of [["publications", PublicationModel], ["projects", ProjectModel], ["research-interests", ResearchInterestModel]] as const) {
    const documents = await Model.find({ deletedAt: null }).select("title slug doi links").lean();
    for (const document of documents) {
      const set: Record<string, unknown> = {};
      const unset: Record<string, 1> = {};
      if (typeof document.slug === "string" && !slugPattern.test(document.slug)) {
        const slug = slugify(String(document.title ?? ""));
        if (!slug) throw new Error(`Cannot generate a slug for ${module} record ${document._id}`);
        const collision = await Model.exists({ _id: { $ne: document._id }, slug });
        if (collision) throw new Error(`Cannot repair ${module} record ${document._id}: slug "${slug}" already exists.`);
        set.slug = slug;
        const legacyUrl = httpUrl(document.slug);
        if (module === "publications" && legacyUrl && !(document.links as { pdf?: string } | undefined)?.pdf) set["links.pdf"] = legacyUrl;
      }
      if (module === "publications" && document.doi === "") unset.doi = 1;
      if (!Object.keys(set).length && !Object.keys(unset).length) continue;
      candidates += 1;
      if (apply) {
        await Model.updateOne({ _id: document._id }, { ...(Object.keys(set).length ? { $set: set } : {}), ...(Object.keys(unset).length ? { $unset: unset } : {}) });
        repaired += 1;
      }
    }
  }
  console.info(apply ? `Repaired ${repaired} of ${candidates} legacy records.` : `Found ${candidates} legacy records. Run with --apply to repair them.`);
}

main()
  .catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
