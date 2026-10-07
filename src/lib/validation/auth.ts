import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email().transform((v) => v.toLowerCase().trim()), password: z.string().min(8).max(200) });
export const forgotSchema = z.object({ email: z.string().email().transform((v) => v.toLowerCase().trim()) });
export const resetSchema = z.object({ token: z.string().min(32), password: z.string().min(12).max(200).regex(/[a-z]/, "Add a lowercase letter").regex(/[A-Z]/, "Add an uppercase letter").regex(/\d/, "Add a number").regex(/[^A-Za-z0-9]/, "Add a symbol") });
