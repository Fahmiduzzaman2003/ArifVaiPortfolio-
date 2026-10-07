import { getSession } from "@/lib/auth/session";
import { invalidateContent } from "@/lib/cache/content-cache";
import { connectDatabase } from "@/lib/database/connect";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { Profile, SiteSettings } from "@/models";
import { contentUpdate, normalizeContentInput } from "@/lib/validation/content";

function model(kind: string) {
  return kind === "profile" ? Profile : kind === "settings" ? SiteSettings : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  try {
    if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401);
    const { kind } = await params;
    const Model = model(kind);
    if (!Model) return fail("Unknown settings module", 404);
    await connectDatabase();
    const value = await Model.findOne(kind === "settings" ? { key: "primary" } : {}).lean();
    return ok(value ?? {});
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  try {
    if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401);
    const { kind } = await params;
    const Model = model(kind);
    if (!Model) return fail("Unknown settings module", 404);
    const payload = normalizeContentInput(kind, await request.json());
    await connectDatabase();
    const value = await Model.findOneAndUpdate(
      kind === "settings" ? { key: "primary" } : {},
      contentUpdate(payload),
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    invalidateContent(kind);
    return ok(value.toObject());
  } catch (error) {
    return handleRouteError(error);
  }
}
