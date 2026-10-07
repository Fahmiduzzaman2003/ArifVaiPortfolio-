"use client";

import { useRef, useState } from "react";
import { CloudUpload, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CloudinaryUploader() {
  const ref = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<"image" | "document" | "cv">("image");
  const [status, setStatus] = useState("");

  async function upload() {
    const file = ref.current?.files?.[0];
    if (!file) return setStatus("Choose an image or PDF first.");
    if (file.size > 15 * 1024 * 1024) return setStatus("The maximum file size is 15 MB.");
    if ((kind === "cv" || kind === "document") && file.type !== "application/pdf") return setStatus("CV and document assets must be PDFs.");
    setStatus("Preparing secure upload…");
    try {
      const isPdf = file.type === "application/pdf";
      const signatureResponse = await fetch("/api/admin/media/signature", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ folder: kind === "cv" ? "cv" : isPdf ? "documents" : "profile", resourceType: isPdf ? "raw" : "image", fileType: file.type, fileSize: file.size }) });
      const signed = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signed.message);
      const config = signed.data;
      const form = new FormData();
      form.set("file", file); form.set("api_key", config.apiKey); form.set("timestamp", String(config.timestamp)); form.set("signature", config.signature); form.set("folder", config.folder);
      const uploadedResponse = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/${config.resourceType}/upload`, { method: "POST", body: form });
      const uploaded = await uploadedResponse.json();
      if (!uploadedResponse.ok) throw new Error(uploaded.error?.message ?? "Upload failed");
      const asset = { url: uploaded.secure_url, secureUrl: uploaded.secure_url, publicId: uploaded.public_id, format: uploaded.format, resourceType: uploaded.resource_type, assetType: kind, bytes: uploaded.bytes, width: uploaded.width, height: uploaded.height, alt: file.name, publishState: "published" };
      const savedResponse = await fetch("/api/admin/content/media", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(asset) });
      if (!savedResponse.ok) throw new Error("The upload succeeded, but its library record could not be saved.");
      if (kind === "cv") await fetch("/api/admin/settings", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ activeCv: asset, cvUpdatedAt: new Date().toISOString(), cvVisible: true }) });
      setStatus(kind === "cv" ? "CV uploaded and set as the active public version." : "Upload complete. The asset is available in the library.");
      if (ref.current) ref.current.value = "";
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload failed."); }
  }

  return <section className="mb-7 rounded-2xl border border-[var(--line)] bg-white p-6"><div className="flex items-center gap-3"><CloudUpload className="text-[var(--teal-deep)]" /><div><h2 className="font-serif text-2xl">Signed media upload</h2><p className="text-xs text-[var(--muted)]">Images and PDFs, up to 15 MB. Files upload directly to Cloudinary.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-[160px_1fr_auto]"><select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)} className="min-h-11 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 text-sm"><option value="image">Image</option><option value="document">Document PDF</option><option value="cv">Active CV PDF</option></select><input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" className="min-h-11 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-2 text-sm" /><Button type="button" onClick={upload}><FileCheck2 size={16} /> Upload asset</Button></div>{status && <p className="mt-3 text-sm text-[var(--muted)]" role="status">{status}</p>}</section>;
}
