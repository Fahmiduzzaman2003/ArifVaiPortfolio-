import "server-only";
import { Resend } from "resend";
import { getEnv } from "@/lib/env";

export async function sendEmail(input: { to: string; subject: string; html: string; replyTo?: string }) {
  const env = getEnv();
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) throw new Error("Email delivery is not configured");
  const resend = new Resend(env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({ from: env.EMAIL_FROM, to: input.to, subject: input.subject, html: input.html, replyTo: input.replyTo });
  if (error) throw new Error(error.message);
  return data;
}
