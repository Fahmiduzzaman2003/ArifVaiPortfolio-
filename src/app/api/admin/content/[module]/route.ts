import mongoose from "mongoose";
import { getSession } from "@/lib/auth/session";
import { invalidateContent } from "@/lib/cache/content-cache";
import { connectDatabase } from "@/lib/database/connect";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { contentModels } from "@/models";
import { duplicateInputSchema, normalizeContentInput, reorderInputSchema } from "@/lib/validation/content";

function resolve(key: string) {
  return contentModels[key as keyof typeof contentModels];
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request, { params }: { params: Promise<{ module: string }> }) {
  try {
    if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401);
    const { module } = await params;
    const Model = resolve(module);
    if (!Model) return fail("Unknown content module", 404);
    await connectDatabase();

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim().slice(0, 100);
    const state = url.searchParams.get("state") ?? "all";
    if (!["all", "published", "draft", "archived", "hidden"].includes(state)) return fail("Unknown content state", 400);

    const filter: Record<string, unknown> = { deletedAt: null };
    if (state === "hidden") filter.visibility = false;
    else if (state !== "all") filter.publishState = state;
    if (search) {
      const pattern = { $regex: escapeRegex(search), $options: "i" };
      filter.$or = ["title", "name", "role", "activity", "degree", "heading", "alt", "organization", "institution"]
        .map((field) => ({ [field]: pattern }));
    }

    const [items, total] = await Promise.all([
      Model.find(filter).sort({ displayOrder: 1, updatedAt: -1 }).limit(100).lean(),
      Model.countDocuments(filter),
    ]);
    return ok({ items, total });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ module: string }> }) {
  try {
    if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401);
    const { module } = await params;
    const Model = resolve(module);
    if (!Model) return fail("Unknown content module", 404);
    const raw: unknown = await request.json();
    await connectDatabase();

    if (raw && typeof raw === "object" && (raw as Record<string, unknown>).action === "reorder") {
      const { ids } = reorderInputSchema.parse(raw);
      if (ids.some((id) => !mongoose.isObjectIdOrHexString(id))) return fail("One or more record IDs are invalid", 400);
      await Model.bulkWrite(ids.map((id, displayOrder) => ({
        updateOne: { filter: { _id: id, deletedAt: null }, update: { $set: { displayOrder } } },
      })));
      invalidateContent(module);
      return ok({ reordered: ids.length });
    }

    if (raw && typeof raw === "object" && (raw as Record<string, unknown>).action === "duplicate") {
      const { id } = duplicateInputSchema.parse(raw);
      if (!mongoose.isObjectIdOrHexString(id)) return fail("Invalid record ID", 400);
      if (module === "media") return fail("Media records point to unique uploaded assets and cannot be duplicated.", 422);
      const source = await Model.findOne({ _id: id, deletedAt: null }).lean() as Record<string, unknown> | null;
      if (!source) return fail("Record not found", 404);
      const { _id, createdAt, updatedAt, __v, doi, ...copy } = source;
      void _id; void createdAt; void updatedAt; void __v; void doi;
      const suffix = `copy-${Date.now()}`;
      if (typeof copy.slug === "string") copy.slug = `${copy.slug}-${suffix}`;
      if (typeof copy.key === "string") copy.key = `${copy.key}-${suffix}`;
      copy.publishState = "draft";
      copy.featured = false;
      copy.deletedAt = null;
      const created = await Model.create(copy);
      invalidateContent(module);
      return ok(created.toObject(), { status: 201 });
    }

    const input = normalizeContentInput(module, raw, { creating: true });
    const created = await Model.create({ ...input, publishState: input.publishState ?? "draft" });
    invalidateContent(module, typeof input.slug === "string" ? input.slug : undefined);
    return ok(created.toObject(), { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
