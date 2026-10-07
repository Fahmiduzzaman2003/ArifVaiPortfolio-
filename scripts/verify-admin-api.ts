const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const modules = ["research-interests", "publications", "projects", "experience", "education", "achievements", "activities", "skills", "sections", "media"];

export {};

if (!email || !password) throw new Error("ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD are required for the admin API smoke test.");

async function json(url: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${url}`, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${init.method ?? "GET"} ${url} failed (${response.status}): ${body.message ?? "Unknown error"}`);
  return { response, body };
}

const login = await json("/api/auth/login", {
  method: "POST",
  headers: { "content-type": "application/json", origin: baseUrl },
  body: JSON.stringify({ email, password }),
});
const cookie = login.response.headers.get("set-cookie")?.split(";", 1)[0];
if (!cookie) throw new Error("Login succeeded without returning a session cookie.");
const headers = { cookie, "content-type": "application/json", origin: baseUrl };

let reads = 0;
let updates = 0;
for (const moduleKey of modules) {
  const { body } = await json(`/api/admin/content/${moduleKey}?state=all`, { headers });
  reads += 1;
  const items = body.data?.items ?? [];
  if (items.length) {
    const update: Record<string, unknown> = { visibility: items[0].visibility !== false };
    if (moduleKey === "publications") update.visualStyle = items[0].visualStyle ?? "cnn-pipeline";
    await json(`/api/admin/content/${moduleKey}/${items[0]._id}`, {
      method: "PATCH", headers, body: JSON.stringify(update),
    });
    await json(`/api/admin/content/${moduleKey}`, {
      method: "POST", headers, body: JSON.stringify({ action: "reorder", ids: items.map((item: { _id: string }) => item._id) }),
    });
    updates += 2;
  }
}

for (const kind of ["profile", "settings"]) {
  const { body } = await json(`/api/admin/${kind}`, { headers });
  reads += 1;
  const current = body.data ?? {};
  const payload = kind === "profile" ? { name: current.name ?? "" } : { cvVisible: current.cvVisible !== false };
  await json(`/api/admin/${kind}`, { method: "PATCH", headers, body: JSON.stringify(payload) });
  updates += 1;
}

console.info(`Admin API smoke test passed: ${reads} authenticated reads and ${updates} safe updates.`);
