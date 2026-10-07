"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Eye, EyeOff, FilePlus2, GripVertical, Pencil, Search, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { AdminField, AdminModule } from "@/config/admin-modules";
import { Button } from "@/components/ui/button";

type RecordItem = Record<string, unknown> & { _id: string; publishState?: string; visibility?: boolean; featured?: boolean };
type ApiDetails = { fieldErrors?: Record<string, string[]>; formErrors?: string[] };

class ApiError extends Error {
  details?: ApiDetails;
  constructor(message: string, details?: ApiDetails) { super(message); this.details = details; }
}

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.message ?? `Request failed (${response.status})`, body?.details);
  return body?.data;
}

function readPath(data: Record<string, unknown> | null, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined,
    data,
  );
}

function writePath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cursor = target;
  for (const key of keys.slice(0, -1)) {
    const child = cursor[key];
    cursor[key] = child && typeof child === "object" && !Array.isArray(child) ? child : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys.at(-1)!] = value;
}

export function ContentManager({ module }: { module: AdminModule }) {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("all");
  const [editing, setEditing] = useState<RecordItem | null | "new">(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const query = useQuery<{ items: RecordItem[]; total: number }>({
    queryKey: ["admin-content", module.key, search, state],
    queryFn: () => api(`/api/admin/content/${module.key}?search=${encodeURIComponent(search)}&state=${state}`),
    staleTime: 30_000,
  });
  const categoryQuery = useQuery<{ items: RecordItem[]; total: number }>({
    queryKey: ["admin-content", "skill-categories", "published"],
    queryFn: () => api("/api/admin/content/skill-categories?state=published"),
    enabled: module.key === "skills",
    staleTime: 30_000,
  });
  const skillCategoryOptions = (categoryQuery.data?.items ?? []).map((item) => ({
    label: String(item.title || item.key),
    value: String(item.key),
  }));
  const mutation = useMutation({
    mutationFn: ({ id, body, method = "PATCH" }: { id?: string; body?: unknown; method?: string }) => api(
      `/api/admin/content/${module.key}${id ? `/${id}` : ""}`,
      { method, headers: { "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) },
    ),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["admin-content", module.key] });
      setEditing(null);
      setNotice(variables.method === "DELETE" ? "Record moved to the archive." : variables.method === "POST" && !variables.id ? "Changes saved." : "Changes saved.");
    },
  });
  const items = query.data?.items ?? [];
  const mutationError = mutation.error instanceof ApiError ? mutation.error : null;

  function startEditing(item: RecordItem | "new") {
    mutation.reset();
    setNotice("");
    setEditing(item);
  }

  function reorder(targetId: string) {
    if (!dragId || dragId === targetId || mutation.isPending) return;
    const ordered = [...items];
    const sourceIndex = ordered.findIndex((item) => item._id === dragId);
    const targetIndex = ordered.findIndex((item) => item._id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = ordered.splice(sourceIndex, 1);
    ordered.splice(targetIndex, 0, moved);
    mutation.mutate({ method: "POST", body: { action: "reorder", ids: ordered.map((item) => item._id) } });
    setDragId(null);
  }

  function title(item: RecordItem) { return String(item[module.primaryField] || "Untitled"); }

  return <div>
    <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-7 md:flex-row md:items-end md:justify-between">
      <div><p className="eyebrow">Content module</p><h1 className="mt-3 font-serif text-4xl md:text-5xl">{module.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">{module.description}</p></div>
      <Button onClick={() => startEditing("new")}><FilePlus2 size={16} /> Add {module.singular}</Button>
    </div>
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <label className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-[var(--line-strong)] bg-white px-4"><Search size={16} /><span className="sr-only">Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${module.title.toLowerCase()}`} className="w-full bg-transparent text-sm outline-none" /></label>
      <label><span className="sr-only">Filter by state</span><select value={state} onChange={(event) => setState(event.target.value)} className="h-11 rounded-xl border border-[var(--line-strong)] bg-white px-4 text-sm"><option value="all">All states</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option><option value="hidden">Hidden</option></select></label>
    </div>
    {(notice || mutationError) && <p role="status" className={`mt-4 rounded-xl border px-4 py-3 text-sm ${mutationError ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{mutationError?.message ?? notice}</p>}
    <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
      <div className="hidden grid-cols-[40px_1fr_130px_160px] bg-[var(--paper-deep)] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] md:grid"><span /><span>Content</span><span>State</span><span>Actions</span></div>
      {query.isLoading ? <p className="p-10 text-center text-sm text-[var(--muted)]">Loading content…</p>
        : query.isError ? <p className="p-10 text-center text-sm text-red-700">{query.error instanceof Error ? query.error.message : "Unable to load content."}</p>
        : items.length ? items.map((item) => <div key={item._id} draggable={!mutation.isPending} onDragStart={() => setDragId(item._id)} onDragEnd={() => setDragId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorder(item._id)} className="grid gap-3 border-t border-[var(--line)] p-4 first:border-t-0 md:grid-cols-[40px_1fr_130px_160px] md:items-center">
          <GripVertical size={16} className="hidden cursor-grab text-[var(--muted)] md:block" />
          <div><strong className="text-sm">{title(item)}</strong><p className="mt-1 text-xs text-[var(--muted)]">Drag to reorder</p></div>
          <span className="w-fit rounded-full bg-[var(--paper-deep)] px-3 py-1 text-[10px] uppercase tracking-wider">{item.visibility === false ? "hidden" : item.publishState ?? "draft"}</span>
          <div className="flex gap-1">
            <button disabled={mutation.isPending} onClick={() => startEditing(item)} className="grid size-9 place-items-center rounded-lg hover:bg-[var(--paper-deep)] disabled:opacity-40" title="Edit"><Pencil size={15} /></button>
            {module.duplicable !== false && <button disabled={mutation.isPending} onClick={() => mutation.mutate({ body: { action: "duplicate", id: item._id }, method: "POST" })} className="grid size-9 place-items-center rounded-lg hover:bg-[var(--paper-deep)] disabled:opacity-40" title="Duplicate"><Copy size={15} /></button>}
            <button disabled={mutation.isPending} onClick={() => mutation.mutate({ id: item._id, body: { visibility: !item.visibility } })} className="grid size-9 place-items-center rounded-lg hover:bg-[var(--paper-deep)] disabled:opacity-40" title="Show or hide">{item.visibility === false ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            <button disabled={mutation.isPending} onClick={() => mutation.mutate({ id: item._id, body: { featured: !item.featured } })} className="grid size-9 place-items-center rounded-lg hover:bg-[var(--paper-deep)] disabled:opacity-40" title="Feature"><Star size={15} fill={item.featured ? "currentColor" : "none"} /></button>
            <button disabled={mutation.isPending} onClick={() => window.confirm(`Delete “${title(item)}”? This uses a recoverable soft delete.`) && mutation.mutate({ id: item._id, method: "DELETE" })} className="grid size-9 place-items-center rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-40" title="Delete"><Trash2 size={15} /></button>
          </div>
        </div>) : <div className="p-14 text-center"><p className="font-serif text-2xl">No content found.</p><p className="mt-2 text-sm text-[var(--muted)]">{state === "all" && !search ? `Add the first ${module.singular}; it will start as a draft.` : "Try a different search or state filter."}</p></div>}
    </div>
    {editing && <Editor module={module} item={editing === "new" ? null : editing} pending={mutation.isPending} error={mutationError} categoryOptions={skillCategoryOptions} onClose={() => setEditing(null)} onSave={(body) => mutation.mutate({ id: editing === "new" ? undefined : editing._id, body, method: editing === "new" ? "POST" : "PATCH" })} />}
  </div>;
}

function fieldValue(item: RecordItem | null, field: AdminField) {
  const value = readPath(item, field.name);
  if (field.type === "date" && value) {
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  }
  if (field.type === "list" && Array.isArray(value)) return value.join("\n");
  return value ?? field.defaultValue ?? "";
}

function Editor({ module, item, pending, error, categoryOptions, onClose, onSave }: { module: AdminModule; item: RecordItem | null; pending: boolean; error: ApiError | null; categoryOptions: Array<{ label: string; value: string }>; onClose: () => void; onSave: (body: unknown) => void }) {
  const [dirty, setDirty] = useState(false);
  function close() { if (!dirty || window.confirm("Discard unsaved changes?")) onClose(); }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {};
    for (const field of module.fields) {
      const raw = field.type === "checkbox" ? form.get(field.name) === "on" : String(form.get(field.name) ?? "");
      const value = field.type === "number" && raw !== "" ? Number(raw)
        : field.type === "list" ? String(raw).split(/[\n,]/).map((entry) => entry.trim()).filter(Boolean)
        : raw;
      writePath(body, field.name, value);
    }
    body.publishState = form.get("publishState");
    body.visibility = form.get("visibility") === "on";
    body.featured = form.get("featured") === "on";
    onSave(body);
  }
  const inputClass = "mt-2 w-full rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--teal)]";
  return <div className="fixed inset-0 z-[100] flex justify-end bg-black/35" role="dialog" aria-modal="true" aria-labelledby="editor-title">
    <div className="h-full w-full max-w-2xl overflow-y-auto bg-[var(--paper)] p-6 shadow-2xl md:p-9">
      <div className="flex items-start justify-between"><div><p className="eyebrow">{item ? "Edit" : "Add"} {module.singular}</p><h2 id="editor-title" className="mt-2 font-serif text-3xl">{item ? String(item[module.primaryField]) : `New ${module.singular}`}</h2></div><button type="button" onClick={close} className="grid size-10 place-items-center rounded-full border border-[var(--line)]" aria-label="Close"><X size={17} /></button></div>
      <form onSubmit={submit} onChange={() => setDirty(true)} className="mt-8 grid gap-5">
        {module.fields.map((field) => {
          const value = fieldValue(item, field);
          const options = field.name === "category" && categoryOptions.length ? categoryOptions : field.options;
          const fieldError = error?.details?.fieldErrors?.[field.name]?.[0];
          if (field.type === "checkbox") return <label key={field.name} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white p-4 text-sm font-semibold"><input name={field.name} type="checkbox" defaultChecked={Boolean(value)} /> {field.label}</label>;
          return <label key={field.name} className="text-sm font-semibold">{field.label}{field.required && <span className="text-red-700"> *</span>}
            {field.type === "textarea" || field.type === "list" ? <textarea name={field.name} defaultValue={String(value)} placeholder={field.placeholder} required={field.required} rows={field.type === "list" ? 3 : 4} className={inputClass} />
              : field.type === "select" ? <select name={field.name} defaultValue={String(value)} required={field.required} className={inputClass}><option value="">Select…</option>{options?.map((option) => { const label = typeof option === "string" ? option : option.label; const optionValue = typeof option === "string" ? option : option.value; return <option key={optionValue} value={optionValue}>{label}</option>; })}</select>
              : <input name={field.name} type={field.type === "number" ? "number" : field.type === "url" ? "url" : field.type === "date" ? "date" : "text"} defaultValue={String(value)} placeholder={field.placeholder} required={field.required} className={inputClass} />}
            {field.help && <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{field.help}</span>}{fieldError && <span className="mt-1 block text-xs font-normal text-red-700">{fieldError}</span>}
          </label>;
        })}
        <div className="grid gap-4 rounded-2xl border border-[var(--line)] p-5 sm:grid-cols-3">
          <label className="text-sm font-semibold">Publishing state<select name="publishState" defaultValue={item?.publishState ?? "draft"} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <label className="flex items-center gap-2 self-end py-3 text-sm"><input name="visibility" type="checkbox" defaultChecked={item?.visibility ?? true} /> Visible</label>
          <label className="flex items-center gap-2 self-end py-3 text-sm"><input name="featured" type="checkbox" defaultChecked={item?.featured ?? false} /> Featured</label>
        </div>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p className="font-semibold">{error.message}</p>{error.details?.formErrors?.map((message) => <p key={message} className="mt-1">{message}</p>)}</div>}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[var(--line)] bg-[var(--paper)] py-4"><Button type="button" variant="ghost" onClick={close} disabled={pending}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? "Saving…" : item ? "Save changes" : "Create draft"}</Button></div>
      </form>
    </div>
  </div>;
}
