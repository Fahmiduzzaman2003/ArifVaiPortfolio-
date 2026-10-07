import mongoose from "mongoose";
import { contentModels } from "../src/models";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI before auditing content.");
  await mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5000 });
  const summary: Record<string, { records: number; invalidSlugs: number; emptyDois: number }> = {};
  for (const [name, Model] of Object.entries(contentModels)) {
    const documents = await Model.find({ deletedAt: null }).select("slug doi").lean();
    summary[name] = {
      records: documents.length,
      invalidSlugs: documents.filter((document: Record<string, unknown>) => typeof document.slug === "string" && !slugPattern.test(document.slug)).length,
      emptyDois: documents.filter((document: Record<string, unknown>) => document.doi === "").length,
    };
  }
  console.table(summary);
}

main()
  .catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
