import argon2 from "argon2";
import mongoose from "mongoose";
import { Admin } from "../src/models";

async function main() { const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.toLowerCase().trim(); const password = process.env.ADMIN_BOOTSTRAP_PASSWORD; const uri = process.env.MONGODB_URI; if (!email || !password || password.length < 12) throw new Error("Set ADMIN_BOOTSTRAP_EMAIL and an ADMIN_BOOTSTRAP_PASSWORD of at least 12 characters."); if (!uri) throw new Error("Set MONGODB_URI before creating the admin account."); await mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5000 }); const passwordHash = await argon2.hash(password); await Admin.findOneAndUpdate({ email }, { $setOnInsert: { email, passwordHash, role: "owner", active: true } }, { upsert: true, returnDocument: "after" }); console.info(`Admin account is ready for ${email}. Existing passwords were not overwritten.`); await mongoose.disconnect(); }
main().catch((error) => { console.error(error); process.exit(1); });
