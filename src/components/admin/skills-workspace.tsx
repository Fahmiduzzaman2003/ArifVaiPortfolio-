"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, ChartNoAxesCombined, ChevronDown, ChevronUp, Eye, EyeOff, Layers3, Pencil, Plus, Route, Sparkles, Trash2, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { defaultSkillCategories, skillVisualStyles } from "@/config/skill-categories";

type Category = {
  _id: string;
  key: string;
  title: string;
  description?: string;
  visualStyle?: string;
  publishState?: string;
  visibility?: boolean;
  featured?: boolean;
};

type Skill = {
  _id: string;
  name: string;
  category: string;
  level?: string;
  evidence?: string;
  publishState?: string;
  visibility?: boolean;
  featured?: boolean;
};

type Collection<T> = { items: T[]; total: number };
type EditorState = { kind: "category"; item?: Category } | { kind: "skill"; item?: Skill } | null;

const visualIcons: Record<string, LucideIcon> = {
  "vision-grid": Eye,
  "data-plot": ChartNoAxesCombined,
  "neural-network": BrainCircuit,
  "logic-path": Route,
  "tool-stack": Layers3,
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message ?? `Request failed (${response.status})`);
  return body?.data as T;
}

export function SkillsWorkspace() {
  const client = useQueryClient();
  const [selectedKey, setSelectedKey] = useState("");
  const [editor, setEditor] = useState<EditorState>(null);
  const [notice, setNotice] = useState("");
  const categoriesQuery = useQuery<Collection<Category>>({
    queryKey: ["admin-skills-workspace", "categories"],
    queryFn: () => api("/api/admin/content/skill-categories?state=all"),
  });
  const skillsQuery = useQuery<Collection<Skill>>({
    queryKey: ["admin-skills-workspace", "skills"],
    queryFn: () => api("/api/admin/content/skills?state=all"),
  });
  const categories = categoriesQuery.data?.items ?? [];
  const skills = skillsQuery.data?.items ?? [];
  const activeCategory = categories.find((category) => category.key === selectedKey) ?? categories[0];
  const categorySkills = skills.filter((skill) => skill.category === activeCategory?.key);

  const mutation = useMutation({
    mutationFn: ({ module, id, method, body }: { module: "skills" | "skill-categories"; id?: string; method: string; body?: unknown }) =>
      api(`/api/admin/content/${module}${id ? `/${id}` : ""}`, {
        method,
        headers: body === undefined ? undefined : { "content-type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["admin-skills-workspace"] });
      client.invalidateQueries({ queryKey: ["admin-content"] });
      setEditor(null);
      setNotice("Skills section updated. The public page is being refreshed.");
    },
  });

  const setupMutation = useMutation({
    mutationFn: () => Promise.all(defaultSkillCategories.map((category) => api("/api/admin/content/skill-categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...category, publishState: "published", visibility: true, featured: false }),
    }))),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["admin-skills-workspace"] });
      setNotice("The four starter categories are ready to edit.");
    },
  });

  function save(kind: "category" | "skill", item: Category | Skill | undefined, body: unknown) {
    mutation.mutate({
      module: kind === "category" ? "skill-categories" : "skills",
      id: item?._id,
      method: item ? "PATCH" : "POST",
      body,
    });
  }

  function remove(kind: "category" | "skill", item: Category | Skill) {
    const label = kind === "category" ? (item as Category).title : (item as Skill).name;
    if (!window.confirm(`Archive “${label}”? This can be recovered from the database.`)) return;
    mutation.mutate({ module: kind === "category" ? "skill-categories" : "skills", id: item._id, method: "DELETE" });
  }

  function move(module: "skills" | "skill-categories", items: Array<Category | Skill>, id: string, direction: -1 | 1) {
    const current = items.findIndex((item) => item._id === id);
    const target = current + direction;
    if (current < 0 || target < 0 || target >= items.length) return;
    const ordered = [...items];
    [ordered[current], ordered[target]] = [ordered[target], ordered[current]];
    mutation.mutate({ module, method: "POST", body: { action: "reorder", ids: ordered.map((item) => item._id) } });
  }

  const loading = categoriesQuery.isLoading || skillsQuery.isLoading;
  const error = categoriesQuery.error || skillsQuery.error || mutation.error || setupMutation.error;

  return <div className="skills-admin-workspace">
    <header className="skills-admin-header">
      <div>
        <p className="eyebrow">Capability system</p>
        <h1>Skills</h1>
        <p>Shape the entire public skills section here—categories, visual context, capability details, visibility, and order.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => setEditor({ kind: "category" })}><Plus size={15} /> Category</Button>
        <Button onClick={() => setEditor({ kind: "skill" })} disabled={!categories.length}><Plus size={15} /> Add skill</Button>
      </div>
    </header>

    <div className="skills-admin-stats">
      <div><span>Sections</span><strong>{categories.length}</strong></div>
      <div><span>Capabilities</span><strong>{skills.length}</strong></div>
      <div><span>Published</span><strong>{skills.filter((skill) => skill.publishState === "published" && skill.visibility !== false).length}</strong></div>
    </div>

    {(notice || error) && <p role="status" className={`skills-admin-notice ${error ? "is-error" : ""}`}>{error instanceof Error ? error.message : notice}</p>}

    {loading ? <div className="skills-admin-loading">Loading the skills workspace…</div> : !categories.length ? <section className="skills-admin-empty">
      <span><Sparkles size={22} /></span>
      <h2>Start with a focused structure.</h2>
      <p>Create the four recommended sections and then tailor every title, description, decoration, and skill.</p>
      <Button onClick={() => setupMutation.mutate()} disabled={setupMutation.isPending}>{setupMutation.isPending ? "Setting up…" : "Set up four categories"}</Button>
    </section> : <div className="skills-admin-grid">
      <aside className="skills-admin-categories">
        <div className="skills-admin-section-title"><div><span>01</span><strong>Categories</strong></div><button onClick={() => setEditor({ kind: "category" })} aria-label="Add category"><Plus size={15} /></button></div>
        <div className="skills-admin-category-list">
          {categories.map((category, index) => {
            const Icon = visualIcons[category.visualStyle ?? "tool-stack"] ?? Layers3;
            const active = category._id === activeCategory?._id;
            return <div key={category._id} className={`skills-admin-category ${active ? "is-active" : ""}`}>
              <button className="skills-admin-category-main" onClick={() => setSelectedKey(category.key)}>
                <span><Icon size={16} /></span>
                <span><strong>{category.title}</strong><small>{skills.filter((skill) => skill.category === category.key).length} skills · {category.publishState ?? "draft"}</small></span>
              </button>
              <div className="skills-admin-row-actions">
                <button onClick={() => move("skill-categories", categories, category._id, -1)} disabled={index === 0 || mutation.isPending} aria-label={`Move ${category.title} up`}><ChevronUp size={13} /></button>
                <button onClick={() => move("skill-categories", categories, category._id, 1)} disabled={index === categories.length - 1 || mutation.isPending} aria-label={`Move ${category.title} down`}><ChevronDown size={13} /></button>
                <button onClick={() => setEditor({ kind: "category", item: category })} aria-label={`Edit ${category.title}`}><Pencil size={13} /></button>
              </div>
            </div>;
          })}
        </div>
      </aside>

      {activeCategory && <section className="skills-admin-detail">
        <div className="skills-admin-category-preview">
          {(() => { const Icon = visualIcons[activeCategory.visualStyle ?? "tool-stack"] ?? Layers3; return <span><Icon size={24} /></span>; })()}
          <div><small>{activeCategory.key}</small><h2>{activeCategory.title}</h2><p>{activeCategory.description || "Add a concise description for this capability area."}</p></div>
          <div className="skills-admin-preview-actions">
            <span className={activeCategory.visibility === false ? "is-hidden" : ""}>{activeCategory.visibility === false ? <EyeOff size={12} /> : <Eye size={12} />}{activeCategory.publishState ?? "draft"}</span>
            <button onClick={() => setEditor({ kind: "category", item: activeCategory })}><Pencil size={14} /> Edit section</button>
            <button className="is-danger" onClick={() => remove("category", activeCategory)}><Trash2 size={14} /> Archive</button>
          </div>
        </div>

        <div className="skills-admin-section-title skills-admin-skills-title"><div><span>02</span><strong>Skills in this section</strong></div><button onClick={() => setEditor({ kind: "skill" })}><Plus size={15} /> Add skill</button></div>
        <div className="skills-admin-skill-list">
          {categorySkills.length ? categorySkills.map((skill, index) => <article key={skill._id} className="skills-admin-skill-row">
            <div className="skills-admin-skill-order"><button onClick={() => move("skills", categorySkills, skill._id, -1)} disabled={index === 0 || mutation.isPending}><ChevronUp size={13} /></button><button onClick={() => move("skills", categorySkills, skill._id, 1)} disabled={index === categorySkills.length - 1 || mutation.isPending}><ChevronDown size={13} /></button></div>
            <div><strong>{skill.name}</strong><p>{skill.evidence || "No supporting context added yet."}</p></div>
            <span className="skills-admin-level">{skill.level || "Level unset"}</span>
            <span className={`skills-admin-state ${skill.visibility === false ? "is-hidden" : ""}`}>{skill.visibility === false ? "Hidden" : skill.publishState ?? "Draft"}</span>
            <div className="skills-admin-row-actions"><button onClick={() => setEditor({ kind: "skill", item: skill })} aria-label={`Edit ${skill.name}`}><Pencil size={14} /></button><button className="is-danger" onClick={() => remove("skill", skill)} aria-label={`Archive ${skill.name}`}><Trash2 size={14} /></button></div>
          </article>) : <div className="skills-admin-no-skills"><p>No skills in this category yet.</p><button onClick={() => setEditor({ kind: "skill" })}>Add the first capability <Plus size={13} /></button></div>}
        </div>
      </section>}
    </div>}

    {editor && <SkillsEditor state={editor} categories={categories} activeCategory={activeCategory} pending={mutation.isPending} onClose={() => setEditor(null)} onSave={save} />}
  </div>;
}

