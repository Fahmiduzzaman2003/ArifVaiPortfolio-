import { createHash } from "node:crypto";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { getEnv } from "@/lib/env";
const schema = z.object({ folder: z.enum(["profile", "publications", "projects", "certificates", "cv", "documents"]), resourceType: z.enum(["image", "raw"]).default("image"), fileType: z.string().regex(/^(image\/(jpeg|png|webp|avif)|application\/pdf)$/), fileSize: z.number().positive().max(15 * 1024 * 1024) });
export async function POST(request: Request) { try { if (!(await getSession({ checkDatabase: true }))) return fail("Unauthorized", 401); const input = schema.parse(await request.json()); const env = getEnv(); if (!env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_CLOUD_NAME) return fail("Cloudinary is not configured", 503); const timestamp = Math.floor(Date.now() / 1000); const folder = `research-portfolio/${input.folder}`; const toSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`; const signature = createHash("sha1").update(toSign).digest("hex"); return ok({ signature, timestamp, folder, cloudName: env.CLOUDINARY_CLOUD_NAME, apiKey: env.CLOUDINARY_API_KEY, resourceType: input.resourceType, maxBytes: 15 * 1024 * 1024 }); } catch (error) { return handleRouteError(error); } }
