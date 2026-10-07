import { z } from "zod";

const schema = z.object({
  MONGODB_URI: z.string().min(1).optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  CONTACT_RECIPIENT_EMAIL: z.string().email().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export function getEnv() { return schema.parse(process.env); }
export function requireEnv<K extends keyof z.infer<typeof schema>>(key: K) { const value = getEnv()[key]; if (!value) throw new Error(`Missing required environment variable: ${key}`); return value; }