function SkillsEditor({ state, categories, activeCategory, pending, onClose, onSave }: { state: Exclude<EditorState, null>; categories: Category[]; activeCategory?: Category; pending: boolean; onClose: () => void; onSave: (kind: "category" | "skill", item: Category | Skill | undefined, body: unknown) => void }) {
  const category = state.kind === "category" ? state.item : undefined;
  const skill = state.kind === "skill" ? state.item : undefined;
  const input = "mt-2 w-full rounded-xl border border-[var(--line-strong)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const common = {
      publishState: String(form.get("publishState") || "draft"),
      visibility: form.get("visibility") === "on",
      featured: Boolean(category?.featured || skill?.featured),
    };
    if (state.kind === "category") onSave("category", category, {
      ...common,
      title: String(form.get("title") || ""),
      key: String(form.get("key") || ""),
      description: String(form.get("description") || ""),
      visualStyle: String(form.get("visualStyle") || "tool-stack"),
    });
    else onSave("skill", skill, {
      ...common,
      name: String(form.get("name") || ""),
      category: String(form.get("category") || ""),
      level: String(form.get("level") || ""),
      evidence: String(form.get("evidence") || ""),
    });
  }

  return <div className="skills-admin-editor-backdrop" role="dialog" aria-modal="true" aria-labelledby="skills-editor-title">
    <div className="skills-admin-editor">
      <header><div><p className="eyebrow">{state.kind === "category" ? "Capability section" : "Individual capability"}</p><h2 id="skills-editor-title">{category?.title || skill?.name || (state.kind === "category" ? "New category" : "New skill")}</h2></div><button onClick={onClose} aria-label="Close editor"><X size={18} /></button></header>
      <form onSubmit={submit}>
        {state.kind === "category" ? <>
          <label>Section title <span>*</span><input className={input} name="title" defaultValue={category?.title} required placeholder="Computer Vision" /></label>
          <label>Category key <span>*</span><input className={input} name="key" defaultValue={category?.key} required readOnly={Boolean(category)} placeholder="computer-vision" /><small>{category ? "The key is locked after creation so assigned skills stay connected." : "Spaces are converted to hyphens automatically."}</small></label>
          <label>Short context<textarea className={input} name="description" defaultValue={category?.description} rows={4} placeholder="Explain how this capability area is used." /></label>
          <label>Contextual decoration<select className={input} name="visualStyle" defaultValue={category?.visualStyle ?? "tool-stack"}>{skillVisualStyles.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}</select></label>
        </> : <>
          <label>Skill name <span>*</span><input className={input} name="name" defaultValue={skill?.name} required placeholder="Object detection" /></label>
          <label>Category <span>*</span><select className={input} name="category" defaultValue={skill?.category ?? activeCategory?.key} required>{categories.map((item) => <option key={item.key} value={item.key}>{item.title}</option>)}</select></label>
          <label>Meaningful level<select className={input} name="level" defaultValue={skill?.level ?? ""}><option value="">Select a level…</option>{["Research Experience", "Production Experience", "Advanced", "Working Knowledge", "Familiar"].map((level) => <option key={level}>{level}</option>)}</select></label>
          <label>Evidence or context<textarea className={input} name="evidence" defaultValue={skill?.evidence} rows={5} placeholder="Briefly explain where and how this skill was applied." /></label>
        </>}
        <div className="skills-admin-publishing"><label>Publishing state<select className={input} name="publishState" defaultValue={category?.publishState ?? skill?.publishState ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="skills-admin-visible"><input name="visibility" type="checkbox" defaultChecked={(category?.visibility ?? skill?.visibility) !== false} /> Visible on the public site</label></div>
        <footer><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button></footer>
      </form>
    </div>
  </div>;
}
