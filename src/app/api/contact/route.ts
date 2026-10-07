import { createHash } from "node:crypto";
import { connectDatabase } from "@/lib/database/connect";
import { getEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { fail, handleRouteError, ok } from "@/lib/api/response";
import { ContactMessage, Profile } from "@/models";
import { clientKey, rateLimit } from "@/lib/security/rate-limit";
import { isSameOrigin } from "@/lib/security/request";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) return fail("Invalid request origin", 403);
    const ip = clientKey(request); const limit = rateLimit(`contact:${ip}`, Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 5), 60 * 60 * 1000);
    if (!limit.allowed) return fail("Too many messages. Please try again later.", 429);
    const input = contactSchema.parse(await request.json());
    if (input.website) return ok({ received: true });
    await connectDatabase();
    const stored = await ContactMessage.create({ ...input, website: undefined, ipHash: createHash("sha256").update(ip).digest("hex"), deliveryStatus: "pending" });
    const configuredRecipient = getEnv().CONTACT_RECIPIENT_EMAIL;
    const profile = configuredRecipient ? null : await Profile.findOne().select({ email: 1 }).lean();
    const fallbackRecipient = typeof profile?.email === "string" && !profile.email.startsWith("YOUR_") ? profile.email : undefined;
    const recipient = configuredRecipient ?? fallbackRecipient;
    if (!recipient) {
      await ContactMessage.updateOne({ _id: stored._id }, { $set: { deliveryStatus: "not-configured", deliveryError: "No contact recipient configured" } });
      return fail("Your message was saved, but inbox delivery is not configured yet. Please use a direct contact link.", 503);
    }
    try {
      const delivery = await sendEmail({ to: recipient, replyTo: input.email, subject: `[Portfolio: ${input.inquiryType}] ${input.subject}`, html: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#15232b"><p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#167f7b">New portfolio inquiry</p><h2 style="margin:8px 0 20px">${escapeHtml(input.subject)}</h2><p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p><p><strong>Inquiry type:</strong> ${escapeHtml(input.inquiryType)}</p><p><strong>Institution:</strong> ${escapeHtml(input.institution ?? "Not provided")}</p><div style="margin:24px 0;padding:18px;border-left:3px solid #167f7b;background:#f4f7f6">${escapeHtml(input.message).replace(/\n/g, "<br>")}</div><p><a href="mailto:${encodeURIComponent(input.email)}" style="color:#167f7b">Reply directly to ${escapeHtml(input.name)}</a></p></div>` });
      await ContactMessage.updateOne({ _id: stored._id }, { $set: { deliveryStatus: "sent", deliveryId: delivery?.id, deliveredAt: new Date() }, $unset: { deliveryError: 1 } });
      return ok({ id: String(stored._id), received: true, delivered: true }, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown delivery error";
      console.error("Contact email delivery failed", error);
      await ContactMessage.updateOne({ _id: stored._id }, { $set: { deliveryStatus: "failed", deliveryError: message.slice(0, 500) } });
      return fail("Your message was saved, but inbox delivery failed. Please try a direct contact link or try again later.", 502);
    }
  } catch (error) { return handleRouteError(error); }
}
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
