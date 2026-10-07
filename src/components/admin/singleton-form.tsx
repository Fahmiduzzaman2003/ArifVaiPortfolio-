"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Field = { name: string; label: string; multiline?: boolean; help?: string; type?: "text" | "email" | "url" | "checkbox" };

function readPath(data: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, data);
}

function writePath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cursor = target;
  for (const key of keys.slice(0, -1)) {
    const next = cursor[key];
    cursor[key] = next && typeof next === "object" && !Array.isArray(next) ? next : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys.at(-1)!] = value;
}

export function SingletonForm({ kind, title, description, fields }: { kind: "profile" | "settings"; title: string; description: string; fields: Field[] }) {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/${kind}`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.message ?? "Unable to load this form.");
        if (active) setData(body.data ?? {});
      })
      .catch((error) => { if (active) { setFailed(true); setMessage(error instanceof Error ? error.message : "Unable to load this form."); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setFailed(false); setMessage("Saving…");
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {};
    for (const field of fields) writePath(body, field.name, field.type === "checkbox" ? form.get(field.name) === "on" : String(form.get(field.name) ?? ""));
    try {
      const response = await fetch(`/api/admin/${kind}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message ?? "Unable to save.");
      setData(result.data ?? body);
      setMessage("Saved. Public pages are being refreshed.");
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  const input = "mt-2 w-full rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--teal)]";
  return <div><p className="eyebrow">Site identity</p><h1 className="mt-3 font-serif text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
    {loading ? <p className="mt-8 text-sm text-[var(--muted)]">Loading…</p> : <form onSubmit={submit} className="mt-8 grid max-w-4xl gap-5 rounded-2xl border border-[var(--line)] bg-white p-6 md:p-8">
      {fields.map((field) => {
        const value = readPath(data, field.name);
        if (field.type === "checkbox") return <label key={field.name} className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-4 text-sm font-semibold"><input name={field.name} type="checkbox" defaultChecked={Boolean(value)} /> {field.label}{field.help && <span className="text-xs font-normal text-[var(--muted)]">{field.help}</span>}</label>;
        return <label key={`${field.name}-${String(value ?? "")}`} className="text-sm font-semibold">{field.label}{field.multiline ? <textarea name={field.name} defaultValue={String(value ?? "")} rows={4} className={input} /> : <input name={field.name} type={field.type ?? "text"} defaultValue={String(value ?? "")} className={input} />}{field.help && <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{field.help}</span>}</label>;
      })}
      {message && <p role="status" className={`rounded-xl px-4 py-3 text-sm ${failed ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{message}</p>}
      <Button type="submit" disabled={saving} className="w-fit">{saving ? "Saving…" : "Save changes"}</Button>
    </form>}
  </div>;
}
