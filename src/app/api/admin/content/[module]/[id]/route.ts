import mongoose from "mongoose";
import { getSession } from "@/lib/auth/session";
import { invalidateContent } from "@/lib/cache/content-cache";
import { connectDatabase } from "@/lib/database/connect";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { contentModels } from "@/models";
import { contentUpdate, normalizeContentInput } from "@/lib/validation/content";

function resolve(key: string) {
  return contentModels[key as keyof typeof contentModels];
}

export async function PATCH(request: Request, { params }: { params: Promise<{ module: string; id: string }> }) {
  try {
    if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401);
    const { module, id } = await params;
    const Model = resolve(module);
    if (!Model) return fail("Unknown content module", 404);
    if (!mongoose.isObjectIdOrHexString(id)) return fail("Invalid record ID", 400);
    const input = normalizeContentInput(module, await request.json());
    await connectDatabase();
    const previous = await Model.findOne({ _id: id, deletedAt: null }).select("slug").lean() as { slug?: string } | null;
    if (!previous) return fail("Record not found", 404);
    const item = await Model.findByIdAndUpdate(id, contentUpdate(input), { new: true, runValidators: true });
    if (!item) return fail("Record not found", 404);
    if (previous.slug && previous.slug !== input.slug) invalidateContent(module, previous.slug);
    invalidateContent(module, typeof input.slug === "string" ? input.slug : undefined);
    return ok(item.toObject());
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ module: string; id: string }> }) {
  try {
    if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401);
    const { module, id } = await params;
    const Model = resolve(module);
    if (!Model) return fail("Unknown content module", 404);
    if (!mongoose.isObjectIdOrHexString(id)) return fail("Invalid record ID", 400);
    await connectDatabase();
    const item = await Model.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date(), visibility: false, publishState: "archived" } },
      { new: true },
    );
    if (!item) return fail("Record not found", 404);
    invalidateContent(module, typeof item.slug === "string" ? item.slug : undefined);
    return ok({ deleted: true, recoverable: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
